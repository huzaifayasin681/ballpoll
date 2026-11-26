import { Suspense } from "react";
import type { Metadata } from "next";
import { PageFallback } from "@/components/ui/primitives";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { AdminPostsClient, type AdminPostRecord } from "@/components/admin/admin-posts-client";

export const metadata: Metadata = {
  title: "Admin: Posts & SEO Publisher",
  robots: { index: false, follow: false },
};

async function AdminPostsBody() {
  const actor = await requireRole(["ADMIN"]);
  const rawPosts = await db.blogPost.findMany({
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  const posts: AdminPostRecord[] = rawPosts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    body: p.body,
    category: p.category,
    coverImage: p.coverImage ?? null,
    coverAlt: p.coverAlt ?? null,
    tags: Array.isArray(p.tags) ? p.tags : [],
    authorName: p.authorName ?? "GlobalPool Editorial",
    metaTitle: p.metaTitle ?? null,
    metaDesc: p.metaDesc ?? null,
    focusKeyword: p.focusKeyword ?? null,
    canonicalUrl: p.canonicalUrl ?? null,
    noIndex: Boolean(p.noIndex),
    featured: Boolean(p.featured),
    readMinutes: p.readMinutes,
    published: p.published,
    publishedAt: p.publishedAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <AdminPostsClient
      posts={posts}
      defaultAuthor={actor.name || "GlobalPool Editorial"}
      siteUrl={site.url}
    />
  );
}

export default function AdminPostsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AdminPostsBody />
    </Suspense>
  );
}
