import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeadActions } from "@/components/LeadActions";
import { Photo } from "@/components/Photo";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { aboutValues } from "@/lib/content";
import { photos } from "@/lib/photos";
import { prago } from "@/lib/business";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Rreth nesh", path: "/rreth-nesh" },
];

export const metadata = pageMetadata({
  title: "Rreth Nesh",
  description:
    "Njihuni me Limoni Cleaning, kompani pastrimi në Tiranë me bazë në Komunën e Parisit dhe ekip me mbi 10 vjet eksperiencë. Na shkruani në WhatsApp.",
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
              Kompania është e re, por njerëzit që e përbëjnë kanë mbi 10 vjet eksperiencë në pastrim
              profesional. Deri tani kemi pastruar mbi 50 prona.
            </p>
            <p className="mt-4 text-text-muted">
              Pjesa më e madhe e punës sonë sot vjen nga pastrimi Airbnb, një shërbim që kërkon
              rregull dhe organizim sipas kalendarit të pronës. Jemi partner zyrtar i {prago.name}, një
              kompani e veçantë që merret me menaxhimin e pronave me qira ditore.
            </p>
          </div>
          <Photo
            src={photos.kitchen.src}
            alt={photos.kitchen.alt}
            aspect="aspect-[4/5]"
            className="mx-auto w-full max-w-md lg:max-w-none"
            priority
          />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading title="Si punojmë" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {aboutValues.map((value) => (
            <div key={value.title} className="rounded-lg border border-border bg-bg p-6">
              <h3 className="text-xl font-bold">{value.title}</h3>
              <p className="mt-2 text-text-muted">{value.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title="Flisni me ne" intro="Na tregoni për pronën dhe ju japim ofertën." />
        <LeadActions placement="rreth_nesh_footer" />
      </Section>
    </>
  );
}
