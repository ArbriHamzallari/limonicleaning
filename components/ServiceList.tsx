import { Photo } from "./Photo";
import { TextLink } from "./TextLink";
import { cardImage, type Service } from "@/lib/services";
import { naturalAspect } from "@/lib/photos";

// /sherbime: an editorial list with hairline dividers instead of a grid of cards. Rows with a
// real photo alternate sides; rows without one stay text only.
export function ServiceList({ services }: { services: Service[] }) {
  const withPhoto = services.filter((s) => cardImage(s)).map((s) => s.slug);
  return (
    <ul className="border-t border-border">
      {services.map((s) => {
        const img = cardImage(s);
        const flip = withPhoto.indexOf(s.slug) % 2 === 1;
        return (
          <li key={s.slug} className="border-b border-border py-10">
            <div className={img ? "grid items-center gap-8 lg:grid-cols-12 lg:gap-14" : "max-w-2xl"}>
              <div className={img ? `lg:col-span-6 ${flip ? "lg:order-2" : ""}` : ""}>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{s.navLabel}</h2>
                <p className="mt-3 text-text-muted">{s.summary}</p>
                <TextLink href={s.path} className="mt-2 text-primary">
                  Shiko shërbimin
                </TextLink>
              </div>
              {img && (
                <Photo
                  src={img.src}
                  alt={img.alt}
                  aspect={img.ratio === "4/3" ? naturalAspect(img) : "aspect-[4/3]"}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="lg:col-span-6"
                  bleed
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
