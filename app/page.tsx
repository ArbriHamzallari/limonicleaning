import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { MediaFrame } from "@/components/MediaFrame";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { PortfolioVideo } from "@/components/PortfolioVideo";
import { services, homeStats } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { waMessages } from "@/lib/whatsapp-messages";
import { prago } from "@/lib/business";

export const metadata = pageMetadata({
  title: "Shërbime Pastrimi në Tiranë",
  description:
    "Pastrime profesionale për Airbnb, apartamente dhe ambiente biznesi në Tiranë. 50+ prona të pastruara dhe ekip me mbi 10 vjet eksperiencë të kombinuar.",
  path: "/",
});

const airbnbProcess = [
  {
    step: "01",
    title: "Pastrimi",
    description: "Dhoma, banjo, kuzhinë, sipërfaqe dhe dysheme, sipas gjendjes së pronës.",
  },
  {
    step: "02",
    title: "Përgatitja",
    description: "Ndërrimi i çarçafëve kur janë në dispozicion dhe organizimi i apartamentit.",
  },
  {
    step: "03",
    title: "Kontrolli final",
    description: "Një kontroll i fundit përpara se prona të jetë gati për mysafirin tjetër.",
  },
];

const recurringPoints = [
  { title: "Proces i qartë", description: "Çdo pastrim kryhet sipas një liste pune." },
  {
    title: "Organizim sipas kalendarit",
    description: "Pastrimi planifikohet rreth hyrjeve dhe daljeve të mysafirëve.",
  },
  {
    title: "Ekip i koordinuar",
    description: "Kur ka ndryshime ose mungesa, organizojmë mbulimin e shërbimit.",
  },
  {
    title: "Raportim",
    description: "Fotot mund t'ju ndihmojnë të kontrolloni gjendjen e pronës pas pastrimit.",
  },
];

const howItWorks = [
  { step: "01", title: "Na kontaktoni", description: "Na tregoni llojin e pronës dhe shërbimin që ju nevojitet." },
  { step: "02", title: "Përcaktojmë shërbimin", description: "Ju japim informacionin dhe ofertën sipas pronës suaj." },
  { step: "03", title: "Organizojmë pastrimin", description: "Vendosim orarin dhe kujdesemi për realizimin e shërbimit." },
  { step: "04", title: "Prona është gati", description: "Ambient i pastër dhe i përgatitur për përdorimin e radhës." },
];

const otherServices = services.filter((s) => s.slug !== "pastrim-airbnb");
const airbnbService = services.find((s) => s.slug === "pastrim-airbnb")!;

const homepagePhotos = [
  { src: "/images/apartament-i-pastruar-dhoma-ndenje-tirane-2.jpg", label: "Dhomë ndenjeje e pastruar" },
  { src: "/images/ekipi-pastrim-kuzhine-tirane.jpg", label: "Pastrim kuzhine" },
  { src: "/images/ekipi-shtrim-shtrati-tirane.jpg", label: "Përgatitje shtrati" },
  { src: "/images/apartament-i-pastruar-dhoma-ndenje-tirane.jpg", label: "Apartament i gatshëm" },
];

