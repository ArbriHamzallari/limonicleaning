import Link from "next/link";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { blogPosts } from "@/lib/blog";
import { waMessages } from "@/lib/whatsapp-messages";

const breadcrumbItems = [{ name: "Kryefaqja", path: "/" }, { name: "Blog", path: "/blog" }];

export const metadata = pageMetadata({
  title: "Blog",
  description: "Këshilla dhe informacione rreth pastrimit profesional të Airbnb-ve, apartamenteve, vilave dhe zyrave.",
  path: "/blog",
});

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      <Section className="pt-14">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">Blog</h1>
        <p className="mt-3 max-w-2xl text-lg text-text-muted">
          Këshilla dhe informacione rreth pastrimit profesional. Artikujt e parë po vijnë së shpejti.
        </p>
      </Section>

      <Section tone="muted">
        {blogPosts.length === 0 ? (
          <Card className="mx-auto max-w-xl text-center">
            <p className="font-display text-lg italic text-primary/80">Së shpejti</p>
            <p className="mt-2 text-text-muted">
              Nuk ka ende artikuj të publikuar. Na shkruaj në WhatsApp nëse ke një pyetje specifike —
              përgjigjemi direkt.
            </p>
            <WhatsAppLink
              message={waMessages.contact}
              source="blog_empty_state"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-primary-hover active:translate-y-0"
            >
              Na shkruaj në WhatsApp
            </WhatsAppLink>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full transition-colors group-hover:border-primary/40">
                  <h2 className="font-display text-lg font-semibold text-text group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-text-muted">{post.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
