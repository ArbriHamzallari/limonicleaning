import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceList } from "@/components/ServiceList";
import { ContactActions } from "@/components/ContactActions";
import { TextLink } from "@/components/TextLink";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getService, type ServiceSlug } from "@/lib/services";
import { businessPath } from "@/lib/service-index";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Shërbimet", path: "/sherbime" },
];

export const metadata = pageMetadata({
  title: "Shërbime pastrimi në Tiranë",
  description:
    "Shërbime pastrimi në Tiranë për apartamente, shtëpi, zyra, vila, Airbnb, hotele dhe pas ndërtimit. Na lini numrin ose na shkruani në WhatsApp për ofertë.",
  path: "/sherbime",
});

const groups: { title: string; slugs: ServiceSlug[]; link?: { href: string; label: string } }[] = [
  { title: "Për shtëpinë", slugs: ["apartamente", "vila", "divane", "airbnb"] },
  {
    title: "Për biznesin",
    slugs: ["zyra", "ambiente", "hotele"],
    link: { href: businessPath, label: "Pastrimi për biznese" },
  },
  { title: "Pastrime të veçanta", slugs: ["me-themel", "pas-ndertimit"] },
];

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
          Shtëpi, zyra, pallate, vila dhe hotele. Zgjidhni shërbimin që ju nevojitet.
        </p>
        <nav aria-label="Grupet e shërbimeve" className="mt-6 flex flex-wrap gap-x-6">
          {groups.map((group, i) => (
            <a
              key={group.title}
              href={`#grupi-${i + 1}`}
              className="inline-flex min-h-12 items-center text-lg font-medium underline decoration-border decoration-2 underline-offset-8 hover:text-primary hover:decoration-primary"
            >
              {group.title}
            </a>
          ))}
        </nav>
      </Section>

      {groups.map((group, i) => (
        <Section key={group.title} id={`grupi-${i + 1}`} className="scroll-mt-20 pt-0!">
          <h2 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{group.title}</h2>
          {group.link && (
            <TextLink href={group.link.href} className="mt-2 text-primary">
              {group.link.label}
            </TextLink>
          )}
          <div className="mt-6">
            <ServiceList services={group.slugs.map(getService)} heading="h3" />
          </div>
        </Section>
      ))}

      <Section className="pt-0!">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Nuk e dini cili ju duhet?</h2>
        <p className="mt-3 text-text-muted">Na tregoni për pronën dhe ju sugjerojmë ne.</p>
        <ContactActions placement="sherbime_footer" className="mt-6" />
      </Section>
    </>
  );
}
