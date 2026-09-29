import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PhoneButton } from "@/components/PhoneButton";
import { LeadForm } from "@/components/LeadForm";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { business } from "@/lib/business";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Kontakt", path: "/kontakt" },
];

export const metadata = pageMetadata({
  title: "Kontakt",
  description:
    "Kontaktoni Limoni Cleaning në Tiranë: telefon dhe WhatsApp +355 68 900 7252, ose na lini numrin te formulari dhe ju kontaktojmë ne për ofertën.",
  path: "/kontakt",
});

// Only confirmed details: email shows once set in lib/business.ts; no hours or street address yet.
export default function KontaktPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-6 sm:pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">Kontakt</h1>
        <p className="mt-4 max-w-2xl text-xl text-text-muted">
          Na telefononi, na shkruani në WhatsApp, ose na lini numrin dhe ju kontaktojmë ne.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <dl className="divide-y divide-border border-y border-border">
              <div className="py-4">
                <dt className="text-text-muted">Telefon dhe WhatsApp</dt>
                <dd className="mt-1 text-xl font-bold">{business.phoneDisplay}</dd>
              </div>
              <div className="py-4">
                <dt className="text-text-muted">Zona</dt>
                <dd className="mt-1 text-xl font-bold">{business.areaServed}</dd>
                <dd>
                  <a
                    href={business.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center font-semibold text-primary underline decoration-2 underline-offset-4"
                  >
                    Na gjeni në Google Maps
                  </a>
                </dd>
              </div>
              {business.email && (
                <div className="py-4">
                  <dt className="text-text-muted">Email</dt>
                  <dd className="mt-1 text-xl font-bold">
                    <a href={`mailto:${business.email}`} className="inline-flex min-h-12 items-center underline underline-offset-4">
                      {business.email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-6 grid gap-3">
              <WhatsAppButton placement="kontakt" size="lg" />
              <PhoneButton placement="kontakt" size="lg">
                Telefononi
              </PhoneButton>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Na lini numrin</h2>
            <p className="mt-2 mb-6 text-text-muted">Ju kontaktojmë ne, në WhatsApp ose me telefon.</p>
            <LeadForm placement="kontakt" />
          </div>
        </div>
      </Section>
    </>
  );
}
