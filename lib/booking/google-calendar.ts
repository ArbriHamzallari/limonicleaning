// Minimal Google Calendar client (server only) using a service account the calendar is shared
// with. No SDK: a signed JWT is exchanged for an access token, then plain REST calls.
//
// Env: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (PEM, "\n" allowed),
//      GOOGLE_CALENDAR_ID. Tests point GOOGLE_API_BASE / GOOGLE_TOKEN_URL at a local fake.
//
// Events we create carry extendedProperties.private.limoniRequestId and a deterministic id
// derived from the request id, so a retry never creates a second event.
import { createHash, createSign } from "node:crypto";
import { zonedToUtc, TZ } from "./time";
import type { Interval } from "./slots";

const API = () => process.env.GOOGLE_API_BASE ?? "https://www.googleapis.com/calendar/v3";
const TOKEN_URL = () => process.env.GOOGLE_TOKEN_URL ?? "https://oauth2.googleapis.com/token";
const TIMEOUT_MS = 8000;

export class CalendarError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

export function isCalendarConfigured(): boolean {
  return !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY && process.env.GOOGLE_CALENDAR_ID);
}

/** Google event ids: base32hex characters (a–v, 0–9), 5–1024 long. */
export function eventIdFor(requestId: string): string {
  return `lmn${createHash("sha256").update(requestId).digest("hex").slice(0, 40)}`;
}

let token: { value: string; exp: number } | null = null;

async function accessToken(): Promise<string> {
  if (token && token.exp > Date.now() + 60000) return token.value;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  const pem = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: email,
    scope: "https://www.googleapis.com/auth/calendar.events",
    aud: TOKEN_URL(),
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(pem).toString("base64url");
  const res = await fetch(TOKEN_URL(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new CalendarError(`token ${res.status}`, res.status);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  token = { value: data.access_token, exp: Date.now() + data.expires_in * 1000 };
  return token.value;
}

/** For tests: forget the cached token. */
export function resetCalendarTokenCache() {
  token = null;
}

async function call(method: string, path: string, body?: unknown): Promise<Response> {
  const res = await fetch(`${API()}/calendars/${encodeURIComponent(process.env.GOOGLE_CALENDAR_ID!)}${path}`, {
    method,
    headers: { Authorization: `Bearer ${await accessToken()}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  return res;
}

interface GEvent {
  id: string;
  status?: string;
  transparency?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  extendedProperties?: { private?: Record<string, string> };
}

function toInterval(e: GEvent): Interval | null {
  if (e.start?.dateTime && e.end?.dateTime) return { start: new Date(e.start.dateTime), end: new Date(e.end.dateTime) };
  if (e.start?.date && e.end?.date) return { start: zonedToUtc(e.start.date, "00:00"), end: zonedToUtc(e.end.date, "00:00") };
  return null;
}

/** Busy time typed into the calendar by hand (our own hold/booking events are excluded). */
export async function listManualBusy(timeMin: Date, timeMax: Date): Promise<Interval[]> {
  const out: Interval[] = [];
  let pageToken: string | undefined;
  do {
    const q = new URLSearchParams({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: "true",
      maxResults: "2500",
      timeZone: TZ,
      ...(pageToken ? { pageToken } : {}),
    });
    const res = await call("GET", `/events?${q}`);
    if (!res.ok) throw new CalendarError(`events.list ${res.status}`, res.status);
    const data = (await res.json()) as { items?: GEvent[]; nextPageToken?: string };
    for (const e of data.items ?? []) {
      if (e.status === "cancelled" || e.transparency === "transparent") continue;
      if (e.extendedProperties?.private?.limoniRequestId) continue;
      const i = toInterval(e);
      if (i) out.push(i);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);
  return out;
}

export interface EventSpec {
  requestId: string;
  summary: string;
  description: string;
  start: Date;
  end: Date;
}

/** Create or update OUR event (same id every time). Restores it if it was deleted. */
export async function upsertEvent(spec: EventSpec): Promise<string> {
  const id = eventIdFor(spec.requestId);
  const body = {
    id,
    status: "confirmed",
    summary: spec.summary,
    description: spec.description,
    start: { dateTime: spec.start.toISOString(), timeZone: TZ },
    end: { dateTime: spec.end.toISOString(), timeZone: TZ },
    visibility: "private",
    transparency: "opaque",
    reminders: { useDefault: false },
    extendedProperties: { private: { limoniRequestId: spec.requestId } },
  };
  let res = await call("PUT", `/events/${id}`, body);
  if (res.status === 404) {
    res = await call("POST", `/events`, body);
    if (res.status === 409) res = await call("PUT", `/events/${id}`, body); // created by a parallel retry
  }
  if (!res.ok) throw new CalendarError(`events.upsert ${res.status}`, res.status);
  return id;
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await call("DELETE", `/events/${id}`);
  if (!res.ok && res.status !== 404 && res.status !== 410) throw new CalendarError(`events.delete ${res.status}`, res.status);
}

export async function getEvent(id: string): Promise<{ status: string; start: Date | null; end: Date | null } | null> {
  const res = await call("GET", `/events/${id}`);
  if (res.status === 404 || res.status === 410) return null;
  if (!res.ok) throw new CalendarError(`events.get ${res.status}`, res.status);
  const e = (await res.json()) as GEvent;
  const i = toInterval(e);
  return { status: e.status ?? "confirmed", start: i?.start ?? null, end: i?.end ?? null };
}
