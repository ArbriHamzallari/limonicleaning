// A local stand-in for the Google OAuth token endpoint and the Calendar v3 endpoints we use.
// It verifies the service-account JWT with the matching public key, stores events in memory
// and can simulate outages. Nothing leaves the machine.
import { createServer, type Server } from "node:http";
import { createVerify, generateKeyPairSync } from "node:crypto";
import type { AddressInfo } from "node:net";

export interface FakeEvent {
  id: string;
  status: string;
  summary?: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  transparency?: string;
  visibility?: string;
  extendedProperties?: { private?: Record<string, string> };
  attendees?: unknown[];
}

export async function startFakeGoogle() {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const events = new Map<string, FakeEvent>();
  const fail = { list: 0, write: 0, token: 0 };
  const calls: string[] = [];

  const server: Server = createServer(async (req, res) => {
    const url = new URL(req.url!, "http://x");
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const send = (status: number, body?: unknown) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(body ? JSON.stringify(body) : "");
    };
    calls.push(`${req.method} ${url.pathname}`);

    if (url.pathname === "/token") {
      if (fail.token) return send(503);
      const assertion = new URLSearchParams(raw).get("assertion") ?? "";
      const [h, p, sig] = assertion.split(".");
      const ok = createVerify("RSA-SHA256").update(`${h}.${p}`).verify(publicKey, Buffer.from(sig, "base64url"));
      if (!ok) return send(401, { error: "invalid_grant" });
      return send(200, { access_token: "fake-token", expires_in: 3600 });
    }
    if (req.headers.authorization !== "Bearer fake-token") return send(401);

    const m = url.pathname.match(/^\/calendars\/([^/]+)\/events(?:\/([^/]+))?$/);
    if (!m) return send(404);
    const id = m[2];
    const body = raw ? (JSON.parse(raw) as FakeEvent) : undefined;

    if (req.method === "GET" && !id) {
      if (fail.list) return send(503);
      const min = new Date(url.searchParams.get("timeMin")!).getTime();
      const max = new Date(url.searchParams.get("timeMax")!).getTime();
      const items = [...events.values()].filter((e) => {
        const s = new Date(e.start.dateTime ?? `${e.start.date}T00:00:00Z`).getTime();
        const en = new Date(e.end.dateTime ?? `${e.end.date}T00:00:00Z`).getTime();
        return e.status !== "cancelled" && s < max && en > min;
      });
      return send(200, { items });
    }
    if (req.method === "GET" && id) {
      const e = events.get(id);
      return e ? send(200, e) : send(404);
    }
    if (fail.write) return send(503);
    if (req.method === "POST" && !id) {
      if (body?.id && events.has(body.id)) return send(409);
      const created = { ...body!, id: body?.id ?? `manual${events.size}` };
      events.set(created.id, created);
      return send(200, created);
    }
    if (req.method === "PUT" && id) {
      if (!events.has(id)) return send(404);
      events.set(id, { ...body!, id });
      return send(200, events.get(id));
    }
    if (req.method === "DELETE" && id) {
      if (!events.has(id)) return send(404);
      events.delete(id);
      res.writeHead(204).end();
      return;
    }
    return send(405);
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  return {
    base,
    privateKeyPem: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    events,
    fail,
    calls,
    /** A busy appointment typed into the calendar by hand. */
    addManual(start: Date, end: Date) {
      const id = `manual${events.size + 1}`;
      events.set(id, { id, status: "confirmed", summary: "Takim", start: { dateTime: start.toISOString() }, end: { dateTime: end.toISOString() } });
      return id;
    },
    close: () => new Promise<void>((r) => server.close(() => r())),
  };
}
