import { describe, expect, it } from "vitest";
import { AFTER_ASSESSMENT, checklistFor, estimateFor, serviceKeys, services, validateAnswers } from "@/lib/booking/catalog";

const ctx = { outsideTirana: false, priorities: [] };

describe("service questions", () => {
  it("every service has its own questions and a media hint", () => {
    for (const k of serviceKeys) {
      expect(services[k].questions.length).toBeGreaterThan(0);
      expect(services[k].mediaHint.length).toBeGreaterThan(10);
    }
    expect(services.divane.questions.map((q) => q.id)).toContain("mattressDouble");
    expect(services.zyra.questions.map((q) => q.id)).toEqual(expect.arrayContaining(["premises", "access", "frequency"]));
    expect(services["me-themel"].questions.map((q) => q.id)).toEqual(
      expect.arrayContaining(["areaM2", "occupancy", "bathrooms", "condition", "sofas", "mattresses"]),
    );
  });

  it("condition wording is neutral", () => {
    const words = JSON.stringify(services).toLowerCase();
    // Whole words only ("pis" must not match "shtëpisë").
    for (const bad of ["pis", "pisët", "e ndotur", "katastrofë", "e tmerrshme", "rrëmujë"])
      expect(words).not.toMatch(new RegExp(`(^|[^a-zë])${bad}([^a-zë]|$)`));
  });

  it("server validation drops unknown keys, clamps counts and requires required choices", () => {
    const { answers, errors } = validateAnswers("me-themel", { areaM2: "80", sofas: 99, hack: "x", bathrooms: "2" });
    expect(answers).toEqual({ areaM2: 80, sofas: 8, bathrooms: 2 });
    expect(errors.propertyType).toBeDefined();
    expect(validateAnswers("divane", { material: "plastike" }).answers).toEqual({});
  });
});

describe("pricing rules", () => {
  it("apartment deep cleaning: 250 lekë të reja per m², indicative, with assumptions", () => {
    const e = estimateFor("me-themel", { propertyType: "apartament", areaM2: 80, condition: "pa-pastrim-te-thelle" }, ctx);
    expect(e).toMatchObject({ kind: "indicative", amountLek: 20000, amountText: "20.000 lekë të reja", basis: "80 m² × 250 lekë të reja" });
    expect(e.assumptions.join(" ")).toMatch(/paraprak/);
  });

  it("houses, villas and post-construction work are reviewed, never priced automatically", () => {
    expect(estimateFor("me-themel", { propertyType: "shtepi", areaM2: 80 }, ctx).kind).toBe("after-assessment");
    expect(estimateFor("me-themel", { propertyType: "apartament", areaM2: 80, condition: "pas-punimeve" }, ctx).kind).toBe("after-assessment");
    expect(estimateFor("pas-ndertimit", { propertyType: "apartament", areaM2: 80 }, ctx).kind).toBe("after-assessment");
  });

  it("services without a confirmed rule say 'Çmimi përcaktohet pas vlerësimit', never zero", () => {
    for (const k of serviceKeys.filter((k) => k !== "me-themel")) {
      const e = estimateFor(k, { areaM2: 80, units: 3 }, ctx);
      expect(e.kind).toBe("after-assessment");
      if (e.kind === "after-assessment") expect(e.reason).toContain(AFTER_ASSESSMENT);
      expect(JSON.stringify(e)).not.toMatch(/\b0 lek/);
    }
  });

  it("outside Tirana adds the transport assumption", () => {
    const e = estimateFor("me-themel", { propertyType: "apartament", areaM2: 80 }, { outsideTirana: true });
    expect(e.assumptions.join(" ")).toMatch(/transportit/);
  });
});

describe("checklists come from templates and answers only", () => {
  it("apartment deep clean includes the counted sofas and mattresses; materials go to clarify", () => {
    const c = checklistFor("me-themel", { propertyType: "apartament", sofas: 1, mattresses: 3, bathrooms: 2, extras: ["furra-frigo"] }, ctx);
    expect(c.included).toEqual(expect.arrayContaining(["Larja e divaneve me makineri ekstraktimi: 1 divan ose kënd", "Larja e dyshekëve: 3 dyshekë", "Furra dhe frigoriferi nga brenda"]));
    expect(c.included.some((l) => l.includes("2 banjo"))).toBe(true);
    expect(c.clarify.join(" ")).toMatch(/Materiali/);
    expect(c.excluded).toContain("Larja dhe hekurosja e rrobave");
  });

  it("no upholstery promise for a house deep clean (clarify instead)", () => {
    const c = checklistFor("me-themel", { propertyType: "shtepi", sofas: 2 }, ctx);
    expect(c.included.join(" ")).not.toMatch(/dyshek|divan/);
    expect(c.clarify.join(" ")).toMatch(/divaneve/);
  });

  it("upholstery lists the items asked about; leather and stains need clarification", () => {
    const c = checklistFor("divane", { sofas: 2, mattressDouble: 1, material: "lekure", stains: "po" }, ctx);
    expect(c.included.join(" ")).toContain("2 divane, 1 dyshek dopio");
    expect(c.clarify.join(" ")).toMatch(/Materiali/);
    expect(c.excluded).toContain("Garanci që çdo njollë do të hiqet");
  });

  it("common areas never include building lifts; priorities are carried through", () => {
    const c = checklistFor("ambiente", { floors: 5 }, { outsideTirana: true, priorities: ["Hyrja kryesore"] });
    expect(c.excluded).toContain("Ashensorët e pallatit");
    expect(c.priorities).toEqual(["Hyrja kryesore"]);
    expect(c.clarify).toContain("Transporti për zonat jashtë Tiranës");
  });
});
