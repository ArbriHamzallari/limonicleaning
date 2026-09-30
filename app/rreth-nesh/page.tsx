import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactActions } from "@/components/ContactActions";
import { Photo } from "@/components/Photo";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { aboutValues } from "@/lib/content";
import { photos, naturalAspect } from "@/lib/photos";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Rreth nesh", path: "/rreth-nesh" },
];

export const metadata = pageMetadata({
  title: "Rreth Nesh: Ekipi i Pastrimit në Tiranë",
  description:
    "Njihuni me Limoni Cleaning, kompani pastrimi në Tiranë me bazë në Komunën e Parisit dhe ekip me mbi 10 vjet përvojë. Na shkruani në WhatsApp.",
  path: "/rreth-nesh",
});

export default function RrethNeshPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      <Section className="pt-6 sm:pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">Rreth nesh</h1>
            <p className="mt-4 text-xl text-text-muted">
              Limoni Cleaning është kompani pastrimi në Tiranë, me bazë në Komunën e Parisit. Pastrojmë
              apartamente, shtëpi, prona Airbnb dhe ambiente biznesi.
            </p>
            <p className="mt-4 text-text-muted">
              Kompania është e re, por njerëzit që e përbëjnë kanë mbi 10 vjet përvojë në pastrim, të
              fituar në kompani të tjera pastrimi. Deri tani kemi pastruar mbi 50 prona.
            </p>
            <p className="mt-4 text-text-muted">
              Pjesa më e madhe e punës sonë sot është pastrimi Airbnb, ku gjithçka varet nga kalendari
              i pronës: vijmë pas check-out-it dhe e lëmë pronën gati për mysafirin tjetër.
            </p>
          </div>
          <Photo
            src={photos.kitchen.src}
            alt={photos.kitchen.alt}
            aspect={naturalAspect(photos.kitchen)}
            className="mx-auto w-full max-w-sm lg:max-w-none"
            priority
          />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading title="Si punojmë" />
        <dl className="grid border-t border-border sm:grid-cols-2 sm:gap-x-10">
          {aboutValues.map((value) => (
            <div key={value.title} className="border-b border-border py-5">
              <dt className="text-xl font-bold">{value.title}</dt>
              <dd className="mt-2 text-text-muted">{value.description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <SectionHeading title="Flisni me ne" intro="Na tregoni për pronën dhe ju japim ofertën." />
        <ContactActions placement="rreth_nesh_footer" />
      </Section>
    </>
  );
}
