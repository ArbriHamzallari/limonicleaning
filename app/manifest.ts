import type { MetadataRoute } from "next";

// Optional Home Screen shortcut ("Shto Limoni në ekranin kryesor"). Opens the quote page with
// a fixed campaign tag so these leads can be told apart; never carries form values.
// No service worker on purpose: Chromium doesn't need one to install, and not caching pages
// means an installed shortcut can never show an old price or an old form.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Limoni Cleaning",
    short_name: "Limoni",
    description: "Kërkoni vlerësim dhe ofertë për pastrim në Tiranë, ose na shkruani në WhatsApp.",
    lang: "sq",
    dir: "ltr",
    start_url: "/kerko-oferte?utm_source=homescreen",
    scope: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    prefer_related_applications: false,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
