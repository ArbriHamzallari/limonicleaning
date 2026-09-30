import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { services } from "@/lib/services";
import { blogPosts } from "@/lib/blog";

// Fixed dates, bumped by hand when a page's content really changes. Stamping every URL
// with the build time tells search engines nothing.
const CONTENT_UPDATED = "2026-09-30";
const LEGAL_UPDATED = "2026-09-29";

const staticRoutes: { path: string; lastModified: string }[] = [
  { path: "", lastModified: CONTENT_UPDATED },
  { path: "/sherbime", lastModified: CONTENT_UPDATED },
  { path: "/kerko-oferte", lastModified: CONTENT_UPDATED },
  { path: "/puna-jone", lastModified: CONTENT_UPDATED },
  { path: "/rreth-nesh", lastModified: CONTENT_UPDATED },
  { path: "/faq", lastModified: CONTENT_UPDATED },
  { path: "/kontakt", lastModified: CONTENT_UPDATED },
  { path: "/privatesia", lastModified: LEGAL_UPDATED },
  { path: "/kushtet", lastModified: LEGAL_UPDATED },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = staticRoutes.map((r) => ({ url: `${siteUrl}${r.path}`, lastModified: r.lastModified }));
  const serviceRoutes = services.map((s) => ({ url: `${siteUrl}${s.path}`, lastModified: CONTENT_UPDATED }));

  // /blog joins the sitemap with its first real post.
  const blogRoutes = blogPosts.length
    ? [
        { url: `${siteUrl}/blog`, lastModified: blogPosts[0].publishedAt },
        ...blogPosts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: p.publishedAt })),
      ]
    : [];

  return [...routes, ...serviceRoutes, ...blogRoutes];
}
