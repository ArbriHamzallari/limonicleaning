import { NextResponse } from "next/server";
import { allowRequest, clientIp } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { isServiceKey } from "@/lib/booking/catalog";
import { getBookingSettings, holdBlocker } from "@/lib/booking/settings";
import { computeSlots } from "@/lib/booking/slots";
import { isCalendarConfigured, listManualBusy } from "@/lib/booking/google-calendar";
import { PREFERRED_MAX_DAYS } from "@/lib/booking/preferred-time";
import { addDays, formatDateSq, tzDate, zonedToUtc } from "@/lib/booking/time";

// Live availability when holds are configured for the service; otherwise (or if Google is
// unavailable) a preferred-date range, clearly NOT a hold.
export async function GET(request: Request) {
  const service = new URL(request.url).searchParams.get("sherbimi");
  if (!isServiceKey(service)) return NextResponse.json({ error: "sherbimi" }, { status: 400 });
  const now = new Date();
  const today = tzDate(now);
  const preferred = (reason: string) =>
    NextResponse.json(
      { mode: "preferred", reason, minDate: addDays(today, 1), maxDate: addDays(today, PREFERRED_MAX_DAYS) },
      { headers: { "Cache-Control": "no-store" } },
    );

  const s = getBookingSettings();
  if (holdBlocker(service, s)) return preferred("not-configured");
  if (!isCalendarConfigured()) return preferred("calendar-off");

  // Only the live path reads Google Calendar and the database, so only it is limited per visitor;
  // the preferred-date answers above are static and must not fail for visitors behind a shared IP.
  if (!allowRequest(`disponueshmeria:${clientIp(request)}`, Date.now(), 30)) return NextResponse.json({ error: "shume" }, { status: 429 });

  const rangeStart = zonedToUtc(today, "00:00");
  const rangeEnd = zonedToUtc(addDays(today, s.horizonDays + 1), "00:00");
  let busy;
  try {
    busy = await listManualBusy(rangeStart, rangeEnd);
  } catch {
    return preferred("calendar-unavailable");
  }
  const reservations = await prisma.slotReservation.findMany({
    where: { status: { not: "released" }, startsAt: { lt: rangeEnd }, endsAt: { gt: rangeStart } },
    select: { crew: true, startsAt: true, endsAt: true },
  });
  const slots = computeSlots({
    service,
    fromDate: today,
    days: s.horizonDays + 1,
    settings: s,
    now,
    reservations: reservations.map((r) => ({ crew: r.crew, start: r.startsAt, end: r.endsAt })),
    busy,
  }).filter((x) => x.available);

  const days = new Map<string, { date: string; label: string; times: string[] }>();
  for (const x of slots) {
    if (!days.has(x.date)) days.set(x.date, { date: x.date, label: formatDateSq(x.date), times: [] });
    days.get(x.date)!.times.push(x.time);
  }
  return NextResponse.json({ mode: "live", days: [...days.values()] }, { headers: { "Cache-Control": "no-store" } });
}
