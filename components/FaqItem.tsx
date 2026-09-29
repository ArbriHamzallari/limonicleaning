interface FaqItemProps {
  question: string;
  answer: string;
}

// Hairline-divided rows, no boxes. Wrap a list of these in a container with `border-t`.
export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group border-b border-border">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold marker:content-none">
        {question}
        <span
          aria-hidden
          className="shrink-0 text-2xl leading-none text-primary transition-transform duration-150 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="pb-5 text-(--fg-muted)">{answer}</p>
    </details>
  );
}
