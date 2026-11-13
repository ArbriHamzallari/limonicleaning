// End-to-end booking workflow against a real (local, throwaway) Postgres and a fake Google
// Calendar. Run with:  TEST_DATABASE_URL=postgresql://… npm run test:integration
// Skipped when TEST_DATABASE_URL isn't set. Never point it at a real database: it TRUNCATEs.
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { startFakeGoogle } from "./fake-google";

const DB = process.env.TEST_DATABASE_URL;
const google = DB ? await startFakeGoogle() : null;

if (DB && google) {
  if (!/127\.0\.0\.1|localhost/.test(DB)) throw new Error("TEST_DATABASE_URL must be a local database");
  Object.assign(process.env, {
    DATABASE_URL: DB,
    DATABASE_URL_UNPOOLED: DB,
    GOOGLE_API_BASE: google.base,
    GOOGLE_TOKEN_URL: `${google.base}/token`,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: "test@example.iam.gserviceaccount.com",
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: google.privateKeyPem,
    GOOGLE_CALENDAR_ID: "test-calendar",
    MEDIA_STORAGE: "local",
    MEDIA_LOCAL_DIR: mkdtempSync(join(tmpdir(), "limoni-media-")),
    BOOKING_SETTINGS: JSON.stringify({
      liveHolds: true,
      startTimes: ["08:00", "13:00"],
      dayEndsAt: "18:00",
      bufferMinutes: 60,
      crews: 1,
      minLeadHours: 24,
      horizonDays: 30,
      services: { "me-themel": { durationMinutes: 240, crewsNeeded: 1 } },
    }),
  });
}

const m = DB
  ? {
      prisma: (await import("@/lib/prisma")).prisma,
      req: await import("@/lib/booking/requests"),
      sync: await import("@/lib/booking/calendar-sync"),
      maint: await import("@/lib/booking/maintenance"),
      time: await import("@/lib/booking/time"),
      gcal: await import("@/lib/booking/google-calendar"),
      mediaInit: await import("@/app/api/kerkesa/media/route"),
      mediaOne: await import("@/app/api/kerkesa/media/[id]/route"),
      customerMedia: await import("@/app/kerkesa/[token]/media/[id]/route"),
      notify: await import("@/lib/booking/notify-owner"),
    }
  : null;

