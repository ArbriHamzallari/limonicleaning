"use client";

import { useState } from "react";

/** Copy button for a private link, plus "send it to myself" on WhatsApp (no number: the user picks). */
export function CopyLink({ link, whatsappText }: { link: string; whatsappText?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-3">
      <input readOnly value={link} aria-label="Lidhja" className="block min-h-12 w-full rounded-lg border-2 border-border bg-bg px-3 text-base" onFocus={(e) => e.currentTarget.select()} />
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex min-h-12 items-center rounded-full border-2 border-primary/30 px-5 font-semibold text-primary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(link);
              setCopied(true);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? "U kopjua" : "Kopjo lidhjen"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(whatsappText ?? `Kërkesa ime te Limoni Cleaning: ${link}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center rounded-full border-2 border-primary/30 px-5 font-semibold text-primary"
        >
          {whatsappText ? "Dërgo në WhatsApp" : "Ruaje në WhatsApp"}
        </a>
      </div>
    </div>
  );
}
