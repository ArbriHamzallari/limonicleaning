import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { services } from "@/lib/content";
import { waMessages } from "@/lib/whatsapp-messages";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Shërbimet", path: "/sherbime" }];

export const metadata = pageMetadata({
  title: "Shërbimet — Pastrim Apartamentesh, Airbnb, Zyrash, Vilash, Hotelesh",
  description:
    "Pastrim apartamentesh, Airbnb, zyrash, vilash, hotelesh dhe pas ndërtimit në Tiranë. Zgjidh shërbimin që të përshtatet dhe rezervo online.",
  path: "/sherbime",
});

export default function SherbimePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-14">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">Shërbimet tona</h1>
        <p className="mt-3 max-w-2xl text-lg text-text-muted">
          Nga apartamente dhe Airbnb te vila, zyra, hotele dhe pastrim pas ndërtimit — zgjidh
          shërbimin që të përshtatet dhe rezervo online, telefon ose WhatsApp.
        </p>
      </Section>

      <Section tone="muted">
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <Card key={service.slug} className="flex flex-col">
              <h2 className="font-display text-xl font-semibold text-text">{service.name}</h2>
              <p className="mt-2 text-text-muted">{service.description}</p>
              <ul className="mt-4 space-y-1.5">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-text-muted">
                    <span aria-hidden className="text-primary">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold text-primary">{service.priceNote}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={service.path} variant="outline">
                  Mëso më shumë
                </Button>
                {service.slug === "pastrim-airbnb" ? (
                  <WhatsAppLink
                    message={waMessages.airbnb}
                    source="sherbime_airbnb_card"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                  >
                    Kërko ofertë
                  </WhatsAppLink>
                ) : (
                  <Button href="/rezervo" variant="primary">
                    Rezervo tani
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <Card className="flex flex-col items-start gap-3 bg-bg-warm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-text">Je pronar Airbnb?</h2>
            <p className="mt-1 text-text-muted">
              Shiko planet tona për turnover dhe pastrim periodik, të mendura posaçërisht për host-a.
            </p>
          </div>
          <Button href="/pronare-airbnb" variant="primary">
            Shiko për pronarët
          </Button>
        </Card>

        <Card className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-text">
              Kërkon një pastrim më të thelluar?
            </h2>
            <p className="mt-1 text-text-muted">
              Shiko çfarë përfshin pastrimi me themel dhe kur ka kuptim ta zgjedhësh.
            </p>
          </div>
          <Button href="/pastrim-me-themel-tirane" variant="outline">
            Zbulo pastrimin me themel
          </Button>
        </Card>
      </Section>
    </>
  );
}
