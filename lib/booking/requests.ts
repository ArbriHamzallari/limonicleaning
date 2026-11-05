// Booking-request workflow (server only). Every state change goes through here, writes an
// audit row (RequestEvent) and leaves Google Calendar to calendar-sync.ts.
//
// States: PENDING_REVIEW → (AWAITING_INFO ↔ PENDING_REVIEW) → CONFIRMED | AWAITING_CUSTOMER →
// CONFIRMED | DECLINED; CANCELLED from any open state; COMPLETED after the job.
// A material change (price, scope, date) is a new Proposal that the customer must accept.
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import {
  CATALOG_VERSION,
  checklistFor,
  estimateFor,
  services,
  type Answers,
  type Checklist,
  type Estimate,
  type ServiceKey,
} from "./catalog";
import { getBookingSettings, holdBlocker } from "./settings";
import { slotWindow } from "./slots";
import { formatDateSq, formatTimeSq, tzDate, tzWeekday, zonedToUtc } from "./time";
import { reserveCrews, releaseReservations, confirmReservations, SlotTakenError } from "./reservations";
import { isCalendarConfigured, listManualBusy } from "./google-calendar";
import { syncCalendar } from "./calendar-sync";
import { decryptToken, encryptToken, hashToken, newToken } from "./tokens";
import { formatLek } from "../quote";

export const OPEN_STATUSES = ["PENDING_REVIEW", "AWAITING_INFO", "AWAITING_CUSTOMER"] as const;

// ---------------------------------------------------------------------------------------
// Snapshots
// ---------------------------------------------------------------------------------------

export type ProposalPrice =
  | Estimate
  /** A total the owner proposed after review (needs the customer's acceptance). */
  | { kind: "proposed-total"; amountLek: number; amountText: string; note?: string };

export interface ProposalDate {
  mode: "held" | "booked" | "preferred" | "none";
  startsAt?: string;
  endsAt?: string;
  preferredDate?: string;
}

export interface ProposalSnapshot {
  catalogVersion: string;
  service: ServiceKey;
  serviceLabel: string;
  answerLines: { label: string; value: string }[];
  price: ProposalPrice;
  checklist: Checklist;
  date: ProposalDate;
  /** Owner's note to the customer (revised proposals and info requests). */
  message?: string;
}

export function answerLines(service: ServiceKey, a: Answers): { label: string; value: string }[] {
  const lines: { label: string; value: string }[] = [];
  for (const q of services[service].questions) {
    const v = a[q.id];
    if (v == null) continue;
    let value: string;
    if (q.type === "choice") value = q.options.find((x) => x.value === v)?.label ?? String(v);
    else if (q.type === "multi") value = q.options.filter((x) => (v as string[]).includes(x.value)).map((x) => x.label).join(", ");
    else if (q.type === "area") value = v === "nuk-e-di" ? "Nuk e di ende" : `${v} m²`;
    else value = String(v);
    if (value) lines.push({ label: q.label.replace(/\?$/, ""), value });
  }
  return lines;
}

export function describeDate(d: ProposalDate): string {
  if ((d.mode === "held" || d.mode === "booked") && d.startsAt) {
    const s = new Date(d.startsAt);
    return `${formatDateSq(s)}, ora ${formatTimeSq(s)}${d.endsAt ? `–${formatTimeSq(new Date(d.endsAt))}` : ""}`;
  }
  if (d.mode === "preferred" && d.preferredDate) return `${formatDateSq(d.preferredDate)} (datë e preferuar, nuk mbahet)`;
  return "Pa datë të zgjedhur";
}

export function priceText(p: ProposalPrice): string {
  if (p.kind === "indicative") return `${p.amountText} (vlerësim orientues)`;
  if (p.kind === "proposed-total") return `${p.amountText} (totali i propozuar)`;
  return "Çmimi përcaktohet pas vlerësimit";
}

// ---------------------------------------------------------------------------------------
// Customer submission
// ---------------------------------------------------------------------------------------

