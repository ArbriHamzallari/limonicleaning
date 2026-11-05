"use client";

import { useRef, useState } from "react";
import type { FounderVideoConfig } from "@/lib/founder-video";
import { trackEvent } from "@/lib/analytics";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Native controls (keyboard accessible, captions menu), no autoplay, nothing downloaded until
// play except the poster and the metadata. Fixed 16:9 frame so nothing jumps. Progress events
// come from real media events (play, timeupdate, ended), never from button clicks.
export function FounderVideoPlayer({
  video,
  placement,
  className = "",
}: {
  video: FounderVideoConfig;
  placement: string;
  className?: string;
}) {
  const sent = useRef(new Set<string>());
  const [failed, setFailed] = useState(false);

  const once = (key: string, fn: () => void) => {
    if (sent.current.has(key)) return;
    sent.current.add(key);
    fn();
  };

  function onTime(e: React.SyntheticEvent<HTMLVideoElement>) {
    const v = e.currentTarget;
    if (!v.duration || !Number.isFinite(v.duration)) return;
    const pct = (v.currentTime / v.duration) * 100;
    for (const mark of [25, 50, 75]) {
      if (pct >= mark) once(`p${mark}`, () => trackEvent("video_progress", { placement, percent: mark }));
    }
  }

  return (
    <figure className={className}>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-text">
        {failed ? (
          <div className="flex h-full items-center justify-center p-6 text-center text-text-on-dark">
            <p>Videoja nuk u ngarkua. Teksti i plotë është më poshtë.</p>
          </div>
        ) : (
          <video
            controls
            playsInline
            preload="metadata"
            poster={video.poster}
            aria-label={video.title}
            onPlay={() => once("start", () => trackEvent("video_start", { placement }))}
            onTimeUpdate={onTime}
            onEnded={() => once("complete", () => trackEvent("video_complete", { placement }))}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          >
            <source src={video.src} type="video/mp4" onError={() => setFailed(true)} />
            <track kind="captions" src={video.captions} srcLang="sq" label="Shqip" default />
          </video>
        )}
      </div>
      <figcaption className="mt-3 text-base text-text-muted">
        {video.title}
        {video.durationSeconds ? ` (${formatDuration(video.durationSeconds)})` : ""}. Me titra në shqip.
      </figcaption>
      <details className="mt-2">
        <summary className="inline-flex min-h-12 cursor-pointer items-center font-semibold text-primary">
          Lexoni tekstin e videos
        </summary>
        <div className="mt-2 space-y-3 text-text-muted">
          {video.transcript.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </details>
    </figure>
  );
}
