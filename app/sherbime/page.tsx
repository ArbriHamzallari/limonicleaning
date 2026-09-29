import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceList } from "@/components/ServiceList";
import { ContactActions } from "@/components/ContactActions";
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
          Shtëpi, prona Airbnb, zyra, vila, hotele, prona pas rinovimit. Zgjidhni shërbimin që ju nevojitet.
        </p>
        <div className="mt-10">
          <ServiceList services={services} />
        </div>
      </Section>

      <Section className="pt-0!">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Nuk e dini cili ju duhet?</h2>
        <p className="mt-3 text-text-muted">Na tregoni për pronën dhe ju sugjerojmë ne.</p>
        <ContactActions placement="sherbime_footer" className="mt-6" />
      </Section>
    </>
  );
}
