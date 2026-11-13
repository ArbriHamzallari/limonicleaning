import Image from "next/image";
import Link from "next/link";

interface PhotoCardProps {
  href: string;
  src: string;
  alt: string;
  title: string;
  text?: string;
  sizes?: string;
}

// A real photo with a dark green caption bar under it; the whole card is one link.
// The caption bar is solid (no gradient over the photo), so text contrast never depends on
// what the photo shows.
export function PhotoCard({ href, src, alt, title, text, sizes }: PhotoCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-xl bg-primary text-text-on-dark on-dark focus-visible:outline-offset-4"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-primary-hover">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-300 ease-(--ease-out) group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col px-5 py-4">
        <span className="display text-2xl">{title}</span>
        {text && <span className="mt-1 text-base text-text-on-dark-muted">{text}</span>}
      </div>
    </Link>
  );
}
