import Script from "next/script";

// Loads GA4 only when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured — unset by default, so no
// analytics script ships (and no page-speed cost) until the project is actually wired up to a
// real GA4 property. See .env.example / README.md.
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;

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
