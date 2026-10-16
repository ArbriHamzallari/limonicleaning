import Link from "next/link";
import { Section } from "@/components/Section";
import { LeadActions } from "@/components/LeadActions";
import { Photo } from "@/components/Photo";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { WorkLoop } from "@/components/WorkLoop";
import { Closer } from "@/components/Closer";
import { TextLink } from "@/components/TextLink";
import { CheckList } from "@/components/icons";
import { trustFacts, homeFaq, quoteSteps, priceFactors } from "@/lib/content";
import { businessPath, serviceIndex } from "@/lib/service-index";
import { businessCtaLabel } from "@/lib/nav";
import { photos, videos, beforeAfter, naturalAspect } from "@/lib/photos";
import { waQuoteTemplate } from "@/lib/whatsapp-messages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kompani pastrimi në Tiranë | Limoni Cleaning",
  absoluteTitle: true,
  description:
    "Pastrim me themel, pastrim gjeneral dhe mirëmbajtje e rregullt për biznese dhe shtëpi në Tiranë. Na shkruani në WhatsApp për të marrë ofertën tuaj.",
  path: "/",
});

const h2 = "text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl";

// The two doors: homes and businesses. Labels are the reviewed short names, not navLabels.
const doors = [
  {
    title: "Për shtëpinë",
    text: "Apartamente, shtëpi dhe vila, një herë ose rregullisht.",
    links: [
      { label: "Pastrim gjeneral", href: serviceIndex.apartamente.path },
      { label: "Pastrim me themel", href: serviceIndex["me-themel"].path },
      { label: "Vila", href: serviceIndex.vila.path },
      { label: "Pastrim pas rinovimit", href: serviceIndex["pas-ndertimit"].path },
      { label: "Larje divanesh dhe dyshekësh", href: serviceIndex.divane.path },
      { label: "Airbnb", href: serviceIndex.airbnb.path },
    ],
  },
  {
    title: "Për biznesin",
    text: "Zyra, dyqane, hotele dhe pallate, me plan sipas orarit tuaj.",
    links: [
      { label: "Zyra", href: serviceIndex.zyra.path },
      { label: "Ambientet e pallateve", href: serviceIndex.ambiente.path },
      { label: "Hotele", href: serviceIndex.hotele.path },
      { label: "Mirëmbajtje e rregullt", href: businessPath },
    ],
  },
];

