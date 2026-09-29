import { serviceIndex, serviceSlugs } from "./service-index";

// Header nav: four links; the phone number and the "Kërko ofertë" button sit beside them.
// Kontakt lives in the footer and the mobile menu (the phone is already in the header).
export const mainNav = [
  { label: "Shërbimet", href: "/sherbime" },
  { label: "Airbnb", href: "/pastrim-airbnb-tirane" },
  { label: "Puna jonë", href: "/puna-jone" },
  { label: "Rreth nesh", href: "/rreth-nesh" },
] as const;

export const footerServiceLinks = serviceSlugs.map((slug) => ({
  label: serviceIndex[slug].navLabel,
  href: serviceIndex[slug].path,
}));

export const footerCompanyLinks = [
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
