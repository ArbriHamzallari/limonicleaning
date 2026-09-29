import Image from "next/image";

interface PhotoProps {
  src: string;
  alt: string;
  aspect?: string;
  sizes?: string;
  /** Only the page's hero / LCP image. */
  preload?: boolean;
  caption?: string;
  className?: string;
}

// Real photos only. There is deliberately no empty/placeholder state: if a section has no
// photo yet, the layout goes text-only instead of showing a frame.
export function Photo({
  src,
  alt,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  preload = false,
  caption,
  className = "",
}: PhotoProps) {
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden rounded-lg bg-bg-muted ${aspect}`}>
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
      </div>
      {caption && <figcaption className="mt-2 text-sm text-(--fg-muted)">{caption}</figcaption>}
    </figure>
  );
}
