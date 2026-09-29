import Link from "next/link";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";
import { LeadActions } from "@/components/LeadActions";
import { LeadForm } from "@/components/LeadForm";
import { Photo } from "@/components/Photo";
import { ServiceGrid } from "@/components/ServiceGrid";
import { FaqItem } from "@/components/FaqItem";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { services } from "@/lib/services";
import { trustFacts, howItWorks, homeFaq } from "@/lib/content";
import { photos, beforeAfter } from "@/lib/photos";
import { prago } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kompani Pastrimi në Tiranë | Limoni Cleaning",
  absoluteTitle: true,
  description:
    "Kompani pastrimi në Tiranë për shtëpi, zyra, vila dhe Airbnb. Ekip me mbi 10 vjet eksperiencë. Na lini numrin ose na shkruani në WhatsApp për ofertë.",
  path: "/",
});

const workPhotos = [photos.windowsTeam, photos.kitchen, photos.bedroom, photos.guestRoom];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-8 pb-12 sm:pt-14 sm:pb-16" flush>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Pastrim profesional për shtëpi, zyra dhe Airbnb në Tiranë
            </h1>
            <p className="mt-5 max-w-xl text-xl text-text-muted">
              Ekip me mbi 10 vjet eksperiencë. Na lini numrin ose na shkruani në WhatsApp dhe ju
              japim ofertën.
            </p>
            <LeadActions placement="home_hero" className="mt-8" />
          </div>
          <div className="lg:col-span-5">
            <Photo
              src={photos.bedroom.src}
              alt={photos.bedroom.alt}
              aspect="aspect-[4/5]"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="mx-auto max-w-md lg:max-w-none"
              priority
            />
          </div>
        </div>
      </Section>

      {/* Trust row: four plain facts */}
      <section aria-label="Pse Limoni Cleaning" className="border-y border-border bg-bg-muted">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-3 px-4 py-6 font-semibold sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustFacts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </section>

      {/* Services */}
      <Section>
        <SectionHeading
          title="Shërbimet tona"
          intro="Zgjidhni llojin e pronës për të parë çfarë përfshin pastrimi."
        />
        <ServiceGrid services={services} />
      </Section>

      {/* Puna jonë */}
      <Section tone="muted">
        <SectionHeading title="Puna jonë" intro="Foto reale nga pastrimet e ekipit, jo foto stoku." />
        <BeforeAfterSlider {...beforeAfter} className="mx-auto max-w-3xl" />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {workPhotos.map((photo) => (
            <Photo
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              caption={photo.caption}
              aspect="aspect-square"
              sizes="(min-width: 1024px) 25vw, 50vw"
            />
          ))}
        </div>
        <Button href="/puna-jone" variant="outline" className="mt-10">
          Shiko më shumë foto
        </Button>
      </Section>

      {/* How it works */}
      <Section>
        <SectionHeading title="Si funksionon" />
        <ol className="grid max-w-4xl gap-4 sm:grid-cols-3">
          {howItWorks.map((step, i) => (
            <li key={step} className="rounded-lg border border-border p-5">
              <span className="sr-only">Hapi {i + 1}: </span>
              {step}
            </li>
          ))}
        </ol>
      </Section>

      {/* Airbnb, once */}
      <Section tone="dark">
        <div className="max-w-2xl">
          <SectionHeading
            title="Keni një Airbnb në Tiranë?"
            intro={`Pastrojmë dhe përgatisim pronën pas çdo check-out, për një ose disa prona. Jemi partner zyrtar i ${prago.name}, që merret me menaxhimin e pronave.`}
            className="mb-6"
          />
          <Button href="/pastrim-airbnb-tirane" variant="secondary">
            Pastrimi për Airbnb
          </Button>
        </div>
      </Section>

      {/* Form, then FAQ */}
      <Section tone="warm" id="formulari">
        <SectionHeading
          title="Na lini numrin, ju kontaktojmë ne"
          intro="Pa detyrim. Ju telefonojmë ose ju shkruajmë për ofertën."
        />
        <div className="max-w-3xl">
          <LeadForm placement="home_form" />
        </div>
      </Section>

      <Section>
        <SectionHeading title="Pyetje të shpeshta" />
        <div className="max-w-3xl space-y-3">
          {homeFaq.map((entry) => (
            <FaqItem key={entry.question} question={entry.question} answer={entry.answer} />
          ))}
        </div>
        <p className="mt-6">
          <Link href="/faq" className="inline-flex min-h-12 items-center font-semibold text-primary underline decoration-2 underline-offset-4">
            Të gjitha pyetjet
          </Link>
        </p>
      </Section>
    </>
  );
}
