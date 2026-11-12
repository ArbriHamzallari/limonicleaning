import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileStickyCta } from "@/components/MobileStickyCta";
import { Analytics } from "@/components/Analytics";
import { InstallPromptListener } from "@/components/InstallShortcut";
import { AttributionCapture } from "@/components/AttributionCapture";
import { JsonLd, siteGraphJsonLd, siteUrl } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

// Display headings only (uppercase, condensed). The latin subset (U+0000-00FF) already holds
// ë and ç. Not preloaded: on most pages it is below the fold, and a preload competes with the
// hero image; the size-matched fallback shows until it arrives.
const display = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: "800",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kompani Pastrimi në Tiranë | Limoni Cleaning",
    template: "%s | Limoni Cleaning",
  },
  description:
    "Pastrim profesional për shtëpi, zyra, vila dhe Airbnb në Tiranë. Na lini numrin ose na shkruani në WhatsApp dhe ju japim ofertën.",
  applicationName: "Limoni Cleaning",
  appleWebApp: { capable: true, title: "Limoni", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  // Lets env(safe-area-inset-bottom) work for the mobile action bar on iPhones.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sq" className={`${inter.variable} ${display.variable} h-full antialiased`}>
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
        <InstallPromptListener />
        <AttributionCapture />
        <Analytics />
      </body>
    </html>
  );
}
