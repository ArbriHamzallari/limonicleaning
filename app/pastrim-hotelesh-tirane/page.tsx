import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MediaFrame } from "@/components/MediaFrame";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { JsonLd, breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { getServiceBySlug } from "@/lib/content";
import { waMessages } from "@/lib/whatsapp-messages";

const service = getServiceBySlug("pastrim-hotelesh")!;
const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Shërbimet", path: "/sherbime" },
  { name: service.name, path: service.path },
];

export const metadata = pageMetadata({
  title: "Pastrim Hotelesh në Tiranë",
  description:
    "Mbështetje pastrimi për hotele dhe apart-hotele në Tiranë — dhoma dhe hapësira të përbashkëta, ekip që përshtatet me volumin e pronës. Ofertë në WhatsApp.",
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
              Pastrim Hotelesh
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
                message={waMessages.hotelQuote}
                source="service_pastrim_hotelesh"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Kërko Ofertë në WhatsApp
              </WhatsAppLink>
              <Button href="/kontakt" variant="outline">
                Na kontakto
              </Button>
            </div>
          </div>
          <MediaFrame label="Foto — dhomë hoteli" aspect="aspect-[5/4]" />
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          Ekip që përshtatet me volumin tuaj
        </h2>
        <p className="mt-3 max-w-2xl text-text-muted">
          Numri i dhomave, frekuenca e check-in/check-out dhe orët e pikut ndryshojnë nga një
          hotel në tjetrin. Për këtë, çdo marrëveshje për pastrim hotelesh fillon me një bisedë të
          shkurtër për të kuptuar volumin dhe orarin real të pronës, para se të propozojmë një
          plan dhe çmim.
        </p>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Çmimi</h2>
        <p className="mt-4 text-2xl font-extrabold text-primary">Ofertë sipas numrit të dhomave</p>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Çmimi përcaktohet sipas numrit të dhomave, frekuencës së pastrimit dhe hapësirave të
          përbashkëta të përfshira.
        </p>
        <WhatsAppLink
          message={waMessages.hotelQuote}
          source="service_pricing_pastrim_hotelesh"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Kërko Ofertë
        </WhatsAppLink>
      </Section>
    </>
  );
}
