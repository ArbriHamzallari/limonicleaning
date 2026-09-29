"use client";

import { usePathname } from "next/navigation";
import { Button } from "./Button";
import { WhatsAppLink } from "./WhatsAppLink";
import { waMessages } from "@/lib/whatsapp-messages";
import { trackEvent } from "@/lib/analytics";

// Pages where the strategic priority is a WhatsApp quote, not the general booking wizard
// (see CLAUDE.md: Airbnb pricing is assessed, never booked off a fixed public rate). On
// these routes the sticky bar leads with WhatsApp; everywhere else it leads with booking.
const whatsAppLedRoutes = ["/", "/pastrim-airbnb-tirane", "/pronare-airbnb"];

// Mobile-only, persistent but slim — one primary action and one compact secondary, never
// a full CTA row, so it doesn't compete with in-page CTAs. Hidden on /rezervo, which
// already ends every step in its own primary action.
export function MobileStickyCta() {
  const pathname = usePathname();
  if (pathname === "/rezervo") return null;

  const whatsAppLed = whatsAppLedRoutes.includes(pathname);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      {whatsAppLed ? (
        <>
          <WhatsAppLink
            message={waMessages.airbnb}
            source="mobile_sticky"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Kërko ofertë
          </WhatsAppLink>
          <Button
            href="/rezervo"
            variant="outline"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full !p-0"
            onClick={() => trackEvent("cta_book_click", { placement: "mobile_sticky" })}
          >
            <span className="sr-only">Rezervo pastrimin</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <rect x="3.75" y="5.25" width="16.5" height="15" rx="2" />
              <path strokeLinecap="round" d="M3.75 9.75h16.5M8.25 3v3M15.75 3v3" />
            </svg>
          </Button>
        </>
      ) : (
        <>
          <Button
            href="/rezervo"
            variant="primary"
            className="flex-1"
            onClick={() => trackEvent("cta_book_click", { placement: "mobile_sticky" })}
          >
            Rezervo pastrimin
          </Button>
          <WhatsAppLink
            message={waMessages.general}
            source="mobile_sticky"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary text-primary"
          >
            <span className="sr-only">Na shkruaj në WhatsApp</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.29-1.39a9.9 9.9 0 0 0 4.7 1.2h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.19c-.24.68-1.4 1.3-1.93 1.37-.49.07-1.11.1-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.7-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.09.99-2.37c.24-.27.53-.34.71-.34.18 0 .35 0 .5.01.16.01.38-.06.6.46.24.55.79 1.9.86 2.03.07.14.11.3.02.48-.09.19-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.28-.12.56.16.27.71 1.17 1.53 1.89 1.05.94 1.94 1.23 2.21 1.37.27.14.43.12.59-.05.16-.16.68-.79.86-1.06.18-.27.36-.22.6-.13.25.09 1.58.75 1.85.88.27.14.45.2.51.32.07.11.07.65-.17 1.33Z" />
            </svg>
          </WhatsAppLink>
        </>
      )}
    </div>
  );
}
