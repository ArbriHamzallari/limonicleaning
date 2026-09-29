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
  // Google Maps listing (share link from Arbri, 29 Sep 2026). Used for the "Google Maps" link
  // and as sameAs in the JSON-LD. Swap for the full maps.google.com/?cid=… URL if available.
  googleMapsUrl: "https://share.google/3oNsn9iygdcwmc4Gt",
  // Set once the Hostinger mailbox exists (e.g. "info@limonicleaning.com"); it then shows on
  // /kontakt. No social links, street address or hours confirmed yet.
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
