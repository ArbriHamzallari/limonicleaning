import { Button } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import type { ServiceSlug } from "@/lib/service-index";

interface LeadActionsProps {
  service?: ServiceSlug;
  placement: string;
  className?: string;
}

// The two actions every page ends in: the short form (preselected to this page's service)
// and a WhatsApp chat with the matching prefilled message.
export function LeadActions({ service, placement, className = "" }: LeadActionsProps) {
  const quoteHref = service ? `/kerko-oferte?sherbimi=${service}` : "/kerko-oferte";

  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <Button href={quoteHref} variant="secondary" size="lg">
        Kërko ofertë
      </Button>
      <WhatsAppButton service={service} placement={placement} size="lg" />
    </div>
  );
}
