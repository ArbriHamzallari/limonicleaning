import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { PortfolioVideo } from "@/components/PortfolioVideo";
import { JsonLd, breadcrumbJsonLd, videoJsonLd, pageMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/SectionHeading";
import { LeadActions } from "@/components/LeadActions";
import { Photo } from "@/components/Photo";
import { photos, beforeAfter } from "@/lib/photos";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Puna jonë", path: "/puna-jone" }];

export const metadata = pageMetadata({
  title: "Puna Jonë: Foto Para dhe Pas Pastrimit",
  description:
    "Foto dhe video reale nga pastrimet e Limoni Cleaning në apartamente në Tiranë, me krahasim para dhe pas. Na lini numrin ose na shkruani në WhatsApp.",
  path: "/puna-jone",
});

const videos = [
  {
    src: "/videos/puna-jone-para-pastrimit.mp4",
    poster: "/images/puna-jone-para-pastrimit.jpg",
    caption: "Apartament, para fillimit të pastrimit",
    name: "Vizitë e apartamentit para fillimit të pastrimit",
    description: "Pamje reale nga celulari i ekipit, në apartamentin ku po nisim punën.",
    uploadDate: "2026-09-10",
    durationSeconds: 17.87,
  },
  {
    src: "/videos/puna-jone-vizite-apartamenti-1.mp4",
    poster: "/images/puna-jone-vizite-apartamenti-1.jpg",
    caption: "Apartament pas pastrimit",
    name: "Vizitë e apartamentit pas pastrimit",
    description: "Pamje reale nga celulari i ekipit, në apartamentin pas pastrimit.",
    uploadDate: "2026-09-11",
    durationSeconds: 25.97,
  },
  {
    src: "/videos/puna-jone-vizite-apartamenti-2.mp4",
    poster: "/images/puna-jone-vizite-apartamenti-2.jpg",
    caption: "Apartament që mirëmbajmë rregullisht",
    name: "Vizitë e një apartamenti që Limoni Cleaning mirëmban rregullisht",
    description: "Pamje reale nga celulari i ekipit, në një nga pronat që mirëmbajmë me vizita periodike.",
    uploadDate: "2026-09-11",
    durationSeconds: 34.57,
  },
];

const gallery = [photos.kitchen, photos.bedroom, photos.livingRoomClean, photos.hallwayClean];

export default function PunaJonePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      {videos.map((v) => (
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
          Foto dhe video reale nga celulari i ekipit. Lëvizni vijën mbi foto për të parë dhomën para
          dhe pas pastrimit.
        </p>
        <BeforeAfterSlider {...beforeAfter} className="mt-10 max-w-3xl" />
      </Section>

      <Section tone="muted">
        <SectionHeading title="Foto nga pastrimet" />
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

      <Section>
        <SectionHeading
          title="Video nga puna jonë"
          intro="Pamje të papërpunuara, direkt nga celulari i ekipit. Videot ngarkohen vetëm kur i hapni."
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {videos.map((v) => (
            <PortfolioVideo key={v.src} src={v.src} poster={v.poster} caption={v.caption} />
          ))}
        </div>
      </Section>

      <Section tone="warm">
        <SectionHeading title="Ju pëlqen si punojmë?" intro="Na tregoni për pronën tuaj dhe ju japim ofertën." />
        <LeadActions placement="puna_jone_footer" />
      </Section>
    </>
  );
}
