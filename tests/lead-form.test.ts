import { describe, expect, it } from "vitest";
import { formFieldsFor, isValidPreferredDate, parseSize } from "@/lib/lead-form";
import { formPreset, isPageKey } from "@/lib/service-index";

describe("service preselection", () => {
  it("each service page preselects its own service", () => {
    expect(formPreset("me-themel")).toEqual({ service: "me-themel" });
    expect(formPreset("divane")).toEqual({ service: "divane" });
    expect(formPreset("apartamente")).toEqual({ service: "apartamente", propertyType: "apartament" });
    expect(formPreset("biznese")).toEqual({ propertyType: "zyre" });
    expect(formPreset(undefined)).toEqual({});
  });

  it("only known keys from ?sherbimi= are accepted", () => {
    expect(isPageKey("me-themel")).toBe(true);
    expect(isPageKey("biznese")).toBe(true);
    expect(isPageKey("<script>")).toBe(false);
    expect(isPageKey(null)).toBe(false);
  });
});

describe("progressive disclosure", () => {
  it("deep cleaning asks apartment/house/villa, condition and area, not frequency", () => {
    const f = formFieldsFor("me-themel");
    expect(f).toMatchObject({ size: true, condition: true, frequency: false, propertyType: true, business: false });
    expect(f.propertyOptions?.map((o) => o.value)).toEqual(["apartament", "shtepi", "vile"]);
    expect(f.priorities?.options.map((o) => o.value)).toContain("divani-dysheket");
  });

  it("upholstery asks for items, not square metres", () => {
    const f = formFieldsFor("divane");
    expect(f.size).toBe(false);
    expect(f.condition).toBe(false);
    expect(f.priorities?.options.map((o) => o.value)).toEqual(["divan", "kolltuqe", "karrige", "dyshek"]);
  });

  it("business services show the business name and frequency, never home questions", () => {
    for (const s of ["zyra", "ambiente", "hotele"] as const) {
      const f = formFieldsFor(s);
      expect(f.business).toBe(true);
      expect(f.frequency).toBe(true);
      expect(f.condition).toBe(false);
    }
  });

  it("no service yet: show the property type to orient the visitor", () => {
    expect(formFieldsFor("").propertyType).toBe(true);
  });
});

describe("parsing", () => {
  it("accepts 80, 80 m2 and 80m²", () => {
    expect(parseSize("80")).toBe(80);
    expect(parseSize(" 80 m2 ")).toBe(80);
    expect(parseSize("80m²")).toBe(80);
    expect(parseSize("")).toBeUndefined();
    expect(parseSize("tetëdhjetë")).toBeNull();
    expect(parseSize("80.5")).toBeNull();
  });

  it("a preferred date is a real day from today to a year ahead", () => {
    const today = new Date(2026, 10, 4);
    expect(isValidPreferredDate("2026-11-04", today)).toBe(true);
    expect(isValidPreferredDate("2026-12-20", today)).toBe(true);
    expect(isValidPreferredDate("2026-11-03", today)).toBe(false);
    expect(isValidPreferredDate("2026-02-30", today)).toBe(false);
    expect(isValidPreferredDate("2028-01-01", today)).toBe(false);
    expect(isValidPreferredDate("04.11.2026", today)).toBe(false);
  });
});
