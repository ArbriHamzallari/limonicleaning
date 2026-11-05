import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuoteButton } from "@/components/QuoteButton";
import { FaqItem } from "@/components/FaqItem";
import { FounderVideo } from "@/components/FounderVideo";
import { LeadForm } from "@/components/LeadForm";
import { Photo } from "@/components/Photo";
import { PortfolioVideo } from "@/components/PortfolioVideo";
import { Section } from "@/components/Section";
import { TextLink } from "@/components/TextLink";
import { TrackView } from "@/components/TrackView";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PhoneButton } from "@/components/PhoneButton";
import { CheckIcon, MinusIcon } from "@/components/icons";
import { photos, videos, naturalAspect } from "@/lib/photos";
import { latestApartmentPhotos, latestApartmentVideos } from "@/lib/latest-project-media";
import { getService } from "@/lib/services";
import { deepCleanFaq } from "@/lib/content";
import { assessmentBenefit, assessmentBenefitText, assessmentRoutes, visitNote } from "@/lib/assessment";
import { DEEP_CLEAN_EXAMPLE_M2, DEEP_CLEAN_RATE_LEK, formatLek } from "@/lib/quote";
import { JsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

const deepCleaning = getService("me-themel");
const FORM_ID = "kerko-vleresim";

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

const exampleTotal = formatLek(DEEP_CLEAN_EXAMPLE_M2 * DEEP_CLEAN_RATE_LEK);

const included = [
  {
    label: "Kuzhina",
    text: "Banakët, dollapët nga brenda, furra, frigoriferi dhe sipërfaqet e përdorimit të përditshëm.",
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

const priceChanges = [
  "Gjendja e apartamentit dhe sa kohë ka që nuk është pastruar me themel",
  "Mbetjet pas punimeve: ky pastrim vlerësohet veçmas",
  "Sa divane dhe dyshekë ka, përmasat, materiali dhe gjendja e tyre",
  "Zona: për vendet jashtë Tiranës sqarojmë paraprakisht transportin",
];

const excluded = [
  "Larja dhe hekurosja e rrobave",
  "Largimi i mbetjeve të mëdha të ndërtimit dhe lyerja e mureve",
  "Rimbushja e produkteve të konsumit",
];

const preparation = [
  "Largoni nga sipërfaqet sendet personale dhe të vlefshme",
  "Na tregoni për sende të brishta, njolla të vjetra ose zona ku nuk duhet të prekim",
];

const h2 = "text-3xl font-extrabold tracking-tight sm:text-4xl";

function Bullet({ children, minus = false }: { children: React.ReactNode; minus?: boolean }) {
  return (
    <li className="flex gap-3">
      {minus ? (
        <MinusIcon className="mt-1 h-5 w-5 shrink-0 text-text-muted" />
      ) : (
        <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-primary" />
      )}
      <span>{children}</span>
    </li>
  );
}

export function ResidentialDeepCleaningLanding() {
  return (
    <>
      <JsonLd data={serviceJsonLd(deepCleaning.h1, deepCleaning.intro, deepCleaning.path)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <TrackView service="me-themel" />

      {/* Hero: outcome, honest starting price, the two actions. Nothing here needs the video. */}
      <Section className="pt-7! sm:pt-10!">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-6 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <h1 className="max-w-2xl text-4xl leading-[1.14] font-extrabold tracking-tight sm:text-5xl">
              Pastrim me themel në Tiranë, deri në detaj
            </h1>
            <p className="mt-5 max-w-xl text-xl text-text-muted">
              Kuzhina, banja, xhamat dhe vendet që pastrimi i përditshëm nuk i arrin. Për apartamente, në paketë
              përfshihet edhe larja e divanit dhe e të gjithë dyshekëve.
            </p>
            <div className="mt-6 max-w-xl border-l-4 border-accent pl-5">
              <p className="text-2xl font-extrabold tracking-tight">Apartamente: nga {DEEP_CLEAN_RATE_LEK} lekë të reja/m²</p>
              <p className="mt-1 text-text-muted">
                Për shembull, {DEEP_CLEAN_EXAMPLE_M2} m² × {DEEP_CLEAN_RATE_LEK} = {exampleTotal} lekë të reja. Është
                vlerësim orientues: totalin e konfirmojmë pas vlerësimit. Shtëpitë dhe vilat marrin ofertë pas
                vlerësimit.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <QuoteButton href="/kerko-oferte?sherbimi=me-themel" service="me-themel" placement="deep_cleaning_hero">
                Kërko vlerësim
              </QuoteButton>
              <WhatsAppButton service="me-themel" placement="deep_cleaning_hero" variant="outline" size="lg">
                Na shkruani në WhatsApp
              </WhatsAppButton>
            </div>
            <p className="mt-4 text-base text-text-muted">
              Fotot nuk janë të detyrueshme. Mund ta nisim me një telefonatë.
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

      {/* What's included, upholstery as part of the package (not a promotion). */}
      <Section id="cfare-perfshin">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 className={h2}>Çfarë përfshihet</h2>
            <p className="mt-5 text-text-muted">
              Puna planifikohet sipas pronës suaj dhe përfshin edhe detajet që shpesh lihen pas dore: brenda
              dollapëve, prapa dhe poshtë mobilieve që lëvizen në mënyrë të sigurt, kornizat dhe bazamentet.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {included.map((item) => (
              <div key={item.label} className="border-t-2 border-primary pt-5">
                <h3 className="text-xl font-bold">{item.label}</h3>
                <p className="mt-3 text-text-muted">{item.text}</p>
              </div>
            ))}
            <div className="rounded-lg bg-bg-warm p-5 sm:col-span-2">
              <h3 className="text-xl font-bold">Divani dhe dyshekët e apartamentit</h3>
              <p className="mt-3">
                Në pastrimin me themel të një apartamenti përfshihet larja e divanit dhe e të gjithë dyshekëve me
                makineri ekstraktimi. Gjatë vlerësimit shënojmë sa janë, përmasat, materialin dhe gjendjen, dhe në
                ofertën me shkrim shkruajmë saktë cilat përfshihen.
              </p>
              <p className="mt-3 text-text-muted">
                Pëlhura nuk thahet menjëherë: koha varet nga materiali dhe ajrimi. Nëse ju duhen po atë ditë, na e
                thoni që ta planifikojmë.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* How the price works: one worked example, what changes it, where it doesn't apply. */}
      <Section tone="warm" id="cmimi">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <h2 className={h2}>Si llogaritet çmimi</h2>
            <div className="mt-7 rounded-lg border border-border bg-bg p-6">
              <p className="text-text-muted">Shembull për një apartament</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {DEEP_CLEAN_EXAMPLE_M2} m² × {DEEP_CLEAN_RATE_LEK} = {exampleTotal} lekë të reja
              </p>
              <p className="mt-3 text-text-muted">
                Vlerësim orientues; totali konfirmohet pas vlerësimit. {exampleTotal} lekë të reja janë{" "}
                {formatLek(DEEP_CLEAN_EXAMPLE_M2 * DEEP_CLEAN_RATE_LEK * 10)} lekë të vjetra.
              </p>
            </div>
            <p className="mt-5 text-text-muted">
              Çmimi orientues vlen vetëm për pastrimin me themel të apartamenteve, ku jetohet ose që janë bosh.
              Shtëpitë, vilat, zyrat dhe shërbimet e tjera marrin ofertën e tyre pas vlerësimit.
            </p>
          </div>
          <div className="lg:col-span-6">
            <h3 className="text-2xl font-bold tracking-tight">Çfarë mund ta ndryshojë totalin</h3>
            <ul className="mt-5 space-y-3">
              {priceChanges.map((item) => (
                <Bullet key={item}>{item}</Bullet>
              ))}
            </ul>
            <p className="mt-6 text-text-muted">
              Totalin e konfirmuar e merrni me shkrim, me të gjitha kostot, përpara se të rezervoni. Nuk ka tarifa të
              papritura në ditën e pastrimit.
            </p>
            <p className="mt-4">
              Prona është pas punimeve?{" "}
              <TextLink href="/pastrim-pas-ndertimit-tirane" className="text-primary">
                Shikoni pastrimin pas ndërtimit
              </TextLink>
            </p>
          </div>
        </div>
      </Section>

      {/* The form comes right after scope and price, so phones reach it in a few screens. */}
      <Section id={FORM_ID} tone="warm">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-5">
            <h2 data-lead-form-anchor tabIndex={-1} className={`${h2} scroll-mt-20`}>
              Kërkoni vlerësim për pronën tuaj
            </h2>
            <p className="mt-4 text-text-muted">
              Për apartamente shihni menjëherë një vlerësim orientues. Pastaj ju kontaktojmë dhe ju dërgojmë planin dhe
              ofertën me shkrim, pa pagesë.
            </p>
          </div>
          <div className="lg:col-span-7 lg:row-span-2">
            <LeadForm page="me-themel" placement="deep_cleaning_inline_form" />
          </div>
          <div className="lg:col-span-5">
            <p className="text-text-muted">Preferoni të flisni direkt?</p>
            <div className="mt-3 flex flex-col gap-3">
              <WhatsAppButton service="me-themel" placement="deep_cleaning_form" variant="outline" size="lg">
                Na shkruani në WhatsApp
              </WhatsAppButton>
              <PhoneButton placement="deep_cleaning_form" variant="outline" size="lg" />
            </div>
          </div>
        </div>
      </Section>

      {/* Founder video: renders nothing until a real, captioned file is configured. */}
      <FounderVideo placement="deep_cleaning" className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8" />

      <Section id="puna-jone">
        <div className="max-w-3xl">
          <h2 className={h2}>Shikoni ekipin në punë</h2>
          <p className="mt-4 text-text-muted">
            Pamje reale nga punët e ekipit Limoni Cleaning: një pastrim me themel në një shtëpi me disa kate dhe pastrime
            pas punimeve. Tregojnë punën në proces, jo domosdoshmërisht rezultatin përfundimtar.
          </p>
        </div>
        <div className="mt-9 grid grid-cols-2 items-start gap-4 sm:gap-8 lg:grid-cols-3">
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
            className="col-span-2 mx-auto w-full max-w-60 sm:col-span-1 sm:max-w-sm"
          />
        </div>
        <TextLink href="/puna-jone" className="mt-7 text-primary">
          Shikoni më shumë nga puna jonë
        </TextLink>
      </Section>

      {/* The customer benefit for asking: a deliverable, prepared after the assessment. */}
      <Section tone="muted" id="vleresimi">
        <div className="max-w-3xl">
          <h2 className={h2}>{assessmentBenefit}</h2>
          <p className="mt-4 text-xl text-text-muted">{assessmentBenefitText}</p>
        </div>
        <div className="mt-9 grid gap-8 md:grid-cols-3">
          {assessmentRoutes.map((route) => (
            <div key={route.title} className="border-t-2 border-primary pt-5">
              <h3 className="text-xl font-bold">{route.title}</h3>
              <p className="mt-3 text-text-muted">{route.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-text-muted">{visitNote}</p>
        <p className="mt-3 max-w-3xl text-text-muted">
          Pastrimi rezervohet vetëm pasi të pranoni ofertën dhe të caktojmë bashkë datën. Ekipi sjell pajisjet dhe
          solucionet.
        </p>
      </Section>

      <Section tone="muted" id="para-pastrimit">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Çfarë nuk përfshihet</h2>
            <span className="sr-only">Këto nuk përfshihen:</span>
            <ul className="mt-5 space-y-3">
              {excluded.map((item) => (
                <Bullet key={item} minus>
                  {item}
                </Bullet>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Para pastrimit</h2>
            <ul className="mt-5 space-y-3">
              {preparation.map((item) => (
                <Bullet key={item}>{item}</Bullet>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className={h2}>Pyetjet që na bëni më shpesh</h2>
        <div className="mt-7 max-w-3xl border-t border-border">
          {deepCleanFaq.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
        <TextLink href="/faq" className="mt-5 text-primary">
          Të gjitha pyetjet
        </TextLink>
      </Section>
    </>
  );
}
