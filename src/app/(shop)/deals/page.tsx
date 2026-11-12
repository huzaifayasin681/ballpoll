import { Suspense } from "react";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Flame, Tag } from "lucide-react";
import { Badge, Card, Container, PageFallback, SectionHeading } from "@/components/ui/primitives";
import { ProductCard } from "@/components/shop/product-card";
import { Countdown } from "@/components/shop/countdown";
import { db } from "@/lib/db";
import { getActiveSales, getProducts, saleFor } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Flash Deals & Discount Bundles",
  description: "Limited-time discounts on 8 Ball Pool coins, cash, cues and boosting services.",
};

async function getCoupons() {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return db.coupon.findMany({ where: { isActive: true } });
}

async function DealsBody() {
  const [sales, products, coupons] = await Promise.all([
    getActiveSales(),
    getProducts({}),
    getCoupons(),
  ]);
  const discounted = products.filter((p) => saleFor(sales, p.slug) || p.variants.some((v) => v.compareCents));

  return (
    <Container className="space-y-12 py-10">
      <SectionHeading
        eyebrow="Deals"
        title="Flash Sales & Discount Bundles"
        subtitle="Time-limited price drops and active promo codes."
      />

      {sales.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {sales.map((s) => (
            <Card key={s.id} className="flex flex-col items-start justify-between gap-4 border-accent-border bg-accent-soft p-4 sm:flex-row sm:items-center sm:p-6">
              <div>
                <Badge tone="gold">
                  <Flame className="h-3 w-3" /> {s.percentOff}% OFF
                </Badge>
                <h2 className="mt-2 font-display text-lg sm:text-xl font-bold text-foreground">{s.title}</h2>
                <p className="text-xs sm:text-sm text-muted">{s.subtitle}</p>
              </div>
              <div className="sm:text-right">
                <p className="mb-1 text-xs text-muted">Ends in</p>
                <Countdown endsAt={s.endsAt.toISOString()} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {coupons.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {coupons.map((c) => (
            <div key={c.id} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-brand-border bg-brand-soft px-4 py-2 text-sm">
              <Tag className="h-4 w-4 text-brand" />
              <span>
                Use code <strong className="font-mono text-brand">{c.code}</strong> at checkout for <strong>{c.percentOff}% off</strong>
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {discounted.map((p) => (
          <ProductCard key={p.id} product={p} sale={saleFor(sales, p.slug)} />
        ))}
      </div>
    </Container>
  );
}

export default function DealsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <DealsBody />
    </Suspense>
  );
}
