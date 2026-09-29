import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { PhoneLink } from "@/components/PhoneLink";
import { Button } from "@/components/Button";
import { MediaFrame } from "@/components/MediaFrame";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { business } from "@/lib/business";
import { waMessages } from "@/lib/whatsapp-messages";
import { ContactForm } from "./ContactForm";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Kontakt", path: "/kontakt" }];

export const metadata = pageMetadata({
  title: "Kontakt",
  description:
    "Na kontakto për pastrim profesional në Tiranë — telefon, WhatsApp ose formulari më poshtë.",
  path: "/kontakt",
});

const infoRows = [
  { label: "Email", value: "Së shpejti" },
  { label: "Instagram", value: "Së shpejti" },
  { label: "Orari", value: "Do konfirmohet së shpejti" },
  { label: "Zona", value: business.areaServed },
];

export default function KontaktPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-14">
        <Breadcrumbs items={breadcrumbItems} />
        <p className="font-display text-lg italic text-primary/80">Le të flasim</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          Kontakt
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-text-muted">
          Na shkruaj në WhatsApp për përgjigje të shpejtë, ose rezervo direkt online pa pritur.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <WhatsAppLink
            message={waMessages.contact}
            source="kontakt_page"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-primary-hover active:translate-y-0"
          >
            Na shkruaj në WhatsApp
          </WhatsAppLink>
          <Button href="/rezervo" variant="outline">
            Rezervo online
          </Button>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="space-y-8">
            <ul className="divide-y divide-border border-y border-border text-sm">
              <li className="flex items-center justify-between gap-4 py-3.5">
                <span className="font-display italic text-text-muted">Telefon</span>
                <PhoneLink className="font-semibold text-text hover:text-primary" />
              </li>
              {infoRows.map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-4 py-3.5">
                  <span className="font-display italic text-text-muted">{row.label}</span>
                  <span className="text-right text-text-muted">{row.value}</span>
                </li>
              ))}
            </ul>

            <MediaFrame
              label="Harta do të shtohet kur adresa e saktë konfirmohet"
              aspect="aspect-[4/3]"
            />
          </div>

          <div>
            <h2 className="font-display text-xl italic text-text">Ose na shkruaj një mesazh</h2>
            <p className="mt-2 text-sm text-text-muted">
              Plotëso formularin dhe do të të kontaktojmë sapo ta shohim mesazhin.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
