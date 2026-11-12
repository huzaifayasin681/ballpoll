import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import type { Metadata } from "next";
import { Badge, Card, Container, PageFallback } from "@/components/ui/primitives";
import { Markdown } from "@/components/markdown";
import { JsonLd } from "@/components/json-ld";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";

async function getPost(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return db.blogPost.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return { title: "Guide" };
  return { title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` } };
}

async function BlogPostBody({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || !post.published) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: site.name },
  };

  return (
    <Container className="max-w-3xl space-y-8 py-10">
      <JsonLd data={schema} />
      <Link href="/blog" className="text-xs text-muted hover:text-foreground">
        ← All guides
      </Link>
      <article>
        <Badge tone="green">
          {post.category} · {post.readMinutes} min read
        </Badge>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">{post.title}</h1>
        <p className="mt-2 text-xs text-muted">Published {formatDate(post.publishedAt)}</p>
        <Card className="mt-6 p-6 sm:p-8">
          <Markdown body={post.body} />
        </Card>
      </article>
    </Container>
  );
}

export default function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <BlogPostBody {...props} />
    </Suspense>
  );
}
