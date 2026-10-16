"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  /** Shown as a caption under the frame. */
  caption?: string;
  aspect?: string;
  className?: string;
  /** Edge to edge on phones. */
  bleed?: boolean;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

// Drag anywhere on the frame (mouse, pen or finger), or tap to jump. `touch-action: pan-y`
// leaves vertical swipes to the browser, so scrolling past the photo never moves the line:
// a touch only takes over once it's clearly horizontal. The handle is a real slider for
// keyboard and screen-reader users (arrows, Page Up/Down, Home/End).
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  caption,
  aspect = "aspect-[3/2]",
  className = "",
  bleed = false,
}: BeforeAfterSliderProps) {
  const [value, setValue] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number; dragging: boolean } | null>(null);

  function setFromClientX(clientX: number) {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect?.width) return;
    setValue(clamp(((clientX - rect.left) / rect.width) * 100));
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const mouse = e.pointerType === "mouse";
    gesture.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dragging: mouse };
    if (mouse) {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      setFromClientX(e.clientX);
    }
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    if (!g.dragging) {
      const dx = Math.abs(e.clientX - g.x);
      const dy = Math.abs(e.clientY - g.y);
      if (dx < 6 && dy < 6) return;
      if (dy >= dx) {
        gesture.current = null; // a scroll, not a comparison
        return;
      }
      g.dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setFromClientX(e.clientX);
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (g && g.id === e.pointerId && !g.dragging) setFromClientX(e.clientX); // a tap
    gesture.current = null;
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -10, PageUp: 10 }[e.key];
    if (step !== undefined) setValue((v) => clamp(v + step));
    else if (e.key === "Home") setValue(0);
    else if (e.key === "End") setValue(100);
    else return;
    e.preventDefault();
  }

  const rounded = Math.round(value);

  return (
    <div className={className}>
      <div
        ref={frame}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (gesture.current = null)}
        className={`relative cursor-ew-resize touch-pan-y select-none overflow-hidden border-border ${bleed ? "-mx-4 border-y sm:mx-0 sm:rounded-lg sm:border" : "rounded-lg border"} ${aspect}`}
      >
        {/* After: full frame, base layer */}
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          draggable={false}
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="object-cover"
        />

        {/* Before: clipped to the slider value, on top */}
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            draggable={false}
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="object-cover"
          />
        </div>

        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-text/80 px-3 py-1 text-sm font-semibold text-white">
          Para
        </span>
        <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">
          Pas
        </span>

        {/* Divider line and the focusable handle, positioned from the same value */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
          style={{ left: `${value}%`, transform: "translateX(-1px)" }}
        >
          <div
            role="slider"
            tabIndex={0}
            aria-label="Krahasoni dhomën para dhe pas pastrimit"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={rounded}
            aria-orientation="horizontal"
            onKeyDown={onKeyDown}
            className="pointer-events-auto absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-md focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7 4 12l4 5M16 7l4 5-4 5" />
            </svg>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-(--fg-muted)">
        {caption ? `${caption}. ` : ""}
        <span className="font-semibold text-(--fg-muted)">Tërhiqni vijën për të krahasuar</span>
      </p>
    </div>
  );
}
