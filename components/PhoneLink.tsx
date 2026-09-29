"use client";

import { business } from "@/lib/business";
import { trackEvent } from "@/lib/analytics";

export function PhoneLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={`tel:${business.phoneE164}`}
      className={className}
      onClick={() => trackEvent("phone_click")}
    >
      {business.phoneDisplay}
    </a>
  );
}
