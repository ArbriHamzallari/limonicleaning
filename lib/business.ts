// Ground-truth business facts. Mirrors CLAUDE.md exactly — do not add anything here
// that isn't listed there (no years-in-business, no review counts, no addresses).

export const business = {
  name: "Limoni Cleaning",
  city: "Tiranë",
  country: "Shqipëri",
  areaServed: "Komuna e Parisit, Tiranë",
  phoneDisplay: "+355 68 900 7252",
  phoneE164: "+355689007252",
  whatsappUrl: "https://wa.me/355689007252",
  // No business email, social links, street address, or hours confirmed yet.
  email: null as string | null,
  instagramUrl: null as string | null,
  facebookUrl: null as string | null,
  streetAddress: null as string | null,
  hours: null as string | null,
} as const;

export function whatsappLink(message: string): string {
  return `${business.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

// Official partner — separate company, not the same legal entity as Limoni Cleaning.
export const prago = {
  name: "Prago",
  url: "https://www.prago.al/",
} as const;
