interface SectionHeadingProps {
  title: string;
  intro?: string;
  id?: string;
  className?: string;
}

// h2 + an optional one-line intro. Colours come from the surrounding Section's tone
// (--fg-muted), so the same component works on light and dark sections.
export function SectionHeading({ title, intro, id, className = "" }: SectionHeadingProps) {
  return (
    <div className={`mb-8 max-w-2xl ${className}`}>
      <h2 id={id} className="text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {intro && <p className="mt-3 text-(--fg-muted)">{intro}</p>}
    </div>
  );
}
