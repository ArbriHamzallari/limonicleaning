import Image from "next/image";

interface PhotoProps {
  src: string;
  alt: string;
  aspect?: string;
  sizes?: string;
  /** Only the page's hero / LCP image: loads eagerly with high fetch priority. */
  priority?: boolean;
  caption?: string;
  /** Runs edge to edge on phones (cancels the 16px page gutter), normal from sm up. */
  bleed?: boolean;
  className?: string;
}

// Real photos only. There is deliberately no empty/placeholder state: if a section has no
// photo yet, the layout goes text-only instead of showing a frame.
export function Photo({
  src,
  alt,
  aspect = "aspect-[4/3]",
  sizes,
  priority = false,
  caption,
  bleed = false,
  className = "",
}: PhotoProps) {
  return (
    <figure className={`${bleed ? "-mx-4 sm:mx-0" : ""} ${className}`}>
      <div className={`relative overflow-hidden bg-bg-muted ${bleed ? "sm:rounded-lg" : "rounded-lg"} ${aspect}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
          className="object-cover"
          {...(priority ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
        />
      </div>
      {caption && (
        <figcaption className={`mt-2 text-sm text-(--fg-muted) ${bleed ? "px-4 sm:px-0" : ""}`}>{caption}</figcaption>
      )}
    </figure>
  );
}
