import { CheckIcon } from "./icons";
import type { ChecklistItem } from "@/lib/services";

// Two-column list with a thin check and hairline dividers. No boxes.
export function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <ul className="grid border-t border-border sm:grid-cols-2 sm:gap-x-10">
      {items.map((item) => {
        const key = typeof item === "string" ? item : item.label;
        return (
          <li key={key} className="flex gap-3 border-b border-border py-4">
            <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-primary" />
            {typeof item === "string" ? (
              <span>{item}</span>
            ) : (
              <span>
                <strong className="font-bold">{item.label}.</strong>{" "}
                <span className="text-(--fg-muted)">{item.text}</span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
