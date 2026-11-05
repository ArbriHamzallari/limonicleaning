// Daily maintenance (GET /api/cron/kerkesa, Vercel Cron). Idempotent; safe to run by hand.
//  1. Retry failed/pending Google Calendar syncs.
//  2. Detect manual edits/deletions of our calendar blocks (flag DRIFT, never change bookings).
//  3. Release pending holds older than BOOKING_SETTINGS.holdHours, only if the owner set it.
//  4. Delete uploads never attached to a request (24 h).
//  5. Delete media of closed requests after MEDIA_RETENTION_DAYS, only if set.
//  6. Email the owner a digest of anything needing attention (stale holds, sync problems).
import { prisma } from "../prisma";
import { getBookingSettings } from "./settings";
import { checkDrift, syncCalendar } from "./calendar-sync";
import { releaseReservations } from "./reservations";
import { getStorage } from "./storage";
import { tzDate } from "./time";
import { sendOwnerDigest } from "./notify-owner";
import { services, type ServiceKey } from "./catalog";

const OPEN = ["PENDING_REVIEW", "AWAITING_INFO", "AWAITING_CUSTOMER"] as const;

export async function runMaintenance(now = new Date()) {
  const s = getBookingSettings();
  const summary = { retried: 0, drift: 0, expired: 0, draftsDeleted: 0, mediaDeleted: 0, attention: 0, digest: "skipped" as string };

  for (const r of await prisma.serviceRequest.findMany({ where: { calendarSync: { in: ["FAILED", "PENDING"] }, calendarAttempts: { lt: 20 } }, take: 50 })) {
    if ((await syncCalendar(r.id)) !== "failed") summary.retried++;
  }

  for (const r of await prisma.serviceRequest.findMany({ where: { calendarSync: "SYNCED", status: { in: [...OPEN, "CONFIRMED"] } }, take: 100 })) {
    try {
      if ((await checkDrift(r.id)) === "drift") summary.drift++;
    } catch {
      // Google unavailable: try again next run.
    }
  }

  if (s.holdHours) {
    const cutoff = new Date(now.getTime() - s.holdHours * 3600000);
    const expired = await prisma.serviceRequest.findMany({
      where: { status: { in: [...OPEN] }, dateMode: "HELD", createdAt: { lt: cutoff } },
      include: { reservations: { where: { status: "held" } } },
    });
    for (const r of expired) {
      if (!r.reservations.length) continue;
      await prisma.$transaction(async (tx) => {
        await releaseReservations(tx, r.id);
        await tx.serviceRequest.update({
          where: { id: r.id },
          data: { dateMode: "PREFERRED", preferredDate: tzDate(r.reservations[0].startsAt), dateNote: "Mbajtja e datës përfundoi pa konfirmim." },
        });
        await tx.requestEvent.create({ data: { requestId: r.id, actor: "sistemi", action: "hold_expired", detail: { holdHours: s.holdHours } } });
      });
      await syncCalendar(r.id);
      summary.expired++;
    }
  }

  const storage = getStorage();
  const drafts = await prisma.requestMedia.findMany({ where: { requestId: null, createdAt: { lt: new Date(now.getTime() - 24 * 3600000) } } });
  for (const m of drafts) {
    if (storage) await (await storage).remove(m.storageKey).catch(() => {});
    await prisma.requestMedia.delete({ where: { id: m.id } });
    summary.draftsDeleted++;
  }

  const retention = Number(process.env.MEDIA_RETENTION_DAYS);
  if (retention > 0) {
    const old = await prisma.requestMedia.findMany({
      where: { request: { status: { in: ["DECLINED", "CANCELLED", "COMPLETED"] }, updatedAt: { lt: new Date(now.getTime() - retention * 86400000) } } },
    });
    for (const m of old) {
      if (storage) await (await storage).remove(m.storageKey).catch(() => {});
      await prisma.requestMedia.delete({ where: { id: m.id } });
      summary.mediaDeleted++;
    }
  }

  const stale = await prisma.serviceRequest.findMany({
    where: {
      OR: [
        { status: { in: [...OPEN] }, createdAt: { lt: new Date(now.getTime() - s.staleHoldAlertHours * 3600000) } },
        { calendarSync: { in: ["FAILED", "DRIFT"] } },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: 30,
  });
  summary.attention = stale.length;
  if (stale.length) {
    const lines = stale.map((r) => {
      const label = services[r.service as ServiceKey]?.label ?? r.service;
      const sync = r.calendarSync === "FAILED" || r.calendarSync === "DRIFT" ? ` · kalendari: ${r.calendarSyncError ?? r.calendarSync}` : "";
      return `${label}, ${r.status}${r.dateMode === "HELD" ? ", datë e mbajtur" : ""}, që nga ${tzDate(r.createdAt)}${sync}`;
    });
    summary.digest = await sendOwnerDigest(lines).catch(() => "failed");
  }
  return summary;
}
