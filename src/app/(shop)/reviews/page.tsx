import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { getProducts, getStoreStats } from "@/lib/catalog";
import { Container, PageFallback } from "@/components/ui/primitives";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import { ReviewsClient, type ReviewItem } from "@/components/shop/reviews-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Verified 8 Ball Pool player reviews from customers after their order is delivered.",
};

async function getReviews() {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return db.review.findMany({
    where: { approved: true },
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
}

function classifyGroup(slug: string, categorySlug?: string): ReviewItem["categoryGroup"] {
  const s = `${slug} ${categorySlug ?? ""}`.toLowerCase();
  if (s.includes("cue")) return "Cues";
  if (s.includes("boost") || s.includes("ring") || s.includes("level") || s.includes("rank")) {
    return "Boosting";
  }
  if (s.includes("pass") || s.includes("vip") || s.includes("account") || s.includes("assist")) {
    return "Passes";
  }
  return "Coins";
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ReviewsBody />
    </Suspense>
  );
}

async function ReviewsBody() {
  const [rawReviews, products, stats] = await Promise.all([
    getReviews(),
    getProducts({}),
    getStoreStats(),
  ]);

  const catBySlug = new Map(products.map((p) => [p.slug, p.category?.slug]));

  const reviews: ReviewItem[] = rawReviews.map((r) => ({
    id: r.id,
    author: r.author,
    country: r.country,
    rating: r.rating,
    body: r.body,
    verified: r.verified,
    createdAt: r.createdAt.toISOString(),
    productName: r.product.name,
    productSlug: r.product.slug,
    categoryGroup: classifyGroup(r.product.slug, catBySlug.get(r.product.slug)),
  }));

  const productOptions = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
  }));

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : stats.avgRating || 4.9;

  return (
    <div className="bg-cream pb-16">
      <ClubhousePageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
        eyebrow="CUSTOMER REVIEWS"
        title="What players say"
        subtitle="Reviews come from customers after their order is delivered."
      />

      <Container className="mt-8">
        <ReviewsClient
          reviews={reviews}
          products={productOptions}
          avgRating={avgRating}
          totalCount={Math.max(stats.reviewCount, reviews.length)}
        />
      </Container>
    </div>
  );
}
