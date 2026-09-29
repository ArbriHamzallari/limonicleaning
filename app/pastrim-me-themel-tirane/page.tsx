import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MediaFrame } from "@/components/MediaFrame";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { JsonLd, breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { services } from "@/lib/content";
import { waMessages } from "@/lib/whatsapp-messages";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Shërbimet", path: "/sherbime" },
  { name: "Pastrim me Themel", path: "/pastrim-me-themel-tirane" },
];

const description =
  "Pastrimi me themel është niveli më i thelluar i pastrimit — përfshin çdo cep që pastrimi standard nuk e mbulon: brenda dollapëve, frigoriferit dhe furrës, prapa dhe poshtë mobilieve, kornizat e dyerve dhe dritareve, bazamentet dhe pajisjet.";

export const metadata = pageMetadata({
  title: "Pastrim me Themel në Tiranë",
  description:
    "Çfarë është pastrimi me themel dhe kur ka kuptim — për apartamente, zyra dhe vila në Tiranë. Diferenca nga pastrimi standard, shpjeguar thjeshtë.",
  path: "/pastrim-me-themel-tirane",
});

const includes = [
  "Brenda dollapëve, frigoriferit dhe furrës",
  "Prapa dhe poshtë mobilieve të lëvizshme",
  "Kornizat e dyerve, dritareve dhe bazamentet",
  "Pastrim i detajuar i banjës dhe kuzhinës, çdo sipërfaqe",
];

const whenItMakesSense = [
  "Para se të hyni në një apartament ose zyrë të re",
  "Kur prona nuk është pastruar thellë prej kohësh",
  "Një ose dy herë në vit, si mirëmbajtje periodike",
  "Përpara ose pas një ngjarjeje me shumë të ftuar",
];

export default function Page() {
  return (
    <>
      <JsonLd data={serviceJsonLd("Pastrim me Themel", description, "/pastrim-me-themel-tirane")} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      <Section className="pt-14">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
              Pastrim me Themel
            </h1>
            <p className="mt-4 text-lg text-text-muted">{description}</p>
            <ul className="mt-6 space-y-2">
              {includes.map((item) => (
                <li key={item} className="flex gap-2 text-text-muted">
                  <span aria-hidden className="text-primary">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <WhatsAppLink
                message={waMessages.deepCleanQuote}
                source="service_pastrim_me_themel"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Na shkruaj në WhatsApp
              </WhatsAppLink>
            </div>
          </div>
          <MediaFrame label="Foto — pastrim me themel" aspect="aspect-[5/4]" />
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          Kur ka kuptim
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {whenItMakesSense.map((item) => (
            <li key={item} className="flex gap-2 text-text-muted">
              <span aria-hidden className="text-primary">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          Disponohet për çdo lloj prone
        </h2>
        <p className="mt-3 max-w-2xl text-text-muted">
          Pastrimi me themel shtohet mbi pastrimin bazë të secilit shërbim — çmimi varet nga lloji
          i pronës dhe gjendja e saj, jo një tarifë fikse e veçantë.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {services
            .filter((s) => s.slug !== "pastrim-airbnb")
            .map((s) => (
              <a
                key={s.slug}
                href={s.path}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary"
              >
                {s.name}
              </a>
            ))}
        </div>
      </Section>
    </>
  );
}
