"use client";

import { useEffect, useRef, useState } from "react";

interface WorkLoopProps {
  src: string;
  poster: string;
  /** Accessible name: what the clip shows. */
  label: string;
  className?: string;
}

// The one moving image on the site ("Ekipi në punë"): a few silent seconds of real work.
// Muted, no sound track at all, downloads nothing until it scrolls into view, and plays only
// while on screen. With reduced motion or Save-Data it stays a poster with a play button.
// Once someone pauses it, it stays paused.
export function WorkLoop({ src, poster, label, className = "" }: WorkLoopProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [near, setNear] = useState(false);

  // The poster is far down the homepage: fetch it only when the clip gets close.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced || saveData) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) {
          video.play().catch(() => setPlaying(false));
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play();
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  const optimizedPoster = `/_next/image?url=${encodeURIComponent(poster)}&w=640&q=75`;

  return (
    <div className={`relative ${className}`}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={near ? optimizedPoster : undefined}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="aspect-[9/16] w-full rounded-lg border border-border bg-text object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
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
    </div>
  );
}
