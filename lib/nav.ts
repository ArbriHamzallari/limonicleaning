import { serviceIndex, serviceSlugs } from "./service-index";

// Header nav: five links, the lead button and the phone number sit beside it.
export const mainNav = [
  { label: "Shërbimet", href: "/sherbime" },
  { label: "Airbnb", href: "/pastrim-airbnb-tirane" },
  { label: "Puna jonë", href: "/puna-jone" },
  { label: "Rreth nesh", href: "/rreth-nesh" },
  { label: "Kontakt", href: "/kontakt" },
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
  { label: "Kërko ofertë", href: "/kerko-oferte" },
] as const;

export const footerLegalLinks = [
  { label: "Politika e privatësisë", href: "/privatesia" },
  { label: "Kushtet e shërbimit", href: "/kushtet" },
] as const;
