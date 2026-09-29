import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeadActions } from "@/components/LeadActions";
import { ServiceGrid } from "@/components/ServiceGrid";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { services } from "@/lib/services";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Shërbimet", path: "/sherbime" },
];

export const metadata = pageMetadata({
  title: "Shërbime Pastrimi në Tiranë",
  description:
    "Shërbime pastrimi në Tiranë për apartamente, shtëpi, zyra, vila, Airbnb, hotele dhe pas ndërtimit. Na lini numrin ose na shkruani në WhatsApp për ofertë.",
  path: "/sherbime",
});

export default function SherbimePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-6 sm:pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">
          Shërbime pastrimi në Tiranë
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-text-muted">
          Pastrojmë shtëpi, zyra, vila, prona Airbnb dhe hotele, si dhe prona pas rinovimit.
          Zgjidhni shërbimin për të parë çfarë përfshin.
        </p>
      </Section>

      <Section tone="muted">
        <ServiceGrid services={services} headingLevel="h2" />
      </Section>

      <Section>
        <SectionHeading
          title="Nuk jeni të sigurt cili shërbim ju duhet?"
          intro="Na tregoni për pronën dhe ju sugjerojmë ne."
        />
        <LeadActions placement="sherbime_footer" />
      </Section>
    </>
  );
}
