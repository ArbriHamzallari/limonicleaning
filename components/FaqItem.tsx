interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group rounded-lg border border-border bg-bg px-5 py-4 open:bg-bg-muted">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-text marker:content-none sm:text-lg">
        {question}
        <span
          aria-hidden
          className="shrink-0 font-display text-xl text-primary transition-transform duration-150 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">{answer}</p>
    </details>
  );
}
