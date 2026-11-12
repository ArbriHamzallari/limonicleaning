import { describe, expect, it } from "vitest";
import { addMonths, daysInMonth, isSelectable, monthGrid, monthLabelSq, moveDay, weekdayMonFirst, type DayRule } from "@/lib/booking/calendar";
import { dateFieldsFor, isPreferredDateInRange, preferredTimeForClock } from "@/lib/booking/preferred-time";
import { addDays, tzDate } from "@/lib/booking/time";
import { optionalEmail } from "@/lib/booking/contact-fields";
import { demoAvailability } from "@/lib/booking/availability-client";
import { newId } from "@/lib/booking/client-id";
import { isPrivatePath } from "@/lib/analytics";

describe("calendar grid", () => {
  it("starts weeks on Monday", () => {
    expect(weekdayMonFirst("2026-11-02")).toBe(0); // Monday
    expect(weekdayMonFirst("2026-11-01")).toBe(6); // Sunday
  });

  it("lays out November 2026 with six leading blanks", () => {
    const grid = monthGrid("2026-11");
    expect(grid[0].slice(0, 6)).toEqual([null, null, null, null, null, null]);
    expect(grid[0][6]).toBe("2026-11-01");
    expect(grid.every((w) => w.length === 7)).toBe(true);
    expect(grid.flat().filter(Boolean)).toHaveLength(30);
  });

  it("handles month and year boundaries", () => {
    expect(addMonths("2026-12", 1)).toBe("2027-01");
    expect(addMonths("2027-01", -1)).toBe("2026-12");
    expect(daysInMonth("2028-02")).toBe(29);
    expect(daysInMonth("2027-02")).toBe(28);
  });

  it("labels the month in Albanian", () => {
    expect(monthLabelSq("2026-11")).toBe("nëntor 2026");
  });
});

describe("calendar keyboard movement", () => {
  const rule: DayRule = { min: "2026-11-13", max: "2027-02-10" };

  it("moves by day and week", () => {
    expect(moveDay("2026-11-20", "ArrowRight", rule)).toBe("2026-11-21");
    expect(moveDay("2026-11-20", "ArrowDown", rule)).toBe("2026-11-27");
    expect(moveDay("2026-11-20", "ArrowUp", rule)).toBe("2026-11-13");
  });

  it("never leaves the allowed range", () => {
    expect(moveDay("2026-11-14", "ArrowUp", rule)).toBe("2026-11-13");
    expect(moveDay("2026-11-13", "ArrowLeft", rule)).toBe("2026-11-13");
    expect(moveDay("2027-02-09", "ArrowDown", rule)).toBe("2027-02-10");
  });

  it("goes to the ends of the week", () => {
    expect(moveDay("2026-11-19", "Home", rule)).toBe("2026-11-16");
    expect(moveDay("2026-11-19", "End", rule)).toBe("2026-11-22");
  });

  it("clamps PageDown to the shorter month", () => {
    const wide: DayRule = { min: "2027-01-01", max: "2027-12-31" };
    expect(moveDay("2027-01-31", "PageDown", wide)).toBe("2027-02-28");
    expect(moveDay("2027-03-31", "PageUp", wide)).toBe("2027-02-28");
  });

  it("ignores keys that are not grid keys", () => {
    expect(moveDay("2026-11-20", "Enter", rule)).toBeNull();
  });

  it("marks days without free times as not selectable", () => {
    const live: DayRule = { ...rule, open: new Set(["2026-11-20"]) };
    expect(isSelectable("2026-11-20", live)).toBe(true);
    expect(isSelectable("2026-11-21", live)).toBe(false);
    expect(isSelectable("2026-11-12", rule)).toBe(false);
  });
});

describe("preferred date range", () => {
  const today = "2026-11-12";

  it("rejects today and accepts tomorrow up to 90 days ahead", () => {
    expect(isPreferredDateInRange(today, today)).toBe(false);
    expect(isPreferredDateInRange("2026-11-13", today)).toBe(true);
    expect(isPreferredDateInRange(addDays(today, 90), today)).toBe(true);
    expect(isPreferredDateInRange(addDays(today, 91), today)).toBe(false);
    expect(isPreferredDateInRange("2026-02-30", today)).toBe(false);
  });

  it("uses the Tirana day, not UTC, near midnight", () => {
    expect(tzDate(new Date("2026-11-12T23:30:00Z"))).toBe("2026-11-13");
  });

  it("sends demo clock times as a time of day", () => {
    expect(preferredTimeForClock("09:00")).toBe("paradite");
    expect(preferredTimeForClock("13:00")).toBe("pasdite");
  });
});

describe("optional email", () => {
  it("treats blank as absent and rejects malformed addresses", () => {
    expect(optionalEmail.parse("")).toBeUndefined();
    expect(optionalEmail.parse("   ")).toBeUndefined();
    expect(optionalEmail.parse(undefined)).toBeUndefined();
    expect(optionalEmail.parse(" emri@shembull.al ")).toBe("emri@shembull.al");
    expect(optionalEmail.safeParse("jo-email").success).toBe(false);
    expect(optionalEmail.safeParse(`${"a".repeat(116)}@b.al`).success).toBe(false);
  });
});

describe("demo availability", () => {
  const demo = demoAvailability("2026-11-12");

  it("is labelled demo and starts tomorrow", () => {
    expect(demo.mode).toBe("demo");
    if (demo.mode !== "demo") return;
    expect(demo.minDate).toBe("2026-11-13");
    expect(demo.days[0].date).toBe("2026-11-13");
  });

  it("leaves some days full so the unavailable state shows", () => {
    if (demo.mode !== "demo") return;
    const dates = new Set(demo.days.map((d) => d.date));
    expect(dates.has(addDays("2026-11-12", 5))).toBe(false);
    expect(demo.days.every((d) => d.times.length > 0)).toBe(true);
  });
});

describe("private paths and request ids", () => {
  it("treats the owner panel, status links and job sheets as private", () => {
    expect(isPrivatePath("/admin")).toBe(true);
    expect(isPrivatePath("/kerkesa/abc")).toBe(true);
    expect(isPrivatePath("/flete-pune/xyz")).toBe(true);
    expect(isPrivatePath("/kerko-oferte")).toBe(false);
    expect(isPrivatePath("/adminx")).toBe(false);
  });

  it("mints distinct ids", () => {
    const a = newId();
    expect(a.length).toBeGreaterThanOrEqual(32);
    expect(newId()).not.toBe(a);
  });
});

describe("submit date mapping", () => {
  it("sends only a live time as a slot", () => {
    expect(dateFieldsFor("live", { kind: "day", date: "2026-11-20", time: "09:00" }).slot).toEqual({ date: "2026-11-20", time: "09:00" });
  });
  it("sends demo and preferred picks as a date plus time of day, never a slot", () => {
    expect(dateFieldsFor("demo", { kind: "day", date: "2026-11-20", time: "13:00" })).toEqual({ slot: undefined, preferredDate: "2026-11-20", preferredTime: "pasdite" });
    expect(dateFieldsFor("preferred", { kind: "day", date: "2026-11-20", time: "paradite" })).toEqual({ slot: undefined, preferredDate: "2026-11-20", preferredTime: "paradite" });
  });
  it("sends nothing when the date is left for the call", () => {
    expect(dateFieldsFor("live", { kind: "later" })).toEqual({ slot: undefined, preferredDate: undefined, preferredTime: undefined });
  });
});
