import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { TextLink } from "@/components/TextLink";
import { ContactActions } from "@/components/ContactActions";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Faqja nuk u gjet",
  robots: { index: false, follow: true },
};

// Replaces Next.js's default English 404 so a wrong or old link still leads somewhere useful.
export default function NotFound() {
  return (
    <Section className="pt-10 sm:pt-16">
      <div className="max-w-2xl">
        <p className="text-lg font-semibold text-text-muted">Gabim 404</p>
        <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">
          Kjo faqe nuk ekziston
        </h1>
        <p className="mt-5 text-xl text-text-muted">
          Lidhja mund të jetë e vjetër ose e shkruar gabim. Ja ku mund të vazhdoni:
        </p>
      </div>

      <ul className="mt-8 grid max-w-3xl border-t border-border sm:grid-cols-2 sm:gap-x-10">
        <li className="border-b border-border">
          <TextLink href="/" className="text-primary">
            Kryefaqja
          </TextLink>
        </li>
        {services.map((s) => (
          <li key={s.slug} className="border-b border-border">
            <TextLink href={s.path} className="text-primary">
              {s.navLabel}
            </TextLink>
          </li>
        ))}
        <li className="border-b border-border">
          <TextLink href="/puna-jone" className="text-primary">
            Puna jonë
          </TextLink>
        </li>
      </ul>

      <div className="mt-12">
        <p className="mb-4 text-lg font-semibold">Po kërkonit një ofertë?</p>
        <ContactActions placement="not_found" />
      </div>
    </Section>
  );
}
