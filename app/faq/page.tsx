import { Section } from "@/components/Section";
import { FaqItem } from "@/components/FaqItem";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { faqEntries } from "@/lib/content";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "FAQ", path: "/faq" }];

export const metadata = pageMetadata({
  title: "Pyetje të Shpeshta",
  description: "Përgjigje për pyetjet më të shpeshta rreth pastrimit, rezervimit dhe çmimeve.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqEntries)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      <Section className="pt-14">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">Pyetje të shpeshta</h1>
        <p className="mt-3 max-w-2xl text-lg text-text-muted">
          Nuk gjete përgjigjen që kërkon? Na shkruaj në WhatsApp ose plotëso formularin e kontaktit.
        </p>

        <div className="mt-10 space-y-3">
          {faqEntries.map((entry) => (
            <FaqItem key={entry.question} question={entry.question} answer={entry.answer} />
          ))}
        </div>
      </Section>
    </>
  );
}
