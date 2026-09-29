import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import type { ServiceSlug } from "@/lib/service-index";

interface ServiceCardProps {
  slug: ServiceSlug;
  path: string;
  name: string;
  summary: string;
  image?: { src: string; alt: string };
  headingLevel?: "h2" | "h3";
}

// Photo (when a real one exists for this service), name, one sentence, and two ways in.
// No price line.
export function ServiceCard({ slug, path, name, summary, image, headingLevel = "h3" }: ServiceCardProps) {
  const Heading = headingLevel;
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-bg">
      {image && (
        <div className="relative aspect-[3/2] bg-bg-muted">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Heading className="text-xl font-bold text-text">
          <Link href={path} className="hover:text-primary">
            {name}
          </Link>
        </Heading>
        <p className="mt-2 text-text-muted">{summary}</p>
        <div className="mt-auto flex items-center gap-3 pt-5">
          <Button href={path} variant="outline" aria-label={`Më shumë për ${name.toLowerCase()}`}>
            Më shumë
          </Button>
          <WhatsAppButton service={slug} placement="service_card" variant="outline" iconOnly>
            {`Na shkruani në WhatsApp për ${name.toLowerCase()}`}
          </WhatsAppButton>
        </div>
      </div>
    </article>
  );
}
