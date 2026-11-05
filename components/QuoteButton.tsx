"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { trackEvent } from "@/lib/analytics";
import { jumpToLeadForm } from "@/lib/jump-to-form";
import type { PageKey } from "@/lib/service-index";

/** The yellow quote button, with the quote_cta_click event (page key + placement only). */
export function QuoteButton({
  href,
  service,
  placement,
  className = "",
  jump = false,
  children,
}: {
  href: string;
  service?: PageKey;
  placement: string;
  className?: string;
  /** Jump to this page's own form (instant, with focus) instead of following href. */
  jump?: boolean;
  children: ReactNode;
}) {
  return (
    <Button
      href={href}
      variant="secondary"
      size="lg"
      className={className}
      onClick={(e) => {
        trackEvent("quote_cta_click", { service: service ?? "pergjithshem", placement });
        if (jump && jumpToLeadForm()) e.preventDefault();
      }}
    >
      {children}
    </Button>
  );
}
