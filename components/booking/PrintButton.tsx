"use client";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="inline-flex min-h-12 items-center rounded-full border-2 border-primary/30 px-5 font-semibold text-primary print:hidden">
      Printo
    </button>
  );
}
