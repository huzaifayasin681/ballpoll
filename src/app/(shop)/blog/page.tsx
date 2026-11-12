import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Badge, Card, Container, PageFallback, SectionHeading } from "@/components/ui/primitives";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "8 Ball Pool Guides, Tips & Blog",
  description: "Guides on earning coins, unlocking legendary cues, climbing leagues and keeping your 8 Ball Pool account secure.",
};

async function getPosts() {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return db.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
}

async function BlogIndexBody() {
  const posts = await getPosts();
  return (
    <Container className="space-y-10 py-10">
      <SectionHeading
        eyebrow="Blog & Guides"
        title="8 Ball Pool Tips & Guides"
        subtitle="Practical articles on coins, cues, leagues and account security."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="group">
            <Card className="flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-brand/50">
              <div className="flex items-center justify-between text-xs text-muted">
                <Badge tone="green">{p.category}</Badge>
                <span>{p.readMinutes} min read</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-foreground group-hover:text-brand">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted">{p.excerpt}</p>
              <p className="mt-4 text-xs text-muted">{formatDate(p.publishedAt)} · Read article →</p>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}

export default function BlogIndexPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <BlogIndexBody />
    </Suspense>
  );
}
