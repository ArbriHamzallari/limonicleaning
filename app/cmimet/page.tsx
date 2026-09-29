import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { AirbnbWhatsAppQuote } from "@/components/AirbnbWhatsAppQuote";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { sqmRates, laundryPricePerKg, formatPerSqm, formatPerKg, extraServicesOnRequest } from "@/lib/pricing";
import { waMessages } from "@/lib/whatsapp-messages";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Çmimet", path: "/cmimet" }];

export const metadata = pageMetadata({
  title: "Çmimet",
  description:
    "Çmime transparente për pastrim apartamentesh, zyrash dhe vilash në Tiranë, sipas m². Për Airbnb, ofertë e personalizuar pas një bisede të shkurtër në WhatsApp.",
  path: "/cmimet",
});

const residentialRows = [
  {
    title: "Apartamente & Shtëpi",
    priceLabel: formatPerSqm(sqmRates.apartament),
    description: "Pastrim standard dhe me themel për apartamente e shtëpi të çdo madhësie.",
    message: waMessages.apartmentQuote,
    source: "cmimet_apartament",
  },
  {
    title: "Zyra",
    priceLabel: formatPerSqm(sqmRates.zyre),
    description: "Paketa të përshtatura sipas sipërfaqes, frekuencës dhe nevojave të biznesit tuaj.",
    message: waMessages.officeQuote,
    source: "cmimet_zyre",
  },
  {
    title: "Vila",
    priceLabel: formatPerSqm(sqmRates.vile),
    description: "Çmim i personalizuar në bazë të sipërfaqes, numrit të ambienteve dhe nivelit të pastrimit.",
    message: waMessages.villaQuote,
    source: "cmimet_vile",
  },
];

export default function CmimetPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      <Section className="pt-14">
        <Breadcrumbs items={breadcrumbItems} />
        <p className="font-display text-lg italic text-primary/80">Pa surpriza</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">Çmimet</h1>
        <p className="mt-3 max-w-2xl text-lg text-text-muted">
          Çmime nisëse transparente sipas sipërfaqes. Çmimi final përcaktohet gjithmonë sipas
          pronës konkrete — na shkruaj për një ofertë të saktë.
        </p>
      </Section>

      <Section tone="muted">
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">Pastrim rezidencial dhe zyra</h2>
          <p className="max-w-md text-text-muted">Çmim nisës sipas m² — çmimi final varet nga gjendja e pronës.</p>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {residentialRows.map((row, i) => (
            <div
              key={row.title}
              className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 font-display text-2xl italic text-primary/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-text">{row.title}</h3>
                  <p className="mt-1.5 max-w-md text-sm text-text-muted">{row.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-10 sm:flex-col sm:items-end sm:gap-2 sm:pl-0 sm:text-right">
                <p className="font-display text-2xl font-semibold text-primary">{row.priceLabel}</p>
                <WhatsAppLink
                  message={row.message}
                  source={row.source}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Kërko ofertë →
                </WhatsAppLink>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-text-muted">
          Çmimi final përcaktohet në bazë të sipërfaqes, gjendjes së pronës dhe llojit të pastrimit.
        </p>
      </Section>

      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-display text-lg italic text-accent">Shërbimi ynë kryesor</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">Oferta për Airbnb</h2>
            <p className="mt-4 max-w-md text-white/85">
              Nuk kemi një çmim unik për Airbnb. Çmimi përcaktohet sipas pronës dhe frekuencës së
              pastrimit — sipërfaqja, numri i pronave dhe kërkesat specifike. Na dërgo disa
              informacione në WhatsApp dhe të kthehemi me një ofertë.
            </p>
            <a
              href="/pastrim-airbnb-tirane"
              className="mt-4 inline-block text-sm font-semibold text-accent underline decoration-accent/40 decoration-2 underline-offset-4 hover:decoration-accent"
            >
              Shiko pastrimin Airbnb →
            </a>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/[0.04] p-6 sm:p-8">
            <p className="font-display text-sm italic text-white/70">Na duhen vetëm disa informacione paraprake</p>
            <AirbnbWhatsAppQuote className="mt-4" source="cmimet_airbnb" />
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Shërbime shtesë</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="font-semibold text-text">Lavanderi për Airbnb</h3>
            <p className="mt-1 text-xl font-extrabold text-primary">{formatPerKg(laundryPricePerKg)}</p>
            <p className="mt-2 text-sm text-text-muted">
              Çarçafë, peshqirë, mbulesa dhe tekstile të tjera të pronës, si shërbim i menaxhuar
              nga ekipi ynë. Për klientë me vëllim të lartë e të rregullt, çmimi mund të
              personalizohet — na shkruaj për detaje.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold text-text">Të tjera sipas kërkesës</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-text-muted">
              {extraServicesOnRequest.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="text-primary">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section tone="warm">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">Nuk jeni të sigurt se cili shërbim ju përshtatet?</h2>
          <p className="max-w-xl text-text-muted">
            Rezervo online dhe zgjidh detajet e pronës gjatë procesit, ose na shkruaj për këshillë të
            shpejtë.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/rezervo" variant="primary">
              Rezervo pastrimin
            </Button>
            <WhatsAppLink
              message={waMessages.pricing}
              source="cmimet_final_cta"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              Na shkruaj në WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </Section>
    </>
  );
}
