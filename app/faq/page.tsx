import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { FaqItem } from "@/components/FaqItem";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeadActions } from "@/components/LeadActions";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { faqEntries } from "@/lib/content";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Pyetje të shpeshta", path: "/faq" },
];

export const metadata = pageMetadata({
  title: "Pyetje të Shpeshta",
  description:
    "Përgjigje për pyetjet më të shpeshta rreth pastrimit në Tiranë: çfarë përfshin, si kërkohet oferta dhe në cilat zona punojmë. Shkruani në WhatsApp për të tjera.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqEntries)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      <Section className="pt-6 sm:pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">Pyetje të shpeshta</h1>
        <p className="mt-4 max-w-2xl text-xl text-text-muted">
          Nuk e gjeni përgjigjen? Na shkruani në WhatsApp ose na lini numrin.
        </p>
        <div className="mt-10 max-w-3xl space-y-3">
          {faqEntries.map((entry) => (
            <FaqItem key={entry.question} question={entry.question} answer={entry.answer} />
          ))}
        </div>
      </Section>

      <Section tone="warm">
        <SectionHeading title="Keni një pyetje tjetër?" />
        <LeadActions placement="faq_footer" />
      </Section>
    </>
  );
}
