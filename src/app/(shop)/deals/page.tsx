import { Suspense } from "react";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Flame, Tag } from "lucide-react";
import { db } from "@/lib/db";
import { getActiveSales, getProducts, saleFor, toComboBundlePacks } from "@/lib/catalog";
import { getMoneyContext } from "@/lib/money";
import { site } from "@/lib/site";
import { Badge, Card, Container, PageFallback } from "@/components/ui/primitives";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import { ProductCard } from "@/components/shop/product-card";
import { ComboBundlesShop } from "@/components/shop/combo-bundles-shop";
import { Countdown } from "@/components/shop/countdown";

export const metadata: Metadata = {
  title: { absolute: "8 Ball Pool Combo Deals & Custom Service Packages" },
  description:
    "Save Up to 40% with All-in-One Gamer Bundles. Gamer Starter Combo, King Master Bundle, Custom Build Box & Flash Deals.",
  openGraph: {
    title: "8 Ball Pool Combo Deals & Custom Service Packages",
    description: "Save Up to 40% with All-in-One Gamer Bundles",
    images: ["/images/pool/combo-bundles-deals.jpg"],
  },
  alternates: { canonical: "/deals" },
};

async function getCoupons() {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return db.coupon.findMany({ where: { isActive: true } });
}

export default function DealsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <DealsBody />
    </Suspense>
  );
}

async function DealsBody() {
  const [sales, products, coupons, money] = await Promise.all([
    getActiveSales(),
    getProducts({}),
    getCoupons(),
    getMoneyContext(),
  ]);

  const comboPacks = toComboBundlePacks(products, sales);
  const discounted = products.filter(
    (p) => saleFor(sales, p.slug) || p.variants.some((v) => v.compareCents),
  );

  return (
    <div className="bg-cream pb-16">
      <ClubhousePageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Deals" }]}
        eyebrow="LIMITED-TIME DROPS & COMBOS"
        title="Combo Deals & Flash Sales"
        subtitle="Time-limited price drops, all-in-one gamer bundles, and active promo codes."
      />

      <Container className="mt-8 space-y-12">
        {/* Combo Bundles Showcase + 3 Real Bundle Cards + Custom Build Box */}
        <ComboBundlesShop
          packs={comboPacks}
          currency={money.currency}
          rates={money.rates}
          whatsappHref={site.whatsappHref}
          siteName={site.name}
          headingTag="h2"
        />

        {/* Active Flash Sales (Felt countdown cards) */}
        {sales.length > 0 && (
          <section className="space-y-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
                ACTIVE CLOCKS
              </div>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                Flash Sales
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {sales.map((s) => (
                <div
                  key={s.id}
                  className="felt-hero-surface flex flex-col justify-between gap-4 rounded-[6px] border border-brass/35 p-5 text-paper sm:flex-row sm:items-center sm:p-6"
                >
                  <div>
                    <Badge tone="gold">
                      <Flame className="h-3 w-3" /> {s.percentOff}% OFF
                    </Badge>
                    <h3 className="mt-2 font-display text-xl font-semibold text-paper">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-xs text-cream/80 sm:text-sm">{s.subtitle}</p>
                  </div>
                  <div className="shrink-0 sm:text-right">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">
                      Ends in
                    </p>
                    <Countdown endsAt={s.endsAt.toISOString()} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Real Active Coupons */}
        {coupons.length > 0 && (
          <section className="space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
              PROMO CODES
            </div>
            <div className="flex flex-wrap gap-3">
              {coupons.map((c) => (
                <Card
                  key={c.id}
                  className="inline-flex items-center gap-2.5 border-dashed border-brass bg-accent-soft px-4 py-2.5 text-sm text-ink"
                >
                  <Tag className="h-4 w-4 text-brass-dark" />
                  <span>
                    Use code <strong className="font-mono font-bold text-felt">{c.code}</strong> at
                    checkout for <strong>{c.percentOff}% off</strong>
                  </span>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Real Discounted Packages */}
        <section className="space-y-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
              REDUCED PACKAGES
            </div>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
              On Sale Now
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {discounted.map((p) => (
              <ProductCard key={p.id} product={p} sale={saleFor(sales, p.slug)} />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
