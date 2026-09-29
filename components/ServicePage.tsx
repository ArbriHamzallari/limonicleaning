import type { ReactNode } from "react";
import Link from "next/link";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { Breadcrumbs } from "./Breadcrumbs";
import { LeadActions } from "./LeadActions";
import { LeadForm } from "./LeadForm";
import { Photo } from "./Photo";
import { FaqItem } from "./FaqItem";
import { ServiceCard } from "./ServiceCard";
import { CheckList } from "./icons";
import { getService, type ServiceSlug } from "@/lib/services";
import { JsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

interface ServicePageProps {
  slug: ServiceSlug;
  /** Extra section rendered after "Për kë është" (e.g. the Airbnb #pronare block). */
  children?: ReactNode;
}

// The one template behind every /pastrim-*-tirane page. Order: breadcrumbs, hero with the
// two lead actions, what's included, who it's for, real photos (only if any exist), FAQ,
// related services, then the form with this service preselected.
export function ServicePage({ slug, children }: ServicePageProps) {
  const service = getService(slug);
  const [hero, ...gallery] = service.images;
  const related = service.related.map(getService);
  const breadcrumbItems = [
    { name: "Kryefaqja", path: "/" },
    { name: "Shërbimet", path: "/sherbime" },
    { name: service.navLabel, path: service.path },
  ];

  return (
    <>
      <JsonLd data={serviceJsonLd(service.h1, service.intro, service.path)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      <Section className="pt-6 sm:pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <div className={hero ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-14" : "max-w-3xl"}>
          <div>
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">{service.h1}</h1>
            <p className="mt-4 text-xl text-text-muted">{service.intro}</p>
            <LeadActions service={slug} placement={`service_${slug}_hero`} className="mt-8" />
          </div>
          {hero && (
            <Photo
              src={hero.src}
              alt={hero.alt}
              aspect={hero.orientation === "portrait" ? "aspect-[4/5]" : "aspect-[4/3]"}
              className="mx-auto w-full max-w-md lg:max-w-none"
              preload
            />
          )}
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title="Çfarë përfshin" />
            <CheckList items={service.includes} />
            {service.includesNote && <p className="mt-6 text-text-muted">{service.includesNote}</p>}
          </div>
          <div>
            <SectionHeading title="Për kë është" />
            <CheckList items={service.goodFor} />
            <h3 className="mt-10 text-xl font-bold">{service.howWeWork.title}</h3>
            <p className="mt-3 text-text-muted">{service.howWeWork.text}</p>
          </div>
        </div>
      </Section>

      {children}

      {gallery.length > 0 && (
        <Section>
          <SectionHeading title="Nga puna jonë" intro="Foto reale nga pastrimet e ekipit." />
          <div className="grid gap-6 sm:grid-cols-2">
            {gallery.map((photo) => (
              <Photo
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                caption={photo.caption}
                aspect="aspect-[4/3]"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            ))}
          </div>
        </Section>
      )}

      <Section tone={gallery.length > 0 ? "muted" : "default"}>
        <SectionHeading title="Pyetje të shpeshta" />
        <div className="max-w-3xl space-y-3">
          {service.faq.map((entry) => (
            <FaqItem key={entry.question} question={entry.question} answer={entry.answer} />
          ))}
        </div>
      </Section>

      <Section tone={gallery.length > 0 ? "default" : "muted"}>
        <SectionHeading title="Shërbime të tjera" />
        <div className="grid gap-6 sm:grid-cols-2">
          {related.map((s) => (
            <ServiceCard
              key={s.slug}
              slug={s.slug}
              path={s.path}
              name={s.navLabel}
              summary={s.summary}
              image={s.images[0]}
            />
          ))}
        </div>
        <p className="mt-8">
          <Link
            href="/puna-jone"
            className="inline-flex min-h-12 items-center font-semibold text-primary underline decoration-2 underline-offset-4"
          >
            Shikoni foto dhe video nga puna jonë
          </Link>
        </p>
      </Section>

      <Section tone="warm" id="formulari">
        <SectionHeading title="Na lini numrin, ju kontaktojmë ne" intro="Pa detyrim. Ju telefonojmë ose ju shkruajmë për ofertën." />
        <div className="max-w-3xl">
          <LeadForm service={slug} placement={`service_${slug}_form`} />
        </div>
      </Section>
    </>
  );
}
