import { businessPath, serviceIndex, serviceSlugs } from "./service-index";

/** The site-wide main button (header, heroes). Polite "ju" form, as everywhere else. */
export const mainCtaLabel = "Merrni ofertën tuaj";
export const businessCtaLabel = "Merrni ofertë për biznesin tuaj";

// Header nav: four links; the phone number and the main button sit beside them.
// Kontakt lives in the footer and the mobile menu (the phone is already in the header).
// Two doors: Shërbimet (mostly homes) and Për biznese. Airbnb is reached through Shërbimet.
export const mainNav = [
  { label: "Shërbimet", href: "/sherbime" },
  { label: "Për biznese", href: businessPath },
  { label: "Puna jonë", href: "/puna-jone" },
  { label: "Rreth nesh", href: "/rreth-nesh" },
] as const;

export const footerServiceLinks = serviceSlugs.map((slug) => ({
  label: serviceIndex[slug].navLabel,
  href: serviceIndex[slug].path,
}));

export const footerCompanyLinks = [
  { label: "Për biznese", href: businessPath },
  { label: "Rreth nesh", href: "/rreth-nesh" },
  { label: "Puna jonë", href: "/puna-jone" },
  { label: "Pyetje të shpeshta", href: "/faq" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Na lini numrin", href: "/kerko-oferte" },
] as const;

export const footerLegalLinks = [
  { label: "Politika e privatësisë", href: "/privatesia" },
  { label: "Kushtet e shërbimit", href: "/kushtet" },
] as const;
