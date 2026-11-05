import { describe, expect, it } from "vitest";
import { addDays, formatDateSq, formatTimeSq, tzDate, tzOffsetMinutes, tzWeekday, zonedToUtc } from "@/lib/booking/time";

describe("Europe/Tirane time handling", () => {
  it("uses +01:00 in winter and +02:00 in summer", () => {
    expect(tzOffsetMinutes(new Date("2026-01-15T12:00:00Z"))).toBe(60);
    expect(tzOffsetMinutes(new Date("2026-07-15T12:00:00Z"))).toBe(120);
  });

  it("converts 08:00 local correctly on both sides of the March and October switches", () => {
    expect(zonedToUtc("2026-03-28", "08:00").toISOString()).toBe("2026-03-28T07:00:00.000Z");
    expect(zonedToUtc("2026-03-29", "08:00").toISOString()).toBe("2026-03-29T06:00:00.000Z");
    expect(zonedToUtc("2026-10-24", "08:00").toISOString()).toBe("2026-10-24T06:00:00.000Z");
    expect(zonedToUtc("2026-10-25", "08:00").toISOString()).toBe("2026-10-25T07:00:00.000Z");
    expect(zonedToUtc("2027-03-28", "13:00").toISOString()).toBe("2027-03-28T11:00:00.000Z");
  });

  it("a 4-hour job across the October switch night still starts and ends at the right wall time", () => {
    const start = zonedToUtc("2026-10-25", "08:00");
    expect(formatTimeSq(start)).toBe("08:00");
    expect(formatTimeSq(new Date(start.getTime() + 4 * 3600000))).toBe("12:00");
  });

  it("dates and weekdays are Tirana's, not the server's", () => {
    expect(tzDate(new Date("2026-11-05T23:30:00Z"))).toBe("2026-11-06");
    expect(tzWeekday("2026-11-06")).toBe(5);
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(formatDateSq("2026-11-06")).toBe("e premte, 6 nëntor 2026");
  });
});
