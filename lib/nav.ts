import { businessPath, serviceIndex, serviceSlugs } from "./service-index";

/** Label of every booking button (header, heroes, mobile bar). Polite "ju" form, as everywhere else. */
export const bookingCtaLabel = "Rezervoni pastrimin";

/** Older quote label, still used where a page asks for an offer rather than a date. */
export const mainCtaLabel = "Merrni ofertën tuaj";
export const businessCtaLabel = "Merrni ofertë për biznesin tuaj";

// Header nav: four links; the phone number and the booking button sit beside them.
// "Si funksionon" is a section of the homepage. Puna jonë, Për biznese, Kontakt and the FAQ
// live in the footer and the mobile menu.
export const mainNav = [
  { label: "Kryefaqja", href: "/" },
  { label: "Shërbimet", href: "/sherbime" },
  { label: "Si funksionon", href: "/#si-funksionon" },
  { label: "Rreth nesh", href: "/rreth-nesh" },
] as const;

/** Extra links in the mobile menu, after mainNav. */
export const mobileMenuExtraLinks = [
  { label: "Puna jonë", href: "/puna-jone" },
  { label: "Për biznese", href: businessPath },
  { label: "Pyetje të shpeshta", href: "/faq" },
  { label: "Kontakt", href: "/kontakt" },
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
  { label: bookingCtaLabel, href: "/kerko-oferte" },
] as const;

export const footerLegalLinks = [
  { label: "Politika e privatësisë", href: "/privatesia" },
  { label: "Kushtet e shërbimit", href: "/kushtet" },
] as const;
