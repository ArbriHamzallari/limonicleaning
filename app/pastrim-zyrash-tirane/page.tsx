import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MediaFrame } from "@/components/MediaFrame";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { JsonLd, breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { getServiceBySlug } from "@/lib/content";
import { sqmRates, formatPerSqm } from "@/lib/pricing";
import { waMessages } from "@/lib/whatsapp-messages";

const service = getServiceBySlug("pastrim-zyrash")!;
const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Shërbimet", path: "/sherbime" },
  { name: service.name, path: service.path },
];

export const metadata = pageMetadata({
  title: "Pastrim Zyrash në Tiranë",
  description:
    "Pastrim periodik zyrash dhe hapësirash biznesi në Tiranë, nga 175 ALL/m². Plan pastrimi sipas orarit tuaj të punës, rezervim online ose në WhatsApp.",
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
              Pastrim Zyrash
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
                source="service_pastrim_zyrash"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                Na shkruaj në WhatsApp
              </WhatsAppLink>
            </div>
          </div>
          <MediaFrame label="Foto — pastrim zyre" aspect="aspect-[5/4]" />
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          Plan i përshtatur me orarin tuaj
        </h2>
        <p className="mt-3 max-w-2xl text-text-muted">
          Zyrat kanë nevojë për pastrim që nuk ndërhyn në ditën e punës. Koordinojmë orarin e
          vizitave — para hapjes, pas mbylljes, ose në ditë të caktuara të javës — dhe mbajmë të
          njëjtin ekip për çdo vizitë, në mënyrë që stafi juaj të njohë kush hyn në zyrë.
        </p>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Çmimi</h2>
        <p className="mt-4 text-2xl font-extrabold text-primary">{formatPerSqm(sqmRates.zyre)}</p>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Çmimi final përcaktohet sipas sipërfaqes, frekuencës së pastrimit dhe numrit të
          ambienteve/banjove.
        </p>
        <WhatsAppLink
          message={waMessages.officeQuote}
          source="service_pricing_pastrim_zyrash"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Kërko Ofertë
        </WhatsAppLink>
      </Section>
    </>
  );
}
