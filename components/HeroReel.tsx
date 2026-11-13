"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HERO_MOTION_EVENT, type HeroMotionDetail } from "@/components/RotatingWords";
import { motionAllowed } from "@/lib/motion";

const noop = () => () => {};

// The rotating hero heading pauses and resumes with the reel.
function announceMotion(paused: boolean) {
  window.dispatchEvent(new CustomEvent<HeroMotionDetail>(HERO_MOTION_EVENT, { detail: { paused } }));
}

interface HeroReelProps {
  src: string;
  poster: string;
  /** Accessible name: what the reel shows. */
  label: string;
  className?: string;
}

// Homepage hero reel: a short silent loop of real work. The poster is a priority image (the
// LCP element). The video gets its source only after the window load event and once at least
// half of it is on screen, so its bytes never compete with the poster or the page's own files;
// it plays only while on screen. With reduced motion or Save-Data it never loads and the poster
// stays. Once the visitor pauses it, it stays paused.
export function HeroReel({ src, poster, label, className = "" }: HeroReelProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  // On the server (and during hydration) motion is not allowed, so the first render is always the
  // still poster.
  const allowed = useSyncExternalStore(noop, motionAllowed, () => false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !allowed) return;

    let observer: IntersectionObserver | undefined;
    const watch = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !userPaused.current) {
            if (!video.getAttribute("src")) video.setAttribute("src", src);
            // Autoplay can still be refused (iOS Low Power Mode): the reel then stays on its poster
            // with a play button, so the heading stops too until the visitor presses play.
            video.play().catch(() => {
              setPlaying(false);
              announceMotion(true);
            });
          } else if (!entry.isIntersecting) {
            video.pause();
          }
        },
        { threshold: 0.5 },
      );
      observer.observe(video);
    };
    // The load event may already have fired before hydration.
    if (document.readyState === "complete") watch();
    else window.addEventListener("load", watch, { once: true });
    return () => {
      window.removeEventListener("load", watch);
      observer?.disconnect();
    };
  }, [src, allowed]);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      if (!video.getAttribute("src")) video.setAttribute("src", src);
      void video.play();
    } else {
      userPaused.current = true;
      video.pause();
    }
    announceMotion(userPaused.current);
  }

  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-primary-hover ${className}`}>
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover"
        loading="eager"
        fetchPriority="high"
      />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {allowed && (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-3 left-3 inline-flex min-h-12 items-center gap-2 rounded-full bg-text/80 px-4 text-base font-semibold text-white hover:bg-text focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
            {playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
          {playing ? "Ndalo videon" : "Luaj videon"}
        </button>
      )}
    </div>
  );
}
