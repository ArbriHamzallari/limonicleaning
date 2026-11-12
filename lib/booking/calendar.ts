// Pure calendar maths for the booking section's month grid. Dates are plain "YYYY-MM-DD"
// calendar days (already in Europe/Tirane, see lib/booking/time.ts), so a weekday or a month
// length never depends on the visitor's own time zone.
import { addDays, monthsSq } from "./time";

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-11-12" → "2026-11" */
export function monthOf(ymd: string): string {
  return ymd.slice(0, 7);
}

/** "2026-11" + 2 → "2027-01" */
export function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7);
}

export function daysInMonth(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** 0 = Monday … 6 = Sunday (Albanian calendars start on Monday). */
export function weekdayMonFirst(ymd: string): number {
  const [y, m, d] = ymd.split("-").map(Number);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}

/** The month as Monday-first weeks; days outside the month are null. */
export function monthGrid(ym: string): (string | null)[][] {
  const lead = weekdayMonFirst(`${ym}-01`);
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= daysInMonth(ym); d++) cells.push(`${ym}-${pad(d)}`);
  while (cells.length % 7) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export interface DayRule {
  /** First day that can be chosen (never today or earlier: the server sets it). */
  min: string;
  max: string;
  /** When set (live or demo times), only these days have free times. */
  open?: ReadonlySet<string>;
}

export function inRange(ymd: string, rule: DayRule): boolean {
  return ymd >= rule.min && ymd <= rule.max;
}

export function isSelectable(ymd: string, rule: DayRule): boolean {
  return inRange(ymd, rule) && (!rule.open || rule.open.has(ymd));
}

export function clampDay(ymd: string, rule: DayRule): string {
  return ymd < rule.min ? rule.min : ymd > rule.max ? rule.max : ymd;
}

function shiftMonth(ymd: string, n: number): string {
  const ym = addMonths(monthOf(ymd), n);
  const day = Math.min(Number(ymd.slice(8)), daysInMonth(ym));
  return `${ym}-${pad(day)}`;
}

/**
 * Keyboard movement in the grid (WAI-ARIA date picker pattern): arrows move a day or a week,
 * Home/End go to the start or end of the week, PageUp/PageDown move a month. The result stays
 * inside the allowed range; null means the key is not a grid key.
 */
export function moveDay(ymd: string, key: string, rule: DayRule): string | null {
  let next: string;
  switch (key) {
    case "ArrowLeft":
      next = addDays(ymd, -1);
      break;
    case "ArrowRight":
      next = addDays(ymd, 1);
      break;
    case "ArrowUp":
      next = addDays(ymd, -7);
      break;
    case "ArrowDown":
      next = addDays(ymd, 7);
      break;
    case "Home":
      next = addDays(ymd, -weekdayMonFirst(ymd));
      break;
    case "End":
      next = addDays(ymd, 6 - weekdayMonFirst(ymd));
      break;
    case "PageUp":
      next = shiftMonth(ymd, -1);
      break;
    case "PageDown":
      next = shiftMonth(ymd, 1);
      break;
    default:
      return null;
  }
  return clampDay(next, rule);
}

/** "2026-11" → "nëntor 2026" */
export function monthLabelSq(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${monthsSq[m - 1]} ${y}`;
}

export const weekdaysSq = [
  { short: "Hën", long: "e hënë" },
  { short: "Mar", long: "e martë" },
  { short: "Mër", long: "e mërkurë" },
  { short: "Enj", long: "e enjte" },
  { short: "Pre", long: "e premte" },
  { short: "Sht", long: "e shtunë" },
  { short: "Die", long: "e diel" },
] as const;
