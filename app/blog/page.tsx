import Link from "next/link";
import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactActions } from "@/components/ContactActions";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { blogPosts } from "@/lib/blog";

const breadcrumbItems = [
  { name: "Kryefaqja", path: "/" },
  { name: "Blog", path: "/blog" },
];

// Noindex and out of the sitemap/nav until the first real article exists (prompt 03, D5).
export const metadata = pageMetadata({
  title: "Blog",
  description: "Këshilla për pastrimin e shtëpisë, të zyrës dhe të pronave Airbnb nga ekipi i Limoni Cleaning.",
  path: "/blog",
  noindex: blogPosts.length === 0,
});

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-6 sm:pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">Blog</h1>

        {blogPosts.length === 0 ? (
          <div className="mt-8 max-w-2xl">
            <p className="text-xl text-text-muted">
              Ende nuk kemi publikuar artikuj. Nëse keni një pyetje për pastrimin, na shkruani.
            </p>
            <ContactActions placement="blog_empty" className="mt-8" />
          </div>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <li key={post.slug} className="rounded-lg border border-border p-6">
                <h2 className="text-xl font-bold">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-text-muted">{post.description}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
