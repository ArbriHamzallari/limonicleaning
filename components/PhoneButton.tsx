"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { PhoneIcon } from "./icons";
import { business } from "@/lib/business";
import { trackEvent } from "@/lib/analytics";

interface PhoneButtonProps {
  placement: string;
  variant?: "primary" | "outline" | "link";
  size?: "md" | "lg";
  iconOnly?: boolean;
  showIcon?: boolean;
  className?: string;
  children?: ReactNode;
}

export function PhoneButton({
  placement,
  variant = "outline",
  size = "md",
  iconOnly = false,
  showIcon = true,
  className = "",
  children = business.phoneDisplay,
}: PhoneButtonProps) {
  const onClick = () => trackEvent("phone_click", { placement });
  const href = `tel:${business.phoneE164}`;

  if (iconOnly) {
    return (
      <Button href={href} variant={variant} onClick={onClick} className={`min-h-12! w-12! shrink-0 px-0! ${className}`}>
        <PhoneIcon className="h-6 w-6" />
        <span className="sr-only">Na telefononi në {business.phoneDisplay}</span>
      </Button>
    );
  }

  return (
    <Button href={href} variant={variant} size={size} onClick={onClick} className={className}>
      {showIcon && <PhoneIcon className="h-5 w-5 shrink-0" />}
      {children}
    </Button>
  );
}
