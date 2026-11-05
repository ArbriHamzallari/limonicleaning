// Mirrors a request's reservation into Google Calendar. The database is the truth: this
// function makes the calendar match it, never the other way round. Safe to call repeatedly
// (deterministic event id). Failures are recorded on the request for the owner to see and are
// retried by the maintenance job; they never undo a reservation already made in the database.
import { prisma } from "../prisma";
import { siteUrl } from "../seo";
import { services, type ServiceKey } from "./catalog";
import { CalendarError, deleteEvent, eventIdFor, getEvent, isCalendarConfigured, upsertEvent } from "./google-calendar";

const ACTIVE = ["PENDING_REVIEW", "AWAITING_INFO", "AWAITING_CUSTOMER", "CONFIRMED"];

function summaryFor(status: string, service: ServiceKey) {
  const label = services[service]?.label ?? service;
  if (status === "CONFIRMED") return `Konfirmuar: ${label}`;
  if (status === "AWAITING_CUSTOMER") return `Në pritje të klientit: ${label}`;
  return `Në shqyrtim (pa konfirmuar): ${label}`;
}

const reason = (e: unknown) => (e instanceof CalendarError ? e.message : e instanceof Error ? e.name : "error").slice(0, 200);

export async function syncCalendar(requestId: string): Promise<"synced" | "removed" | "not-needed" | "failed"> {
  const req = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { reservations: { where: { status: { not: "released" } } } },
  });
  if (!req) return "not-needed";
  const active = req.reservations.length > 0 && ACTIVE.includes(req.status);

  if (!isCalendarConfigured()) {
    await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { calendarSync: active ? "FAILED" : "NOT_NEEDED", calendarSyncError: active ? "Google Calendar nuk është lidhur" : null },
    });
    return active ? "failed" : "not-needed";
  }

  try {
    if (active) {
      const start = new Date(Math.min(...req.reservations.map((r) => r.startsAt.getTime())));
      const end = new Date(Math.max(...req.reservations.map((r) => r.jobEndsAt.getTime())));
      const id = await upsertEvent({
        requestId,
        summary: summaryFor(req.status, req.service as ServiceKey),
        // No customer data or media here: only a link to the protected owner page.
        description: `Kërkesë nga limonicleaning.com. Detajet: ${siteUrl}/admin/kerkesa/${requestId}`,
        start,
        end,
      });
      await prisma.serviceRequest.update({
        where: { id: requestId },
        data: { calendarEventId: id, calendarSync: "SYNCED", calendarSyncError: null, calendarSyncedAt: new Date(), calendarAttempts: 0 },
      });
      return "synced";
    }
    if (req.calendarEventId) await deleteEvent(req.calendarEventId);
    await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { calendarSync: "NOT_NEEDED", calendarSyncError: null, calendarSyncedAt: new Date(), calendarAttempts: 0 },
    });
    return "removed";
  } catch (error) {
    await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { calendarSync: "FAILED", calendarSyncError: reason(error), calendarAttempts: { increment: 1 } },
    });
    await prisma.requestEvent.create({
      data: { requestId, actor: "sistemi", action: "calendar_sync_failed", detail: { error: reason(error) } },
    });
    return "failed";
  }
}

/**
 * Manual edits in Google Calendar never change a booking. If our event was deleted or moved
 * by hand, the request is flagged DRIFT so the owner decides (re-sync = put it back to the
 * agreed time; or reschedule through the website, which asks the customer).
 */
export async function checkDrift(requestId: string): Promise<"ok" | "drift" | "skipped"> {
  const req = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { reservations: { where: { status: { not: "released" } } } },
  });
  if (!req?.calendarEventId || req.calendarSync !== "SYNCED" || !isCalendarConfigured() || !req.reservations.length) return "skipped";
  const expectedStart = Math.min(...req.reservations.map((r) => r.startsAt.getTime()));
  const expectedEnd = Math.max(...req.reservations.map((r) => r.jobEndsAt.getTime()));
  const e = await getEvent(eventIdFor(requestId));
  let problem: string | null = null;
  if (!e || e.status === "cancelled") problem = "Blloku në Google Calendar u fshi me dorë";
  else if (e.start?.getTime() !== expectedStart || e.end?.getTime() !== expectedEnd) problem = "Blloku në Google Calendar u zhvendos me dorë";
  if (!problem) return "ok";
  await prisma.serviceRequest.update({ where: { id: requestId }, data: { calendarSync: "DRIFT", calendarSyncError: problem } });
  await prisma.requestEvent.create({ data: { requestId, actor: "sistemi", action: "calendar_drift", detail: { problem } } });
  return "drift";
}
