import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { PortfolioVideo } from "@/components/PortfolioVideo";
import { JsonLd, breadcrumbJsonLd, videoJsonLd, pageMetadata } from "@/lib/seo";
import { Button } from "@/components/Button";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { waMessages } from "@/lib/whatsapp-messages";
import { PortfolioGrid } from "./PortfolioGrid";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Puna jonë", path: "/puna-jone" }];

export const metadata = pageMetadata({
  title: "Puna Jonë — Para dhe Mbas Pastrimit",
  description:
    "Foto dhe video reale nga pastrimet tona për Airbnb, apartamente, vila dhe zyra në Tiranë, me krahasim para/mbas.",
  path: "/puna-jone",
});

const videos = [
  {
    src: "/videos/puna-jone-para-pastrimit.mp4",
    poster: "/images/puna-jone-para-pastrimit.jpg",
    caption: "Apartament — para fillimit të pastrimit",
    name: "Vizitë e apartamentit para fillimit të pastrimit",
    description: "Pamje reale nga celulari i ekipit, në apartamentin ku po nisim punën.",
    uploadDate: "2026-09-10",
    durationSeconds: 17.87,
  },
  {
    src: "/videos/puna-jone-vizite-apartamenti-1.mp4",
    poster: "/images/puna-jone-vizite-apartamenti-1.jpg",
    caption: "Apartament — pas pastrimit të plotë",
    name: "Vizitë e apartamentit pas pastrimit",
    description: "Pamje reale nga celulari i ekipit, në apartamentin e pastruar plotësisht.",
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
      <Section className="pt-14">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">Puna jonë</h1>
        <p className="mt-3 max-w-2xl text-lg text-text-muted">
          Një pastrim i mirë shihet në detaje, jo vetëm përshkruhet. Lëviz rrëshqitësin për të parë
          ndryshimin, dhe shiko video dhe foto reale nga punët tona më poshtë.
        </p>
      </Section>

      <Section>
        <BeforeAfterSlider
          beforeSrc="/images/pastrim-apartamenti-para.jpg"
          afterSrc="/images/pastrim-apartamenti-mbas.jpg"
          beforeAlt="Dhomë ndenjeje para pastrimit, me rrëmujë dhe mbeturina"
          afterAlt="E njëjta dhomë ndenjeje pas pastrimit nga Limoni Cleaning, e rregullt dhe e pastër"
          caption="Dhomë ndenjeje — para dhe mbas pastrimit"
          aspect="aspect-[4/3]"
          className="mx-auto max-w-2xl"
          priority
        />
      </Section>

      <Section tone="muted">
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Video nga puna jonë</h2>
          <p className="max-w-md text-text-muted">
            Pamje reale, të papërpunuara — direkt nga celulari i ekipit, jo material i xhiruar
            posaçërisht.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {videos.map((v) => (
            <PortfolioVideo key={v.src} src={v.src} poster={v.poster} caption={v.caption} />
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-16">
          <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Foto nga punët tona</h2>
          <div className="mt-8">
            <PortfolioGrid />
          </div>
        </div>
      </Section>

      <Section tone="warm">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">
            Ju pëlqeu puna jonë?
          </h2>
          <p className="max-w-xl text-text-muted">
            Na shkruani në WhatsApp për një ofertë, ose rezervoni pastrimin direkt nga faqja.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <WhatsAppLink
              message={waMessages.offer}
              source="puna_jone_final_cta"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Na shkruaj në WhatsApp
            </WhatsAppLink>
            <Button href="/rezervo" variant="outline">
              Rezervo pastrimin
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
