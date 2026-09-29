// Public pricing model (see CLAUDE.md "Services & pricing"). Per-m² starting prices for
// residential/office/villa cleaning; Airbnb is quote-only via WhatsApp, never a fixed public
// price. These are the only figures that may appear in the UI — internal cost/margin/wholesale
// figures live in internal/pricing-reference.md and must never be imported or echoed here.

export const sqmRates = {
  apartament: 150,
  zyre: 175,
  vile: 200,
} as const;

export const laundryPricePerKg = 250;

export function formatPerSqm(rateAll: number): string {
  return `Nga ${rateAll.toLocaleString("sq-AL")} ALL/m²`;
}

export function formatPerKg(rateAll: number): string {
  return `${rateAll.toLocaleString("sq-AL")} ALL/kg`;
}

export const pricingDisclaimer =
  "Çmimi final përcaktohet në bazë të sipërfaqes, gjendjes së pronës dhe llojit të pastrimit.";

// Extras without a published per-unit price — quoted on request, alongside laundry.
export const extraServicesOnRequest = ["Hekurosje", "Pastrim dritaresh", "Shërbime të tjera sipas kërkesës"];
