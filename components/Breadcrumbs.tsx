import Link from "next/link";

interface BreadcrumbsProps {
  items: { name: string; path: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Shtegu i faqes" className="mb-4 text-base text-text-muted">
      <ol className="flex flex-wrap items-center gap-x-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-x-2">
              {i > 0 && (
                <span aria-hidden className="text-text-muted/60">
                  /
                </span>
              )}
              {isLast ? (
                <span aria-current="page" className="font-medium text-text">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="inline-flex min-h-12 items-center underline-offset-4 hover:text-primary hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
