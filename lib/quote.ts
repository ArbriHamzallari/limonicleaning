// Indicative price for ONE case only: deep cleaning ("pastrim me themel") of an APARTMENT,
// occupied or empty, at the founder's published reference of 250 lekë të reja per m²
// (Arbri, 4 Nov 2026; restricted to apartments 5 Nov 2026). Houses, villas and every other
// service are priced after assessment and get no number here. No other rate lives in this
// public repo.
//
// The result is never a total: condition, post-construction residues, upholstery quantities
// and travel outside Tirana are confirmed in the written offer.

export const DEEP_CLEAN_RATE_LEK = 250;

/** Example used on the site and in the founder script: 80 m² × 250 = 20.000. */
export const DEEP_CLEAN_EXAMPLE_M2 = 80;

/** Areas outside this range get no automatic number: they need a conversation. */
export const ESTIMATE_MIN_M2 = 20;
export const ESTIMATE_MAX_M2 = 400;

export type PropertyCondition = "banohet" | "bosh" | "pas-punimeve";

export type Estimate =
  | { kind: "indicative"; sizeM2: number; rateLek: number; totalLek: number }
  /** Post-construction work, a house/villa, or another service: assessed, no number. */
  | { kind: "assessment"; reason: "pas-punimeve" | "property" | "service" }
  /** The property type isn't chosen yet: the rate only applies to apartments. */
  | { kind: "needs-type" }
  /** Area missing, unknown or outside the range we price automatically. */
  | { kind: "needs-size"; reason: "missing" | "unknown" | "out-of-range" };

/** "20.000": Albanian grouping with a dot, as written in the founder script. */
export function formatLek(amount: number): string {
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function deepCleanEstimate(input: {
  service: string | undefined;
  sizeM2: number | null | undefined;
  sizeUnknown?: boolean;
  condition?: string | null;
  propertyType?: string | null;
}): Estimate {
  if (input.service !== "me-themel") return { kind: "assessment", reason: "service" };
  if (input.condition === "pas-punimeve") return { kind: "assessment", reason: "pas-punimeve" };
  if (!input.propertyType) return { kind: "needs-type" };
  if (input.propertyType !== "apartament") return { kind: "assessment", reason: "property" };
  if (input.sizeUnknown) return { kind: "needs-size", reason: "unknown" };
  const size = input.sizeM2;
  if (size == null || !Number.isFinite(size) || size <= 0) return { kind: "needs-size", reason: "missing" };
  if (size < ESTIMATE_MIN_M2 || size > ESTIMATE_MAX_M2) return { kind: "needs-size", reason: "out-of-range" };
  return { kind: "indicative", sizeM2: size, rateLek: DEEP_CLEAN_RATE_LEK, totalLek: size * DEEP_CLEAN_RATE_LEK };
}

/** The one sentence the site uses to explain the example. */
export const deepCleanExampleLine = `${DEEP_CLEAN_EXAMPLE_M2} m² × ${DEEP_CLEAN_RATE_LEK} = ${formatLek(
  DEEP_CLEAN_EXAMPLE_M2 * DEEP_CLEAN_RATE_LEK,
)} lekë të reja`;
