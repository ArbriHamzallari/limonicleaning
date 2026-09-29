"use client";

import { whatsappLink } from "@/lib/business";
import { trackEvent } from "@/lib/analytics";

interface WhatsAppLinkProps {
  message: string;
  className?: string;
  children: React.ReactNode;
  source?: string;
}

export function WhatsAppLink({ message, className = "", children, source }: WhatsAppLinkProps) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackEvent("whatsapp_click", source ? { source } : undefined)}
    >
      {children}
    </a>
  );
}
