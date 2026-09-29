import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MediaFrame } from "@/components/MediaFrame";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { JsonLd, breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { getServiceBySlug } from "@/lib/content";
import { waMessages } from "@/lib/whatsapp-messages";

const service = getServiceBySlug("pastrim-pas-ndertimit")!;
const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Shërbimet", path: "/sherbime" },
  { name: service.name, path: service.path },
];

export const metadata = pageMetadata({
  title: "Pastrim Pas Ndërtimit në Tiranë",
  description:
    "Pastrim i thelluar pas ndërtimit ose rinovimit në Tiranë — heqje pluhuri, xhama, dysheme dhe kornizat. Ofertë sipas gjendjes së pronës në WhatsApp.",
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
              Pastrim Pas Ndërtimit
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
              <WhatsAppLink
                message={waMessages.constructionQuote}
                source="service_pastrim_pas_ndertimit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Kërko Ofertë në WhatsApp
              </WhatsAppLink>
              <Button href="/kontakt" variant="outline">
                Na kontakto
              </Button>
            </div>
          </div>
          <MediaFrame label="Foto — pastrim pas ndërtimit" aspect="aspect-[5/4]" />
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          Çfarë përfshin, çfarë jo
        </h2>
        <p className="mt-3 max-w-2xl text-text-muted">
          Ky pastrim fokusohet te pluhuri i imët i llaçit, ngjyrës dhe punimeve, i cili mbulon
          çdo sipërfaqe pas një rinovimi — jo te mbetjet e rënda të ndërtimit (inerte, tulla,
          materiale ndërtimi), të cilat duhen hequr nga prona përpara se ekipi ynë të vijë.
        </p>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Çmimi</h2>
        <p className="mt-4 text-2xl font-extrabold text-primary">Ofertë sipas gjendjes së pronës</p>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Çmimi përcaktohet pas një përshkrimi të shkurtër të gjendjes së pronës — sipërfaqja,
          sasia e pluhurit dhe niveli i punimeve.
        </p>
        <WhatsAppLink
          message={waMessages.constructionQuote}
          source="service_pricing_pastrim_pas_ndertimit"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Kërko Ofertë
        </WhatsAppLink>
      </Section>
    </>
  );
}
