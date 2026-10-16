import { Button } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import { mainCtaLabel } from "@/lib/nav";
import type { PageKey } from "@/lib/service-index";

// Hero (and the home business block) only. The main button appears in the header and heroes;
// everywhere else the action is WhatsApp or the phone (ContactActions / Closer).
export function LeadActions({
  service,
  placement,
  label = mainCtaLabel,
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
      <Button href={quoteHref} variant="secondary" size="lg" className="sm:whitespace-nowrap">
        {label}
      </Button>
      <WhatsAppButton service={service} placement={placement} variant="outline" size="lg" className="sm:whitespace-nowrap">
        WhatsApp
      </WhatsAppButton>
    </div>
  );
}
