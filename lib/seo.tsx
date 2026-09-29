import type { Metadata } from "next";
import { business } from "@/lib/business";
import { services } from "@/lib/services";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://limonicleaning.com";

interface PageMetadataInput {
  /** Set `absoluteTitle` to skip the "| Limoni Cleaning" template (homepage). */
  title: string;
  absoluteTitle?: boolean;
  noindex?: boolean;
  description: string;
  path: string;
  ogImage?: string;
}

export function pageMetadata({ title, absoluteTitle, noindex, description, path, ogImage }: PageMetadataInput): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: business.name,
      locale: "sq_AL",
      type: "website",
      // No `images` override here — falls back to the site-wide app/opengraph-image.tsx
      // (generated from brand colors) unless a page passes its own via `ogImage`.
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

const businessId = `${siteUrl}/#business`;

/** One @graph for the whole site, rendered once in the root layout. */
export function siteGraphJsonLd() {
  const sameAs = [business.googleMapsUrl, business.instagramUrl, business.facebookUrl].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HousekeepingService",
        "@id": businessId,
        name: business.name,
        url: siteUrl,
        telephone: business.phoneE164,
        image: `${siteUrl}/images/ekipi-shtrim-shtrati-tirane.jpg`,
        logo: `${siteUrl}/logo.png`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Tiranë",
          addressCountry: "AL",
        },
        areaServed: { "@type": "City", name: "Tiranë" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Shërbime pastrimi",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.h1, url: `${siteUrl}${s.path}` },
          })),
        },
        hasMap: business.googleMapsUrl,
        ...(business.email ? { email: business.email } : {}),
        // Only real profiles (Google Maps listing now; social once they exist).
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: business.name,
        url: siteUrl,
        inLanguage: "sq-AL",
        publisher: { "@id": businessId },
      },
    ],
  };
}

export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    provider: { "@id": businessId },
    areaServed: { "@type": "City", name: "Tiranë" },
    url: `${siteUrl}${path}`,
  };
}

export function videoJsonLd(input: {
  name: string;
  description: string;
  thumbnailPath: string;
  contentPath: string;
  uploadDate: string; // YYYY-MM-DD
  durationSeconds: number;
}) {
  const minutes = Math.floor(input.durationSeconds / 60);
  const seconds = Math.round(input.durationSeconds % 60);
  const isoDuration = `PT${minutes ? `${minutes}M` : ""}${seconds}S`;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.name,
    description: input.description,
    thumbnailUrl: [`${siteUrl}${input.thumbnailPath}`],
    uploadDate: input.uploadDate,
    duration: isoDuration,
    contentUrl: `${siteUrl}${input.contentPath}`,
    publisher: { "@id": businessId },
  };
}

export function faqJsonLd(entries: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
