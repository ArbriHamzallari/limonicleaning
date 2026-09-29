// Thin GA4 event wrapper. No-ops safely when NEXT_PUBLIC_GA_MEASUREMENT_ID isn't set (default,
// see .env.example) or before the gtag script has loaded — callers never need to guard calls.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent = "lead_submitted" | "whatsapp_click" | "phone_click" | "quote_cta_click";

export function trackEvent(event: AnalyticsEvent, params?: Record<string, string>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
