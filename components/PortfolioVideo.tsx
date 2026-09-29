interface PortfolioVideoProps {
  src: string;
  poster: string;
  caption: string;
  className?: string;
}

// Real handheld walkthrough footage, not a hero loop: native controls, no autoplay, and
// preload="none" so the clip only downloads once someone actually taps play — the poster
// frame (and its next/image-optimized JPEG sibling) is what everyone else sees.
export function PortfolioVideo({ src, poster, caption, className = "" }: PortfolioVideoProps) {
  return (
    <div className={className}>
      <video
        controls
        preload="none"
        poster={poster}
        playsInline
        className="aspect-[9/16] w-full rounded-lg border border-border bg-text object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <p className="mt-3 text-sm text-(--fg-muted)">{caption}</p>
    </div>
  );
}
