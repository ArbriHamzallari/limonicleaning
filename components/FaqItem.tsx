interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group rounded-lg border border-border bg-bg open:bg-bg-muted">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-lg font-semibold text-text marker:content-none">
        {question}
        <span
          aria-hidden
          className="shrink-0 text-2xl leading-none text-primary transition-transform duration-150 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="px-5 pb-5 text-text-muted">{answer}</p>
    </details>
  );
}
