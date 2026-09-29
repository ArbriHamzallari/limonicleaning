import { Section } from "./Section";
import { WhatsAppButton } from "./WhatsAppButton";
import { PhoneButton } from "./PhoneButton";
import { LeadForm } from "./LeadForm";
import { FaqItem } from "./FaqItem";
import { TextLink } from "./TextLink";
import { closerSteps, type FaqEntry } from "@/lib/content";
import type { ServiceSlug } from "@/lib/service-index";

interface CloserProps {
  service?: ServiceSlug;
  /** Overrides the service WhatsApp message (homepage uses the fill-in template). */
  whatsappMessage?: string;
  placement: string;
  faq?: FaqEntry[];
  faqTitle?: string;
}

// The end of every main page: WhatsApp first, phone second, what happens next, then the
// form as the quieter alternative, then a few questions.
export function Closer({ service, whatsappMessage, placement, faq, faqTitle = "Pyetjet që na bëni më shpesh" }: CloserProps) {
  return (
    <Section id="na-shkruani" className="border-t border-border">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <h2 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
            Keni një pronë për të pastruar?
          </h2>
          <p className="mt-4 max-w-xl text-xl text-text-muted">
            Na shkruani në WhatsApp zonën, madhësinë e pronës dhe llojin e pastrimit. Ju përgjigjemi me
            ofertën.
          </p>
          <WhatsAppButton
            service={service}
            message={whatsappMessage}
            placement={`${placement}_closer`}
            size="lg"
            className="mt-8 w-full sm:w-auto"
          >
            Na shkruani në WhatsApp
          </WhatsAppButton>
          <p className="mt-6 text-text-muted">Preferoni telefonin?</p>
          <PhoneButton
            placement={`${placement}_closer`}
            variant="link"
            showIcon={false}
            className="text-2xl font-bold no-underline! hover:underline!"
          >
            068 900 7252
          </PhoneButton>
        </div>

        <ol className="grid content-start gap-6 lg:col-span-5">
          {closerSteps.map((step, i) => (
            <li key={step.title} className="flex gap-4 border-t border-border pt-5">
              <span aria-hidden className="text-xl font-extrabold text-primary">
                {i + 1}
              </span>
              <p>
                <strong className="font-bold">{step.title}</strong> <span className="text-text-muted">{step.text}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-16 max-w-3xl">
        <p className="mb-4 text-lg font-semibold">Ose na lini numrin dhe ju telefonojmë ne:</p>
        <LeadForm service={service} placement={`${placement}_form`} />
      </div>

      {faq && faq.length > 0 && (
        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{faqTitle}</h2>
          <div className="mt-6 border-t border-border">
            {faq.map((entry) => (
              <FaqItem key={entry.question} question={entry.question} answer={entry.answer} />
            ))}
          </div>
          <TextLink href="/faq" className="mt-4 text-primary">
            Të gjitha pyetjet
          </TextLink>
        </div>
      )}
    </Section>
  );
}
