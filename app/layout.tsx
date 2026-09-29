import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileStickyCta } from "@/components/MobileStickyCta";
import { Analytics } from "@/components/Analytics";
import { JsonLd, localBusinessJsonLd, organizationJsonLd, websiteJsonLd, siteUrl } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

// Display serif, used only for headings — pairs against Inter's neutrality to give the
// brand an editorial, considered voice instead of a single-typeface SaaS default.
// latin-ext covers ë/ç for Albanian headings set in this face.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Limoni Cleaning — Pastrim Profesional në Tiranë",
    template: "%s | Limoni Cleaning",
  },
  description:
    "Pastrim profesional për Airbnb, apartamente, vila dhe zyra në Tiranë. Rezervo online, telefon ose WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sq" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Kalo te përmbajtja
        </a>
        <JsonLd data={localBusinessJsonLd()} />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <Header />
        <main id="main-content" className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
        <Footer />
        <MobileStickyCta />
        <Analytics />
      </body>
    </html>
  );
}
