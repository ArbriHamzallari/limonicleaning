import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { services } from "@/lib/content";
import { blogPosts } from "@/lib/blog";

const staticRoutes = [
  "",
  "/sherbime",
  "/pronare-airbnb",
  "/cmimet",
  "/rezervo",
  "/puna-jone",
  "/rreth-nesh",
  "/faq",
  "/kontakt",
  "/blog",
  "/privatesia",
  "/kushtet",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${siteUrl}${s.path}`,
    lastModified: now,
  }));

  const extraRoutes = ["/pastrim-me-themel-tirane"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));

  const blogRoutes = blogPosts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.publishedAt,
  }));

  return [...routes, ...serviceRoutes, ...extraRoutes, ...blogRoutes];
}
