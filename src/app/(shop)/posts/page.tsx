import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { PenSquare } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { Container, PageFallback } from "@/components/ui/primitives";
import { JsonLd } from "@/components/json-ld";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import { PostsFeedClient, type PublicPostItem } from "@/components/shop/posts-feed-client";

export const metadata: Metadata = {
  title: "8 Ball Pool Posts, Guides & Strategy Articles",
  description:
    "Read SEO-curated 8 Ball Pool posts, coin strategies, legendary cue guides, Berlin & Venice ring tips, and account safety updates.",
  keywords: [
    "8 ball pool posts",
    "8 ball pool guides",
    "8 ball pool tips",
    "legendary cues guide",
    "8 ball pool coins strategy",
    "berlin ring guide",
  ],
  alternates: { canonical: "/posts" },
  openGraph: {
    type: "website",
    title: `8 Ball Pool Posts & Strategy Articles | ${site.name}`,
    description:
      "Read 8 Ball Pool posts, coin strategies, legendary cue breakdowns, ring tips, and safety updates.",
    url: `${site.url}/posts`,
    siteName: site.name,
    images: [{ url: "/images/pool/cues-legendary.png", width: 1200, height: 630, alt: "8 Ball Pool Posts" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `8 Ball Pool Posts & Strategy Articles | ${site.name}`,
    description: "Latest 8 Ball Pool posts, legendary cue breakdowns, and pro tips.",
    images: ["/images/pool/cues-legendary.png"],
  },
};

async function getPublishedPosts() {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return db.blogPost.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });
}

async function PostsBody({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; category?: string; q?: string }>;
}) {
  const [posts, user, sp] = await Promise.all([
    getPublishedPosts(),
    getCurrentUser(),
    searchParams,
  ]);

  const items: PublicPostItem[] = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    coverImage: p.coverImage ?? null,
    coverAlt: p.coverAlt ?? null,
    tags: Array.isArray(p.tags) ? p.tags : [],
    authorName: p.authorName ?? "GlobalPool Editorial",
    featured: Boolean(p.featured),
    readMinutes: p.readMinutes,
    publishedAtIso: p.publishedAt.toISOString(),
    publishedAtLabel: formatDate(p.publishedAt),
  }));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Posts & Articles | ${site.name}`,
    description: metadata.description,
    url: `${site.url}/posts`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${site.url}/posts/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <div className="bg-cream pb-16">
      <JsonLd data={collectionSchema} />
      <ClubhousePageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Posts" }]}
        eyebrow="CLUBHOUSE DISPATCH"
        title="Posts & Strategy Articles"
        subtitle="In-depth 8 Ball Pool posts, cue breakdowns, ring strategies, and updates."
      />

      <Container className="mt-8 space-y-6">
        {user?.role === "ADMIN" && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-brass/50 bg-accent-soft px-4 py-3 text-xs">
            <span className="font-medium text-ink">
              Signed in as <strong className="font-semibold text-felt">ADMIN</strong> — create or manage posts and SEO settings in the studio.
            </span>
            <Link
              href="/admin/posts"
              className="inline-flex h-8 items-center gap-1.5 rounded-[2px] border border-felt bg-felt px-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-paper hover:bg-felt-deep"
            >
              <PenSquare className="h-3.5 w-3.5" /> Admin Post Publisher
            </Link>
          </div>
        )}

        <PostsFeedClient
          posts={items}
          initialTag={sp.tag ?? ""}
          initialCategory={sp.category ?? "All"}
          initialQuery={sp.q ?? ""}
        />
      </Container>
    </div>
  );
}

export default function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; category?: string; q?: string }>;
}) {
  return (
    <Suspense fallback={<PageFallback />}>
      <PostsBody searchParams={searchParams} />
    </Suspense>
  );
}
