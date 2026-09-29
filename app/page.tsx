import Link from "next/link";
import { Section } from "@/components/Section";
import { LeadActions } from "@/components/LeadActions";
import { Photo } from "@/components/Photo";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Checklist } from "@/components/Checklist";
import { Closer } from "@/components/Closer";
import { TextLink } from "@/components/TextLink";
import { trustFacts, serviceGroups, homeFaq } from "@/lib/content";
import { apartmentIncludes } from "@/lib/services";
import { photos, beforeAfter, naturalAspect } from "@/lib/photos";
import { waQuoteTemplate } from "@/lib/whatsapp-messages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kompani Pastrimi në Tiranë | Limoni Cleaning",
  absoluteTitle: true,
  description:
    "Kompani pastrimi në Tiranë për apartamente, Airbnb, vila dhe biznese. Ekip me mbi 10 vjet përvojë në pastrim. Na shkruani në WhatsApp për ofertë.",
  path: "/",
});

const h2 = "text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl";

/** Renders a sentence with some of its words turned into links. */
function LinkedText({ text, links }: { text: string; links: { label: string; href: string }[] }) {
  if (!links.length) return <>{text}</>;
  const pattern = new RegExp(`(${links.map((l) => l.label).join("|")})`);
  return (
    <>
      {text.split(pattern).map((part, i) => {
        const link = links.find((l) => l.label === part);
        return link ? (
          <Link key={i} href={link.href} className="underline decoration-1 underline-offset-4 hover:text-primary">
            {part}
          </Link>
        ) : (
          part
        );
      })}
    </>
  );
}

