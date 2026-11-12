import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { formatDateSq, formatTimeSq, zonedToUtc } from "@/lib/booking/time";
import { monthLabelSq } from "@/lib/booking/calendar";

// Chromium ships without "sq" locale data, so Intl.DateTimeFormat("sq-AL") prints English in
// Chrome while Node prints Albanian. The names must not come from Intl at all.
describe("Albanian date names without locale data", () => {
  it("does not ask Intl for Albanian names in client-side booking code", () => {
    for (const file of ["lib/booking/time.ts", "lib/booking/calendar.ts", "components/booking/BookingSection.tsx", "components/booking/BookingWizard.tsx"]) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/(DateTimeFormat|toLocale\w*String)\(\s*["'`]sq/);
    }
  });

  it("names every month", () => {
    const months = Array.from({ length: 12 }, (_, i) => monthLabelSq(`2027-${String(i + 1).padStart(2, "0")}`));
    expect(months).toEqual([
      "janar 2027", "shkurt 2027", "mars 2027", "prill 2027", "maj 2027", "qershor 2027",
      "korrik 2027", "gusht 2027", "shtator 2027", "tetor 2027", "nëntor 2027", "dhjetor 2027",
    ]);
  });

  it("names every weekday, Sunday included", () => {
    // 2026-11-09 is a Monday.
    const days = Array.from({ length: 7 }, (_, i) => formatDateSq(`2026-11-${String(9 + i).padStart(2, "0")}`));
    expect(days).toEqual([
      "e hënë, 9 nëntor 2026", "e martë, 10 nëntor 2026", "e mërkurë, 11 nëntor 2026", "e enjte, 12 nëntor 2026",
      "e premte, 13 nëntor 2026", "e shtunë, 14 nëntor 2026", "e diel, 15 nëntor 2026",
    ]);
  });

  it("uses Tirana's date and time for an instant", () => {
    const late = new Date("2026-12-31T23:30:00Z"); // 00:30 on 1 January in Tirana
    expect(formatDateSq(late)).toBe("e premte, 1 janar 2027");
    expect(formatTimeSq(late)).toBe("00:30");
    expect(formatTimeSq(zonedToUtc("2026-07-01", "08:05"))).toBe("08:05");
  });
});
