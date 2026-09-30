// Fails if any page renders the same image twice (prompt 04 photo rule).
// Run after `npm run build`: `npm run check:images`. Reads the prerendered HTML.
import { readFileSync, existsSync } from "node:fs";

const pages = [
  "index",
  "pastrim-apartamentesh-tirane",
  "pastrim-airbnb-tirane",
  "pastrim-zyrash-tirane",
  "pastrim-vilash-tirane",
  "pastrim-me-themel-tirane",
  "pastrim-pas-ndertimit-tirane",
  "pastrim-hotelesh-tirane",
];

let failed = false;
for (const page of pages) {
  const file = `.next/server/app/${page}.html`;
  if (!existsSync(file)) {
    console.error(`missing ${file}: run npm run build first`);
    process.exit(1);
  }
  const html = readFileSync(file, "utf8").replace(/<link[^>]*>/g, "");
  const srcs = [...html.matchAll(/<img[^>]*?\ssrc="([^"]+)"/g)].map((m) => {
    const url = new URL(m[1].replace(/&amp;/g, "&"), "https://x");
    return url.searchParams.get("url") ?? url.pathname;
  });
  const posters = [...html.matchAll(/poster="([^"]+)"/g)].map((m) => {
    const url = new URL(m[1].replace(/&amp;/g, "&"), "https://x");
    return url.searchParams.get("url") ?? url.pathname;
  });
  const all = [...srcs, ...posters].filter((s) => !s.includes("logo"));
  const dupes = [...new Set(all.filter((s, i) => all.indexOf(s) !== i))];
  if (dupes.length) {
    failed = true;
    console.error(`✗ /${page === "index" ? "" : page}: ${dupes.join(", ")}`);
  } else {
    console.log(`✓ /${page === "index" ? "" : page}: ${all.length} images, all unique`);
  }
}
process.exit(failed ? 1 : 0);
