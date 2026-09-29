// Header is a conversion tool, kept short: the five links that matter for a visitor
// deciding what Limoni does and whether it fits their property. FAQ, Kontakt, Rreth nesh
// and Blog stay reachable from the footer and contextual in-page links instead of
// competing for header space.
export const mainNav = [
  { label: "Shërbimet", href: "/sherbime" },
  { label: "Airbnb", href: "/pastrim-airbnb-tirane" },
  { label: "Puna jonë", href: "/puna-jone" },
  { label: "Çmimet", href: "/cmimet" },
  { label: "Për pronarët", href: "/pronare-airbnb" },
] as const;

export const footerServiceLinks = [
  { label: "Pastrim Airbnb", href: "/pastrim-airbnb-tirane" },
  { label: "Pastrim Apartamentesh", href: "/pastrim-apartamentesh-tirane" },
  { label: "Pastrim Zyrash", href: "/pastrim-zyrash-tirane" },
  { label: "Pastrim Vilash", href: "/pastrim-vilash-tirane" },
  { label: "Pastrim Hotelesh", href: "/pastrim-hotelesh-tirane" },
  { label: "Pastrim Pas Ndërtimit", href: "/pastrim-pas-ndertimit-tirane" },
  { label: "Për Pronarë Airbnb", href: "/pronare-airbnb" },
] as const;

export const footerLegalLinks = [
  { label: "Politika e Privatësisë", href: "/privatesia" },
  { label: "Kushtet e Shërbimit", href: "/kushtet" },
] as const;
