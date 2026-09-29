import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MediaFrame } from "@/components/MediaFrame";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { JsonLd, breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { getServiceBySlug } from "@/lib/content";
import { sqmRates, formatPerSqm, pricingDisclaimer } from "@/lib/pricing";
import { waMessages } from "@/lib/whatsapp-messages";

const service = getServiceBySlug("pastrim-apartamentesh")!;
const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Shërbimet", path: "/sherbime" },
  { name: service.name, path: service.path },
];

export const metadata = pageMetadata({
  title: "Pastrim Apartamentesh në Tiranë",
  description:
    "Pastrim profesional apartamentesh dhe shtëpish në Tiranë, nga 150 ALL/m². Pastrim standard ose me themel, rezervim online ose në WhatsApp.",
  path: service.path,
});

export default function Page() {
  return (
    <>
      <JsonLd data={serviceJsonLd(service.name, service.description, service.path)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      <Section className="pt-14">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
              Pastrim Apartamentesh dhe Shtëpish
            </h1>
            <p className="mt-4 text-lg text-text-muted">{service.description}</p>
            <ul className="mt-6 space-y-2">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-2 text-text-muted">
                  <span aria-hidden className="text-primary">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/rezervo" variant="primary">
                Rezervo tani
              </Button>
              <WhatsAppLink
                message={waMessages.service(service.name)}
                source="service_pastrim_apartamentesh"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                Na shkruaj në WhatsApp
              </WhatsAppLink>
            </div>
          </div>
          <MediaFrame label="Foto — pastrim apartamenti" src="/images/ekipi-pastrim-kuzhine-tirane.jpg" alt="Punonjëse e Limoni Cleaning duke pastruar kuzhinën e një apartamenti në Tiranë" aspect="aspect-[5/4]" priority />
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          Standard apo me themel?
        </h2>
        <p className="mt-3 max-w-2xl text-text-muted">
          Pastrimi standard mban ambientin të pastër javë pas jave: fshirje pluhuri, larje
          dyshemesh, kuzhinë dhe banjë. Kur apartamenti ka nevojë për diçka më të thelluar — para
          se të hyni në një pronë të re, pas një periudhe pa pastrim, ose thjesht një herë në disa
          muaj — sugjerojmë{" "}
          <a href="/pastrim-me-themel-tirane" className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary">
            pastrimin me themel
          </a>
          , që përfshin brenda dollapëve, frigoriferit, furrës dhe kornizave.
        </p>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Çmimi</h2>
        <p className="mt-4 text-2xl font-extrabold text-primary">{formatPerSqm(sqmRates.apartament)}</p>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">{pricingDisclaimer}</p>
        <WhatsAppLink
          message={waMessages.apartmentQuote}
          source="service_pricing_pastrim_apartamentesh"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Kërko Ofertë
        </WhatsAppLink>
      </Section>
    </>
  );
}
