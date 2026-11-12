import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { business } from "@/lib/business";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Politika e Privatësisë", path: "/privatesia" }];

export const metadata = pageMetadata({
  title: "Politika e privatësisë",
  description: "Si i mbledh, i përdor dhe i ruan Limoni Cleaning të dhënat që na jepni kur kërkoni ofertë për pastrim, dhe si mund të kërkoni t'i shihni ose t'i fshini.",
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
          <p className="mt-3 text-sm text-text-muted">Përditësuar së fundmi: nëntor 2026.</p>

          <p className="mt-8 text-text-muted">
            Kjo faqe shpjegon çfarë të dhënash mbledh {business.name} kur përdorni faqen tonë, si i
            përdorim dhe si mund të na kontaktoni për to.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Çfarë të dhënash mbledhim</h2>
          <p className="mt-3 text-text-muted">
            Kur plotësoni formularin e kërkesës për vlerësim, ruajmë vetëm atë që na jepni: emrin,
            numrin e telefonit, llojin e pastrimit dhe mënyrën si preferoni t&apos;ju kontaktojmë.
            Nëse i plotësoni, ruajmë edhe zonën ose qytetin, sipërfaqen, gjendjen e pronës, kohën ose
            datën që preferoni, mënyrën e vlerësimit, zonat që ju interesojnë dhe mesazhin. Ruajmë
            gjithashtu faqen nga u dërgua kërkesa dhe, kur ekziston, burimin e reklamës (UTM), që të
            kuptojmë si na gjetët. Formulari nuk kërkon adresën e saktë dhe nuk ngarkon foto.
          </p>
          <p className="mt-3 text-text-muted">
            Kur dërgoni një kërkesë për vlerësim, ruajmë edhe përgjigjet për pronën, datën ose orën që
            zgjidhni dhe, nëse i shkruani, email-in dhe lagjen ose adresën e pronës. Email-in e
            përdorim vetëm për t&apos;ju shkruar për këtë kërkesë. Nëse i ngarkoni, ruajmë edhe fotot
            dhe videot. Fotot dhe videot ruhen privatisht, jo në
            lidhje publike: i shohim vetëm ne, kur shqyrtojmë kërkesën, dhe nuk analizohen automatikisht.
            Nuk u jepen automatikisht të gjithë punonjësve. Fotot nga telefoni mund të përmbajnë të dhëna
            të vendndodhjes; nëse nuk doni t&apos;i ndani, fotografoni pa to ose vazhdoni pa foto. Skedarët
            që ngarkohen por nuk dërgohen me një kërkesë fshihen brenda 24 orëve. Fotot që na dërgoni në
            WhatsApp mbeten në bisedën tuaj me ne dhe nuk ruhen nga kjo faqe.
          </p>
          <p className="mt-3 text-text-muted">
            Pas dërgimit merrni një lidhje private për kërkesën tuaj. Kushdo që e ka lidhjen mund ta
            shohë kërkesën, prandaj mos ua jepni të tjerëve. Në kalendarin tonë të brendshëm (Google
            Calendar) shënojmë vetëm llojin e shërbimit dhe orën, pa emrin, numrin apo fotot tuaja. Faqja nuk i ruan në pajisjen tuaj emrin, numrin ose mesazhin që shkruani në
            formular: ato mbahen vetëm në memorien e faqes derisa ta dërgoni ose ta mbyllni. (Shfletuesi
            juaj mund t&apos;i mbajë mend vetë, nëse keni aktivizuar plotësimin automatik.)
          </p>

          <h2 className="mt-10 text-2xl font-bold">Si i përdorim</h2>
          <p className="mt-3 text-text-muted">
            Numrin e përdorim vetëm për t&apos;ju kontaktuar për këtë kërkesë, në telefon ose në
            WhatsApp, dhe për të organizuar pastrimin nëse bini dakord. Nuk i shesim dhe nuk i ndajmë
            të dhënat tuaja me palë të treta për qëllime marketingu.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Ku ruhen të dhënat</h2>
          <p className="mt-3 text-text-muted">
            Kërkesat ruhen në bazën tonë të të dhënave, te ofruesi i hostimit të faqes (Vercel) dhe
            ofruesi i bazës së të dhënave; fotot dhe videot te ofruesi ynë i ruajtjes së skedarëve. Orët e
            punëve shënohen në Google Calendar, pa të dhëna personale. Njoftimi për çdo kërkesë të re na vjen me email (përmes
            Resend) dhe, kur është aktivizuar, në WhatsApp (përmes WhatsApp Business të Meta-s). Këta
            ofrues i përpunojnë të dhënat në emrin tonë, sipas kushteve të tyre.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Të drejtat tuaja</h2>
          <p className="mt-3 text-text-muted">
            Mund të kërkoni në çdo kohë të shihni, të korrigjoni ose të fshini të dhënat, fotot dhe
            videot që na keni dhënë, duke na kontaktuar në {business.phoneDisplay} ose në WhatsApp.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Cookies</h2>
          <p className="mt-3 text-text-muted">
            Kjo faqe nuk përdor cookies reklamimi dhe vetë nuk vendos cookies. Në shfletuesin tuaj ruan
            vetëm dy gjëra pa të dhëna personale: burimin e reklamës (UTM) deri sa të mbyllni skedën, dhe
            nëse keni mbyllur sugjerimin për ta shtuar faqen në ekranin kryesor. Nëse aktivizohet Google
            Analytics, ai përdor cookies për të matur vizitat; nuk i dërgojmë emra, numra ose mesazhe.
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
