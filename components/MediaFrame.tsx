import Image from "next/image";

interface MediaFrameProps {
  /** Short caption for the empty state, e.g. "Ekipi në punë — Bllok". Always required so
   *  an empty slot still communicates what will go there. */
  label: string;
  src?: string;
  alt?: string;
  aspect?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

// Real photography isn't wired in for every slot yet. Rather than a dashed
// "under construction" box, this renders a deliberately designed empty state — a hairline
// frame, a faint brand texture, and a caption set in the display face — so an unfilled
// slot still looks like a considered part of the layout. Drop a real photo in via `src`
// later with no other changes.
export function MediaFrame({
  label,
  src,
  alt = "",
  aspect = "aspect-[4/3]",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className = "",
}: MediaFrameProps) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-md ${aspect} ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex ${aspect} flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-border bg-bg-muted px-6 text-center ${className}`}
    >
      <div className="bg-citrus-texture absolute inset-0 opacity-40" aria-hidden />
      <span className="relative font-display text-sm italic text-text-muted">{label}</span>
    </div>
  );
}
