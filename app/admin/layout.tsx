import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Paneli", template: "%s | Paneli Limoni" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">{children}</div>;
}