export interface SubmitInput {
  service: ServiceKey;
  answers: Answers;
  priorities: string[];
  note?: string;
  name: string;
  phone: string;
  channel: "WHATSAPP" | "TELEFON";
  area?: string;
  outsideTirana: boolean;
  draftKey?: string;
  mediaIds: string[];
  slot?: { date: string; time: string };
  preferredDate?: string;
  clientRequestId?: string;
  pagePath: string;
  utmSource?: string;
  utmCampaign?: string;
}

export type SubmitResult =
  | { ok: true; token: string; requestId: string; held: boolean; duplicate?: boolean }
  | { ok: false; code: "slot-taken" | "slot-invalid" | "media" | "failed"; message: string };

type DateDecision =
  | { mode: "HELD"; startsAt: Date; jobEndsAt: Date; holdEndsAt: Date; crewsNeeded: number; crewsAvailable: number }
  | { mode: "PREFERRED"; preferredDate: string; note?: string }
  | { mode: "NONE" };

/** Decide whether the chosen slot can really be held now. Never claims a hold it can't make. */
async function decideDate(input: SubmitInput, now: Date): Promise<DateDecision | { error: SubmitResult }> {
  const s = getBookingSettings();
  if (input.slot) {
    const { date, time } = input.slot;
    const blocker = holdBlocker(input.service, s);
    if (blocker || !isCalendarConfigured()) {
      return { mode: "PREFERRED", preferredDate: date, note: "Data e preferuar; nuk u mbajt (rezervimi i drejtpërdrejtë nuk është aktiv)." };
    }
    const w = slotWindow(input.service, date, time, s)!;
    const dayEnd = zonedToUtc(date, s.dayEndsAt!);
    const valid =
      s.startTimes!.includes(time) &&
      s.workingDays.includes(tzWeekday(date)) &&
      w.jobEndsAt <= dayEnd &&
      w.startsAt.getTime() >= now.getTime() + s.minLeadHours * 3600000 &&
      w.startsAt.getTime() <= now.getTime() + (s.horizonDays + 1) * 86400000;
    if (!valid) return { error: { ok: false, code: "slot-invalid", message: "Ky orar nuk është më i disponueshëm. Zgjidhni një tjetër." } };
    let busyHits = 0;
    try {
      const busy = await listManualBusy(w.startsAt, w.holdEndsAt);
      busyHits = busy.filter((b) => b.start < w.holdEndsAt && w.startsAt < b.end).length;
    } catch {
      // Google unavailable: no hold, an honest preferred date instead.
      return { mode: "PREFERRED", preferredDate: date, note: "Kalendari nuk u kontrollua dot; data u ruajt si e preferuar, pa u mbajtur." };
    }
    const crewsAvailable = busyHits ? (s.manualBusyBlocks === "all" ? 0 : s.crews! - busyHits) : s.crews!;
    if (crewsAvailable < w.crewsNeeded) return { error: { ok: false, code: "slot-taken", message: "Ky orar sapo u zu. Zgjidhni një orar tjetër." } };
    return { mode: "HELD", ...w, crewsAvailable };
  }
  if (input.preferredDate) return { mode: "PREFERRED", preferredDate: input.preferredDate };
  return { mode: "NONE" };
}

