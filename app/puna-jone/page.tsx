import { TextLink } from "@/components/TextLink";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { PortfolioVideo } from "@/components/PortfolioVideo";
import { ContactActions } from "@/components/ContactActions";
import { Photo } from "@/components/Photo";
import { JsonLd, breadcrumbJsonLd, videoJsonLd, pageMetadata } from "@/lib/seo";
import { beforeAfter, naturalAspect } from "@/lib/photos";
import { portfolioProjects } from "@/lib/portfolio";
import { serviceIndex } from "@/lib/service-index";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Puna jonë", path: "/puna-jone" },
];

export const metadata = pageMetadata({
  title: "Puna Jonë: Foto Para dhe Pas Pastrimit",
  description:
    "Foto dhe video reale nga pastrimet e Limoni Cleaning në Tiranë: apartamente, pas ndërtimit, zyra dhe dhoma për mysafirë. Na lini numrin për ofertë.",
  path: "/puna-jone",
});

const allVideos = portfolioProjects.flatMap((p) => p.videos);

export default function PunaJonePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      {allVideos.map((v) => (
        <JsonLd
          key={v.src}
          data={videoJsonLd({
            name: v.name,
            description: v.description,
            thumbnailPath: v.poster,
            contentPath: v.src,
            uploadDate: v.uploadDate,
            durationSeconds: v.durationSeconds,
          })}
        />
      ))}

      <Section className="pt-6 sm:pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">
          Puna jonë: para dhe pas pastrimit
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-text-muted">
          Foto dhe video nga celulari i ekipit, gjatë pastrimeve në Tiranë.
        </p>
        <nav aria-label="Punët në këtë faqe" className="mt-6 flex flex-wrap gap-x-6">
          {portfolioProjects.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="inline-flex min-h-12 items-center text-lg font-medium underline decoration-border decoration-2 underline-offset-8 hover:text-primary hover:decoration-primary"
            >
              {p.title}
            </a>
          ))}
        </nav>
      </Section>

      {portfolioProjects.map((project, i) => (
        <Section key={project.id} id={project.id} className={`scroll-mt-20 ${i > 0 ? "border-t border-border" : ""}`}>
          <SectionHeading title={project.title} intro={project.text} />

          {project.beforeAfter && <BeforeAfterSlider {...beforeAfter} className="mb-8" bleed />}

          {(project.photos.length > 0 || project.videos.length > 0) && (
            <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {project.photos.map((photo) => (
                <Photo
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  caption={photo.caption}
                  aspect={naturalAspect(photo)}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              ))}
              {project.videos.map((v) => (
                <PortfolioVideo key={v.src} src={v.src} poster={v.poster} caption={v.caption} className="max-w-xs" />
              ))}
            </div>
          )}

          <TextLink href={serviceIndex[project.service].path} className="mt-6 text-primary">
            {`Më shumë për shërbimin: ${serviceIndex[project.service].navLabel}`}
          </TextLink>
        </Section>
      ))}

      <Section tone="muted">
        <SectionHeading title="Ju pëlqen si punojmë?" intro="Na tregoni për pronën tuaj dhe ju japim ofertën." />
        <ContactActions placement="puna_jone_footer" />
      </Section>
    </>
  );
}
