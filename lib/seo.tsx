import type { Metadata } from "next";
import { business } from "@/lib/business";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://limonicleaning.al";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

export function pageMetadata({ title, description, path, ogImage }: PageMetadataInput): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
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

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HousekeepingService",
    name: business.name,
    url: siteUrl,
    telephone: business.phoneE164,
    areaServed: {
      "@type": "City",
      name: "Tiranë",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.areaServed,
      addressCountry: "AL",
    },
    sameAs: [] as string[],
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: business.name,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    telephone: business.phoneE164,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: business.name,
    url: siteUrl,
    inLanguage: "sq-AL",
  };
}

export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    provider: {
      "@type": "HousekeepingService",
      name: business.name,
      telephone: business.phoneE164,
    },
    areaServed: {
      "@type": "City",
      name: "Tiranë",
    },
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
    publisher: {
      "@type": "Organization",
      name: business.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
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