export async function submitRequest(input: SubmitInput, now = new Date()): Promise<SubmitResult> {
  if (input.clientRequestId) {
    const existing = await prisma.serviceRequest.findUnique({ where: { clientRequestId: input.clientRequestId } });
    if (existing) {
      const token = decryptToken(existing.publicTokenEnc);
      if (token) return { ok: true, token, requestId: existing.id, held: existing.dateMode === "HELD", duplicate: true };
    }
  }

  const decision = await decideDate(input, now);
  if ("error" in decision) return decision.error;

  const ctx = { outsideTirana: input.outsideTirana, priorities: input.priorities };
  const snapshot: ProposalSnapshot = {
    catalogVersion: CATALOG_VERSION,
    service: input.service,
    serviceLabel: services[input.service].label,
    answerLines: answerLines(input.service, input.answers),
    price: estimateFor(input.service, input.answers, ctx),
    checklist: checklistFor(input.service, input.answers, ctx),
    date:
      decision.mode === "HELD"
        ? { mode: "held", startsAt: decision.startsAt.toISOString(), endsAt: decision.jobEndsAt.toISOString() }
        : decision.mode === "PREFERRED"
          ? { mode: "preferred", preferredDate: decision.preferredDate }
          : { mode: "none" },
  };

  const token = newToken();
  const draftKeyHash = input.draftKey ? hashToken(input.draftKey) : null;

  try {
    const request = await prisma.$transaction(async (tx) => {
      const req = await tx.serviceRequest.create({
        data: {
          publicTokenHash: hashToken(token),
          publicTokenEnc: encryptToken(token),
          clientRequestId: input.clientRequestId,
          service: input.service,
          catalogVersion: CATALOG_VERSION,
          answers: input.answers as Prisma.InputJsonValue,
          priorities: input.priorities,
          note: input.note,
          name: input.name,
          phone: input.phone,
          channel: input.channel,
          area: input.area,
          outsideTirana: input.outsideTirana,
          dateMode: decision.mode,
          preferredDate: decision.mode === "PREFERRED" ? decision.preferredDate : null,
          dateNote: decision.mode === "PREFERRED" ? (decision.note ?? null) : null,
          pagePath: input.pagePath,
          utmSource: input.utmSource,
          utmCampaign: input.utmCampaign,
          calendarSync: decision.mode === "HELD" ? "PENDING" : "NOT_NEEDED",
          proposals: {
            create: { version: 1, kind: "submitted", createdBy: "klienti", snapshot: snapshot as unknown as Prisma.InputJsonValue },
          },
          events: { create: { actor: "klienti", action: "submitted", detail: { held: decision.mode === "HELD" } } },
        },
      });
      if (input.mediaIds.length) {
        if (!draftKeyHash) throw new MediaClaimError();
        const claimed = await tx.requestMedia.updateMany({
          where: { id: { in: input.mediaIds }, draftKeyHash, requestId: null, status: "ready" },
          data: { requestId: req.id },
        });
        if (claimed.count !== input.mediaIds.length) throw new MediaClaimError();
      }
      if (decision.mode === "HELD") {
        await reserveCrews(tx, {
          requestId: req.id,
          startsAt: decision.startsAt,
          holdEndsAt: decision.holdEndsAt,
          jobEndsAt: decision.jobEndsAt,
          crewsNeeded: decision.crewsNeeded,
          crews: Math.min(getBookingSettings().crews!, decision.crewsAvailable),
        });
      }
      return req;
    });
    if (decision.mode === "HELD") await syncCalendar(request.id);
    return { ok: true, token, requestId: request.id, held: decision.mode === "HELD" };
  } catch (error) {
    if (error instanceof SlotTakenError) return { ok: false, code: "slot-taken", message: "Ky orar sapo u zu. Zgjidhni një orar tjetër." };
    if (error instanceof MediaClaimError)
      return { ok: false, code: "media", message: "Disa foto ose video nuk u ngarkuan plotësisht. Hiqini ose provoni t'i ngarkoni përsëri." };
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && input.clientRequestId) {
      return submitRequest(input, now); // a parallel duplicate won the race: return its link
    }
    console.error("[booking] submit failed:", error instanceof Error ? error.name : "unknown");
    return { ok: false, code: "failed", message: "Kërkesa nuk u dërgua. Provoni përsëri ose na shkruani në WhatsApp." };
  }
}

class MediaClaimError extends Error {}

// ---------------------------------------------------------------------------------------
// Reading
// ---------------------------------------------------------------------------------------

export async function findByToken(token: string) {
  return prisma.serviceRequest.findUnique({
    where: { publicTokenHash: hashToken(token) },
    include: {
      proposals: { orderBy: { version: "asc" } },
      media: { where: { status: "ready" }, orderBy: { createdAt: "asc" } },
      events: { orderBy: { at: "asc" } },
      reservations: { where: { status: { not: "released" } } },
    },
  });
}

export type FullRequest = NonNullable<Awaited<ReturnType<typeof findByToken>>>;

export function latestProposal<P extends { version: number }>(r: { proposals: P[] }): P {
  return [...r.proposals].sort((a, b) => b.version - a.version)[0];
}

export function snapshotOf(p: { snapshot: unknown }): ProposalSnapshot {
  return p.snapshot as ProposalSnapshot;
}

