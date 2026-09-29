// The small, client-safe part of the service catalogue: slugs, routes and short labels.
// Header, sticky bar and LeadForm import this; the full page copy lives in lib/services.ts
// so it never ends up in the client bundle.

export const serviceSlugs = [
  "apartamente",
  "airbnb",
  "zyra",
  "vila",
  "me-themel",
  "pas-ndertimit",
  "hotele",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

/** Values accepted by the lead form and stored in Lead.service. */
export const leadServiceValues = [...serviceSlugs, "tjeter"] as const;
export type LeadService = (typeof leadServiceValues)[number];

interface ServiceIndexEntry {
  path: string;
  /** Used in nav, cards, footer and breadcrumbs. */
  navLabel: string;
  /** Short label for the lead form chips. */
  chipLabel: string;
}

export const serviceIndex: Record<ServiceSlug, ServiceIndexEntry> = {
  apartamente: {
    path: "/pastrim-apartamentesh-tirane",
    navLabel: "Apartamente dhe shtëpi",
    chipLabel: "Apartament ose shtëpi",
  },
  airbnb: { path: "/pastrim-airbnb-tirane", navLabel: "Airbnb", chipLabel: "Airbnb" },
  zyra: { path: "/pastrim-zyrash-tirane", navLabel: "Zyra", chipLabel: "Zyrë" },
  vila: { path: "/pastrim-vilash-tirane", navLabel: "Vila", chipLabel: "Vilë" },
  "me-themel": {
    path: "/pastrim-me-themel-tirane",
    navLabel: "Pastrim me themel",
    chipLabel: "Pastrim me themel",
  },
  "pas-ndertimit": {
    path: "/pastrim-pas-ndertimit-tirane",
    navLabel: "Pas ndërtimit ose rinovimit",
    chipLabel: "Pas ndërtimit",
  },
  hotele: { path: "/pastrim-hotelesh-tirane", navLabel: "Hotele", chipLabel: "Hotel" },
};

export function leadServiceLabel(value: string): string {
  if (value === "tjeter") return "Tjetër";
  return serviceIndex[value as ServiceSlug]?.navLabel ?? value;
}

export function isServiceSlug(value: string | null | undefined): value is ServiceSlug {
  return !!value && (serviceSlugs as readonly string[]).includes(value);
}

/** Which service a route belongs to, so WhatsApp messages and form preselection follow the page. */
export function serviceForPath(pathname: string): ServiceSlug | undefined {
  return serviceSlugs.find((slug) => serviceIndex[slug].path === pathname);
}
