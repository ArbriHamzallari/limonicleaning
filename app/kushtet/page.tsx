import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { business } from "@/lib/business";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Kushtet e Shërbimit", path: "/kushtet" }];

export const metadata = pageMetadata({
  title: "Kushtet e Shërbimit",
  description: "Kushtet e përdorimit të shërbimeve të pastrimit të Limoni Cleaning.",
  path: "/kushtet",
});

export default function KushtetPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-14">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <article className="mx-auto mt-6 max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">Kushtet e Shërbimit</h1>
          <p className="mt-3 text-sm text-text-muted">Përditësuar së fundmi: 2026.</p>

          <h2 className="mt-10 font-display text-2xl font-semibold text-text">Rezervimet</h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Një rezervim e bërë përmes faqes konsiderohet kërkesë fillestare. Ekipi ynë e konfirmon
            çdo rezervim përmes telefonit ose WhatsApp përpara ditës së shërbimit.
          </p>

          <h2 className="mt-10 font-display text-2xl font-semibold text-text">Çmimet</h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Çmimet e listuara në faqen /cmimet janë orientuese sipas tipologjisë së pronës. Çmimi
            final mund të ndryshojë në varësi të madhësisë, gjendjes së pronës dhe shërbimeve
            shtesë të kërkuara, dhe konfirmohet përpara kryerjes së shërbimit.
          </p>

          <h2 className="mt-10 font-display text-2xl font-semibold text-text">Anulimi dhe ndryshimi</h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Për anulim ose ndryshim të një rezervimi, na kontakto sa më shpejt të jetë e mundur në
            telefon ose WhatsApp.
          </p>

          <h2 className="mt-10 font-display text-2xl font-semibold text-text">Përgjegjësia</h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Ekipi ynë trajton çdo pronë me kujdes maksimal. Nëse ka ndonjë shqetësim rreth punës së
            kryer, na njofto brenda 24 orëve nga përfundimi i shërbimit, në mënyrë që ta adresojmë.
          </p>

          <h2 className="mt-10 font-display text-2xl font-semibold text-text">Kontakt</h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Për çdo pyetje rreth këtyre kushteve, na kontakto në {business.phoneDisplay}.
          </p>
        </article>
      </Section>
    </>
  );
}
