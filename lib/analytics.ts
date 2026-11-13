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

// Pages whose URL carries a private token (customer status link, team job sheet) or that only
// the owner sees. The invariant: gtag never runs in a document that shows a private URL.
// - Analytics does not load in a document whose first page was private (components/Analytics.tsx).
// - Public pages enter private ones only by a full page load (window.location.assign, plain <a>
//   from outside the app), never next/link or router.push; tests/private-navigation.test.ts
//   fails on a client navigation into a private prefix.
// So the Back button cannot bring a private URL into a document where gtag is running.
const PRIVATE_PREFIXES = ["/kerkesa", "/flete-pune", "/admin"];

export function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function trackEvent(event: AnalyticsEvent, params?: AnalyticsParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (isPrivatePath(window.location.pathname)) return;
  window.gtag("event", event, params);
}
