import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PhoneButton } from "@/components/PhoneButton";
import { BookingSection } from "@/components/booking/BookingSection";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { business, socialLinks } from "@/lib/business";
import { serviceAreaLine } from "@/lib/content";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Kontakt", path: "/kontakt" },
];

export const metadata = pageMetadata({
  title: "Kontakt: kompani pastrimi në Tiranë",
  description:
    "Kontaktoni Limoni Cleaning në Tiranë: telefon dhe WhatsApp +355 68 900 7252, ose zgjidhni shërbimin dhe datën që ju përshtatet dhe ju kontaktojmë ne.",
  path: "/kontakt",
});

// Only confirmed details from lib/business.ts (email, social profiles); no hours or street address yet.
export default function KontaktPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-6 sm:pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">Kontakt</h1>
        <p className="mt-4 max-w-2xl text-xl text-text-muted">
          Na telefononi, na shkruani në WhatsApp, ose zgjidhni më poshtë shërbimin dhe datën që ju përshtatet.
        </p>

        <div className="mt-10 max-w-xl">
          <dl className="divide-y divide-border border-y border-border">
            <div className="py-4">
              <dt className="text-text-muted">Telefon dhe WhatsApp</dt>
              <dd className="mt-1 text-xl font-bold">{business.phoneDisplay}</dd>
            </div>
            <div className="py-4">
              <dt className="text-text-muted">Zona</dt>
              <dd className="mt-1 text-xl font-bold">{serviceAreaLine}</dd>
              <dd className="mt-1 text-text-muted">Baza jonë është në Komunën e Parisit.</dd>
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
            {socialLinks.length > 0 && (
              <div className="py-4">
                <dt className="text-text-muted">Rrjetet sociale</dt>
                <dd className="mt-1 flex flex-wrap gap-x-6">
                  {socialLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center text-xl font-bold underline underline-offset-4"
                    >
                      {link.label}
                    </a>
                  ))}
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
      </Section>
      <BookingSection />
    </>
  );
}