// ---------------------------------------------------------------------------------------
// Customer actions (authorised by the status-link token)
// ---------------------------------------------------------------------------------------

export class WorkflowError extends Error {}

async function log(tx: Prisma.TransactionClient, requestId: string, actor: string, action: string, detail?: Record<string, unknown>) {
  await tx.requestEvent.create({ data: { requestId, actor, action, detail: detail as Prisma.InputJsonValue } });
}

/** Make sure the reservation for a proposal exists (re-reserve if it was released). */
async function ensureReservation(tx: Prisma.TransactionClient, requestId: string, date: ProposalDate, status: "held" | "confirmed") {
  if (!date.startsAt || !date.endsAt) return;
  const active = await tx.slotReservation.count({ where: { requestId, status: { not: "released" } } });
  if (active) return;
  const s = getBookingSettings();
  const startsAt = new Date(date.startsAt);
  const jobEndsAt = new Date(date.endsAt);
  const holdEndsAt = new Date(jobEndsAt.getTime() + (s.bufferMinutes ?? 0) * 60000);
  const req = await tx.serviceRequest.findUniqueOrThrow({ where: { id: requestId } });
  if (s.crews && !holdBlocker(req.service as ServiceKey, s)) {
    await reserveCrews(tx, { requestId, startsAt, holdEndsAt, jobEndsAt, crewsNeeded: req.plannedCrews ?? s.services[req.service as ServiceKey]!.crewsNeeded, crews: s.crews, status });
  } else {
    // Capacity not configured: an untracked row (crew NULL) only so the calendar shows the job.
    await tx.slotReservation.create({ data: { requestId, crew: null, startsAt, endsAt: holdEndsAt, jobEndsAt, status } });
  }
}

export async function customerAccept(token: string, proposalId: string): Promise<void> {
  const r = await findByToken(token);
  if (!r) throw new WorkflowError("not-found");
  const p = latestProposal(r);
  if (r.status !== "AWAITING_CUSTOMER" || p.id !== proposalId || p.status !== "PROPOSED" || p.kind !== "revised")
    throw new WorkflowError("Kjo ofertë nuk pret më përgjigje.");
  await prisma.$transaction(async (tx) => {
    await ensureReservation(tx, r.id, snapshotOf(p).date, "confirmed");
    await confirmReservations(tx, r.id);
    await tx.proposal.update({ where: { id: p.id }, data: { status: "ACCEPTED", respondedAt: new Date(), respondedBy: "klienti" } });
    await tx.serviceRequest.update({ where: { id: r.id }, data: { status: "CONFIRMED", dateMode: "HELD" } });
    await log(tx, r.id, "klienti", "accepted_proposal", { version: p.version });
  });
  await ensureJobSheet(r.id);
  await syncCalendar(r.id);
}

export async function customerDecline(token: string, proposalId: string, reason?: string): Promise<void> {
  const r = await findByToken(token);
  if (!r) throw new WorkflowError("not-found");
  const p = latestProposal(r);
  if (r.status !== "AWAITING_CUSTOMER" || p.id !== proposalId || p.status !== "PROPOSED") throw new WorkflowError("Kjo ofertë nuk pret më përgjigje.");
  await prisma.$transaction(async (tx) => {
    await tx.proposal.update({ where: { id: p.id }, data: { status: "REJECTED", respondedAt: new Date(), respondedBy: "klienti" } });
    await releaseReservations(tx, r.id);
    await tx.serviceRequest.update({ where: { id: r.id }, data: { status: "DECLINED" } });
    await log(tx, r.id, "klienti", "declined_proposal", { version: p.version, reason: reason?.slice(0, 500) });
  });
  await syncCalendar(r.id);
}

export async function customerCancel(token: string, reason?: string): Promise<void> {
  const r = await findByToken(token);
  if (!r) throw new WorkflowError("not-found");
  if (!["PENDING_REVIEW", "AWAITING_INFO", "AWAITING_CUSTOMER", "CONFIRMED"].includes(r.status)) throw new WorkflowError("Kjo kërkesë nuk mund të anulohet më.");
  await prisma.$transaction(async (tx) => {
    await releaseReservations(tx, r.id);
    await tx.serviceRequest.update({ where: { id: r.id }, data: { status: "CANCELLED" } });
    await log(tx, r.id, "klienti", "cancelled", { reason: reason?.slice(0, 500) });
  });
  await syncCalendar(r.id);
}

