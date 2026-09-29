"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { WhatsAppIcon } from "./icons";
import { whatsappLink } from "@/lib/business";
import { waMessageFor } from "@/lib/whatsapp-messages";
import { trackEvent } from "@/lib/analytics";
import type { ServiceSlug } from "@/lib/service-index";

interface WhatsAppButtonProps {
  service?: ServiceSlug;
  /** Where on the page the button sits, for the whatsapp_click event. */
  placement: string;
  variant?: "whatsapp" | "outline" | "link";
  size?: "md" | "lg";
  /** Round 48px icon button; `children` becomes the screen-reader label. */
  iconOnly?: boolean;
  className?: string;
  children?: ReactNode;
}

export function WhatsAppButton({
  service,
  placement,
  variant = "whatsapp",
  size = "md",
  iconOnly = false,
  className = "",
  children = "Na shkruani në WhatsApp",
}: WhatsAppButtonProps) {
  const href = whatsappLink(waMessageFor(service));
  const onClick = () => trackEvent("whatsapp_click", { service: service ?? "pergjithshem", placement });

  if (iconOnly) {
    return (
      <Button
        href={href}
        variant={variant}
        onClick={onClick}
        className={`min-h-12! w-12! shrink-0 px-0! ${className}`}
      >
        <WhatsAppIcon className="h-6 w-6" />
        <span className="sr-only">{children}</span>
      </Button>
    );
  }

  return (
    <Button href={href} variant={variant} size={size} onClick={onClick} className={className}>
      {variant !== "link" && <WhatsAppIcon className="h-5 w-5 shrink-0" />}
      {children}
    </Button>
  );
}
