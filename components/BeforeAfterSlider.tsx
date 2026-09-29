"use client";

import { useState } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  /** e.g. "Airbnb — Bllok" — shown as a caption under the frame. */
  caption?: string;
  aspect?: string;
  className?: string;
  /** Set when this is the largest above-the-fold image on the page (LCP candidate). */
  priority?: boolean;
}

// A single native <input type="range"> drives the reveal, so dragging, touch, and
// keyboard (arrow keys, Home/End) all work without any custom pointer-event plumbing.
// The input is visually hidden but fills the frame; only the custom handle graphic and
// the clip-path reveal are drawn from its value.
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  caption,
  aspect = "aspect-[4/3]",
  className = "",
  priority = false,
}: BeforeAfterSliderProps) {
  const [value, setValue] = useState(50);

  return (
    <div className={className}>
      <div
        className={`group relative select-none overflow-hidden rounded-md border border-border ${aspect}`}
      >
        {/* After — full frame, base layer */}
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority={priority}
        />

        {/* Before — clipped to the slider value, sits on top */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        >
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority={priority}
          />
        </div>

        {/* Divider line + handle, purely visual, positioned from the same value */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
          style={{ left: `${value}%`, transform: "translateX(-1px)" }}
          aria-hidden
        >
          <span className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-md">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7 4 12l4 5M16 7l4 5-4 5" />
            </svg>
          </span>
        </div>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-bg-ink/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          Para
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-primary/85 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          Mbas
        </span>

        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={caption ? `Krahaso para dhe mbas — ${caption}` : "Krahaso para dhe mbas pastrimit"}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      {caption ? <p className="mt-3 text-sm text-text-muted">{caption}</p> : null}
    </div>
  );
}