export default function Home() {
  return (
    <>
      {/* 2. Hero */}
      <Section flush className="pt-8 pb-12 sm:pt-14 sm:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Ne pastrojmë. Ju e gjeni ambientin gati.
            </h1>
            <p className="mt-6 max-w-xl text-xl text-text-muted">
              Pastrime për apartamente, Airbnb, vila dhe biznese në Tiranë. Ekip me mbi 10 vjet përvojë
              në pastrim. Na tregoni çfarë duhet pastruar dhe ju japim ofertën.
            </p>
            <LeadActions placement="home_hero" className="mt-8" />
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

      {/* 3. Three plain facts */}
      <section aria-label="Pse Limoni Cleaning" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ul className="grid border-y border-border text-lg font-semibold sm:grid-cols-3 sm:divide-x sm:divide-border">
          {trustFacts.map((fact) => (
            <li key={fact} className="border-b border-border py-4 last:border-b-0 sm:border-b-0 sm:px-6 sm:first:pl-0">
              {fact}
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Çfarë pastrojmë: four groups beside one large photo */}
      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <Photo
            src={photos.steamFrame.src}
            alt={photos.steamFrame.alt}
            aspect="aspect-[3/4] lg:aspect-[9/16]"
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="order-2 lg:order-1 lg:col-span-5"
            bleed
          />
          <div className="order-1 lg:order-2 lg:col-span-7">
            <h2 className={h2}>Çfarë pastrojmë</h2>
            <p className="mt-3 text-text-muted">Zgjidhni shërbimin që ju nevojitet.</p>
            <ul className="mt-8 border-t border-border">
              {serviceGroups.map((group) => (
                <li key={group.name} className="border-b border-border py-6">
                  <h3 className="text-2xl font-bold">{group.name}</h3>
                  <p className="mt-2 text-text-muted">
                    <LinkedText text={group.text} links={group.links} />
                  </p>
                  <TextLink href={group.href} className="mt-1 text-primary">
                    Shiko shërbimin
                  </TextLink>
                </li>
              ))}
            </ul>
            <TextLink href="/sherbime" className="mt-4 text-primary">
              Shiko të gjitha shërbimet
            </TextLink>
          </div>
        </div>
      </Section>

      {/* 5. Airbnb, the one dark section */}
      <Section tone="dark">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Photo
            src={photos.bedroom.src}
            alt={photos.bedroom.alt}
            aspect={naturalAspect(photos.bedroom)}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="lg:col-span-5"
            bleed
          />
          <div className="lg:col-span-7">
            <h2 className={h2}>Keni një Airbnb në Tiranë?</h2>
            <p className="mt-5 text-xl">
              Ne merremi me pastrimin pas çdo check-out-i. Ekipi vjen sipas kalendarit të rezervimeve,
              pastron pronën, rregullon ambientin dhe e lë gati për mysafirin tjetër.
            </p>
            <p className="mt-4 text-(--fg-muted)">Për një pronë apo për disa prona.</p>
            <p className="mt-4 text-(--fg-muted)">
              Bashkëpunojmë me Prago, kompani që menaxhon prona me qira ditore, për pastrimin e pronave
              Airbnb.
            </p>
            <TextLink href="/pastrim-airbnb-tirane" className="mt-4 text-accent">
              Pastrimi për Airbnb
            </TextLink>
          </div>
        </div>
      </Section>

      {/* 6. Before/after as the widest element on the page */}
      <Section tone="muted">
        <h2 className={h2}>Shikoni si e lëmë pronën</h2>
        <BeforeAfterSlider
          {...beforeAfter}
          caption="Dhoma e ndenjes, para dhe pas pastrimit"
          className="mt-8"
          bleed
        />
        <div className="mt-10 grid items-start gap-6 sm:grid-cols-[3fr_2fr]">
          <Photo
            src={photos.constructionBefore.src}
            alt={photos.constructionBefore.alt}
            caption="Apartament i ri, para pastrimit pas punimeve"
            aspect={naturalAspect(photos.constructionBefore)}
            sizes="(min-width: 640px) 55vw, 100vw"
          />
          <div className="grid gap-6">
            <Photo
              src={photos.constructionGlass.src}
              alt={photos.constructionGlass.alt}
              caption={photos.constructionGlass.caption}
              aspect={naturalAspect(photos.constructionGlass)}
              sizes="(min-width: 640px) 55vw, 100vw"
            />
            <Photo
              src={photos.guestRoom.src}
              alt={photos.guestRoom.alt}
              caption={photos.guestRoom.caption}
              aspect={naturalAspect(photos.guestRoom)}
              sizes="(min-width: 640px) 55vw, 100vw"
            />
          </div>
        </div>
        <TextLink href="/puna-jone" className="mt-6 text-primary">
          Shiko më shumë foto
        </TextLink>
      </Section>

      {/* 7. What a cleaning includes (same muted block continues) */}
      <Section tone="muted" className="pt-0!">
        <div className="max-w-4xl">
          <h2 className={h2}>Çfarë përfshin një pastrim</h2>
          <div className="mt-8">
            <Checklist items={apartmentIncludes} />
          </div>
        </div>
      </Section>

      {/* 8. Rreth Limoni */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <h2 className={h2}>Rreth Limoni</h2>
            <div className="mt-6 space-y-4 text-lg">
              <p>Limoni Cleaning është kompani e re pastrimi në Tiranë, me bazë në Komunën e Parisit.</p>
              <p>
                Njerëzit e ekipit kanë mbi 10 vjet përvojë në pastrim, të fituar në kompani të tjera
                pastrimi.
              </p>
              <p>Deri tani kemi pastruar mbi 50 prona. Pjesa më e madhe e punës sonë sot është pastrimi Airbnb.</p>
            </div>
            <TextLink href="/rreth-nesh" className="mt-4 text-primary">
              Më shumë për ne
            </TextLink>
          </div>
          <Photo
            src={photos.kitchen.src}
            alt={photos.kitchen.alt}
            aspect={naturalAspect(photos.kitchen)}
            sizes="(min-width: 1024px) 35vw, 100vw"
            className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none"
          />
        </div>
      </Section>

      {/* 9. Closer: WhatsApp, phone, what happens next, form, FAQ */}
      <Closer whatsappMessage={waQuoteTemplate} placement="home" faq={homeFaq} />
    </>
  );
}
