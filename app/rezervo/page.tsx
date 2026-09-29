import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { BookingWizard } from "./BookingWizard";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Rezervo", path: "/rezervo" }];

export const metadata = pageMetadata({
  title: "Rezervo Pastrimin",
  description:
    "Rezervo pastrim për apartament, Airbnb, vilë apo zyrë në Tiranë në pak hapa. Zgjidh datën, orarin dhe konfirmojmë në WhatsApp.",
  path: "/rezervo",
});

export default function RezervoPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-14">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">Rezervo pastrimin</h1>
          <p className="mt-3 text-lg text-text-muted">
            Sa e pastër dëshiron pronën tënde? Plotëso hapat më poshtë — do t&apos;ju kontaktojmë në
            WhatsApp për konfirmimin.
          </p>
          <div className="mt-8">
            <BookingWizard />
          </div>
        </div>
      </Section>
    </>
  );
}