const gallery = [
  { photo: photos.constructionBefore, caption: "Apartament i ri para pastrimit pas punimeve" },
  { photo: photos.kitchen, caption: "Pastrimi i kuzhinës" },
  { photo: photos.villaSalon, caption: "Salloni i një vile pas pastrimit" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Section flush className="pt-8 pb-12 sm:pt-14 sm:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Pastrim profesional për biznese dhe shtëpi në Tiranë
            </h1>
            <p className="mt-6 max-w-xl text-xl text-text-muted">
              Pastrim me themel, pastrim gjeneral dhe mirëmbajtje e rregullt. Anëtarët e ekipit kanë mbi 10
              vjet përvojë në pastrim.
            </p>
            <LeadActions placement="home_hero" className="mt-8" />
            <TextLink href="/puna-jone" className="mt-3 text-primary">
              Shikoni punën tonë
            </TextLink>
          </div>
          <Photo
            src={photos.windowsTeam.src}
            alt={photos.windowsTeam.alt}
            aspect={naturalAspect(photos.windowsTeam)}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="lg:col-span-7"
            bleed
            priority
          />
        </div>
      </Section>

      {/* Three plain facts */}
      <section aria-label="Pse Limoni Cleaning" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ul className="grid border-y border-border text-lg font-semibold sm:grid-cols-3 sm:divide-x sm:divide-border">
          {trustFacts.map((fact) => (
            <li key={fact} className="border-b border-border py-4 last:border-b-0 sm:border-b-0 sm:px-6 sm:first:pl-0">
              {fact}
            </li>
          ))}
        </ul>
      </section>

      {/* Two doors: homes and businesses */}
      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:gap-14">
          {doors.map((door) => (
            <div key={door.title}>
              <h2 className={h2}>{door.title}</h2>
              <p className="mt-3 text-lg text-text-muted">{door.text}</p>
              <ul className="mt-6 border-t border-border">
                {door.links.map((link) => (
                  <li key={link.href} className="border-b border-border">
                    <Link
                      href={link.href}
                      className="flex min-h-14 items-center text-xl font-semibold underline decoration-border decoration-2 underline-offset-8 hover:text-primary hover:decoration-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <TextLink href="/sherbime" className="mt-6 text-primary">
          Shikoni të gjitha shërbimet
        </TextLink>
      </Section>

      {/* Businesses: the one dark section */}
      <Section tone="dark">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Photo
            src={photos.stairsTeam.src}
            alt={photos.stairsTeam.alt}
            aspect={naturalAspect(photos.stairsTeam)}
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none"
          />
          <div className="lg:col-span-7">
            <h2 className={h2}>Zyra, dyqane dhe pallate: pastrim sipas orarit tuaj</h2>
            <p className="mt-5 text-xl">
              Vijmë para hapjes, pas mbylljes ose në ditët që zgjidhni. Për ambientet më të mëdha, vijmë
              fillimisht për një vizitë pa pagesë dhe ju dërgojmë ofertën me shkrim.
            </p>
            <CheckList
              items={[
                "Një herë ose çdo javë / çdo muaj",
                "Përpiqemi të dërgojmë të njëjtin ekip sa herë që është e mundur",
                "Ofertë sipas ambientit tuaj",
              ]}
              iconClassName="text-accent"
              className="mt-6 text-lg"
            />
            <LeadActions service="biznese" label={businessCtaLabel} placement="home_business" className="mt-8" />
            <TextLink href={businessPath} className="mt-3 text-accent">
              Pastrimi për biznese
            </TextLink>
          </div>
        </div>
      </Section>

      {/* Before/after, the widest element on the page, then real photos */}
      <Section tone="muted">
        <h2 className={h2}>Shikoni ndryshimin para dhe pas</h2>
        <BeforeAfterSlider {...beforeAfter} className="mt-8" bleed />
        <div className="mt-10 grid items-start gap-6 sm:grid-cols-[2fr_3fr]">
          <Photo
            src={gallery[0].photo.src}
            alt={gallery[0].photo.alt}
            caption={gallery[0].caption}
            aspect={naturalAspect(gallery[0].photo)}
            sizes="(min-width: 640px) 40vw, 100vw"
          />
          <div className="grid gap-6">
            {gallery.slice(1).map(({ photo, caption }) => (
              <Photo
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                caption={caption}
                aspect={photo.ratio === "4/3" ? naturalAspect(photo) : "aspect-[4/3]"}
                sizes="(min-width: 640px) 55vw, 100vw"
              />
            ))}
          </div>
        </div>
        <TextLink href="/puna-jone" className="mt-6 text-primary">
          Shikoni më shumë foto
        </TextLink>
      </Section>

      {/* Ekipi në punë: the one moving image (same muted block continues) */}
      <Section tone="muted" className="pt-0!">
        <div className="grid items-center gap-10 border-t border-border pt-14 sm:pt-20 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <h2 className={h2}>Ekipi në punë</h2>
            <p className="mt-5 max-w-xl text-xl text-text-muted">
              Larja e një divani me makineri ekstraktimi në shtëpinë e klientit. Pamje reale nga puna jonë.
            </p>
            <TextLink href="/rreth-nesh" className="mt-4 text-primary">
              Më shumë për ne
            </TextLink>
          </div>
          <WorkLoop
            src={videos.sofaExtraction.src}
            poster={videos.sofaExtraction.poster}
            label={videos.sofaExtraction.label}
            className="mx-auto w-full max-w-xs lg:col-span-5"
          />
        </div>
      </Section>

      {/* Si përgatitet oferta: no prices, but nothing hidden either */}
      <Section>
        <h2 className={h2}>Si përgatitet oferta</h2>
        <ol className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {quoteSteps.map((step, i) => (
            <li key={step.title} className="border-t-2 border-primary py-5">
              <p className="text-lg font-bold">
                <span aria-hidden className="mr-2 text-primary">
                  {i + 1}
                </span>
                {step.title}
              </p>
              <p className="mt-2 text-text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 max-w-3xl">
          <h3 className="text-2xl font-bold tracking-tight">Nga çfarë varet çmimi</h3>
          <CheckList items={priceFactors} className="mt-5 text-lg" />
        </div>
      </Section>

      {/* Closer: WhatsApp, phone, form, FAQ */}
      <Closer whatsappMessage={waQuoteTemplate} placement="home" showSteps={false} faq={homeFaq} />
    </>
  );
}