export default function Home() {
  return (
    <>
      {/* Hero — real portfolio photography, not stock. Asymmetric 7/5 split. */}
      <Section flush className="pt-10 pb-14 sm:pt-16 sm:pb-20">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="font-display text-lg italic text-primary/80">Pastrime profesionale në Tiranë</p>
            <h1 className="mt-2 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-text sm:text-6xl lg:text-7xl">
              Apartamenti juaj, gati për mysafirin tjetër.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-text-muted">
              Pastrojmë Airbnb, apartamente dhe ambiente biznesi me një proces të qartë dhe ekip
              që kujdeset për çdo detaj.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppLink
                message={waMessages.offer}
                source="hero"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Kërko ofertë në WhatsApp
              </WhatsAppLink>
              <Button href="/puna-jone" variant="outline">
                Shiko punën tonë
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-6">
              {homeStats.map((stat) => (
                <span key={stat} className="text-sm font-medium text-text">
                  {stat}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <MediaFrame
              label="Foto — ekipi në punë"
              src="/images/ekipi-shtrim-shtrati-tirane.jpg"
              alt="Punonjëse e Limoni Cleaning duke përgatitur shtratin gjatë një pastrimi turnover në Tiranë"
              aspect="aspect-[4/5]"
              priority
            />
          </div>
        </div>
      </Section>

      {/* Airbnb problem / value — the dominant commercial story, large photo + text. */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="font-display text-lg italic text-primary/80">Specializimi ynë</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              Kur ke një Airbnb, pastrimi nuk mund të lihet në dorë të rastësisë.
            </h2>
            <p className="mt-4 text-lg text-text-muted">
              Check-out sot. Mysafir i ri pas pak orësh. Apartamenti duhet të jetë gati.
            </p>
            <p className="mt-3 text-text-muted">
              Limoni Cleaning merret me pastrimin dhe përgatitjen e pronës për qëndrimin e radhës.
            </p>

            <ol className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-3 sm:gap-4">
              {airbnbProcess.map((item) => (
                <li key={item.step}>
                  <span className="font-display text-xl italic text-primary/50">{item.step}</span>
                  <h3 className="mt-1.5 font-semibold text-text">{item.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{item.description}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <Link
                href="/pastrim-airbnb-tirane"
                className="text-sm font-semibold text-primary underline decoration-primary/30 decoration-2 underline-offset-4 hover:decoration-primary"
              >
                Shiko pastrimin Airbnb →
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <MediaFrame
              label="Foto — pronë Airbnb e përgatitur"
              src="/images/apartament-i-pastruar-dhoma-ndenje-tirane.jpg"
              alt="Dhomë ndenjeje e pastruar dhe e përgatitur për mysafirin tjetër të Airbnb-së"
              aspect="aspect-[4/5]"
            />
          </div>
        </div>
      </Section>

      {/* Real work proof — the strongest trust mechanism on the site: before/after, real
          video, and a small photo selection. The full archive lives on /puna-jone. */}
      <Section tone="muted">
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">
            Puna jonë shihet më mirë sesa përshkruhet.
          </h2>
          <p className="max-w-md text-text-muted">Shikoni disa nga pastrimet dhe pronat ku kemi punuar.</p>
        </div>

        <BeforeAfterSlider
          beforeSrc="/images/pastrim-apartamenti-para.jpg"
          afterSrc="/images/pastrim-apartamenti-mbas.jpg"
          beforeAlt="Dhomë ndenjeje para pastrimit, me rrëmujë dhe mbeturina"
          afterAlt="E njëjta dhomë ndenjeje pas pastrimit nga Limoni Cleaning, e rregullt dhe e pastër"
          caption="Dhomë ndenjeje — para dhe mbas pastrimit"
          aspect="aspect-[4/3]"
          className="mx-auto max-w-2xl"
        />

        <div className="mt-16 border-t border-border pt-16">
          <h3 className="font-display text-xl font-semibold text-text sm:text-2xl">Video nga puna jonë</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:max-w-xl">
            <PortfolioVideo
              src="/videos/puna-jone-para-pastrimit.mp4"
              poster="/images/puna-jone-para-pastrimit.jpg"
              caption="Apartament — para fillimit të pastrimit"
            />
            <PortfolioVideo
              src="/videos/puna-jone-vizite-apartamenti-1.mp4"
              poster="/images/puna-jone-vizite-apartamenti-1.jpg"
              caption="Apartament — pas pastrimit të plotë"
            />
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-16">
          <h3 className="font-display text-xl font-semibold text-text sm:text-2xl">Foto nga punët tona</h3>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {homepagePhotos.map((photo) => (
              <MediaFrame key={photo.src} label={photo.label} src={photo.src} alt={photo.label} aspect="aspect-square" />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Button href="/puna-jone" variant="outline">
            Shiko të gjitha →
          </Button>
        </div>
      </Section>

      {/* Recurring Airbnb operation — the message an owner needs to hear: this isn't a
          one-off cleaner, it's a repeatable arrangement. Kept operational, not promissory. */}
      <Section tone="dark">
        <div className="max-w-2xl">
          <p className="font-display text-lg italic text-accent">Për pronarë me pastrime të përsëritura</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Një partner për pastrimin e pronës suaj.
          </h2>
          <p className="mt-4 text-text-on-dark-muted">
            Na tregoni kalendarin e rezervimeve dhe shohim bashkë si të organizojmë pastrimet sipas
            nevojave të pronës suaj.
          </p>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-6 divide-y divide-white/15 border-t border-white/15 pt-8 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
          {recurringPoints.map((point) => (
            <div key={point.title} className="pt-6 first:pt-0 sm:pt-0 sm:px-6 sm:first:pl-0">
              <h3 className="font-semibold text-text-on-dark">{point.title}</h3>
              <p className="mt-1.5 text-sm text-text-on-dark-muted">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/pronare-airbnb"
            className="text-sm font-semibold text-accent underline decoration-accent/40 decoration-2 underline-offset-4 hover:decoration-accent"
          >
            Menaxhoni disa prona? Shiko faqen për pronarë Airbnb →
          </Link>
        </div>
      </Section>

      {/* Services — Airbnb as a dominant feature block, the rest as smaller, accessible
          links rather than six equal cards. */}
      <Section>
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">
            Pastrim për shtëpi, prona turistike dhe biznese.
          </h2>
        </div>

        <Link href={airbnbService.path} className="group grid items-center gap-8 border-b border-border pb-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="font-display text-sm italic text-primary/60">Shërbimi kryesor</span>
            <h3 className="mt-1 font-display text-2xl font-semibold text-text group-hover:text-primary sm:text-3xl">
              {airbnbService.name}
            </h3>
            <p className="mt-2 max-w-md text-text-muted">
              Pastrimi dhe përgatitja e apartamentit për mysafirin tjetër.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-primary">Mëso më shumë →</span>
          </div>
          <div className="lg:col-span-5">
            <MediaFrame
              label={`Foto — ${airbnbService.name}`}
              src={airbnbService.image}
              alt={`${airbnbService.name} — Limoni Cleaning, Tiranë`}
              aspect="aspect-[16/9]"
              className="transition-opacity group-hover:opacity-90"
            />
          </div>
        </Link>

        <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {otherServices.map((service) => (
            <Link key={service.slug} href={service.path} className="group block">
              <h3 className="font-semibold text-text group-hover:text-primary">{service.name}</h3>
              <p className="mt-1.5 text-sm text-text-muted">{service.shortDescription}</p>
              <p className="mt-3 text-sm font-semibold text-primary">{service.priceNote}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Button href="/sherbime" variant="outline">
            Shiko të gjitha shërbimet
          </Button>
        </div>
      </Section>

      {/* Limoni + Prago relationship — one intentional section, two clearly separate
          companies, not scattered "official partner" mentions. */}
      <Section tone="warm">
        <Card className="mx-auto max-w-2xl bg-bg text-center">
          <p className="font-display text-sm italic text-text-muted">Menaxhon një Airbnb?</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-text sm:text-3xl">
            Limoni dhe Prago — dy shërbime të ndara
          </h2>
          <p className="mt-4 text-text-muted">
            Limoni Cleaning merret me pastrimin dhe përgatitjen e pronës. Prago Albania merret me
            menaxhimin e Airbnb. Dy shërbime të ndara, për një proces më të thjeshtë për pronarin.
          </p>
          <a
            href={prago.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
          >
            Shiko Prago Albania →
          </a>
        </Card>
      </Section>

      {/* How it works — a connected sequence, not identical boxed cards. */}
      <Section id="si-funksionon" tone="muted">
        <div className="mb-12 flex flex-col gap-2">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">Si funksionon</h2>
        </div>
        <ol className="grid gap-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {howItWorks.map((item) => (
            <li key={item.step}>
              <span className="font-display text-2xl italic text-primary/50">{item.step}</span>
              <h3 className="mt-2 font-semibold text-text">{item.title}</h3>
              <p className="mt-1.5 text-sm text-text-muted">{item.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="warm">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">
            Gati për një ambient më të pastër?
          </h2>
          <p className="max-w-xl text-text-muted">
            Na shkruani në WhatsApp dhe na tregoni çfarë pastrimi ju nevojitet. Për Airbnb, na
            dërgoni disa informacione për pronat dhe ju kontaktojmë për ofertën.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <WhatsAppLink
              message={waMessages.offer}
              source="home_final_cta"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Na kontaktoni në WhatsApp
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