describe.skipIf(!DB)("booking workflow (local Postgres + fake Google Calendar)", () => {
  // Vitest still collects a skipped suite, so don't touch the modules when they weren't loaded.
  const { prisma, req, sync, maint, time, gcal } = m ?? ({} as NonNullable<typeof m>);
  const day = time ? time.addDays(time.tzDate(new Date()), 3) : "";
  const base = (over: Partial<Parameters<typeof req.submitRequest>[0]> = {}): Parameters<typeof req.submitRequest>[0] => ({
    service: "me-themel",
    answers: { propertyType: "apartament", areaM2: 80, sofas: 1, mattresses: 2 },
    priorities: ["Kuzhina"],
    name: "Klient Test",
    phone: "+355690000001",
    channel: "WHATSAPP",
    area: "Tiranë, Komuna e Parisit",
    outsideTirana: false,
    mediaIds: [],
    slot: { date: day, time: "08:00" },
    pagePath: "/kerko-oferte",
    ...over,
  });
  const ours = () => [...google!.events.values()].filter((e) => e.extendedProperties?.private?.limoniRequestId);

  beforeAll(async () => {
    await prisma.$executeRawUnsafe(`TRUNCATE "service_requests", "proposals", "request_media", "slot_reservations", "request_events" CASCADE`);
  });
  beforeEach(async () => {
    await prisma.$executeRawUnsafe(`TRUNCATE "service_requests", "proposals", "request_media", "slot_reservations", "request_events" CASCADE`);
    google!.events.clear();
    Object.assign(google!.fail, { list: 0, write: 0, token: 0 });
    gcal.resetCalendarTokenCache();
  });
  afterAll(async () => {
    await prisma.$disconnect();
    await google!.close();
  });

  it("holds a slot, snapshots estimate + checklist, and creates ONE private calendar block without personal data", async () => {
    const r = await req.submitRequest(base({ clientRequestId: "dup-test-0001" }));
    expect(r).toMatchObject({ ok: true, held: true });
    if (!r.ok) return;
    const row = await prisma.serviceRequest.findUniqueOrThrow({ where: { id: r.requestId }, include: { proposals: true, reservations: true } });
    expect(row.dateMode).toBe("HELD");
    expect(row.reservations).toHaveLength(1);
    expect(row.calendarSync).toBe("SYNCED");
    const snap = row.proposals[0].snapshot as unknown as import("@/lib/booking/requests").ProposalSnapshot;
    expect(snap.price).toMatchObject({ kind: "indicative", amountLek: 20000 });
    expect(snap.checklist.included).toContain("Larja e dyshekëve: 2 dyshekë");
    expect(snap.catalogVersion).toBeTruthy();
    expect(ours()).toHaveLength(1);
    const ev = ours()[0];
    expect(ev.summary).toBe("Në shqyrtim (pa konfirmuar): Pastrim me themel");
    expect(ev.visibility).toBe("private");
    expect(ev.attendees).toBeUndefined(); // no invitation to anyone
    expect(JSON.stringify(ev)).not.toMatch(/Klient Test|355690000001|Komuna/);
    expect(new Date(ev.start.dateTime!).toISOString()).toBe(time.zonedToUtc(day, "08:00").toISOString());

    // Same clientRequestId again (double tap / retry): same request, no second block.
    const again = await req.submitRequest(base({ clientRequestId: "dup-test-0001" }));
    expect(again).toMatchObject({ ok: true, duplicate: true, requestId: r.requestId, token: r.token });
    expect(await prisma.serviceRequest.count()).toBe(1);
    expect(ours()).toHaveLength(1);
  });

  it("two simultaneous requests for the last crew: exactly one gets the hold", async () => {
    const [a, b] = await Promise.all([req.submitRequest(base({ phone: "+355690000011" })), req.submitRequest(base({ phone: "+355690000012" }))]);
    const results = [a, b];
    expect(results.filter((x) => x.ok)).toHaveLength(1);
    expect(results.filter((x) => !x.ok && x.code === "slot-taken")).toHaveLength(1);
    expect(await prisma.slotReservation.count({ where: { status: { not: "released" } } })).toBe(1);
    expect(await prisma.serviceRequest.count()).toBe(1); // the loser's transaction rolled back entirely
  });

  it("a busy appointment typed into Google blocks the slot", async () => {
    google!.addManual(time.zonedToUtc(day, "09:00"), time.zonedToUtc(day, "10:00"));
    const r = await req.submitRequest(base());
    expect(r).toMatchObject({ ok: false, code: "slot-taken" });
  });

  it("Google unavailable at submit: honest preferred date, no hold, no event", async () => {
    google!.fail.list = 1;
    const r = await req.submitRequest(base());
    expect(r).toMatchObject({ ok: true, held: false });
    if (!r.ok) return;
    const row = await prisma.serviceRequest.findUniqueOrThrow({ where: { id: r.requestId }, include: { reservations: true } });
    expect(row.dateMode).toBe("PREFERRED");
    expect(row.preferredDate).toBe(day);
    expect(row.dateNote).toMatch(/nuk u kontrollua/);
    expect(row.reservations).toHaveLength(0);
    expect(ours()).toHaveLength(0);
  });

  it("calendar write fails after the hold: hold kept, owner sees FAILED, maintenance retries without duplicates", async () => {
    google!.fail.write = 1;
    const r = await req.submitRequest(base());
    expect(r).toMatchObject({ ok: true, held: true });
    if (!r.ok) return;
    let row = await prisma.serviceRequest.findUniqueOrThrow({ where: { id: r.requestId } });
    expect(row.calendarSync).toBe("FAILED");
    expect(row.calendarSyncError).toContain("503");
    expect(await prisma.slotReservation.count({ where: { requestId: r.requestId, status: "held" } })).toBe(1);
    google!.fail.write = 0;
    await maint.runMaintenance();
    await maint.runMaintenance(); // twice: still one event
    row = await prisma.serviceRequest.findUniqueOrThrow({ where: { id: r.requestId } });
    expect(row.calendarSync).toBe("SYNCED");
    expect(ours()).toHaveLength(1);
  });

  it("owner approves the original: CONFIRMED, the SAME event is updated, job sheet link exists", async () => {
    const r = await req.submitRequest(base());
    if (!r.ok) throw new Error("submit failed");
    const eventId = ours()[0].id;
    await expect(req.approveOriginal(r.requestId, "arbri", {})).rejects.toThrow(/vendndodhjen/); // feasibility first
    await req.setFeasibility(r.requestId, "arbri", true);
    await req.approveOriginal(r.requestId, "arbri", {});
    const row = await prisma.serviceRequest.findUniqueOrThrow({ where: { id: r.requestId }, include: { reservations: true, proposals: true, events: true } });
    expect(row.status).toBe("CONFIRMED");
    expect(row.reservations[0].status).toBe("confirmed");
    expect(row.proposals[0]).toMatchObject({ status: "ACCEPTED", respondedBy: "arbri" });
    expect(row.jobSheetTokenHash).toBeTruthy();
    expect(row.events.find((e) => e.action === "approved")?.actor).toBe("arbri");
    expect(ours()).toHaveLength(1);
    expect(ours()[0]).toMatchObject({ id: eventId, summary: "Konfirmuar: Pastrim me themel" });
  });

  it("re-checks conflicts before approval: a new manual appointment blocks it unless overridden", async () => {
    const r = await req.submitRequest(base());
    if (!r.ok) throw new Error("submit failed");
    await req.setFeasibility(r.requestId, "arbri", true);
    google!.addManual(time.zonedToUtc(day, "10:00"), time.zonedToUtc(day, "11:00"));
    await expect(req.approveOriginal(r.requestId, "arbri", {})).rejects.toThrow(/Google Calendar/);
    await req.approveOriginal(r.requestId, "arbri", { override: true });
    const ev = await prisma.requestEvent.findFirstOrThrow({ where: { requestId: r.requestId, action: "approved" } });
    expect(ev.detail).toMatchObject({ override: true });
  });

  it("revised proposal needs the customer's acceptance; versions are kept", async () => {
    const r = await req.submitRequest(base());
    if (!r.ok) throw new Error("submit failed");
    const newDay = time.addDays(day, 2);
    await req.sendRevision(r.requestId, "arbri", {
      priceLek: 24000,
      included: ["Kuzhina", "Banja", "Divani 1 copë", "Dyshekë 2 copë"],
      excluded: ["Larja e rrobave"],
      clarify: [],
      date: newDay,
      time: "13:00",
      durationMinutes: 300,
      message: "Pas fotove, banja kërkon më shumë punë.",
    });
    let row = await prisma.serviceRequest.findUniqueOrThrow({ where: { id: r.requestId }, include: { proposals: { orderBy: { version: "asc" } }, reservations: { where: { status: { not: "released" } } } } });
    expect(row.status).toBe("AWAITING_CUSTOMER");
    expect(row.proposals.map((p) => [p.version, p.kind, p.status, p.createdBy])).toEqual([
      [1, "submitted", "SUPERSEDED", "klienti"],
      [2, "revised", "PROPOSED", "arbri"],
    ]);
    expect(row.reservations[0].startsAt.toISOString()).toBe(time.zonedToUtc(newDay, "13:00").toISOString());
    expect(ours()).toHaveLength(1);
    expect(ours()[0].summary).toMatch(/Në pritje të klientit/);

    await expect(req.customerAccept("wrong-token-wrong-token-wrong-token-wrong-t", row.proposals[1].id)).rejects.toThrow();
    await req.customerAccept(r.token, row.proposals[1].id);
    row = await prisma.serviceRequest.findUniqueOrThrow({ where: { id: r.requestId }, include: { proposals: { orderBy: { version: "asc" } }, reservations: { where: { status: { not: "released" } } } } });
    expect(row.status).toBe("CONFIRMED");
    expect(row.proposals[1]).toMatchObject({ status: "ACCEPTED", respondedBy: "klienti" });
    expect((row.proposals[0].snapshot as { price: { amountLek: number } }).price.amountLek).toBe(20000); // original kept
    expect(row.reservations[0].status).toBe("confirmed");
    expect(ours()[0].summary).toBe("Konfirmuar: Pastrim me themel");
  });

  it("customer declines a revised proposal: hold released, block removed, slot free again", async () => {
    const r = await req.submitRequest(base());
    if (!r.ok) throw new Error("submit failed");
    await req.sendRevision(r.requestId, "arbri", { priceLek: 30000, included: ["Kuzhina"], excluded: [], clarify: [] });
    const p = await prisma.proposal.findFirstOrThrow({ where: { requestId: r.requestId, version: 2 } });
    await req.customerDecline(r.token, p.id, "Shtrenjtë");
    expect((await prisma.serviceRequest.findUniqueOrThrow({ where: { id: r.requestId } })).status).toBe("DECLINED");
    expect(await prisma.slotReservation.count({ where: { requestId: r.requestId, status: { not: "released" } } })).toBe(0);
    expect(ours()).toHaveLength(0);
    expect(await req.submitRequest(base({ phone: "+355690000099" }))).toMatchObject({ ok: true, held: true });
  });

  it("customer cancels; owner can decline; both release the slot", async () => {
    const a = await req.submitRequest(base());
    if (!a.ok) throw new Error();
    await req.customerCancel(a.token);
    expect(ours()).toHaveLength(0);
    const b = await req.submitRequest(base());
    if (!b.ok) throw new Error();
    await req.closeRequest(b.requestId, "arbri", "DECLINED", "Zona shumë larg");
    expect(await prisma.slotReservation.count({ where: { status: { not: "released" } } })).toBe(0);
    expect(ours()).toHaveLength(0);
  });

  it("manual deletion of our block in Google is flagged, not applied to the booking; re-sync restores it", async () => {
    const r = await req.submitRequest(base());
    if (!r.ok) throw new Error();
    google!.events.delete(ours()[0].id);
    expect(await sync.checkDrift(r.requestId)).toBe("drift");
    const row = await prisma.serviceRequest.findUniqueOrThrow({ where: { id: r.requestId }, include: { reservations: { where: { status: "held" } } } });
    expect(row).toMatchObject({ calendarSync: "DRIFT", status: "PENDING_REVIEW" });
    expect(row.reservations).toHaveLength(1);
    await sync.syncCalendar(r.requestId);
    expect(ours()).toHaveLength(1);
  });

  it("hold expiry runs only when the owner sets holdHours", async () => {
    const r = await req.submitRequest(base());
    if (!r.ok) throw new Error();
    await prisma.serviceRequest.update({ where: { id: r.requestId }, data: { createdAt: new Date(Date.now() - 72 * 3600000) } });
    await maint.runMaintenance();
    expect(await prisma.slotReservation.count({ where: { status: "held" } })).toBe(1); // no policy: never auto-released
    const saved = process.env.BOOKING_SETTINGS!;
    process.env.BOOKING_SETTINGS = JSON.stringify({ ...JSON.parse(saved), holdHours: 48 });
    const summary = await maint.runMaintenance();
    process.env.BOOKING_SETTINGS = saved;
    expect(summary.expired).toBe(1);
    const row = await prisma.serviceRequest.findUniqueOrThrow({ where: { id: r.requestId } });
    expect(row).toMatchObject({ dateMode: "PREFERRED", preferredDate: day, status: "PENDING_REVIEW" });
    expect(ours()).toHaveLength(0);
  });

  it("services without configured capacity collect a preferred date, explicitly not held", async () => {
    const r = await req.submitRequest(base({ service: "divane", answers: { sofas: 2 }, slot: { date: day, time: "08:00" } }));
    expect(r).toMatchObject({ ok: true, held: false });
    if (!r.ok) return;
    const row = await prisma.serviceRequest.findUniqueOrThrow({ where: { id: r.requestId } });
    expect(row).toMatchObject({ dateMode: "PREFERRED", preferredDate: day });
    expect(ours()).toHaveLength(0);
  });

  it("no-photo submission works; owner notification status is recorded apart from the booking", async () => {
    const r = await req.submitRequest(base({ slot: undefined, preferredDate: undefined }));
    if (!r.ok) throw new Error();
    await m!.notify.notifyOwnerNewRequest(r.requestId);
    const row = await prisma.serviceRequest.findUniqueOrThrow({ where: { id: r.requestId } });
    expect(row).toMatchObject({ dateMode: "NONE", status: "PENDING_REVIEW", notifyStatus: "email:skipped; whatsapp:skipped" });
  });

  it("uploads: real photo accepted, fake file rejected, wrong draft key refused, customers can't see others' media", async () => {
    const jpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(200, 1)]);
    const init = async (name: string, type: string, size: number, draftKey?: string) =>
      (await m!.mediaInit.POST(new Request("http://x/api/kerkesa/media", { method: "POST", headers: { "x-forwarded-for": "10.2.0.1" }, body: JSON.stringify({ name, type, size, draftKey }) }))).json();
    const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

    const a = await init("dhoma.jpg", "image/jpeg", jpeg.length);
    expect(a.upload.url).toBe(`/api/kerkesa/media/${a.id}`);
    const put = await m!.mediaOne.PUT(new Request("http://x", { method: "PUT", headers: { "x-draft-key": a.draftKey }, body: jpeg }), ctx(a.id));
    expect(put.status).toBe(200);
    expect((await m!.mediaOne.POST(new Request("http://x", { method: "POST", headers: { "x-draft-key": a.draftKey } }), ctx(a.id))).status).toBe(200);

    const fake = Buffer.from("<html>not a photo</html>");
    const b = await init("foto.jpg", "image/jpeg", fake.length, a.draftKey);
    await m!.mediaOne.PUT(new Request("http://x", { method: "PUT", headers: { "x-draft-key": a.draftKey }, body: fake }), ctx(b.id));
    expect((await m!.mediaOne.POST(new Request("http://x", { method: "POST", headers: { "x-draft-key": a.draftKey } }), ctx(b.id))).status).toBe(422);

    const stranger = await init("x.jpg", "image/jpeg", 10);
    expect((await m!.mediaOne.DELETE(new Request("http://x", { method: "DELETE", headers: { "x-draft-key": stranger.draftKey } }), ctx(a.id))).status).toBe(404);
    expect((await init("doc.pdf", "application/pdf", 10)).error).toBeTruthy();

    const mine = await req.submitRequest(base({ slot: undefined, draftKey: a.draftKey, mediaIds: [a.id] }));
    const other = await req.submitRequest(base({ slot: undefined, phone: "+355690000077" }));
    if (!mine.ok || !other.ok) throw new Error();
    const view = (token: string) => m!.customerMedia.GET(new Request("http://x"), { params: Promise.resolve({ token, id: a.id }) });
    const ok = await view(mine.token);
    expect(ok.status).toBe(200);
    expect(ok.headers.get("cache-control")).toBe("private, no-store");
    expect((await view(other.token)).status).toBe(404);
    expect((await view("x".repeat(43))).status).toBe(404);

    // A media id from someone else's draft can't be attached to a new request.
    const c = await init("c.jpg", "image/jpeg", jpeg.length);
    const steal = await req.submitRequest(base({ slot: undefined, draftKey: stranger.draftKey, mediaIds: [c.id] }));
    expect(steal).toMatchObject({ ok: false, code: "media" });
  });
});
