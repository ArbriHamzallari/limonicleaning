import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MediaFrame } from "@/components/MediaFrame";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { PortfolioVideo } from "@/components/PortfolioVideo";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { AirbnbWhatsAppQuote } from "@/components/AirbnbWhatsAppQuote";
import { FaqItem } from "@/components/FaqItem";
import { JsonLd, breadcrumbJsonLd, pageMetadata, serviceJsonLd, faqJsonLd } from "@/lib/seo";
import { getServiceBySlug, airbnbCleaningChecklist, faqEntries } from "@/lib/content";
import { waMessages } from "@/lib/whatsapp-messages";

const service = getServiceBySlug("pastrim-airbnb")!;
const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Shërbimet", path: "/sherbime" },
  { name: service.name, path: service.path },
];

// The first six entries in faqEntries are the Airbnb-focused cluster (see lib/content.ts).
const airbnbFaqEntries = faqEntries.slice(0, 6);

export const metadata = pageMetadata({
  title: "Pastrim Airbnb në Tiranë",
  description:
    "Pastrim Airbnb në Tiranë për përgatitjen e pronës pas check-out dhe para mysafirit tjetër. Oferta përcaktohet sipas pronës dhe frekuencës së pastrimit.",
  path: service.path,
});

export default function Page() {
  return (
    <>
      <JsonLd data={serviceJsonLd(service.name, service.description, service.path)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd data={faqJsonLd(airbnbFaqEntries)} />

      {/* Intro */}
      <Section className="pt-14">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-display text-lg italic text-primary/80">Nga check-out te prona gati për mysafirin tjetër</p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
              Pastrim Airbnb në Tiranë
            </h1>
            <p className="mt-4 text-lg text-text-muted">{service.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppLink
                message={waMessages.airbnb}
                source="service_pastrim_airbnb"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Na shkruaj në WhatsApp
              </WhatsAppLink>
              <Button href="#oferta" variant="outline">
                Si përcaktohet oferta
              </Button>
            </div>
          </div>
          <MediaFrame
            label="Foto — dhomë Airbnb e përgatitur"
            src="/images/ekipi-shtrim-shtrati-tirane.jpg"
            alt="Punonjëse e Limoni Cleaning duke përgatitur shtratin për një turnover Airbnb"
            aspect="aspect-[5/4]"
            priority
          />
        </div>
      </Section>

      {/* What the cleaning includes, room by room */}
      <Section tone="muted">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Çfarë përfshin pastrimi</h2>
        <p className="mt-3 max-w-2xl text-text-muted">
          Pastrojmë dhe përgatisim pronën sipas nevojave të saj dhe shërbimit të rënë dakord.
          Përmbledhja më poshtë tregon çfarë mbulon zakonisht një pastrim Airbnb.
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {airbnbCleaningChecklist.map((group) => (
            <div key={group.category}>
              <h3 className="font-semibold text-text">{group.category}</h3>
              <ul className="mt-3 space-y-1.5">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-text-muted">
                    <span aria-hidden className="text-primary">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {service.addOns && service.addOns.length > 0 && (
          <p className="mt-8 max-w-2xl border-t border-border pt-6 text-sm text-text-muted">
            {service.addOns.join(" ")}
          </p>
        )}
      </Section>

      {/* Turnover process */}
      <Section>
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Si funksionon një turnover</h2>
        <ol className="mt-8 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
          <li>
            <span className="font-display text-xl italic text-primary/50">01</span>
            <h3 className="mt-1.5 font-semibold text-text">Pastrimi</h3>
            <p className="mt-1 text-sm text-text-muted">Dhoma, banjo, kuzhinë, sipërfaqe dhe dysheme.</p>
          </li>
          <li>
            <span className="font-display text-xl italic text-primary/50">02</span>
            <h3 className="mt-1.5 font-semibold text-text">Përgatitja</h3>
            <p className="mt-1 text-sm text-text-muted">
              Ndërrimi i çarçafëve kur janë në dispozicion dhe organizimi i apartamentit.
            </p>
          </li>
          <li>
            <span className="font-display text-xl italic text-primary/50">03</span>
            <h3 className="mt-1.5 font-semibold text-text">Kontrolli final</h3>
            <p className="mt-1 text-sm text-text-muted">Një kontroll i fundit përpara se prona të jetë gati.</p>
          </li>
        </ol>
      </Section>

      {/* Recurring service for multiple properties */}
      <Section tone="dark">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="font-display text-lg italic text-accent">Për pronarë me disa Airbnb</p>
            <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
              Një partner për pastrimin e pronës suaj, jo vetëm një pastrim i vetëm
            </h2>
            <p className="mt-4 max-w-xl text-text-on-dark-muted">
              Nëse keni një ose disa Airbnb, rëndësi ka jo vetëm pastrimi i një apartamenti, por
              organizimi i pastrimeve sipas kalendarit të pronës. Për pastrime të përsëritura,
              oraret mund të organizohen sipas nevojave dhe kalendarit të pronës.
            </p>
          </div>
          <div className="lg:col-span-4">
            <Button href="/pronare-airbnb" variant="secondary" className="w-full sm:w-auto">
              Shiko për pronarë Airbnb
            </Button>
          </div>
        </div>
      </Section>

      {/* Real photo/video proof */}
      <Section tone="muted">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Puna jonë</h2>
        <p className="mt-3 max-w-2xl text-text-muted">Një pastrim i mirë duhet të shihet, jo vetëm të përshkruhet.</p>
        <div className="mt-8">
          <BeforeAfterSlider
            beforeSrc="/images/pastrim-apartamenti-para.jpg"
            afterSrc="/images/pastrim-apartamenti-mbas.jpg"
            beforeAlt="Dhomë ndenjeje para pastrimit, me rrëmujë dhe mbeturina"
            afterAlt="E njëjta dhomë ndenjeje pas pastrimit nga Limoni Cleaning, e rregullt dhe e pastër"
            caption="Dhomë ndenjeje — para dhe mbas pastrimit"
            aspect="aspect-[4/3]"
            className="mx-auto max-w-xl"
          />
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:max-w-lg sm:mx-auto">
          <PortfolioVideo
            src="/videos/puna-jone-vizite-apartamenti-1.mp4"
            poster="/images/puna-jone-vizite-apartamenti-1.jpg"
            caption="Apartament — pas pastrimit të plotë"
          />
          <PortfolioVideo
            src="/videos/puna-jone-vizite-apartamenti-2.mp4"
            poster="/images/puna-jone-vizite-apartamenti-2.jpg"
            caption="Apartament që mirëmbajmë rregullisht"
          />
        </div>
        <div className="mt-8 text-center">
          <Button href="/puna-jone" variant="outline">
            Shiko të gjitha →
          </Button>
        </div>
      </Section>

      {/* How pricing is assessed — no public Airbnb price, ever */}
      <Section id="oferta">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Si përcaktohet oferta?</h2>
        <p className="mt-4 max-w-2xl text-text-muted">
          Çdo pronë është ndryshe. Nuk kemi një çmim unik për çdo Airbnb — e vlerësojmë shërbimin
          sipas pronës, madhësisë, kërkesave dhe frekuencës së pastrimit.
        </p>
        <p className="mt-3 max-w-2xl text-text-muted">Na duhen vetëm disa informacione paraprake:</p>
        <ul className="mt-3 max-w-2xl space-y-1.5">
          {["Sa Airbnb keni?", "Sa m² është secila?", "Sa herë në muaj nevojitet mesatarisht pastrimi për pronë?", "Në cilat zona ndodhen?"].map(
            (q) => (
              <li key={q} className="flex gap-2 text-text-muted">
                <span aria-hidden className="text-primary">✓</span>
                {q}
              </li>
            )
          )}
        </ul>
        <p className="mt-4 max-w-2xl text-sm text-text-muted">
          Pas këtyre informacioneve, ju kontaktojmë për të kuptuar më mirë pronat dhe për të
          përcaktuar ofertën.
        </p>
        <AirbnbWhatsAppQuote
          variant="light"
          source="pastrim_airbnb_oferta"
          className="mt-6 max-w-md rounded-lg border border-border bg-bg-muted p-5"
        />
      </Section>

      {/* FAQ */}
      <Section tone="muted">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Pyetje të shpeshta</h2>
        <div className="mt-8 space-y-3">
          {airbnbFaqEntries.map((entry) => (
            <FaqItem key={entry.question} question={entry.question} answer={entry.answer} />
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section tone="warm">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">Na tregoni për pronën</h2>
          <p className="max-w-xl text-text-muted">
            Na shkruani në WhatsApp me disa detaje të pronës dhe ju kontaktojmë për ofertën.
          </p>
          <WhatsAppLink
            message={waMessages.airbnb}
            source="pastrim_airbnb_final_cta"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Na shkruaj në WhatsApp
          </WhatsAppLink>
        </div>
      </Section>
    </>
  );
}
