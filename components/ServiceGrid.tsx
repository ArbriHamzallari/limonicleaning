import { ServiceCard } from "./ServiceCard";
import type { Service } from "@/lib/services";

// Services with a real photo get a two-column row of their own; the rest sit in a tighter
// text-only grid below, so a card without a photo never stretches next to one with.
export function ServiceGrid({ services, headingLevel }: { services: Service[]; headingLevel?: "h2" | "h3" }) {
  const withPhoto = services.filter((s) => s.images.length > 0);
  const textOnly = services.filter((s) => s.images.length === 0);
  const card = (s: Service) => (
    <ServiceCard
      key={s.slug}
      slug={s.slug}
      path={s.path}
      name={s.navLabel}
      summary={s.summary}
      image={s.images[0]}
      headingLevel={headingLevel}
    />
  );

  return (
    <div className="grid gap-6">
      {withPhoto.length > 0 && <div className="grid gap-6 sm:grid-cols-2">{withPhoto.map(card)}</div>}
      {textOnly.length > 0 && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{textOnly.map(card)}</div>}
    </div>
  );
}
