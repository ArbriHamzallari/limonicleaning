"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/business";
import { waMessages } from "@/lib/whatsapp-messages";
import { trackEvent } from "@/lib/analytics";

interface AirbnbWhatsAppQuoteProps {
  className?: string;
  /** "dark" for placement on a bg-primary/bg-bg-ink panel, "light" for a default/muted/warm
   *  section. Purely visual — the message logic is identical either way. */
  variant?: "dark" | "light";
  source?: string;
}

// Four optional fields, not a form: whatever the visitor fills in gets folded into the
// WhatsApp message before it opens, so the conversation starts with the specific details
// Limoni actually needs to assess an Airbnb property (see /cmimet, /pastrim-airbnb-tirane,
// /pronare-airbnb). Leaving all four blank still produces a clean, natural message. This
// deliberately never computes or displays a price — Airbnb pricing is assessed per property,
// not published, see CLAUDE.md.
export function AirbnbWhatsAppQuote({ className = "", variant = "dark", source }: AirbnbWhatsAppQuoteProps) {
  const [properties, setProperties] = useState("");
  const [sqm, setSqm] = useState("");
  const [frequency, setFrequency] = useState("");
  const [zone, setZone] = useState("");

  const href = whatsappLink(
    waMessages.airbnbInquiry(properties.trim(), sqm.trim(), frequency.trim(), zone.trim())
  );

  const isDark = variant === "dark";
  const inputClasses = isDark
    ? "mt-1 w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none"
    : "mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted/70 focus:border-primary focus:outline-none";
  const labelClasses = isDark ? "text-xs font-medium text-white/80" : "text-xs font-medium text-text-muted";
  const buttonClasses = isDark
    ? "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-text transition-colors hover:bg-accent-hover"
    : "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover";

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="airbnb-properties" className={labelClasses}>
            Sa Airbnb keni?
          </label>
          <input
            id="airbnb-properties"
            type="number"
            inputMode="numeric"
            min={0}
            value={properties}
            onChange={(e) => setProperties(e.target.value)}
            placeholder="p.sh. 2"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="airbnb-sqm" className={labelClasses}>
            Sa m² secila?
          </label>
          <input
            id="airbnb-sqm"
            type="number"
            inputMode="numeric"
            min={0}
            value={sqm}
            onChange={(e) => setSqm(e.target.value)}
            placeholder="p.sh. 60"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="airbnb-frequency" className={labelClasses}>
            Herë/muaj për pronë?
          </label>
          <input
            id="airbnb-frequency"
            type="number"
            inputMode="numeric"
            min={0}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="p.sh. 8"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="airbnb-zone" className={labelClasses}>
            Në cilën zonë?
          </label>
          <input
            id="airbnb-zone"
            type="text"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            placeholder="p.sh. Bllok"
            className={inputClasses}
          />
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("whatsapp_click", { source: source ?? "airbnb_quote" })}
        className={buttonClasses}
      >
        Na dërgo informacionin në WhatsApp
      </a>
    </div>
  );
}
