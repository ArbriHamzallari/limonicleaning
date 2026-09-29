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
      <Section className="pt-14">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <article className="mx-auto mt-6 max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">Politika e Privatësisë</h1>
          <p className="mt-3 text-sm text-text-muted">Përditësuar së fundmi: 2026.</p>

          <p className="mt-8 leading-relaxed text-text-muted">
            Kjo faqe shpjegon çfarë të dhënash mbledh {business.name} kur përdor faqen tonë, si i
            përdorim ato dhe si mund të na kontaktosh për t&apos;i menaxhuar.
          </p>

          <h2 className="mt-10 font-display text-2xl font-semibold text-text">Çfarë të dhënash mbledhim</h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Kur plotëson formularin e rezervimit ose të kontaktit, mbledhim vetëm të dhënat që na jep
            direkt: emër, numër telefoni, email (opsional), adresë (opsionale), dhe detajet e
            rezervimit (lloji i pronës, data, ora, shërbimet e zgjedhura, shënime).
          </p>

          <h2 className="mt-10 font-display text-2xl font-semibold text-text">Si i përdorim</h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Përdorim këto të dhëna vetëm për të konfirmuar dhe organizuar shërbimin e kërkuar —
            përfshirë kontaktimin tënd në telefon ose WhatsApp. Nuk i shesim dhe nuk i ndajmë të
            dhënat tuaja me palë të treta për qëllime marketingu.
          </p>

          <h2 className="mt-10 font-display text-2xl font-semibold text-text">Ku ruhen të dhënat</h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Të dhënat e rezervimeve dhe mesazheve ruhen në një bazë të dhënash të sigurt. Njoftimet
            për rezervime dhe mesazhe të reja dërgohen përmes një shërbimi email (Resend). Këta
            ofrues përpunojnë të dhënat vetëm në emrin tonë, sipas kushteve të tyre të shërbimit.
          </p>

          <h2 className="mt-10 font-display text-2xl font-semibold text-text">Të drejtat e tua</h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Mund të kërkosh në çdo kohë të shohësh, korrigjosh ose fshish të dhënat që na ke dhënë,
            duke na kontaktuar në {business.phoneDisplay} ose në WhatsApp.
          </p>

          <h2 className="mt-10 font-display text-2xl font-semibold text-text">Cookies</h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Kjo faqe nuk përdor cookies gjurmimi apo reklamimi. Mund të përdoren cookie thjesht
            teknike të domosdoshme për funksionimin e faqes.
          </p>

          <h2 className="mt-10 font-display text-2xl font-semibold text-text">Kontakt</h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Për çdo pyetje rreth kësaj politike, na kontakto në {business.phoneDisplay}.
          </p>
        </article>
      </Section>
    </>
  );
}
