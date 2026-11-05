// Availability (pure): which start times can take a job of a service, given working settings,
// existing reservations (website holds and bookings) and busy times typed into Google Calendar.
// The database exclusion constraint is the final guard; this only decides what to offer.
import { addDays, tzWeekday, zonedToUtc } from "./time";
import type { BookingSettings } from "./settings";
import type { ServiceKey } from "./catalog";

export interface Interval {
  start: Date;
  end: Date;
}
export interface ReservationLike extends Interval {
  /** null = an owner-placed booking outside crew tracking: counted as one busy crew. */
  crew: number | null;
}
export interface Slot {
  date: string;
  time: string;
  startsAt: Date;
  jobEndsAt: Date;
  holdEndsAt: Date;
  available: boolean;
}

const overlaps = (a: Interval, b: Interval) => a.start < b.end && b.start < a.end;

export function slotWindow(service: ServiceKey, date: string, time: string, s: BookingSettings) {
  const cap = s.services[service];
  if (!cap?.durationMinutes || s.bufferMinutes == null) return null;
  const startsAt = zonedToUtc(date, time);
  const jobEndsAt = new Date(startsAt.getTime() + cap.durationMinutes * 60000);
  const holdEndsAt = new Date(jobEndsAt.getTime() + s.bufferMinutes * 60000);
  return { startsAt, jobEndsAt, holdEndsAt, crewsNeeded: cap.crewsNeeded };
}

export function computeSlots(input: {
  service: ServiceKey;
  fromDate: string;
  days: number;
  settings: BookingSettings;
  now: Date;
  reservations: ReservationLike[];
  busy: Interval[];
}): Slot[] {
  const { service, settings: s, now } = input;
  const out: Slot[] = [];
  if (!s.startTimes?.length || !s.dayEndsAt || !s.crews) return out;
  const earliest = new Date(now.getTime() + s.minLeadHours * 3600000);
  for (let i = 0; i < input.days; i++) {
    const date = addDays(input.fromDate, i);
    if (!s.workingDays.includes(tzWeekday(date))) continue;
    const dayEnd = zonedToUtc(date, s.dayEndsAt);
    for (const time of s.startTimes) {
      const w = slotWindow(service, date, time, s);
      if (!w) return out;
      if (w.jobEndsAt > dayEnd) continue;
      const window = { start: w.startsAt, end: w.holdEndsAt };
      const hits = input.reservations.filter((r) => overlaps(r, window));
      let free = s.crews - new Set(hits.filter((r) => r.crew != null).map((r) => r.crew)).size - hits.filter((r) => r.crew == null).length;
      const busyHits = input.busy.filter((b) => overlaps(b, window)).length;
      if (busyHits) free = s.manualBusyBlocks === "all" ? 0 : free - busyHits;
      out.push({
        date,
        time,
        startsAt: w.startsAt,
        jobEndsAt: w.jobEndsAt,
        holdEndsAt: w.holdEndsAt,
        available: w.startsAt >= earliest && free >= w.crewsNeeded,
      });
    }
  }
  return out;
}
