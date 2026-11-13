import { business } from "@/lib/business";
import { businessPage, services } from "@/lib/services";
import { serviceAreaLine } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

// /llms.txt: a plain summary for AI search engines, built from the same data as the site so it
// never says more than the pages do. Static: generated at build time.
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${business.name}`,
    "",
    `> Kompani pastrimi në Tiranë, Shqipëri, me bazë në Komunën e Parisit. Ekip me mbi 10 vjet përvojë në pastrim (përvoja e ekipit; kompania është e re). Mbi 50 prona të pastruara. Pastrim për biznese dhe shtëpi: pastrim me themel, pastrim i rregullt dhe mirëmbajtje e rregullt. ${serviceAreaLine} Pastrimi me themel i apartamenteve ka një çmim orientues nga 250 lekë të reja/m² (për 80 m², 20.000 lekë të reja), me larjen e divanit dhe të të gjithë dyshekëve të apartamentit të përfshirë; totali konfirmohet pas vlerësimit. Shtëpitë, vilat dhe shërbimet e tjera ofertohen pas vlerësimit. Plani i pastrimit dhe oferta me shkrim jepen pa pagesë.`,
    "",
    `Kontakt: telefon dhe WhatsApp ${business.phoneDisplay} (${business.whatsappUrl})${business.email ? `, email ${business.email}` : ""}.`,
    "",
    "## Shërbimet",
    ...services.map((s) => `- [${s.navLabel}](${siteUrl}${s.path}): ${s.summary}`),
    "",
    "## Për biznese",
    `- [${businessPage.navLabel}](${siteUrl}${businessPage.path}): ${businessPage.summary}`,
    "",
    "## Faqe të tjera",
    `- [Puna jonë](${siteUrl}/puna-jone): foto dhe video reale nga pastrimet`,
    `- [Rreth nesh](${siteUrl}/rreth-nesh)`,
    `- [Pyetje të shpeshta](${siteUrl}/faq)`,
    `- [Kërko ofertë](${siteUrl}/kerko-oferte)`,
    `- [Kontakt](${siteUrl}/kontakt)`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
