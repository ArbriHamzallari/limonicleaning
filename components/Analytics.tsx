"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { isPrivatePath } from "@/lib/analytics";

// Loads GA4 only when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured — unset by default, so no
// analytics script ships (and no page-speed cost) until the project is actually wired up to a
// real GA4 property. See .env.example / README.md.
// Privacy invariant (see isPrivatePath): gtag only ever runs in a document whose first page was
// public, and private pages are only entered by a full page load. So a document that runs gtag
// never shows a private URL, and no page_view (automatic or history-based) can carry a token.
// A document opened on a private page never loads gtag, even after the visitor clicks through to
// a public page and back. tests/private-navigation.test.ts guards the second half.
const documentStartedPrivate = typeof window !== "undefined" && isPrivatePath(window.location.pathname);

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();
  if (!gaId || documentStartedPrivate || isPrivatePath(pathname)) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
