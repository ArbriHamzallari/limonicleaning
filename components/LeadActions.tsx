import { Button } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import type { ServiceSlug } from "@/lib/service-index";

// Hero only. "Kërko ofertë" appears in exactly two places site-wide: the header and heroes.
// Everywhere else the action is WhatsApp or the phone (ContactActions / Closer).
export function LeadActions({
  service,
  placement,
  className = "",
}: {
  service?: ServiceSlug;
  placement: string;
  className?: string;
}) {
  const quoteHref = service ? `/kerko-oferte?sherbimi=${service}` : "/kerko-oferte";

  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <Button href={quoteHref} variant="secondary" size="lg">
        Kërko ofertë
      </Button>
      <WhatsAppButton service={service} placement={placement} variant="outline" size="lg">
        WhatsApp
      </WhatsAppButton>
    </div>
  );
}
