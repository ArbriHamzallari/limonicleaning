"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import type { PageKey } from "@/lib/service-index";

/** Sends one service_view per visit to a service page (page key only, no personal data). */
export function TrackView({ service }: { service: PageKey }) {
  useEffect(() => {
    trackEvent("service_view", { service });
  }, [service]);
  return null;
}
