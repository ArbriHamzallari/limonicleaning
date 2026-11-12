"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motionAllowed } from "@/lib/motion";

/** Fired by HeroReel when the visitor pauses or plays it; the heading follows the same choice. */
export const HERO_MOTION_EVENT = "limoni:hero-motion";
export type HeroMotionDetail = { paused: boolean };

const noop = () => () => {};
const motionOff = () => !motionAllowed();

interface RotatingWordsProps {
  /**
   * Phrases shown one at a time, all on one line (no wrapping). The first is the server-rendered
   * one. On the homepage at 320px the widest phrase leaves about 10px, so keep new ones no longer
   * than "shtëpinë tuaj".
   */
  words: readonly string[];
  /** Milliseconds each phrase stays on screen. */
  interval?: number;
  className?: string;
}

// Visual only (aria-hidden): the surrounding heading carries the full sentence for screen
// readers and search engines. Every phrase sits in the same grid cell, so the line keeps the
// height and width of the widest phrase and nothing below it moves when the phrase changes.
// It never rotates with reduced motion or Save-Data (when the reel and its pause button are off
// too), stops while off screen, and pauses when the visitor pauses the hero reel.
export function RotatingWords({ words, interval = 2200, className = "" }: RotatingWordsProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const still = useSyncExternalStore(noop, motionOff, () => true);

  useEffect(() => {
    const node = ref.current;
    if (still || !node || words.length < 2) return;

    let onScreen = true;
    let userPaused = false;
    const timer = window.setInterval(() => {
      if (onScreen && !userPaused && !document.hidden) setActive((i) => (i + 1) % words.length);
    }, interval);
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    observer.observe(node);
    const onMotion = (e: Event) => {
      userPaused = (e as CustomEvent<HeroMotionDetail>).detail.paused;
    };
    window.addEventListener(HERO_MOTION_EVENT, onMotion);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      window.removeEventListener(HERO_MOTION_EVENT, onMotion);
    };
  }, [still, words.length, interval]);

  return (
    <span ref={ref} aria-hidden className={`grid ${className}`}>
      {words.map((word, i) => (
        <span
          key={word}
          className={`col-start-1 row-start-1 whitespace-nowrap transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none ${
            i === active
              ? "translate-y-0 opacity-100"
              : i === (active - 1 + words.length) % words.length
                ? "-translate-y-[0.3em] opacity-0"
                : "translate-y-[0.3em] opacity-0"
          }`}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
