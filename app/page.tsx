import Link from "next/link";
import { Section } from "@/components/Section";
import { Photo } from "@/components/Photo";
import { PhotoCard } from "@/components/PhotoCard";
import { HeroReel } from "@/components/HeroReel";
import { RotatingWords } from "@/components/RotatingWords";
import { DisplayHeading } from "@/components/DisplayHeading";
import { QuoteButton } from "@/components/QuoteButton";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { FaqItem } from "@/components/FaqItem";
import { TextLink } from "@/components/TextLink";
import { CheckIcon } from "@/components/icons";
import { FounderVideo } from "@/components/FounderVideo";
import { BookingSection } from "@/components/booking/BookingSection";
import { faqArea, homeFaq, howItWorks } from "@/lib/content";
import { businessPath, serviceIndex } from "@/lib/service-index";
import { bookingCtaLabel } from "@/lib/nav";
import { business } from "@/lib/business";
import { photos, videos, beforeAfter, naturalAspect } from "@/lib/photos";
import { assessmentBenefit } from "@/lib/assessment";
import { DEEP_CLEAN_RATE_LEK, deepCleanExampleLine } from "@/lib/quote";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kompani pastrimi në Tiranë | Limoni Cleaning",
  absoluteTitle: true,
  description:
    "Pastrim për shtëpi, zyra dhe pallate në Tiranë dhe zonat përreth: pastrim me themel, pas ndërtimit, larje divanesh dhe pastrim i rregullt me kontratë. Kërkoni ofertë online ose në WhatsApp.",
  path: "/",
});

const h2 = "text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl";
const lead = "mt-4 max-w-[65ch] text-xl text-[var(--fg-muted)]";

// The service picker: two groups, each card a real photo from our work. Short names, not navLabels.
const pickerGroups = [
  {
    title: "Për shtëpinë",
    cards: [
      { key: "apartamente", title: "Pastrim i rregullt", text: "Çdo javë ose çdo muaj", photo: photos.livingKitchenAfter },
      { key: "me-themel", title: "Pastrim me themel", text: "Çdo cep, edhe brenda dollapëve", photo: photos.steamGrout },
      { key: "vila", title: "Vila", text: "Kate, dhoma dhe xhama të mëdhenj", photo: photos.villaSalon },
      { key: "pas-ndertimit", title: "Pas ndërtimit ose rinovimit", text: "Pluhuri, xhamat dhe kornizat pas punimeve", photo: photos.constructionGlass },
      { key: "divane", title: "Larje divanesh dhe dyshekësh", text: "Me makinë ekstraktimi, në vend", photo: photos.armchairExtraction },
    ],
  },
  {
    title: "Për biznesin",
    note: "Me kontratë për pastrim të rregullt.",
    cards: [
      { key: "zyra", title: "Zyra dhe dyqane", text: "Sipas orarit tuaj", photo: photos.officeRenovation },
      { key: "ambiente", title: "Ambientet e pallatit", text: "Shkallë, holle dhe hyrje", photo: photos.stairsTeam },
      { key: "hotele", title: "Hotele dhe apart-hotele", text: "Me staf shtesë sipas nevojës", photo: photos.guestRoom },
      { key: "airbnb", title: "Airbnb dhe qira ditore", text: "Pastrim pas çdo largimi", photo: photos.bedroom },
    ],
  },
] as const;

const reasons = [
  {
    title: "E shihni punën para se të vendosni",
    text: "Fotot dhe videot në faqe janë nga punët tona, jo foto stoku.",
  },
  {
    title: "Çmimi shpjegohet që në fillim",
    text: `Pastrimi me themel i apartamentit nis nga ${DEEP_CLEAN_RATE_LEK} lekë të reja/m², si vlerësim orientues. Për shërbimet e tjera, oferta vjen pas vlerësimit.`,
  },
  {
    title: "Divani dhe dyshekët përfshihen",
    text: "Në pastrimin me themel të apartamentit lajmë divanin dhe dyshekët. Në ofertë shkruhen të gjitha.",
  },
  {
    title: assessmentBenefit,
    text: "Mbi 50 prona të pastruara deri tani, nga një ekip me mbi 10 vjet përvojë.",
  },
];

// Hero heading: "Pastërti për ... tuaj", one place at a time (confirmed services only).
const heroPlaces = [
  "shtëpinë tuaj",
  "zyrën tuaj",
  "hotelin tuaj",
  "vilën tuaj",
  "dyqanin tuaj",
  "pallatin tuaj",
] as const;
const heroSentence = "Pastërti për shtëpinë, zyrën, hotelin, vilën, dyqanin dhe pallatin tuaj";

