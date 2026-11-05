import { describe, expect, it } from "vitest";
import { deepCleanEstimate, deepCleanExampleLine, formatLek, DEEP_CLEAN_RATE_LEK } from "@/lib/quote";

describe("deep-clean indicative estimate", () => {
  it("uses 250 lekë të reja per m² (80 m² = 20.000)", () => {
    expect(DEEP_CLEAN_RATE_LEK).toBe(250);
    expect(deepCleanEstimate({ service: "me-themel", sizeM2: 80, propertyType: "apartament" })).toEqual({
      kind: "indicative",
      sizeM2: 80,
      rateLek: 250,
      totalLek: 20000,
    });
    expect(deepCleanExampleLine).toBe("80 m² × 250 = 20.000 lekë të reja");
  });

  it.each([
    [94, 23500],
    [100, 25000],
    [20, 5000],
    [400, 100000],
  ])("%i m² → %i", (size, total) => {
    const e = deepCleanEstimate({ service: "me-themel", sizeM2: size, condition: "banohet", propertyType: "apartament" });
    expect(e.kind === "indicative" && e.totalLek).toBe(total);
  });

  it("applies the m² reference to apartments only, never to houses or villas", () => {
    expect(deepCleanEstimate({ service: "me-themel", sizeM2: 80, propertyType: "shtepi" })).toEqual({
      kind: "assessment",
      reason: "property",
    });
    expect(deepCleanEstimate({ service: "me-themel", sizeM2: 80, propertyType: "vile" }).kind).toBe("assessment");
    expect(deepCleanEstimate({ service: "me-themel", sizeM2: 80, propertyType: "zyre" }).kind).toBe("assessment");
    expect(deepCleanEstimate({ service: "me-themel", sizeM2: 80 })).toEqual({ kind: "needs-type" });
  });

  it("never prices post-construction work automatically", () => {
    expect(deepCleanEstimate({ service: "me-themel", sizeM2: 80, condition: "pas-punimeve" })).toEqual({
      kind: "assessment",
      reason: "pas-punimeve",
    });
    expect(deepCleanEstimate({ service: "pas-ndertimit", sizeM2: 80 }).kind).toBe("assessment");
  });

  it("never applies the m² rate to other services", () => {
    for (const service of ["apartamente", "vila", "zyra", "hotele", "divane", "airbnb", "ambiente", "tjeter", undefined]) {
      expect(deepCleanEstimate({ service, sizeM2: 80 }).kind).toBe("assessment");
    }
  });

  it("asks for a conversation when the size is missing, unknown or unusual", () => {
    const apt = { service: "me-themel", propertyType: "apartament" };
    expect(deepCleanEstimate({ ...apt, sizeM2: undefined })).toEqual({ kind: "needs-size", reason: "missing" });
    expect(deepCleanEstimate({ ...apt, sizeM2: 80, sizeUnknown: true })).toEqual({
      kind: "needs-size",
      reason: "unknown",
    });
    expect(deepCleanEstimate({ ...apt, sizeM2: 5 }).kind).toBe("needs-size");
    expect(deepCleanEstimate({ ...apt, sizeM2: 2000 }).kind).toBe("needs-size");
    expect(deepCleanEstimate({ ...apt, sizeM2: 0 }).kind).toBe("needs-size");
  });

  it("formats amounts with Albanian dot grouping", () => {
    expect(formatLek(20000)).toBe("20.000");
    expect(formatLek(250)).toBe("250");
    expect(formatLek(1234567)).toBe("1.234.567");
  });
});
