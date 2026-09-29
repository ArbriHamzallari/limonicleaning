import Link from "next/link";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { PortfolioVideo } from "@/components/PortfolioVideo";
import { LeadActions } from "@/components/LeadActions";
import { Photo } from "@/components/Photo";
import { JsonLd, breadcrumbJsonLd, videoJsonLd, pageMetadata } from "@/lib/seo";
import { beforeAfter } from "@/lib/photos";
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
          Të gjitha fotot dhe videot janë nga puna e ekipit, të bëra me celular gjatë pastrimeve. Nuk
          përdorim foto stoku.
        </p>
        <nav aria-label="Punët në këtë faqe" className="mt-6 flex flex-wrap gap-2">
          {portfolioProjects.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="inline-flex min-h-12 items-center rounded-full border-2 border-border px-4 text-base font-medium hover:border-primary hover:text-primary"
            >
              {p.title}
            </a>
          ))}
        </nav>
      </Section>

      {portfolioProjects.map((project, i) => (
        <Section key={project.id} id={project.id} tone={i % 2 === 0 ? "muted" : "default"} className="scroll-mt-20">
          <SectionHeading title={project.title} intro={project.text} />

          {project.beforeAfter && <BeforeAfterSlider {...beforeAfter} className="mb-8 max-w-3xl" />}

          {(project.photos.length > 0 || project.videos.length > 0) && (
            <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {project.photos.map((photo) => (
                <Photo
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  caption={photo.caption}
                  aspect={photo.orientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              ))}
              {project.videos.map((v) => (
                <PortfolioVideo key={v.src} src={v.src} poster={v.poster} caption={v.caption} className="max-w-xs" />
              ))}
            </div>
          )}

          <p className="mt-8">
            <Link
              href={serviceIndex[project.service].path}
              className="inline-flex min-h-12 items-center font-semibold text-primary underline decoration-2 underline-offset-4"
            >
              {`Më shumë për shërbimin: ${serviceIndex[project.service].navLabel}`}
            </Link>
          </p>
        </Section>
      ))}

      <Section tone="warm">
        <SectionHeading title="Ju pëlqen si punojmë?" intro="Na tregoni për pronën tuaj dhe ju japim ofertën." />
        <LeadActions placement="puna_jone_footer" />
      </Section>
    </>
  );
}
