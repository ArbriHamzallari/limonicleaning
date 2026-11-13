import { addDays, isValidYmd } from "./time";

// A preferred time of day, sent with a preferred date while live holds are off. It is a
// preference for the owner to plan around, never a reserved time.
/** How far ahead a preferred date may be: the availability endpoint offers today+1 to today+90. */
export const PREFERRED_MAX_DAYS = 90;

export const preferredTimes = [
  { value: "paradite", label: "Paradite" },
  { value: "pasdite", label: "Pasdite" },
  { value: "nuk-ka-rendesi", label: "Nuk ka rëndësi" },
] as const;

export type PreferredTime = (typeof preferredTimes)[number]["value"];

export const preferredTimeValues = preferredTimes.map((t) => t.value) as [PreferredTime, ...PreferredTime[]];

export function preferredTimeLabel(value: string | null | undefined): string | undefined {
  return preferredTimes.find((t) => t.value === value)?.label;
}

/** A demo time chip (development only) is sent as a time of day, never as a slot. */
export function preferredTimeForClock(hm: string): PreferredTime {
  return hm < "12:00" ? "paradite" : "pasdite";
}

/**
 * A preferred date the server accepts: a real calendar day from tomorrow (Tirana) up to
 * PREFERRED_MAX_DAYS ahead. `today` is tzDate(now), so a form left open past midnight sends a
 * date that is now "today" and gets a clear error instead of being dropped.
 */
export function isPreferredDateInRange(ymd: string, today: string): boolean {
  return isValidYmd(ymd) && ymd > today && ymd <= addDays(today, PREFERRED_MAX_DAYS);
}

export type DatePick = { kind: "none" } | { kind: "day"; date: string; time?: string } | { kind: "later" };

/**
 * The date fields a booking request sends. Only a live time becomes a slot; a preferred or demo
 * pick is a date plus a time of day, which the server never holds.
 */
export function dateFieldsFor(mode: "live" | "preferred" | "demo" | undefined, pick: DatePick) {
  if (pick.kind !== "day") return { slot: undefined, preferredDate: undefined, preferredTime: undefined };
  if (mode === "live" && pick.time) return { slot: { date: pick.date, time: pick.time }, preferredDate: undefined, preferredTime: undefined };
  const preferredTime: PreferredTime | undefined = pick.time
    ? mode === "demo"
      ? preferredTimeForClock(pick.time)
      : (pick.time as PreferredTime)
    : undefined;
  return { slot: undefined, preferredDate: pick.date, preferredTime };
}
