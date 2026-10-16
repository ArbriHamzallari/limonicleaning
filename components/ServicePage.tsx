import { Section } from "./Section";
import { Breadcrumbs } from "./Breadcrumbs";
import { LeadActions } from "./LeadActions";
import { Photo } from "./Photo";
import { PortfolioVideo } from "./PortfolioVideo";
import { Closer } from "./Closer";
import { TextLink } from "./TextLink";
import { Checklist } from "./Checklist";
import { getService, pageLink, type ServicePageContent, type ServiceSection, type ServiceSlug } from "@/lib/services";
import { naturalAspect } from "@/lib/photos";
import { JsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

export function ServicePage({ slug }: { slug: ServiceSlug }) {
  return <ServicePageView page={getService(slug)} />;
}

// Fixed parts: breadcrumbs, hero, the page's own sections in its own order, a one-line
// "Mund t'ju interesojë edhe" row, and the closer (with FAQ only when there are 3+).
// Used by every service page and by /per-biznese (which sits outside "Shërbimet").
export function ServicePageView({ page }: { page: ServicePageContent }) {
  const breadcrumbItems = [
    { name: "Kryefaqja", path: "/" },
    ...(page.key === "biznese" ? [] : [{ name: "Shërbimet", path: "/sherbime" }]),
    { name: page.navLabel, path: page.path },
  ];
  const related = page.related.map(pageLink);
  const { hero, heroVideo } = page;
  const hasMedia = !!(hero || heroVideo);

  return (
    <>
      <JsonLd data={serviceJsonLd(page.h1, page.intro, page.path)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      <Section className="pt-6 sm:pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <div className={hasMedia ? "grid items-center gap-10 lg:grid-cols-12 lg:gap-14" : "max-w-3xl"}>
          <div className={hasMedia ? "lg:col-span-7" : ""}>
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">{page.h1}</h1>
            <p className="mt-5 max-w-xl text-xl text-text-muted">{page.intro}</p>
            <LeadActions service={page.key} label={page.ctaLabel} placement={`service_${page.key}_hero`} className="mt-8" />
          </div>
          {hero && (
            <Photo
              src={hero.src}
              alt={hero.alt}
              aspect={naturalAspect(hero)}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className={`lg:col-span-5 ${hero.ratio === "4/3" ? "" : "mx-auto w-full max-w-sm lg:max-w-none"}`}
              bleed={hero.ratio === "4/3"}
              priority
            />
          )}
          {!hero && heroVideo && (
            <PortfolioVideo
              src={heroVideo.src}
              poster={heroVideo.poster}
              caption={heroVideo.caption}
              label={heroVideo.label}
              className="mx-auto w-full max-w-xs lg:col-span-5"
            />
          )}
        </div>
      </Section>

      {page.sections.map((section, i) => (
        <SectionBlock key={`${section.kind}-${i}`} section={section} />
      ))}

      <Section className="py-8! sm:py-10!">
        <p className="flex flex-wrap items-center gap-x-6 text-lg">
          <span className="text-text-muted">Mund t&apos;ju interesojë edhe:</span>
          {related.map((link) => (
            <TextLink key={link.href} href={link.href} className="text-primary">
              {link.label}
            </TextLink>
          ))}
          <TextLink href="/puna-jone" className="text-primary">
            Puna jonë
          </TextLink>
        </p>
      </Section>

      <Closer
        service={page.key}
        placement={`service_${page.key}`}
        title={page.closer?.title}
        text={page.closer?.text}
        faq={page.faq.length >= 3 ? page.faq : undefined}
        faqTitle="Pyetje për këtë shërbim"
      />
    </>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{children}</h2>;
}

function SectionBlock({ section }: { section: ServiceSection }) {
  switch (section.kind) {
    case "checklist":
      return (
        <Section id={section.id}>
          <div className="max-w-4xl">
            <SectionTitle>{section.title}</SectionTitle>
            <div className="mt-6">
              <Checklist items={section.items} />
            </div>
            {section.note && <p className="mt-5 text-text-muted">{section.note}</p>}
          </div>
        </Section>
      );

    case "steps":
      return (
        <Section id={section.id}>
          <SectionTitle>{section.title}</SectionTitle>
          {section.intro && <p className="mt-4 max-w-2xl text-text-muted">{section.intro}</p>}
          <ol className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {section.steps.map((step, i) => (
              <li key={step.title} className="border-t-2 border-primary py-5">
                <p className="font-bold">
                  <span aria-hidden className="mr-2 text-primary">
                    {i + 1}
                  </span>
                  {step.title}
                </p>
                <p className="mt-2 text-text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Section>
      );

    case "photoStory": {
      const [main, ...rest] = section.photos;
      const small = main.lowRes;
      return (
        <Section id={section.id}>
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5 lg:pt-6">
              <SectionTitle>{section.title}</SectionTitle>
              <p className="mt-4 text-text-muted">{section.text}</p>
            </div>
            <div className={`grid items-start gap-6 lg:col-span-7 ${rest.length ? "sm:grid-cols-[3fr_2fr]" : ""}`}>
              <Photo
                src={main.src}
                alt={main.alt}
                caption={main.caption}
                aspect={naturalAspect(main)}
                sizes={small ? "320px" : "(min-width: 1024px) 35vw, 100vw"}
                className={small ? "max-w-xs" : ""}
                bleed={!small && !rest.length}
              />
              {rest.map((photo) => (
                <Photo
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  caption={photo.caption}
                  aspect={naturalAspect(photo)}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 100vw"
                  className="sm:mt-16"
                />
              ))}
            </div>
          </div>
        </Section>
      );
    }

    case "pair":
      return (
        <Section id={section.id}>
          <div className="max-w-2xl">
            <SectionTitle>{section.title}</SectionTitle>
            {section.text && <p className="mt-4 text-text-muted">{section.text}</p>}
          </div>
          <div className="mt-8 grid items-end gap-6 sm:grid-cols-[2fr_3fr]">
            {[section.left, section.right].map((photo) => (
              <Photo
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                caption={photo.caption}
                aspect={naturalAspect(photo)}
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            ))}
          </div>
        </Section>
      );

    case "text":
      return (
        <Section id={section.id} className="scroll-mt-20">
          <div className="max-w-2xl">
            <SectionTitle>{section.title}</SectionTitle>
            {section.paragraphs.map((p) => (
              <p key={p} className="mt-4 text-text-muted">
                {p}
              </p>
            ))}
            {section.link && (
              <TextLink href={section.link.href} className="mt-3 text-primary">
                {section.link.label}
              </TextLink>
            )}
          </div>
        </Section>
      );

    case "note":
      return (
        <Section id={section.id} className="py-6! sm:py-8!">
          <div className="max-w-3xl border-l-4 border-accent pl-5">
            <p className="text-xl font-semibold">{section.text}</p>
            {section.link && (
              <TextLink href={section.link.href} className="text-lg text-primary">
                {section.link.label}
              </TextLink>
            )}
          </div>
        </Section>
      );

    case "media": {
      const photos = section.photos ?? [];
      const clips = section.videos ?? [];
      return (
        <Section id={section.id} className={section.title ? "" : "pt-0! sm:pt-0!"}>
          {section.title && <SectionTitle>{section.title}</SectionTitle>}
          <div className={`grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 ${section.title ? "mt-8" : ""}`}>
            {photos.map((photo) => (
              <Photo
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                caption={photo.caption}
                aspect={naturalAspect(photo)}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className={photo.ratio === "9/16" ? "max-w-xs" : ""}
              />
            ))}
            {clips.map((clip) => (
              <PortfolioVideo
                key={clip.src}
                src={clip.src}
                poster={clip.poster}
                caption={clip.caption}
                label={clip.label}
                className="max-w-xs"
              />
            ))}
          </div>
        </Section>
      );
    }
  }
}
