import { WhatsAppButton } from "./WhatsAppButton";
import { PhoneButton } from "./PhoneButton";
import { business } from "@/lib/business";
import type { PageKey } from "@/lib/service-index";

// The action outside the hero: WhatsApp as the one button, the phone as a plain link.
export function ContactActions({
  service,
  placement,
  className = "",
}: {
  service?: PageKey;
  placement: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-6 ${className}`}>
      <WhatsAppButton service={service} placement={placement} size="lg" />
      <PhoneButton placement={placement} variant="link" showIcon={false} className="text-lg">
        ose telefononi {business.phoneDisplay}
      </PhoneButton>
    </div>
  );
}
