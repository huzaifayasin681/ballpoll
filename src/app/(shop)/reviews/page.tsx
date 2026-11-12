import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Badge, Card, Container, PageFallback, SectionHeading, Stars } from "@/components/ui/primitives";
import { db } from "@/lib/db";
import { getStoreStats } from "@/lib/catalog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Customer Reviews & Testimonials",
  description: "Read customer reviews and ratings across our 8 Ball Pool coins, cues, accounts and boosting services.",
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

async function ReviewsBody() {
  const [reviews, stats] = await Promise.all([getReviews(), getStoreStats()]);

  return (
    <Container className="space-y-10 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Trust & Reviews"
          title="Customer Reviews"
          subtitle="Reviews submitted by signed-in customers with a completed order carry the Verified Buyer badge."
        />
        <Card className="flex items-center gap-4 px-5 py-3">
          <div>
            <p className="font-display text-2xl font-bold text-foreground">{stats.avgRating.toFixed(1)} / 5</p>
            <Stars rating={stats.avgRating} />
          </div>
          <div className="border-l border-border pl-4 text-xs text-muted">
            <p className="font-semibold text-foreground">{stats.reviewCount} reviews</p>
            <p>{stats.completed} orders delivered</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <Card key={r.id} className="flex flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between">
                <Stars rating={r.rating} />
                {r.verified ? <Badge tone="green">Verified Buyer</Badge> : <Badge tone="gray">Sample</Badge>}
              </div>
              <p className="mt-3 text-sm text-foreground">&ldquo;{r.body}&rdquo;</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted">
              <span>
                {r.author} ({r.country}) · {formatDate(r.createdAt)}
              </span>
              <Link href={`/product/${r.product.slug}`} className="text-brand hover:underline">
                {r.product.name}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ReviewsBody />
    </Suspense>
  );
}
