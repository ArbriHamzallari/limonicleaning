import { Section } from "./Section";
import { CheckIcon, MinusIcon } from "./icons";
import { assessmentBenefit } from "@/lib/assessment";
import type { PracticalInfo as PracticalInfoData } from "@/lib/services";

function List({ items, excluded = false }: { items: string[]; excluded?: boolean }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          {excluded ? (
            <MinusIcon className="mt-1 h-5 w-5 shrink-0 text-text-muted" />
          ) : (
            <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-primary" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// "Para se të kërkoni ofertë": who it's for, what's not included, how it's priced and how to
// prepare. Same four headings on every service page, page-specific content (lib/services.ts).
export function PracticalInfo({ info, id = "para-ofertes" }: { info: PracticalInfoData; id?: string }) {
  const blocks = [
    info.audience?.length ? { title: "Për kë është", body: <List items={info.audience} /> } : null,
    info.excluded?.length
      ? {
          title: "Çfarë nuk përfshihet",
          body: (
            <>
              <span className="sr-only">Këto nuk përfshihen:</span>
              <List items={info.excluded} excluded />
            </>
          ),
        }
      : null,
    {
      title: "Si caktohet çmimi",
      body: (
        <>
          <p className="mt-4 text-text-muted">{info.pricing}</p>
          <p className="mt-3 font-semibold">{assessmentBenefit}</p>
        </>
      ),
    },
    info.preparation?.length ? { title: "Para pastrimit", body: <List items={info.preparation} /> } : null,
  ].filter((b): b is { title: string; body: React.JSX.Element } => !!b);

  return (
    <Section tone="muted" id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Para se të kërkoni ofertë</h2>
      <div className="mt-8 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {blocks.map((block) => (
          <div key={block.title} className="border-t-2 border-primary pt-5">
            <h3 className="text-xl font-bold">{block.title}</h3>
            {block.body}
          </div>
        ))}
      </div>
    </Section>
  );
}
