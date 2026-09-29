import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { business } from "@/lib/business";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Politika e Privatësisë", path: "/privatesia" }];

export const metadata = pageMetadata({
  title: "Politika e Privatësisë",
  description: "Si mbledh, përdor dhe ruan Limoni Cleaning të dhënat e klientëve.",
  path: "/privatesia",
});

export default function PrivatesiaPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-6 sm:pt-10">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <article className="mx-auto mt-6 max-w-3xl">
          <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">Politika e Privatësisë</h1>
          <p className="mt-3 text-sm text-text-muted">Përditësuar së fundmi: shtator 2026.</p>

          <p className="mt-8 text-text-muted">
            Kjo faqe shpjegon çfarë të dhënash mbledh {business.name} kur përdorni faqen tonë, si i
            përdorim dhe si mund të na kontaktoni për to.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Çfarë të dhënash mbledhim</h2>
          <p className="mt-3 text-text-muted">
            Kur plotësoni formularin e kërkesës për ofertë, ruajmë vetëm atë që na jepni: emrin,
            numrin e telefonit, llojin e pastrimit, mënyrën si preferoni t&apos;ju kontaktojmë, dhe
            nëse i shkruani, zonën dhe mesazhin. Ruajmë gjithashtu faqen nga u dërgua kërkesa dhe,
            kur ekziston, burimin e reklamës (UTM), që të kuptojmë si na gjetët.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Si i përdorim</h2>
          <p className="mt-3 text-text-muted">
            Numrin e përdorim vetëm për t&apos;ju kontaktuar për këtë kërkesë, në telefon ose në
            WhatsApp, dhe për të organizuar pastrimin nëse bini dakord. Nuk i shesim dhe nuk i ndajmë
            të dhënat tuaja me palë të treta për qëllime marketingu.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Ku ruhen të dhënat</h2>
          <p className="mt-3 text-text-muted">
            Kërkesat ruhen në një bazë të dhënash të sigurt. Njoftimi për çdo kërkesë të re na vjen
            me email (përmes Resend) dhe, kur është aktiv, në WhatsApp (përmes WhatsApp Business të
            Meta-s). Këta ofrues i përpunojnë të dhënat vetëm në emrin tonë, sipas kushteve të tyre.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Të drejtat e tua</h2>
          <p className="mt-3 text-text-muted">
            Mund të kërkoni në çdo kohë të shihni, të korrigjoni ose të fshini të dhënat që na keni
            dhënë, duke na kontaktuar në {business.phoneDisplay} ose në WhatsApp.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Cookies</h2>
          <p className="mt-3 text-text-muted">
            Kjo faqe nuk përdor cookies reklamimi. Mund të përdoren cookies teknike të domosdoshme
            për funksionimin e faqes, dhe, nëse aktivizohet, Google Analytics për të matur vizitat.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Kontakt</h2>
          <p className="mt-3 text-text-muted">
            Për çdo pyetje rreth kësaj politike, na kontaktoni në {business.phoneDisplay}.
          </p>
        </article>
      </Section>
    </>
  );
}
