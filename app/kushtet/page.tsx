import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { business } from "@/lib/business";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Kushtet e Shërbimit", path: "/kushtet" }];

export const metadata = pageMetadata({
  title: "Kushtet e shërbimit",
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
          <p className="mt-3 text-sm text-text-muted">Përditësuar së fundmi: nëntor 2026.</p>

          <h2 className="mt-10 text-2xl font-bold">Kërkesat për ofertë</h2>
          <p className="mt-3 text-text-muted">
            Një kërkesë e dërguar nga faqja nuk është rezervim. Pasi e marrim, ju kontaktojmë në
            telefon ose në WhatsApp, pyesim për pronën dhe ju japim ofertën. Pastrimi caktohet vetëm
            kur bini dakord për ofertën, ditën dhe orën.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Kërkesa, data dhe konfirmimi</h2>
          <p className="mt-3 text-text-muted">
            Çmimi dhe lista e punëve që shihni kur dërgoni kërkesën janë paraprake. Nëse faqja ju tregon
            se një orar është mbajtur, ai mbahet përkohësisht vetëm ndërsa e shqyrtojmë kërkesën; nuk është
            pastrim i konfirmuar. Nëse zgjidhni një datë të preferuar, ajo nuk mbahet. Kur pas shqyrtimit
            ndryshojmë çmimin, punët ose datën, ju dërgojmë një ofertë të rishikuar dhe pastrimi
            konfirmohet vetëm nëse e pranoni. Pastrimi konfirmohet kur biem dakord për vendndodhjen,
            punët, çmimin dhe datën. Kërkesën mund ta anuloni nga lidhja juaj private ose duke na shkruar.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Oferta</h2>
          <p className="mt-3 text-text-muted">
            Për pastrimin me themel të apartamenteve, faqja tregon një çmim orientues për metër katror
            në lekë të reja. Ai nuk është ofertë përfundimtare dhe nuk vlen për shtëpi, vila ose
            shërbime të tjera. Për të gjitha shërbimet, oferta varet nga
            madhësia dhe gjendja e pronës, lloji i pastrimit dhe punët që përfshihen, dhe totali
            konfirmohet me shkrim para pastrimit. Për zonat jashtë Tiranës, mundësinë dhe kostot e
            transportit i sqarojmë paraprakisht.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Plani i pastrimit dhe oferta me shkrim</h2>
          <p className="mt-3 text-text-muted">
            Pas vlerësimit (me telefon, me foto nëse dëshironi, ose me vizitë kur duhet) ju dërgojmë
            pa pagesë planin e pastrimit dhe ofertën me shkrim. Marrja e ofertës nuk ju detyron të
            rezervoni pastrimin. Nëse një vizitë vlerësimi ka ndonjë kosto, jua themi përpara dhe vijmë
            vetëm pasi të bini dakord.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Shtyrja dhe anulimi</h2>
          <p className="mt-3 text-text-muted">
            Nëse duhet ta shtyni ose ta anuloni pastrimin, na njoftoni sa më shpejt në telefon ose
            në WhatsApp.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Përgjegjësia</h2>
          <p className="mt-3 text-text-muted">
            Ekipi ynë trajton çdo pronë me kujdes. Nëse keni ndonjë shqetësim për punën e kryer, na
            njoftoni në telefon ose në WhatsApp dhe e shqyrtojmë bashkë.
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
