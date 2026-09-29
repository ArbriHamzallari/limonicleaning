import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MediaFrame } from "@/components/MediaFrame";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { aboutValues } from "@/lib/content";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Rreth nesh", path: "/rreth-nesh" }];

export const metadata = pageMetadata({
  title: "Rreth Nesh",
  description:
    "Limoni Cleaning është kompani pastrimi në Tiranë, me bazë në Komuna e Parisit. Ekip me mbi 10 vjet eksperiencë të kombinuar, i specializuar në pastrim Airbnb.",
  path: "/rreth-nesh",
});

export default function RrethNeshPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      <Section className="pt-14">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-lg font-semibold text-primary">
              &ldquo;Ju kujdeseni për pronën. Ne kujdesemi për pastërtinë.&rdquo;
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">Rreth nesh</h1>
            <p className="mt-4 text-lg text-text-muted">
              Limoni Cleaning është kompani pastrimi në Tiranë, me bazë në Komuna e Parisit.
              Punojmë me apartamente, prona Airbnb dhe biznese, me fokus praktik te ekzekutimi —
              jo premtime.
            </p>
            <p className="mt-4 text-text-muted">
              Ekipi ynë sjell mbi 10 vjet eksperiencë të kombinuar në pastrim dhe mirëmbajtje
              ambientesh. Limoni Cleaning si kompani është e re, por njerëzit që e përbëjnë kanë
              punuar në pastrim profesional shumë kohë përpara saj.
            </p>
            <p className="mt-4 text-text-muted">
              Pjesa më e madhe e punës sonë sot vjen nga pastrimi Airbnb — një shërbim që kërkon
              qëndrueshmëri dhe organizim rreth kalendarit të pronës, jo vetëm një pastrim të
              rastësishëm.
            </p>
          </div>
          <MediaFrame
            label="Foto e ekipit"
            src="/images/ekipi-pastrim-kuzhine-tirane.jpg"
            alt="Punonjëse e Limoni Cleaning duke pastruar kuzhinën e një apartamenti në Tiranë"
            aspect="aspect-[5/4]"
            priority
          />
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Si punojmë</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {aboutValues.map((value) => (
            <Card key={value.title}>
              <h3 className="font-semibold text-text">{value.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{value.description}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
