import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { MediaFrame } from "@/components/MediaFrame";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { waMessages } from "@/lib/whatsapp-messages";
import { prago } from "@/lib/business";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Për pronarët", path: "/pronare-airbnb" }];

export const metadata = pageMetadata({
  title: "Për Pronarë Airbnb në Tiranë",
  description:
    "Keni një Airbnb në Tiranë? Limoni Cleaning kujdeset për pastrimin dhe përgatitjen e pronës; Prago Albania për menaxhimin e saj. Dy shërbime të ndara.",
  path: "/pronare-airbnb",
});

const operationalNeeds = [
  "Pastrimi i pronës mes çdo check-out dhe check-in",
  "Përgatitja e ambientit për mysafirin tjetër",
  "Organizimi i pastrimeve për prona me rezervime të shpeshta",
  "Menaxhimi i vetë Airbnb-së — çmimi, kalendari, komunikimi me mysafirët",
];

const whyUs = [
  "Ekip i njëjtë, i njohur me pronën tuaj",
  "Kontroll final përpara se prona të jetë gati",
  "Standard i qëndrueshëm në çdo pastrim",
  "Komunikim i drejtpërdrejtë në WhatsApp",
  "Organizim që përshtatet me kalendarin e pronës",
  "Ofertë e personalizuar sipas pronës, jo çmim fiks",
];

export default function PronareAirbnbPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      <Section className="pt-14">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-display text-lg italic text-primary/80">Për pronarë dhe host-a Airbnb</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
              Keni një Airbnb në Tiranë?
            </h1>
            <p className="mt-4 text-lg text-text-muted">
              Menaxhimi i një prone kërkon më shumë sesa vetëm hapjen e derës për mysafirin.
            </p>
            <ul className="mt-6 space-y-2">
              {operationalNeeds.map((need) => (
                <li key={need} className="flex gap-2 text-text-muted">
                  <span aria-hidden className="text-primary">✓</span>
                  {need}
                </li>
              ))}
            </ul>
          </div>
          <MediaFrame
            label="Foto — pronë Airbnb"
            src="/images/apartament-i-pastruar-dhoma-ndenje-tirane.jpg"
            alt="Dhomë ndenjeje e një prone Airbnb, e pastruar dhe e përgatitur nga Limoni Cleaning"
            aspect="aspect-[5/4]"
            priority
          />
        </div>
      </Section>

      {/* The core distinction — two separate companies, two separate roles */}
      <Section tone="muted">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          Dy nevoja të ndryshme, dy shërbime të ndara
        </h2>
        <p className="mt-3 max-w-2xl text-text-muted">
          Limoni Cleaning dhe Prago Albania janë dy biznese të ndara që mund të mbulojnë dy pjesë
          të ndryshme të nevojave të një pronari Airbnb.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Card>
            <p className="font-display text-sm italic text-primary/70">Limoni Cleaning</p>
            <h3 className="mt-1 text-xl font-bold text-text">Pastrimi dhe përgatitja e pronës.</h3>
            <p className="mt-2 text-sm text-text-muted">
              Pastrim turnover, përgatitje për mysafirin tjetër dhe organizim i pastrimeve për
              prona me rezervime të shpeshta.
            </p>
            <WhatsAppLink
              message={waMessages.airbnbCleaningPath}
              source="pronare_airbnb_path_cleaning"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Kam nevojë për pastrim
            </WhatsAppLink>
          </Card>

          <Card>
            <p className="font-display text-sm italic text-primary/70">Prago Albania</p>
            <h3 className="mt-1 text-xl font-bold text-text">Menaxhimi i Airbnb dhe i pronës.</h3>
            <p className="mt-2 text-sm text-text-muted">
              Kompani e ndarë, partnere me Limoni Cleaning, që merret me menaxhimin e pronës —
              jashtë shërbimit të pastrimit.
            </p>
            <a
              href={prago.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              Kam nevojë për menaxhim
            </a>
          </Card>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 border-t border-border pt-8 text-center">
          <p className="text-sm text-text-muted">Keni nevojë për të dyja?</p>
          <WhatsAppLink
            message={waMessages.airbnbBothPaths}
            source="pronare_airbnb_path_both"
            className="text-sm font-semibold text-primary underline decoration-primary/30 decoration-2 underline-offset-4 hover:decoration-primary"
          >
            Kam nevojë për të dyja — na shkruaj në WhatsApp
          </WhatsAppLink>
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Pse Limoni Cleaning</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {whyUs.map((item) => (
            <li key={item} className="flex gap-2 text-text-muted">
              <span aria-hidden className="text-primary">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="warm">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">Na tregoni për pronën</h2>
          <p className="max-w-xl text-text-muted">
            Na shkruani në WhatsApp me detajet e pronës — sa Airbnb keni, sa m² dhe sa shpesh
            nevojitet pastrimi — dhe ju kontaktojmë për ofertën.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <WhatsAppLink
              message={waMessages.airbnb}
              source="pronare_airbnb_final_cta"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Na shkruaj në WhatsApp
            </WhatsAppLink>
            <Button href="/pastrim-airbnb-tirane" variant="outline">
              Shiko pastrimin Airbnb
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
