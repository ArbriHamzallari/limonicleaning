import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { Checklist } from "@/components/Checklist";
import { FaqItem } from "@/components/FaqItem";
import { LeadForm } from "@/components/LeadForm";
import { Photo } from "@/components/Photo";
import { PortfolioVideo } from "@/components/PortfolioVideo";
import { Section } from "@/components/Section";
import { TextLink } from "@/components/TextLink";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { photos, videos, naturalAspect } from "@/lib/photos";
import { latestApartmentPhotos, latestApartmentVideos } from "@/lib/latest-project-media";
import { getService } from "@/lib/services";
import { JsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

const deepCleaning = getService("me-themel");

// Keep the current photography in place until the new phone files are converted and
// committed. The new images depict post-construction cleaning, and are captioned as such.
const heroPhoto = latestApartmentPhotos[0] ?? photos.windowsTeam;
const detailPhoto = latestApartmentPhotos[1] ?? photos.kitchen;
const detailVideo = latestApartmentVideos[0] ?? videos.teamBedroom;

const breadcrumbs = [
  { name: "Kryefaqja", path: "/" },
  { name: "Shërbimet", path: "/sherbime" },
  { name: "Pastrim me themel", path: "/pastrim-me-themel-tirane" },
];

const included = [
  {
    label: "Kuzhina",
    text: "Banakët, dollapët nga brenda sipas marrëveshjes, pajisjet dhe sipërfaqet e përdorimit të përditshëm.",
  },
  {
    label: "Banja",
    text: "Pllakat, lavamanët, dushi, tualeti, pasqyrat dhe zonat ku grumbullohen papastërtitë.",
  },
  {
    label: "Dhomat",
    text: "Dyshemetë, mobiliet, dyert, kornizat, bazamentet dhe këndet që nuk pastrohen çdo ditë.",
  },
  {
    label: "Xhamat dhe detajet",
    text: "Xhamat, kornizat, pragjet dhe pjesët e arritshme, sipas gjendjes së pronës.",
  },
];

const steps = [
  {
    title: "Na tregoni çfarë duhet pastruar",
    description: "Na dërgoni sipërfaqen, zonën dhe disa foto të ambientit.",
  },
  {
    title: "Merrni një ofertë të përshtatur",
    description: "Vlerësojmë gjendjen e pronës dhe ju propozojmë shërbimin dhe datën.",
  },
  {
    title: "Ekipi kryen pastrimin",
    description: "Pastrojmë ambientin me kujdes, deri te detajet e dakordësuara.",
  },
];

export function ResidentialDeepCleaningLanding() {
  return (
    <>
      <JsonLd data={serviceJsonLd(deepCleaning.h1, deepCleaning.intro, deepCleaning.path)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />

      <Section className="pt-7! sm:pt-10!">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-6 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <p className="mb-4 text-base font-bold uppercase tracking-wider text-primary">
              Pastrim profesional në Tiranë
            </p>
            <h1 className="max-w-2xl text-4xl leading-[1.14] font-extrabold tracking-tight sm:text-5xl">
              Pastrim me themel, deri në detaj.
            </h1>
            <p className="mt-5 max-w-xl text-xl text-text-muted">
              Ka vende që pastrimi i përditshëm nuk i arrin. Kujdesemi për
              kuzhinën, banjën, xhamat dhe papastërtitë e fshehura në apartamente,
              shtëpi e vila në Tiranë.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="#merrni-oferten" variant="secondary" size="lg">
                Merrni ofertën tuaj
              </Button>
              <WhatsAppButton service="me-themel" placement="deep_cleaning_hero" variant="outline" size="lg">
                Na shkruani në WhatsApp
              </WhatsAppButton>
            </div>
            <p className="mt-5 text-base text-text-muted">
              Na dërgoni disa foto ose sipërfaqen në m². Çmimi përcaktohet sipas gjendjes dhe përmasave të pronës.
            </p>
          </div>
          <Photo
            src={heroPhoto.src}
            alt={heroPhoto.alt}
            caption={heroPhoto.caption}
            aspect={naturalAspect(heroPhoto)}
            sizes="(min-width: 1024px) 44vw, 100vw"
            className="lg:col-span-6"
            priority
            bleed
          />
        </div>
      </Section>

      <Section tone="muted" className="py-7! sm:py-9!">
        <div className="grid gap-6 sm:grid-cols-3 sm:gap-10">
          <div>
            <p className="text-2xl font-extrabold text-primary">50+ prona</p>
            <p className="mt-1 text-base text-text-muted">të pastruara nga ekipi ynë</p>
          </div>
          <div className="border-t border-border pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
            <p className="text-xl font-bold text-primary">Mbi 10 vjet përvojë</p>
            <p className="mt-1 text-base text-text-muted">në punën e anëtarëve të ekipit</p>
          </div>
          <div className="border-t border-border pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
            <p className="text-xl font-bold text-primary">Pajisje profesionale</p>
            <p className="mt-1 text-base text-text-muted">për pastrimin me kujdes të sipërfaqeve të përshtatshme</p>
          </div>
        </div>
      </Section>

      <Section id="cfare-perfshin">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-base font-bold uppercase tracking-wider text-primary">Çfarë pastrojmë</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Më shumë se një pastrim i zakonshëm
            </h2>
            <p className="mt-5 text-text-muted">
              Nuk ndalemi vetëm te sipërfaqet që duken. Puna planifikohet
              sipas ambientit tuaj dhe përfshin edhe detajet që shpesh lihen pas dore.
            </p>
            <div className="mt-7">
              <Checklist items={[
                "Brenda dollapëve dhe sirtarëve, sipas gjendjes",
                "Prapa dhe poshtë mobilieve që mund të lëvizen në mënyrë të sigurt",
                "Kornizat, bazamentet dhe këndet",
                "Furra, frigoriferi dhe pajisjet e kuzhinës sipas kërkesës",
              ]} />
            </div>
            <p className="mt-5 text-base text-text-muted">
              Shtrirjen e saktë të punës e përcaktojmë përpara pastrimit.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {included.map((item) => (
              <div key={item.label} className="border-t-2 border-primary pt-5">
                <h3 className="text-xl font-bold">{item.label}</h3>
                <p className="mt-3 text-text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="muted" id="puna-jone">
        <div className="max-w-3xl">
          <p className="text-base font-bold uppercase tracking-wider text-primary">Puna jonë</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Shikoni ekipin në punë
          </h2>
          <p className="mt-4 text-text-muted">
            Pamje reale nga pastrime me themel dhe pas punimeve të kryera nga
            ekipi Limoni Cleaning. Materialet vijnë nga ambiente të ndryshme
            dhe tregojnë punën në proces, jo domosdoshmërisht rezultatin përfundimtar.
          </p>
        </div>
        <div className="mt-9 grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Photo
            src={detailPhoto.src}
            alt={detailPhoto.alt}
            caption={detailPhoto.caption}
            aspect={naturalAspect(detailPhoto)}
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
          />
          <Photo
            src={photos.steamFrame.src}
            alt={photos.steamFrame.alt}
            caption={photos.steamFrame.caption}
            aspect={naturalAspect(photos.steamFrame)}
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
          />
          <PortfolioVideo
            src={detailVideo.src}
            poster={detailVideo.poster}
            caption={detailVideo.caption}
            label={detailVideo.label}
            className="max-w-sm"
          />
        </div>
        <TextLink href="/puna-jone" className="mt-7 text-primary">
          Shikoni më shumë nga puna jonë
        </TextLink>
      </Section>

      <Section>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Si funksionon?</h2>
        <ol className="mt-9 grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-primary pt-5">
              <p className="text-xl font-bold">
                <span className="mr-3 text-primary">{index + 1}.</span>
                {step.title}
              </p>
              <p className="mt-3 text-text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="merrni-oferten" tone="warm" className="scroll-mt-20">
        <div className="grid gap-9 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-base font-bold uppercase tracking-wider text-primary">Merrni ofertën tuaj</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Sa kohë ka që shtëpia juaj nuk është pastruar me themel?
            </h2>
            <p className="mt-5 text-text-muted">
              Na tregoni sipërfaqen, zonën dhe çfarë ju shqetëson më shumë.
              Ekipi ynë ju kontakton për një ofertë të personalizuar.
            </p>
            <div className="mt-7">
              <WhatsAppButton service="me-themel" placement="deep_cleaning_form" variant="outline" size="lg">
                Dërgoni foto në WhatsApp
              </WhatsAppButton>
            </div>
          </div>
          <div className="lg:col-span-7">
            <LeadForm page="me-themel" placement="deep_cleaning_inline_form" />
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Pyetjet që na bëni më shpesh
        </h2>
        <div className="mt-7 max-w-3xl border-t border-border">
          {deepCleaning.faq.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
        <p className="mt-7 text-text-muted">
          Keni nevojë për pastrim pas ndërtimit?{" "}
          <TextLink href="/pastrim-pas-ndertimit-tirane" className="text-primary">
            Shikoni shërbimin për pastrim pas punimeve.
          </TextLink>
        </p>
      </Section>
    </>
  );
}