export async function customerReply(token: string, message: string): Promise<void> {
  const r = await findByToken(token);
  if (!r) throw new WorkflowError("not-found");
  if (!OPEN_STATUSES.includes(r.status as (typeof OPEN_STATUSES)[number])) throw new WorkflowError("Kjo kërkesë është mbyllur.");
  await prisma.$transaction(async (tx) => {
    await log(tx, r.id, "klienti", "customer_message", { message: message.slice(0, 1500) });
    if (r.status === "AWAITING_INFO") await tx.serviceRequest.update({ where: { id: r.id }, data: { status: "PENDING_REVIEW" } });
  });
}

// ---------------------------------------------------------------------------------------
// Owner actions (authorised by the admin session; `actor` is the owner's username)
// ---------------------------------------------------------------------------------------

async function getOpen(id: string) {
  const r = await prisma.serviceRequest.findUnique({
    where: { id },
    include: { proposals: { orderBy: { version: "asc" } }, reservations: { where: { status: { not: "released" } } } },
  });
  if (!r) throw new WorkflowError("Kërkesa nuk u gjet.");
  return r;
}

export async function setFeasibility(id: string, actor: string, ok: boolean, note?: string) {
  await prisma.$transaction(async (tx) => {
    await tx.serviceRequest.update({ where: { id }, data: { feasibilityOk: ok } });
    await log(tx, id, actor, ok ? "feasibility_confirmed" : "feasibility_unconfirmed", { note: note?.slice(0, 500) });
  });
}

export async function setPlanning(id: string, actor: string, plannedCrews: number | null, plannedMinutes: number | null) {
  await prisma.$transaction(async (tx) => {
    await tx.serviceRequest.update({ where: { id }, data: { plannedCrews, plannedMinutes } });
    await log(tx, id, actor, "planning_changed", { plannedCrews, plannedMinutes });
  });
}

export interface ConflictReport {
  conflict: boolean;
  checked: boolean;
  message?: string;
}

/** Re-check right before confirmation: our reservation and anything typed into the calendar since. */
export async function recheckConflicts(id: string, date: ProposalDate): Promise<ConflictReport> {
  if (!date.startsAt || !date.endsAt) return { conflict: false, checked: false, message: "Pa orë të caktuar." };
  if (!isCalendarConfigured()) return { conflict: false, checked: false, message: "Google Calendar nuk është lidhur: kontrolloni kalendarin vetë." };
  try {
    const busy = await listManualBusy(new Date(date.startsAt), new Date(date.endsAt));
    if (busy.length) return { conflict: true, checked: true, message: "Në Google Calendar ka një takim tjetër në këtë orar." };
    const others = await prisma.slotReservation.count({
      where: { requestId: { not: id }, status: { not: "released" }, startsAt: { lt: new Date(date.endsAt) }, endsAt: { gt: new Date(date.startsAt) } },
    });
    const crews = getBookingSettings().crews;
    if (crews && others >= crews) return { conflict: true, checked: true, message: "Të gjitha ekipet janë të zëna në këtë orar." };
    return { conflict: false, checked: true };
  } catch {
    return { conflict: false, checked: false, message: "Google Calendar nuk u kontrollua dot tani." };
  }
}

/**
 * Approve the customer's own proposal without material change. Allowed only when it has a
 * price (an indicative one counts as accepted by both sides) and an exact time. The time may
 * be set here only on the customer's preferred date; any other change is a revised proposal.
 */
