import { describe, expect, it } from "vitest";
import { computeSlots, type ReservationLike } from "@/lib/booking/slots";
import { defaultBookingSettings, holdBlocker, type BookingSettings } from "@/lib/booking/settings";
import { zonedToUtc } from "@/lib/booking/time";

const s: BookingSettings = {
  ...defaultBookingSettings,
  liveHolds: true,
  startTimes: ["08:00", "13:00"],
  dayEndsAt: "18:00",
  bufferMinutes: 60,
  crews: 2,
  minLeadHours: 24,
  horizonDays: 14,
  services: { "me-themel": { durationMinutes: 240, crewsNeeded: 1 } },
};
const now = new Date("2026-11-05T10:00:00Z");

describe("availability", () => {
  it("holds stay off until every operating setting exists", () => {
    expect(holdBlocker("me-themel", defaultBookingSettings)).toBe("live holds are switched off");
    expect(holdBlocker("me-themel", s)).toBeNull();
    expect(holdBlocker("divane", s)).toBe("this service has no duration");
    expect(holdBlocker("me-themel", { ...s, crews: null })).toBe("crew capacity is not set");
  });

  it("respects lead time and the day's end", () => {
    const slots = computeSlots({ service: "me-themel", fromDate: "2026-11-05", days: 3, settings: s, now, reservations: [], busy: [] });
    expect(slots.filter((x) => x.date === "2026-11-05").every((x) => !x.available)).toBe(true);
    expect(slots.find((x) => x.date === "2026-11-07" && x.time === "08:00")?.available).toBe(true);
    const late = computeSlots({ service: "me-themel", fromDate: "2026-11-07", days: 1, settings: { ...s, dayEndsAt: "16:00" }, now, reservations: [], busy: [] });
    expect(late.map((x) => x.time)).toEqual(["08:00"]); // 13:00 + 4 h would end after 16:00
  });

  it("counts crews: two jobs fill the slot, a third can't", () => {
    const start = zonedToUtc("2026-11-07", "08:00");
    const end = new Date(start.getTime() + 5 * 3600000);
    const one: ReservationLike[] = [{ crew: 1, start, end }];
    const both: ReservationLike[] = [...one, { crew: 2, start, end }];
    const at = (res: ReservationLike[]) =>
      computeSlots({ service: "me-themel", fromDate: "2026-11-07", days: 1, settings: s, now, reservations: res, busy: [] }).find((x) => x.time === "08:00")!.available;
    expect(at(one)).toBe(true);
    expect(at(both)).toBe(false);
    expect(at([{ crew: null, start, end }, { crew: 1, start, end }])).toBe(false); // owner-placed job counts too
  });

  it("a busy appointment typed into Google blocks the slot (default: all crews)", () => {
    const busy = [{ start: zonedToUtc("2026-11-07", "14:00"), end: zonedToUtc("2026-11-07", "15:00") }];
    const slots = computeSlots({ service: "me-themel", fromDate: "2026-11-07", days: 1, settings: s, now, reservations: [], busy });
    expect(slots.find((x) => x.time === "13:00")!.available).toBe(false);
    expect(slots.find((x) => x.time === "08:00")!.available).toBe(true);
    const oneCrew = computeSlots({ service: "me-themel", fromDate: "2026-11-07", days: 1, settings: { ...s, manualBusyBlocks: "one" }, now, reservations: [], busy });
    expect(oneCrew.find((x) => x.time === "13:00")!.available).toBe(true);
  });

  it("the buffer is part of the reserved window", () => {
    const busy = [{ start: zonedToUtc("2026-11-07", "12:30"), end: zonedToUtc("2026-11-07", "12:45") }]; // inside 12:00–13:00 buffer
    const slots = computeSlots({ service: "me-themel", fromDate: "2026-11-07", days: 1, settings: s, now, reservations: [], busy });
    expect(slots.find((x) => x.time === "08:00")!.available).toBe(false);
  });

  it("slots on the DST switch day use the right UTC instant", () => {
    const slots = computeSlots({ service: "me-themel", fromDate: "2027-03-28", days: 1, settings: s, now, reservations: [], busy: [] });
    expect(slots[0].startsAt.toISOString()).toBe("2027-03-28T06:00:00.000Z");
  });
});
