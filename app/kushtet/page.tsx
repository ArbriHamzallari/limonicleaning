import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { business } from "@/lib/business";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Kushtet e Shërbimit", path: "/kushtet" }];

export const metadata = pageMetadata({
  title: "Kushtet e Shërbimit",
  description: "Kushtet e shërbimit të Limoni Cleaning: si funksionojnë kërkesat për ofertë, oferta, shtyrja ose anulimi i pastrimit dhe si trajtohen shqetësimet tuaja.",
  path: "/kushtet",
});

export default function KushtetPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-6 sm:pt-10">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <article className="mx-auto mt-6 max-w-3xl">
          <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">Kushtet e Shërbimit</h1>
          <p className="mt-3 text-sm text-text-muted">Përditësuar së fundmi: shtator 2026.</p>

          <h2 className="mt-10 text-2xl font-bold">Kërkesat për ofertë</h2>
          <p className="mt-3 text-text-muted">
            Një kërkesë e dërguar nga faqja nuk është rezervim. Pasi e marrim, ju kontaktojmë në
            telefon ose në WhatsApp, pyesim për pronën dhe ju japim ofertën. Pastrimi caktohet vetëm
            kur bini dakord për ofertën, ditën dhe orën.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Oferta</h2>
          <p className="mt-3 text-text-muted">
            Faqja nuk publikon tarifa. Oferta varet nga madhësia dhe gjendja e pronës, lloji i
            pastrimit dhe shërbimet shtesë të kërkuara, dhe konfirmohet me ju para pastrimit.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Shtyrja dhe anulimi</h2>
          <p className="mt-3 text-text-muted">
            Nëse duhet ta shtyni ose ta anuloni pastrimin, na njoftoni sa më shpejt në telefon ose
            në WhatsApp.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Përgjegjësia</h2>
          <p className="mt-3 text-text-muted">
            Ekipi ynë trajton çdo pronë me kujdes. Nëse keni ndonjë shqetësim për punën e kryer, na
            njoftoni brenda 24 orëve nga përfundimi i shërbimit, që ta zgjidhim.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Kontakt</h2>
          <p className="mt-3 text-text-muted">
            Për çdo pyetje rreth këtyre kushteve, na kontaktoni në {business.phoneDisplay}.
          </p>
        </article>
      </Section>
    </>
  );
}
