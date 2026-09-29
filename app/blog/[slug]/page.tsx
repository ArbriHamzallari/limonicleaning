import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog";
import { waMessages } from "@/lib/whatsapp-messages";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}` });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const breadcrumbItems = [
    { name: "Kryefaqja", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  const publishedDate = new Intl.DateTimeFormat("sq-AL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.publishedAt));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Section className="pt-14">
        <article className="mx-auto max-w-3xl">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="font-display text-sm italic text-text-muted">
            <time dateTime={post.publishedAt}>{publishedDate}</time>
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-8">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 text-text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
              ← Të gjithë artikujt
            </Link>
            <WhatsAppLink
              message={waMessages.contact}
              source="blog_post_footer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              Na shkruaj në WhatsApp
            </WhatsAppLink>
          </div>
        </article>
      </Section>
    </>
  );
}
