export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  content: string; // plain paragraphs, split on \n\n
}

// No posts published yet — this is the structure only, per prompts/01-initial-build.md.
// Add entries here (or swap for a CMS/DB-backed source later) once real posts exist.
export const blogPosts: BlogPost[] = [];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
