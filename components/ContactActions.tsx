import { WhatsAppButton } from "./WhatsAppButton";
import { PhoneButton } from "./PhoneButton";
import type { ServiceSlug } from "@/lib/service-index";

// The action outside the hero: WhatsApp as the one button, the phone as a plain link.
export function ContactActions({
  service,
  placement,
  className = "",
}: {
  service?: ServiceSlug;
  placement: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-6 ${className}`}>
      <WhatsAppButton service={service} placement={placement} size="lg" />
      <PhoneButton placement={placement} variant="link" showIcon={false} className="text-lg">
        ose telefononi 068 900 7252
      </PhoneButton>
    </div>
  );
}
