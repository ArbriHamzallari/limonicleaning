import { QuoteButton } from "./QuoteButton";
import { WhatsAppButton } from "./WhatsAppButton";
import { bookingCtaLabel } from "@/lib/nav";
import type { PageKey } from "@/lib/service-index";

// Hero buttons: the booking button jumps to the page's booking section (#rezervo) and falls back
// to /kerko-oferte with the service preselected; WhatsApp sits beside it.
export function LeadActions({
  service,
  placement,
  label = bookingCtaLabel,
  className = "",
}: {
  service?: PageKey;
  placement: string;
  label?: string;
  className?: string;
}) {
  const quoteHref = service ? `/kerko-oferte?sherbimi=${service}` : "/kerko-oferte";

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <QuoteButton href={quoteHref} service={service} placement={placement} jump className="sm:whitespace-nowrap">
        {label}
      </QuoteButton>
      <WhatsAppButton service={service} placement={placement} variant="outline" size="lg" className="sm:whitespace-nowrap">
        WhatsApp
      </WhatsAppButton>
    </div>
  );
}
