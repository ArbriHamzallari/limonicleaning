// Thin GA4 event wrapper. No-ops safely when NEXT_PUBLIC_GA_MEASUREMENT_ID isn't set (default,
// see .env.example) or before the gtag script has loaded — callers never need to guard calls.
//
// Privacy rule: parameters are page keys, placements and percentages only. Never names, phone
// numbers, zones, dates, free text or photos. A WhatsApp click or a lead is NOT a sale: outcomes
// are reconciled by hand (docs/sales-handoff.md).
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "service_view"
  | "quote_cta_click"
  | "whatsapp_click"
  | "phone_click"
  | "form_start"
  | "lead_submitted"
  | "lead_failed"
  | "video_start"
  | "video_progress"
  | "video_complete"
  | "install_offer_view"
  | "install_click"
  | "install_accepted"
  | "install_dismissed";

export type AnalyticsParams = Record<string, string | number>;

export function trackEvent(event: AnalyticsEvent, params?: AnalyticsParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
