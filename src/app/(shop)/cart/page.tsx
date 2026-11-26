import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, PageFallback } from "@/components/ui/primitives";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import { CartClient } from "@/components/cart/cart-client";
import { ProductCard } from "@/components/shop/product-card";
import { getActiveSales, getProducts, saleFor } from "@/lib/catalog";
import { getMoneyContext } from "@/lib/money";

export const metadata: Metadata = { title: "Your Cart", robots: { index: false } };

async function CartBody() {
  const [{ currency, rates }, products, sales] = await Promise.all([
    getMoneyContext(),
    getProducts({}),
    getActiveSales(),
  ]);

  const crossSellSlugs = ["starter-cue-box", "weekly-pass-key", "gamer-starter-combo", "high-tier-ring-grinding"];
  const crossSell = crossSellSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const fallbackCross = crossSell.length >= 4 ? crossSell : products.slice(0, 4);

  return (
    <div className="bg-cream">
      <ClubhousePageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
        eyebrow="Your order"
        title="Cart"
        subtitle="Review your items, apply a code, and continue to checkout."
      />

      <Container className="py-10 sm:py-12">
        <CartClient currency={currency} rates={rates} />
      </Container>

      {/* Often added together on Felt */}
      <section className="felt-surface border-t border-brass/25 py-14 text-paper">
        <Container className="space-y-7">
          <h2 className="font-display text-3xl font-semibold text-paper">Often added together</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {fallbackCross.map((p) => (
              <ProductCard key={p.id} product={p} sale={saleFor(sales, p.slug)} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <CartBody />
    </Suspense>
  );
}