export default function Home() {
  return (
    <>
      {/* Hero: the work reel first on phones, beside the text on desktop */}
      <Section tone="dark" flush data-hero className="pb-12 sm:pt-14 sm:pb-16">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <HeroReel
            src={videos.workReel.src}
            poster={videos.workReel.poster}
            label={videos.workReel.label}
            className="-mx-4 sm:mx-0 sm:mt-0 sm:rounded-xl lg:order-last lg:col-span-5"
          />
          <div className="lg:col-span-7">
            <DisplayHeading as="h1" size="xl" onDark second={<RotatingWords words={heroPlaces} />}>
              <span className="sr-only">{heroSentence}. </span>
              <span aria-hidden>Pastërti për</span>
            </DisplayHeading>
            <p className="mt-6 max-w-[55ch] text-xl text-text-on-dark-muted">
              Pastrim për shtëpi, zyra dhe pallate në Tiranë dhe zonat përreth. Ekip me mbi 10 vjet përvojë.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <QuoteButton href="/kerko-oferte" placement="home_hero" jump>
                {bookingCtaLabel}
              </QuoteButton>
              <WhatsAppButton placement="home_hero" variant="outline" size="lg">
                Na shkruani në WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </Section>

      {/* Picker */}
      <Section>
        <h2 className={h2}>Çfarë ju duhet?</h2>
        <p className={lead}>
          Zgjidhni shërbimin. Në çdo faqe shihni çfarë përfshihet, foto nga puna dhe si llogaritet çmimi.
        </p>
        {pickerGroups.map((group) => (
          <div key={group.title} className="mt-12">
            <h3 className="text-2xl font-bold tracking-tight">{group.title}</h3>
            {"note" in group && <p className="mt-1 text-lg text-text-muted">{group.note}</p>}
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.cards.map((card) => (
                <li key={card.key}>
                  <PhotoCard
                    href={serviceIndex[card.key].path}
                    src={card.photo.src}
                    alt={card.photo.alt}
                    title={card.title}
                    text={card.text}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
        <TextLink href="/sherbime" className="mt-8 text-primary">
          Krahasoni të gjitha shërbimet
        </TextLink>
      </Section>

      {/* Why Limoni */}
      <Section tone="muted">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <h2 className={h2}>Pse Limoni</h2>
            <ul className="mt-8 space-y-7">
              {reasons.map((r) => (
                <li key={r.title} className="flex gap-4">
                  <CheckIcon className="mt-1.5 h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <p className="text-xl font-bold">{r.title}</p>
                    <p className="mt-1 max-w-[60ch] text-lg text-text-muted">{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Photo
            src={photos.showerTeam.src}
            alt={photos.showerTeam.alt}
            aspect={naturalAspect(photos.showerTeam)}
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none"
          />
        </div>
      </Section>

      {/* Proof: before and after */}
      <Section>
        <h2 className={h2}>Para dhe pas</h2>
        <p className={lead}>Pamje nga punët tona, pa filtra.</p>
        <BeforeAfterSlider {...beforeAfter} className="mt-8" bleed />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Photo
            src={photos.drainBefore.src}
            alt={photos.drainBefore.alt}
            caption="Sifoni i dushit para pastrimit"
            aspect={naturalAspect(photos.drainBefore)}
            sizes="(min-width: 640px) 50vw, 100vw"
          />
          <Photo
            src={photos.drainAfter.src}
            alt={photos.drainAfter.alt}
            caption="I njëjti sifon pas pastrimit"
            aspect={naturalAspect(photos.drainAfter)}
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        </div>
        <TextLink href="/puna-jone" className="mt-6 text-primary">
          Shikoni më shumë nga puna jonë
        </TextLink>
      </Section>

      {/* How it works (the "Si funksionon" nav item lands here) */}
      <Section tone="muted" id="si-funksionon" className="scroll-mt-20">
        <h2 className={h2}>Si funksionon</h2>
        <ol className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, i) => (
            <li key={step.title} className="border-t-2 border-primary py-5">
              <p className="text-xl font-bold">
                <span aria-hidden className="mr-2 text-primary">
                  {i + 1}
                </span>
                {step.title}
              </p>
              <p className="mt-2 text-lg text-text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* The one public price */}
      <Section tone="warm">
        <div className="max-w-3xl">
          <h2 className={h2}>
            Pastrim me themel apartamenti: nga {DEEP_CLEAN_RATE_LEK} lekë të reja/m²
          </h2>
          <p className="mt-4 text-xl">
            Vlerësim orientues. Për shembull, {deepCleanExampleLine}; totali konfirmohet pas vlerësimit. Larja e
            divanit dhe e të gjithë dyshekëve të apartamentit përfshihet.
          </p>
          <p className="mt-3 text-lg text-text-muted">
            Shtëpitë, vilat dhe shërbimet e tjera marrin ofertë pas vlerësimit.
          </p>
          <TextLink href={serviceIndex["me-themel"].path} className="mt-5 text-primary">
            Shikoni çfarë përfshihet
          </TextLink>
        </div>
      </Section>

      {/* Businesses */}
      <Section tone="dark">
        <div className="max-w-3xl">
          <DisplayHeading size="md" onDark>
            Jeni kompani?
          </DisplayHeading>
          <p className="mt-5 text-xl">
            Pastrim i rregullt me kontratë për zyra, dyqane, hotele dhe pallate. Punojmë çdo ditë të javës, edhe
            në fundjavë, sipas orarit tuaj.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <TextLink href={businessPath} className="text-accent">
              Pastrimi për biznese
            </TextLink>
            <a
              href={`tel:${business.phoneE164}`}
              className="inline-flex min-h-12 items-center text-lg font-semibold underline decoration-2 underline-offset-8"
            >
              Telefononi {business.phoneDisplay}
            </a>
          </div>
        </div>
      </Section>

      {/* Service area */}
      <Section>
        <div className="max-w-3xl">
          <h2 className={h2}>Ku punojmë</h2>
          <p className="mt-4 text-xl text-text-muted">{faqArea.answer}</p>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="muted">
        <div className="max-w-3xl">
          <h2 className={h2}>Pyetje të shpeshta</h2>
          <div className="mt-6 border-t border-border">
            {homeFaq.map((f) => (
              <FaqItem key={f.question} question={f.question} answer={f.answer} />
            ))}
          </div>
          <Link
            href="/faq"
            className="mt-6 inline-flex min-h-12 items-center text-lg font-semibold text-primary underline decoration-primary/40 decoration-2 underline-offset-8 hover:decoration-primary"
          >
            Të gjitha pyetjet
          </Link>
        </div>
      </Section>

      {/* Founder video: renders nothing until a real, captioned file is configured. */}
      <FounderVideo placement="home" className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8" />

      <BookingSection />
    </>
  );
}
