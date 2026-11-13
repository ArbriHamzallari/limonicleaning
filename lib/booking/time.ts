// Wall-clock time in Europe/Tirane ↔ UTC instants, DST-safe, without a date library.
// Albania switches on the last Sunday of March (+01:00 → +02:00) and October (back).

export const TZ = "Europe/Tirane";

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  weekday: "short",
});

function parts(date: Date) {
  const p = Object.fromEntries(partsFormatter.formatToParts(date).map((x) => [x.type, x.value]));
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour),
    minute: Number(p.minute),
    second: Number(p.second),
    weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday),
  };
}

/** Offset of Tirana from UTC at this instant, in minutes (60 or 120). */
export function tzOffsetMinutes(date: Date): number {
  const p = parts(date);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
}

/** "2026-11-06" + "08:00" in Tirana → the UTC instant. */
export function zonedToUtc(ymd: string, hm: string): Date {
  const [y, mo, d] = ymd.split("-").map(Number);
  const [h, mi] = hm.split(":").map(Number);
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  let guess = wall - tzOffsetMinutes(new Date(wall)) * 60000;
  // Second pass fixes instants right after a DST switch.
  guess = wall - tzOffsetMinutes(new Date(guess)) * 60000;
  return new Date(guess);
}

/** The Tirana calendar date ("YYYY-MM-DD") of an instant. */
export function tzDate(date: Date): string {
  const p = parts(date);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/** 0 = Sunday … 6 = Saturday, in Tirana. */
export function tzWeekday(ymd: string): number {
  return parts(zonedToUtc(ymd, "12:00")).weekday;
}

export function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

// Albanian names are spelled out here rather than taken from Intl: Chromium (Chrome on Android
// included) ships without "sq" locale data and silently falls back to English, which also makes
// the server and client render different text.
export const monthsSq = [
  "janar", "shkurt", "mars", "prill", "maj", "qershor",
  "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor",
] as const;
/** Indexed by JavaScript weekday, 0 = Sunday. */
const weekdayLongSq = ["e diel", "e hënë", "e martë", "e mërkurë", "e enjte", "e premte", "e shtunë"] as const;

/** "e premte, 6 nëntor 2026" */
export function formatDateSq(dateOrYmd: Date | string): string {
  const d = typeof dateOrYmd === "string" ? zonedToUtc(dateOrYmd, "12:00") : dateOrYmd;
  const p = parts(d);
  return `${weekdayLongSq[p.weekday]}, ${p.day} ${monthsSq[p.month - 1]} ${p.year}`;
}

/** "08:00" */
export function formatTimeSq(date: Date): string {
  const p = parts(date);
  return `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
}

export function isValidYmd(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}
