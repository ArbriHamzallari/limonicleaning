// Thin GA4 event wrapper. No-ops safely when NEXT_PUBLIC_GA_MEASUREMENT_ID isn't set (default,
// see .env.example) or before the gtag script has loaded — callers never need to guard calls.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "cta_book_click"
  | "whatsapp_click"
  | "phone_click"
  | "booking_started"
  | "booking_completed"
  | "contact_submitted";

export function trackEvent(event: AnalyticsEvent, params?: Record<string, string>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
