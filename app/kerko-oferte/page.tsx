import { Suspense } from "react";
import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeadForm } from "@/components/LeadForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PhoneButton } from "@/components/PhoneButton";
import { CheckList } from "@/components/icons";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { howItWorks } from "@/lib/content";
import { LeadFormFromQuery } from "./LeadFormFromQuery";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Kërko ofertë", path: "/kerko-oferte" },
];

export const metadata = pageMetadata({
  title: "Kërko Ofertë për Pastrim",
  description:
    "Kërkoni ofertë për pastrim në Tiranë: shtëpi, zyrë, vilë, Airbnb ose pas ndërtimit. Na lini emrin dhe numrin, ose na shkruani direkt në WhatsApp.",
  path: "/kerko-oferte",
});

export default function KerkoOfertePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-6 sm:pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">
              Kërkoni ofertë për pastrim
            </h1>
            <p className="mt-4 text-xl text-text-muted">
              Na lini emrin dhe numrin. Ju kontaktojmë, pyesim për pronën dhe ju japim ofertën.
            </p>
            <div className="mt-8">
              {/* ?sherbimi=zyra preselects the service; the fallback is the same form, unselected. */}
              <Suspense fallback={<LeadForm placement="kerko_oferte" />}>
                <LeadFormFromQuery />
              </Suspense>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-lg bg-bg-muted p-6 sm:p-8">
              <h2 className="text-xl font-bold">Më shpejt në WhatsApp ose në telefon?</h2>
              <p className="mt-2 text-text-muted">Na shkruani ose na telefononi direkt.</p>
              <div className="mt-5 grid gap-3">
                <WhatsAppButton placement="kerko_oferte_aside" size="lg" />
                <PhoneButton placement="kerko_oferte_aside" size="lg" />
              </div>
              <h2 className="mt-10 text-xl font-bold">Çfarë ndodh më pas</h2>
              <CheckList items={howItWorks} className="mt-4" />
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
