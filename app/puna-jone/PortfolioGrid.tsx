"use client";

import { useState } from "react";
import { MediaFrame } from "@/components/MediaFrame";
import { portfolioEntries, portfolioFilters, type PortfolioEntry } from "@/lib/content";

export function PortfolioGrid() {
  const [filter, setFilter] = useState<(typeof portfolioFilters)[number]>("Të gjitha");

  const visible: PortfolioEntry[] =
    filter === "Të gjitha" ? portfolioEntries : portfolioEntries.filter((e) => e.category === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {portfolioFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? "border-primary bg-primary text-white"
                : "border-border text-text hover:border-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((entry) => (
          <div key={`${entry.title}-${entry.location}`}>
            <MediaFrame
              label={`Foto — ${entry.title}`}
              src={entry.src}
              alt={entry.src ? `${entry.title} — ${entry.category}, ${entry.location}, Limoni Cleaning` : ""}
              aspect="aspect-[4/3]"
            />
            <h3 className="mt-3 font-semibold text-text">{entry.title}</h3>
            <p className="text-sm text-text-muted">
              {entry.category} · {entry.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
