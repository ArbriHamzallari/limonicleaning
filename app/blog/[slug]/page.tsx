import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeadActions } from "@/components/LeadActions";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog";

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
      <Section className="pt-6 sm:pt-10">
        <article className="mx-auto max-w-3xl">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-text-muted">
            <time dateTime={post.publishedAt}>{publishedDate}</time>
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-8">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 text-text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <LeadActions placement="blog_post" />
            <Link href="/blog" className="mt-6 inline-flex min-h-12 items-center font-medium text-primary underline underline-offset-4">
              Të gjithë artikujt
            </Link>
          </div>
        </article>
      </Section>
    </>
  );
}
