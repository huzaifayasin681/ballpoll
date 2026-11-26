"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { submitReviewAction } from "@/app/actions/reviews";
import { Button } from "@/components/ui/button";
import { Card, Input, Label, Select, Textarea } from "@/components/ui/primitives";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReviewItem {
  id: string;
  author: string;
  country: string;
  rating: number;
  body: string;
  verified: boolean;
  createdAt: string;
  productName: string;
  productSlug: string;
  categoryGroup: "Coins" | "Cues" | "Boosting" | "Passes";
}

export interface ReviewProductOption {
  id: string;
  slug: string;
  name: string;
}

const FILTERS = ["All", "Coins", "Cues", "Boosting", "Passes", "Verified"] as const;
type FilterTab = (typeof FILTERS)[number];

export function ReviewsClient({
  reviews,
  products,
  avgRating,
  totalCount,
}: {
  reviews: ReviewItem[];
  products: ReviewProductOption[];
  avgRating: number;
  totalCount: number;
}) {
  const [filter, setFilter] = useState<FilterTab>("All");
  const [rating, setRating] = useState<number>(5);
  const [selectedSlug, setSelectedSlug] = useState<string>(products[0]?.slug ?? "");
  const [state, action, pending] = useActionState<{ ok?: boolean; error?: string }, FormData>(
    submitReviewAction,
    {},
  );

  const distribution = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) {
      const clamped = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[clamped] = (counts[clamped] || 0) + 1;
    }
    const base = reviews.length || 1;
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star],
      pct: Math.round((counts[star] / base) * 100),
    }));
  }, [reviews]);

  const filtered = useMemo(() => {
    if (filter === "All") return reviews;
    if (filter === "Verified") return reviews.filter((r) => r.verified);
    return reviews.filter((r) => r.categoryGroup === filter);
  }, [reviews, filter]);

  const selectedProduct = products.find((p) => p.slug === selectedSlug) ?? products[0];

  return (
    <div className="space-y-8">
      {/* Rating summary Paper card */}
      <Card className="p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-center">
          <div className="flex flex-col items-start md:border-r md:border-border md:pr-8">
            <div className="font-display text-5xl font-semibold leading-none tracking-[-0.02em] text-ink">
              {avgRating.toFixed(1)}
            </div>
            <div className="mt-3 flex items-center gap-1" aria-label={`${avgRating.toFixed(1)} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "h-4 w-4",
                    n <= Math.round(avgRating) ? "fill-brass text-brass" : "text-border-strong",
                  )}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              Based on {totalCount.toLocaleString()} delivered orders
            </p>
          </div>

          <div className="space-y-2.5">
            {distribution.map((row) => (
              <div key={row.star} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-semibold text-ink">{row.star} ★</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-[2px] bg-cream border border-border/60">
                  <div
                    className="h-full bg-brass transition-all duration-300"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-[11px] text-muted">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((tab) => {
          const active = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={cn(
                "rounded-[2px] border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition",
                active
                  ? "border-felt bg-felt text-paper"
                  : "border-border bg-paper text-ink hover:border-brass",
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3-col editorial review cards */}
      {filtered.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted">
          No reviews match this category filter yet.
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Card key={r.id} className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-display text-3xl leading-none text-brass select-none" aria-hidden="true">
                    “
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={cn(
                          "h-3.5 w-3.5",
                          n <= r.rating ? "fill-brass text-brass" : "text-border-strong",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <blockquote className="mt-2 font-display text-[17px] italic leading-[1.45] text-ink">
                  “{r.body}”
                </blockquote>
              </div>

              <div className="mt-5 space-y-3 border-t border-border pt-4">
                <Link
                  href={`/product/${r.productSlug}`}
                  className="inline-flex items-center rounded-[2px] border border-border bg-cream/70 px-2.5 py-1 text-[11px] font-medium text-ink transition hover:border-brass hover:text-felt"
                >
                  {r.productName}
                </Link>
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  <span>
                    {r.author} · {r.country}
                  </span>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 text-felt">
                      <Check className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Write a review Paper card */}
      <Card id="write-review" className="p-6 md:p-8">
        <div className="mb-6 border-b border-border pb-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
            LEAVE FEEDBACK
          </div>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
            Write a review
          </h2>
          <p className="mt-1 text-sm text-muted">
            Tell fellow players how fast your coins, cue, or boost arrived.
          </p>
        </div>

        <form action={action} className="space-y-4">
          <input type="hidden" name="productId" value={selectedProduct?.id ?? ""} />
          <input type="hidden" name="slug" value={selectedProduct?.slug ?? ""} />
          <input type="hidden" name="rating" value={rating} />

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="review-author">Your name</Label>
              <Input
                id="review-author"
                name="author"
                required
                minLength={2}
                placeholder="e.g. Tariq K."
              />
            </div>

            <div>
              <Label htmlFor="review-product">Item ordered</Label>
              <Select
                id="review-product"
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="review-order">Order number (optional)</Label>
              <Input
                id="review-order"
                name="orderRef"
                placeholder="GPS-7F3K9Q"
              />
            </div>
          </div>

          <div>
            <Label>Rating</Label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} out of 5`}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-[2px] border transition",
                    star <= rating
                      ? "border-brass bg-accent-soft text-brass-dark"
                      : "border-border bg-paper text-muted hover:border-brass",
                  )}
                >
                  <Star className={cn("h-4 w-4", star <= rating ? "fill-brass text-brass" : "")} />
                </button>
              ))}
              <span className="ml-2 text-xs text-muted">{rating} out of 5 stars</span>
            </div>
          </div>

          <div>
            <Label htmlFor="review-body">Your review</Label>
            <Textarea
              id="review-body"
              name="body"
              rows={4}
              required
              minLength={8}
              placeholder="Share delivery speed, communication, and overall experience..."
            />
          </div>

          {state.error && (
            <p className="rounded-[2px] border border-danger-border bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
              {state.error}
            </p>
          )}
          {state.ok && (
            <p className="rounded-[2px] border border-felt/30 bg-felt/10 px-3 py-2 text-xs font-medium text-felt">
              Thank you — your review is now live in the ledger.
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={pending || !selectedProduct}>
              {pending ? "Posting..." : "POST REVIEW"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
