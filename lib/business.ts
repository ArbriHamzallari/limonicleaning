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
  // Google Maps listing (link from Arbri, 30 Sep 2026). Used for the "Google Maps" link and as
  // sameAs / hasMap in the JSON-LD (with the social profiles below).
  googleMapsUrl: "https://maps.app.goo.gl/5eHU2M2ihKJaPWyi6",
  // Hostinger mailbox, confirmed 29 Sep 2026. Shown on /kontakt and in the JSON-LD.
  // Instagram and Facebook confirmed by Arbri on 12 Nov 2026. No street address or hours yet.
  email: "info@limonicleaning.com" as string | null,
  instagramUrl: "https://www.instagram.com/limonicleaning.al/" as string | null,
  facebookUrl: "https://www.facebook.com/limonicleaning.al/" as string | null,
  streetAddress: null as string | null,
  hours: null as string | null,
} as const;

// Social profiles that exist, in display order. Rendered in the footer and on /kontakt.
export const socialLinks = [
  { label: "Instagram", href: business.instagramUrl },
  { label: "Facebook", href: business.facebookUrl },
].filter((link): link is { label: string; href: string } => Boolean(link.href));

export function whatsappLink(message: string): string {
  return `${business.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

// Official partner — separate company, not the same legal entity as Limoni Cleaning.
export const prago = {
  name: "Prago",
  url: "https://www.prago.al/",
} as const;
