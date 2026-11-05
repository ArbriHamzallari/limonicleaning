import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@prisma/client";

// Local fixtures only: the database and both notification channels are mocked, so nothing is
// written to a real database and nobody is emailed or messaged.
const create = vi.fn();
const findUnique = vi.fn();
const notify = vi.fn();
const afterQueue: (() => unknown)[] = [];

vi.mock("@/lib/prisma", () => ({ prisma: { lead: { create, findUnique } } }));
vi.mock("@/lib/notify", () => ({ notifyNewLead: notify }));
vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return { ...actual, after: (fn: () => unknown) => afterQueue.push(fn) };
});

const { POST } = await import("@/app/api/lead/route");

let ip = 0;
function request(body: unknown, headers: Record<string, string> = {}) {
  ip += 1;
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${ip}`, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const valid = () => ({
  service: "me-themel",
  name: "Test Klient",
  phone: "+355 69 000 0000",
  sizeM2: "80",
  propertyType: "apartament",
  condition: "banohet",
  priorities: ["kuzhina", "divani-dysheket"],
  timing: "date",
  preferredDate: "2099-01-01",
  assessmentMethod: "telefon",
  channel: "TELEFON",
  area: "Kamëz",
  pagePath: "/pastrim-me-themel-tirane",
  clientRequestId: "test-0001-abcd",
  website: "",
  startedAt: Date.now() - 10_000,
});

beforeEach(() => {
  create.mockReset().mockImplementation(async ({ data }) => ({ id: "lead_1", ...data }));
  findUnique.mockReset().mockResolvedValue(null);
  notify.mockReset();
  afterQueue.length = 0;
});

describe("POST /api/lead", () => {
  it("saves the lead, recomputes the estimate server-side, then notifies", async () => {
    const res = await POST(request({ ...valid(), estimateLek: 1 }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const data = create.mock.calls[0][0].data;
    expect(data).toMatchObject({
      service: "me-themel",
      phone: "+355690000000",
      sizeM2: 80,
      estimateLek: 20000,
      condition: "banohet",
      channel: "TELEFON",
      area: "Kamëz",
      assessmentMethod: "telefon",
      priorities: ["kuzhina", "divani-dysheket"],
      clientRequestId: "test-0001-abcd",
    });
    // A preferred date far in the future (2099) is outside the one-year window: dropped.
    expect(data.preferredDate).toBeUndefined();
    expect(notify).not.toHaveBeenCalled();
    await afterQueue[0]();
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("completes without photos, size or any optional field", async () => {
    const res = await POST(
      request({ service: "divane", name: "Ana", phone: "0690000000", startedAt: Date.now() - 5000 }),
    );
    expect(res.status).toBe(200);
    expect(create.mock.calls[0][0].data).toMatchObject({ service: "divane", sizeM2: undefined, estimateLek: undefined });
  });

  it("never stores an estimate for a house or villa", async () => {
    await POST(request({ ...valid(), clientRequestId: undefined, propertyType: "shtepi" }));
    await POST(request({ ...valid(), clientRequestId: undefined, propertyType: "vile" }));
    expect(create.mock.calls.map((c) => c[0].data.estimateLek)).toEqual([undefined, undefined]);
  });

  it("does not log the submitted name or phone when saving fails", async () => {
    const leaky = new Error('Invalid prisma.lead.create() invocation: { data: { name: "Test Klient", phone: "+355690000000" } }');
    create.mockRejectedValueOnce(leaky);
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await POST(request(valid()));
    const logged = spy.mock.calls.flat().map(String).join(" ");
    expect(logged).not.toMatch(/Test Klient|355690000000/);
    spy.mockRestore();
  });

  it("drops campaign values that aren't plain tags", async () => {
    await POST(request({ ...valid(), utmSource: "facebook", utmCampaign: "Ana 0690000000" }));
    expect(create.mock.calls[0][0].data).toMatchObject({ utmSource: "facebook", utmCampaign: undefined });
  });

  it("never stores an estimate for post-construction or unknown size", async () => {
    await POST(request({ ...valid(), clientRequestId: undefined, condition: "pas-punimeve" }));
    expect(create.mock.calls[0][0].data.estimateLek).toBeUndefined();
    await POST(request({ ...valid(), clientRequestId: undefined, sizeUnknown: true }));
    expect(create.mock.calls[1][0].data).toMatchObject({ estimateLek: undefined, sizeM2: undefined, sizeUnknown: true });
  });

  it("does not show success when the database fails", async () => {
    create.mockRejectedValueOnce(new Error("db down"));
    vi.spyOn(console, "error").mockImplementationOnce(() => {});
    const res = await POST(request(valid()));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toMatch(/nuk u dërgua/);
    expect(afterQueue).toHaveLength(0);
  });

  it("a repeated submit with the same request id returns success without a second row", async () => {
    findUnique.mockResolvedValueOnce({ id: "lead_1" });
    const res = await POST(request(valid()));
    expect(await res.json()).toEqual({ ok: true, duplicate: true });
    expect(create).not.toHaveBeenCalled();
    expect(afterQueue).toHaveLength(0);
  });

  it("two racing submits: the unique index wins, no second notification", async () => {
    create.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", { code: "P2002", clientVersion: "test" }),
    );
    const res = await POST(request(valid()));
    expect(res.status).toBe(200);
    expect((await res.json()).duplicate).toBe(true);
    expect(afterQueue).toHaveLength(0);
  });

  it("returns field errors for invalid input", async () => {
    const res = await POST(request({ ...valid(), phone: "abc", sizeM2: "tetëdhjetë" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(Object.keys(body.fieldErrors)).toEqual(expect.arrayContaining(["phone", "sizeM2"]));
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    expect((await POST(request("{not json"))).status).toBe(400);
  });

  it("keeps the spam protections: honeypot (silent) and the 3-second check", async () => {
    const bot = await POST(request({ ...valid(), website: "http://spam" }));
    expect(await bot.json()).toEqual({ ok: true });
    const fast = await POST(request({ ...valid(), startedAt: Date.now() }));
    expect(fast.status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });

  it("rate-limits one address after five requests in ten minutes", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      const res = await POST(
        new Request("http://localhost/api/lead", {
          method: "POST",
          headers: { "content-type": "application/json", "x-forwarded-for": "10.9.9.9" },
          body: JSON.stringify({ ...valid(), clientRequestId: `rate-limit-${i}-xx` }),
        }),
      );
      statuses.push(res.status);
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
  });
});