export async function approveOriginal(id: string, actor: string, opts: { time?: string; override?: boolean }) {
  const r = await getOpen(id);
  if (!["PENDING_REVIEW", "AWAITING_INFO"].includes(r.status)) throw new WorkflowError("Kjo kërkesë nuk pret miratim.");
  if (!r.feasibilityOk) throw new WorkflowError("Konfirmoni më parë vendndodhjen dhe mundësinë e shërbimit.");
  const p = latestProposal(r);
  if (p.kind !== "submitted" || p.status !== "PROPOSED") throw new WorkflowError("Ka një ofertë të rishikuar: duhet ta pranojë klienti.");
  const snap = snapshotOf(p);
  if (snap.price.kind !== "indicative") throw new WorkflowError("Kjo kërkesë nuk ka çmim: dërgoni një ofertë me çmim që ta pranojë klienti.");
  let date = snap.date;
  if (date.mode === "preferred" || date.mode === "none") {
    if (date.mode === "none" || !opts.time || !/^\d{2}:\d{2}$/.test(opts.time) || !r.plannedMinutes)
      throw new WorkflowError("Vendosni orën dhe kohëzgjatjen në datën e preferuar, ose dërgoni një ofertë me datë tjetër.");
    const startsAt = zonedToUtc(date.preferredDate!, opts.time);
    date = { mode: "booked", startsAt: startsAt.toISOString(), endsAt: new Date(startsAt.getTime() + r.plannedMinutes * 60000).toISOString() };
  }
  const check = await recheckConflicts(id, date);
  if (check.conflict && !opts.override) throw new WorkflowError(`${check.message} Zgjidhni “Mirato gjithsesi” vetëm nëse e keni kontrolluar.`);
  await prisma.$transaction(async (tx) => {
    await ensureReservation(tx, id, date, "confirmed");
    await confirmReservations(tx, id);
    await tx.proposal.update({ where: { id: p.id }, data: { status: "ACCEPTED", respondedAt: new Date(), respondedBy: actor } });
    if (date !== snap.date) {
      // The time was set on the customer's own date: recorded as an approved version (same price/scope).
      await tx.proposal.update({ where: { id: p.id }, data: { status: "SUPERSEDED" } });
      await tx.proposal.create({
        data: {
          requestId: id,
          version: p.version + 1,
          kind: "approved",
          createdBy: actor,
          status: "ACCEPTED",
          respondedAt: new Date(),
          respondedBy: actor,
          snapshot: { ...snap, date } as unknown as Prisma.InputJsonValue,
        },
      });
    }
    await tx.serviceRequest.update({ where: { id }, data: { status: "CONFIRMED", dateMode: "HELD" } });
    await log(tx, id, actor, "approved", { conflictChecked: check.checked, override: !!(check.conflict && opts.override) });
  });
  await ensureJobSheet(id);
  await syncCalendar(id);
}

export interface RevisionInput {
  priceLek: number | null;
  priceNote?: string;
  included: string[];
  excluded: string[];
  clarify: string[];
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
  durationMinutes?: number;
  message?: string;
}

/** A material change: new proposal version the customer must accept. Keeps every earlier version. */
export async function sendRevision(id: string, actor: string, input: RevisionInput) {
  const r = await getOpen(id);
  if (!OPEN_STATUSES.includes(r.status as (typeof OPEN_STATUSES)[number])) throw new WorkflowError("Kjo kërkesë është mbyllur.");
  const prev = snapshotOf(latestProposal(r));
  const price: ProposalPrice =
    input.priceLek && input.priceLek > 0
      ? { kind: "proposed-total", amountLek: input.priceLek, amountText: `${formatLek(input.priceLek)} lekë të reja`, note: input.priceNote }
      : { kind: "after-assessment", reason: "Çmimi përcaktohet pas vlerësimit.", assumptions: [] };
  let date = prev.date;
  const minutes = input.durationMinutes ?? r.plannedMinutes ?? null;
  if (input.date && input.time) {
    if (!minutes) throw new WorkflowError("Vendosni kohëzgjatjen për datën e re.");
    const startsAt = zonedToUtc(input.date, input.time);
    date = { mode: "held", startsAt: startsAt.toISOString(), endsAt: new Date(startsAt.getTime() + minutes * 60000).toISOString() };
  }
  const snapshot: ProposalSnapshot = {
    ...prev,
    price,
    checklist: { included: input.included, excluded: input.excluded, clarify: input.clarify, priorities: prev.checklist.priorities },
    date,
    message: input.message?.slice(0, 1500),
  };
  const dateChanged = date.startsAt !== prev.date.startsAt;
  await prisma.$transaction(async (tx) => {
    await tx.proposal.updateMany({ where: { requestId: id, status: "PROPOSED" }, data: { status: "SUPERSEDED" } });
    await tx.proposal.create({
      data: { requestId: id, version: latestProposal(r).version + 1, kind: "revised", createdBy: actor, snapshot: snapshot as unknown as Prisma.InputJsonValue },
    });
    if (dateChanged) {
      await releaseReservations(tx, id);
      await ensureReservation(tx, id, date, "held");
    }
    await tx.serviceRequest.update({ where: { id }, data: { status: "AWAITING_CUSTOMER", dateMode: date.startsAt ? "HELD" : r.dateMode, plannedMinutes: minutes } });
    await log(tx, id, actor, "revised_proposal", { version: latestProposal(r).version + 1, dateChanged });
  });
  await syncCalendar(id);
}

