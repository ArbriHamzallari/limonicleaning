import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PhoneButton } from "@/components/PhoneButton";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { assessmentBenefit, visitNote } from "@/lib/assessment";
import { isServiceKey, type ServiceKey } from "@/lib/booking/catalog";
import { storageDriver } from "@/lib/booking/storage";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Kërko ofertë", path: "/kerko-oferte" },
];

export const metadata = pageMetadata({
  title: "Kërko vlerësim dhe ofertë për pastrim",
  description:
    "Kërkoni vlerësim për pastrim në Tiranë: plan pastrimi dhe ofertë me shkrim, pa pagesë. Shtëpi, zyrë, vilë ose pas ndërtimit. Ose na shkruani në WhatsApp.",
  path: "/kerko-oferte",
});

const nextSteps = [
  "Arbri e shqyrton kërkesën, fotot dhe datën.",
  "Nëse duhet, ju pyet për detaje ose cakton një vlerësim.",
  "Merrni ofertën: e njëjta, ose një e rishikuar që e pranoni ju.",
  "Pastrimi konfirmohet vetëm pasi të biem dakord.",
];

/** ?sherbimi= from service pages; /per-biznese sends "biznese", which maps to offices. */
function preselect(param: string | string[] | undefined): ServiceKey | undefined {
  const v = Array.isArray(param) ? param[0] : param;
  if (v === "biznese") return "zyra";
  return isServiceKey(v) ? v : undefined;
}

export default async function KerkoOfertePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const initial = preselect((await searchParams).sherbimi);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-6 sm:pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* min-w-0: grid items default to min-width:auto, so a long file name would widen the page. */}
          <div className="min-w-0 lg:col-span-8">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">Kërkoni vlerësim dhe ofertë</h1>
            <p className="mt-3 text-xl text-text-muted">
              Disa pyetje të shkurtra, foto nëse doni, dhe një datë. {assessmentBenefit}
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-5 lg:hidden">
              <span className="text-text-muted">Më shpejt?</span>
              <WhatsAppButton placement="kerko_oferte_top" variant="link">
                WhatsApp
              </WhatsAppButton>
              <PhoneButton placement="kerko_oferte_top" variant="link" showIcon={false}>
                068 900 7252
              </PhoneButton>
            </p>
            <div className="mt-6">
              <BookingWizard key={initial ?? "none"} initialService={initial} uploadsEnabled={storageDriver() !== null} />
            </div>
          </div>
          <aside className="min-w-0 lg:col-span-4">
            <div className="rounded-lg bg-bg-muted p-6">
              <h2 className="text-xl font-bold">Çfarë ndodh më pas</h2>
              <ol className="mt-4 grid gap-3">
                {nextSteps.map((s, i) => (
                  <li key={s} className="flex gap-3">
                    <span aria-hidden className="font-extrabold text-primary">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-base text-text-muted">{visitNote}</p>
              <h2 className="mt-8 text-xl font-bold">Preferoni të flisni direkt?</h2>
              <div className="mt-4 grid gap-3">
                <WhatsAppButton placement="kerko_oferte_aside" size="lg" />
                <PhoneButton placement="kerko_oferte_aside" size="lg" />
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
