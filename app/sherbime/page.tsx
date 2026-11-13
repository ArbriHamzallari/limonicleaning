import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceList } from "@/components/ServiceList";
import { BookingSection } from "@/components/booking/BookingSection";
import { TextLink } from "@/components/TextLink";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getService, type ServiceSlug } from "@/lib/services";
import { businessPath, serviceIndex } from "@/lib/service-index";
import { DEEP_CLEAN_RATE_LEK } from "@/lib/quote";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Shërbimet", path: "/sherbime" },
];

export const metadata = pageMetadata({
  title: "Shërbime pastrimi në Tiranë",
  description:
    "Shërbime pastrimi në Tiranë për apartamente, shtëpi, zyra, vila, Airbnb, hotele dhe pas ndërtimit. Gjeni cili pastrim ju duhet dhe rezervoni datën.",
  path: "/sherbime",
});

const groups: { title: string; slugs: ServiceSlug[]; link?: { href: string; label: string } }[] = [
  { title: "Për shtëpinë", slugs: ["apartamente", "vila", "divane"] },
  {
    title: "Për biznesin",
    slugs: ["zyra", "airbnb", "hotele", "ambiente"],
    link: { href: businessPath, label: "Pastrimi për biznese" },
  },
  { title: "Pastrime të veçanta", slugs: ["me-themel", "pas-ndertimit"] },
];

// The visitor's situation in their own words, and the service it points to.
const situations: { text: string; slug: ServiceSlug }[] = [
  { text: "Dua që shtëpia të mbahet e pastër çdo javë ose çdo dy javë", slug: "apartamente" },
  { text: "Shtëpia nuk është pastruar mirë prej kohësh, ose po hyj në një banesë", slug: "me-themel" },
  { text: "Sapo mbaruan punimet në shtëpi ose në zyrë", slug: "pas-ndertimit" },
  { text: "Kam divan, kolltuqe ose dyshekë me njolla", slug: "divane" },
  { text: "Kam një apartament me qira ditore", slug: "airbnb" },
  { text: "Kam zyrë ose dyqan", slug: "zyra" },
  { text: "Administroj një pallat ose kompleks", slug: "ambiente" },
  { text: "Kam hotel ose apart-hotel", slug: "hotele" },
];

// The two services people confuse most, side by side.
const comparison: { label: string; regular: string; deep: string }[] = [
  { label: "Sa shpesh", regular: "Çdo javë, çdo dy javë ose një herë", deep: "Një ose dy herë në vit, ose para se të hyni në një banesë" },
  {
    label: "Çfarë përfshin",
    regular: "Pluhuri, sipërfaqet, pasqyrat, dyshemetë, kuzhina dhe banja",
    deep: "Gjithçka nga pastrimi i rregullt, plus brenda dollapëve, frigoriferi, furra, dyert, kornizat dhe bazamentet",
  },
  { label: "Divani dhe dyshekët", regular: "Nuk përfshihen", deep: "Përfshihen në apartamente" },
  {
    label: "Çmimi",
    regular: "Pas vlerësimit",
    deep: `Apartamente: nga ${DEEP_CLEAN_RATE_LEK} lekë të reja/m², vlerësim orientues`,
  },
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

      <Section tone="muted" id="cili-ju-duhet">
        <h2 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">Cili pastrim ju duhet?</h2>
        <ul className="mt-6 max-w-3xl border-t border-border">
          {situations.map((item) => (
            <li key={item.text} className="border-b border-border">
              <a
                href={serviceIndex[item.slug].path}
                className="flex min-h-14 flex-col justify-center gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <span>{item.text}</span>
                <span className="shrink-0 font-semibold text-primary underline underline-offset-4">
                  {serviceIndex[item.slug].navLabel}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="rregullt-apo-me-themel">
        <h2 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">Pastrim i rregullt apo me themel?</h2>
        {/* Phones: one block per type, so neither column hides behind a sideways scroll. */}
        <div className="mt-6 grid gap-8 md:hidden">
          {(
            [
              { title: "Pastrim i rregullt", key: "regular" },
              { title: "Pastrim me themel", key: "deep" },
            ] as const
          ).map((col) => (
            <div key={col.key}>
              <h3 className="border-b-2 border-primary pb-2 text-xl font-bold">{col.title}</h3>
              <dl className="divide-y divide-border">
                {comparison.map((row) => (
                  <div key={row.label} className="py-3">
                    <dt className="font-semibold">{row.label}</dt>
                    <dd className="mt-1 text-text-muted">{row[col.key]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <div className="mt-6 hidden max-w-4xl md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-primary">
                <td className="py-3 pr-4" />
                <th scope="col" className="py-3 pr-4 text-lg font-bold">
                  Pastrim i rregullt
                </th>
                <th scope="col" className="py-3 text-lg font-bold">
                  Pastrim me themel
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.label} className="border-b border-border align-top">
                  <th scope="row" className="py-4 pr-4 font-semibold">
                    {row.label}
                  </th>
                  <td className="py-4 pr-4 text-text-muted">{row.regular}</td>
                  <td className="py-4 text-text-muted">{row.deep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 flex flex-wrap gap-x-6">
          <TextLink href={serviceIndex.apartamente.path} className="text-primary">
            Pastrim i rregullt
          </TextLink>
          <TextLink href={serviceIndex["me-themel"].path} className="text-primary">
            Pastrim me themel
          </TextLink>
        </p>
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

      <BookingSection intro={'Nuk e dini cili ju duhet? Zgjidhni "Tjetër" dhe na tregoni për pronën; ju sugjerojmë ne.'} />
    </>
  );
}
