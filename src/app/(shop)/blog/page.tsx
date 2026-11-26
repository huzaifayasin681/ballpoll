import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Container, PageFallback } from "@/components/ui/primitives";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import { GuidesClient, type GuidePostItem } from "@/components/shop/guides-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides & News",
  description: "How-tos, tips and safety advice for 8 Ball Pool players.",
};

async function getPosts() {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return db.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
}

export default function BlogPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <BlogBody />
    </Suspense>
  );
}

async function BlogBody() {
  const posts = await getPosts();
  const items: GuidePostItem[] = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    readMinutes: p.readMinutes,
    publishedAtLabel: formatDate(p.publishedAt),
  }));

  return (
    <div className="bg-cream pb-16">
      <ClubhousePageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }]}
        eyebrow="GUIDES & NEWS"
        title="The guide book"
        subtitle="How-tos, tips and safety advice for 8 Ball Pool players."
      />

      <Container className="mt-8">
        <GuidesClient posts={items} />
      </Container>
    </div>
  );
}
