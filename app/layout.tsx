import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileStickyCta } from "@/components/MobileStickyCta";
import { Analytics } from "@/components/Analytics";
import { JsonLd, siteGraphJsonLd, siteUrl } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kompani Pastrimi në Tiranë | Limoni Cleaning",
    template: "%s | Limoni Cleaning",
  },
  description:
    "Pastrim profesional për shtëpi, zyra, vila dhe Airbnb në Tiranë. Na lini numrin ose na shkruani në WhatsApp dhe ju japim ofertën.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sq" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-base focus:font-semibold focus:text-white"
        >
          Kalo te përmbajtja
        </a>
        <JsonLd data={siteGraphJsonLd()} />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileStickyCta />
        <Analytics />
      </body>
    </html>
  );
}
