// The small, client-safe part of the service catalogue: slugs, routes and short labels.
// Header, sticky bar and LeadForm import this; the full page copy lives in lib/services.ts
// so it never ends up in the client bundle.

export const serviceSlugs = [
  "apartamente",
  "me-themel",
  "vila",
  "pas-ndertimit",
  "divane",
  "airbnb",
  "zyra",
  "ambiente",
  "hotele",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

/** Values accepted by the lead form and stored in Lead.service. */
export const leadServiceValues = [...serviceSlugs, "tjeter"] as const;
export type LeadService = (typeof leadServiceValues)[number];

/** The service chips on the form, in this order (copy review FORM-04). Vila is a property
 *  type there, not a cleaning type, so it has no chip. */
export const leadServiceChips: LeadService[] = [
  "apartamente",
  "me-themel",
  "pas-ndertimit",
  "divane",
  "ambiente",
  "zyra",
  "airbnb",
  "hotele",
  "tjeter",
];

interface ServiceIndexEntry {
  path: string;
  /** Used in nav, cards, footer and breadcrumbs. */
  navLabel: string;
  /** Label for the lead form chips. */
  chipLabel: string;
}

export const serviceIndex: Record<ServiceSlug, ServiceIndexEntry> = {
  apartamente: {
    path: "/pastrim-apartamentesh-tirane",
    navLabel: "Apartamente dhe shtëpi",
    chipLabel: "Pastrim gjeneral",
  },
  "me-themel": {
    path: "/pastrim-me-themel-tirane",
    navLabel: "Pastrim me themel",
    chipLabel: "Pastrim me themel",
  },
  vila: { path: "/pastrim-vilash-tirane", navLabel: "Vila", chipLabel: "Vilë" },
  "pas-ndertimit": {
    path: "/pastrim-pas-ndertimit-tirane",
    navLabel: "Pas ndërtimit ose rinovimit",
    chipLabel: "Pas ndërtimit ose rinovimit",
  },
  divane: {
    path: "/larje-divanesh-dyshekesh-tirane",
    navLabel: "Larje divanesh dhe dyshekësh",
    chipLabel: "Larje divanesh dhe dyshekësh",
  },
  airbnb: { path: "/pastrim-airbnb-tirane", navLabel: "Airbnb", chipLabel: "Airbnb" },
  zyra: { path: "/pastrim-zyrash-tirane", navLabel: "Zyra", chipLabel: "Zyrë ose biznes" },
  ambiente: {
    path: "/pastrim-ambientesh-te-perbashketa-tirane",
    navLabel: "Ambientet e përbashkëta",
    chipLabel: "Ambientet e pallatit",
  },
  hotele: { path: "/pastrim-hotelesh-tirane", navLabel: "Hotele", chipLabel: "Hotel" },
};

/** Pages with their own WhatsApp message and form preset: every service plus /per-biznese. */
export type PageKey = ServiceSlug | "biznese";
export const businessPath = "/per-biznese";

export function leadServiceLabel(value: string): string {
  if (value === "tjeter") return "Tjetër";
  return serviceIndex[value as ServiceSlug]?.navLabel ?? value;
}

export function isServiceSlug(value: string | null | undefined): value is ServiceSlug {
  return !!value && (serviceSlugs as readonly string[]).includes(value);
}

export function isPageKey(value: string | null | undefined): value is PageKey {
  return value === "biznese" || isServiceSlug(value);
}

/** Which page a route belongs to, so WhatsApp messages and form preselection follow the page. */
export function pageKeyForPath(pathname: string): PageKey | undefined {
  if (pathname === businessPath) return "biznese";
  return serviceSlugs.find((slug) => serviceIndex[slug].path === pathname);
}

// ---------------------------------------------------------------------------------------
// Optional form fields (Lead.propertyType / frequency / timing). Values are stored as-is.
// ---------------------------------------------------------------------------------------
export const propertyTypes = [
  { value: "apartament", label: "Apartament ose shtëpi" },
  { value: "vile", label: "Vilë" },
  { value: "zyre", label: "Zyrë ose dyqan" },
  { value: "pallat", label: "Pallat ose kompleks" },
  { value: "tjeter", label: "Tjetër" },
] as const;
export type PropertyTypeValue = (typeof propertyTypes)[number]["value"];

export const frequencies = [
  { value: "njehere", label: "Një herë" },
  { value: "rregullisht", label: "Rregullisht" },
] as const;

export const timings = [
  { value: "sa-me-shpejt", label: "Sa më shpejt" },
  { value: "kete-jave", label: "Këtë javë" },
  { value: "kete-muaj", label: "Këtë muaj" },
  { value: "pa-date", label: "Nuk kam datë të caktuar" },
] as const;

/** The business-name field only makes sense for these property types. */
export const businessPropertyTypes: readonly PropertyTypeValue[] = ["zyre", "pallat"];

export function optionLabel(
  options: readonly { value: string; label: string }[],
  value: string | null | undefined,
): string | undefined {
  return options.find((o) => o.value === value)?.label;
}

/** What the form preselects on each page. */
export function formPreset(page?: PageKey): { service?: LeadService; propertyType?: PropertyTypeValue } {
  switch (page) {
    case undefined:
      return {};
    case "biznese":
      return { propertyType: "zyre" };
    case "vila":
      return { propertyType: "vile" };
    case "apartamente":
      return { service: "apartamente", propertyType: "apartament" };
    case "zyra":
      return { service: "zyra", propertyType: "zyre" };
    case "ambiente":
      return { service: "ambiente", propertyType: "pallat" };
    default:
      return { service: page };
  }
}
