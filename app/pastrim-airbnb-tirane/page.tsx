import { ServicePage } from "@/components/ServicePage";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { CheckList } from "@/components/icons";
import { serviceMetadata } from "@/lib/services";
import { prago } from "@/lib/business";

export const metadata = serviceMetadata("airbnb");

// Merged in from the old /pronare-airbnb page (which now redirects to #pronare).
function OwnersSection() {
  return (
    <Section tone="dark" id="pronare">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            title="Për pronarë me disa prona"
            intro="Kur keni një ose disa prona, rëndësi ka jo vetëm pastrimi, por edhe organizimi i tij sipas kalendarit. Na tregoni sa prona keni dhe sa shpesh ndërrohen mysafirët, dhe e planifikojmë bashkë."
          />
          <CheckList
            iconClassName="text-accent"
            items={[
              "I njëjti standard në çdo pastrim",
              "Kontroll final para çdo mysafiri",
              "Organizim sipas kalendarit të pronës",
              "Komunikim direkt në WhatsApp",
            ]}
          />
        </div>
        <div className="rounded-lg border border-border-on-dark p-6 sm:p-8">
          <h3 className="text-xl font-bold">Ju duhet edhe menaxhimi i pronës?</h3>
          <p className="mt-3 text-text-on-dark-muted">
            Partneri ynë zyrtar, {prago.name}, merret me menaxhimin e pronave në Airbnb, nga kalendari
            te komunikimi me mysafirët. Limoni Cleaning dhe {prago.name} janë dy kompani të ndara: ne
            pastrojmë, ata menaxhojnë.
          </p>
          <a
            href={prago.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-12 items-center font-semibold text-accent underline decoration-2 underline-offset-4"
          >
            Njihuni me {prago.name}
          </a>
        </div>
      </div>
    </Section>
  );
}

export default function Page() {
  return (
    <ServicePage slug="airbnb">
      <OwnersSection />
    </ServicePage>
  );
}