export async function askForInfo(id: string, actor: string, message: string) {
  const r = await getOpen(id);
  if (!["PENDING_REVIEW", "AWAITING_INFO"].includes(r.status)) throw new WorkflowError("Kjo kërkesë nuk është në shqyrtim.");
  await prisma.$transaction(async (tx) => {
    await tx.serviceRequest.update({ where: { id }, data: { status: "AWAITING_INFO" } });
    await log(tx, id, actor, "asked_for_info", { message: message.slice(0, 1500) });
  });
  await syncCalendar(id);
}

export async function closeRequest(id: string, actor: string, to: "DECLINED" | "CANCELLED" | "COMPLETED", reason?: string) {
  const r = await getOpen(id);
  if (to === "COMPLETED" && r.status !== "CONFIRMED") throw new WorkflowError("Vetëm një pastrim i konfirmuar shënohet si i kryer.");
  if (to !== "COMPLETED" && ["DECLINED", "CANCELLED", "COMPLETED"].includes(r.status)) throw new WorkflowError("Kjo kërkesë është mbyllur.");
  await prisma.$transaction(async (tx) => {
    if (to !== "COMPLETED") await releaseReservations(tx, id);
    await tx.serviceRequest.update({ where: { id }, data: { status: to } });
    await log(tx, id, actor, to.toLowerCase(), { reason: reason?.slice(0, 500) });
  });
  if (to !== "COMPLETED") await syncCalendar(id);
}

export async function setAddress(id: string, actor: string, address: string) {
  await prisma.$transaction(async (tx) => {
    await tx.serviceRequest.update({ where: { id }, data: { address: address.trim().slice(0, 300) || null } });
    await log(tx, id, actor, "address_set");
  });
}

/** New customer link (the old one stops working). Returns the raw token to share. */
export async function rotateCustomerLink(id: string, actor: string): Promise<string> {
  const token = newToken();
  await prisma.$transaction(async (tx) => {
    await tx.serviceRequest.update({ where: { id }, data: { publicTokenHash: hashToken(token), publicTokenEnc: encryptToken(token) } });
    await log(tx, id, actor, "customer_link_rotated");
  });
  return token;
}

export async function ensureJobSheet(id: string): Promise<string> {
  const r = await prisma.serviceRequest.findUniqueOrThrow({ where: { id } });
  const existing = r.jobSheetTokenEnc ? decryptToken(r.jobSheetTokenEnc) : null;
  if (existing) return existing;
  const token = newToken();
  await prisma.serviceRequest.update({ where: { id }, data: { jobSheetTokenHash: hashToken(token), jobSheetTokenEnc: encryptToken(token) } });
  return token;
}

export async function rotateJobSheet(id: string, actor: string): Promise<string> {
  const token = newToken();
  await prisma.$transaction(async (tx) => {
    await tx.serviceRequest.update({ where: { id }, data: { jobSheetTokenHash: hashToken(token), jobSheetTokenEnc: encryptToken(token) } });
    await log(tx, id, actor, "job_sheet_link_rotated");
  });
  return token;
}

export function customerLink(r: { publicTokenEnc: string }, base: string): string | null {
  const t = decryptToken(r.publicTokenEnc);
  return t ? `${base}/kerkesa/${t}` : null;
}

export { tzDate };
