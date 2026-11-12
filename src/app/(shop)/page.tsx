import Link from "next/link";
import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { ArrowRight } from "lucide-react";
import { Card, Container, PageFallback, Stars } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button";
import { HeroQuickOrder } from "@/components/shop/hero-carousel";
import { LiveOrderTicker } from "@/components/shop/live-ticker";
import { ProductCard } from "@/components/shop/product-card";
import { categoryIcons } from "@/components/product-art";
import { JsonLd } from "@/components/json-ld";
import { db } from "@/lib/db";
import { applySale, getActiveSales, getCategories, getProducts, getRecentOrdersForTicker, saleFor } from "@/lib/catalog";
import { getMoneyContext } from "@/lib/money";
import { site } from "@/lib/site";

async function getHomeContent() {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  const [categories, featured, sales, reviews] = await Promise.all([
    getCategories(),
    getProducts({ featured: true }),
    getActiveSales(),
    db.review.findMany({
      where: { approved: true },
      include: { product: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);
  return { categories, featured: featured.slice(0, 4), sales, reviews };
}

async function HomeBody() {
  const [{ categories, featured, sales, reviews }, ticker, { currency, rates }] = await Promise.all([
    getHomeContent(),
    getRecentOrdersForTicker(8),
    getMoneyContext(),
  ]);

  const coinProd = featured.find((p) => p.slug === "8-ball-pool-coins") ?? featured[0] ?? null;
  const coinSale = coinProd ? saleFor(sales, coinProd.slug) : null;

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    contactPoint: { "@type": "ContactPoint", email: site.supportEmail, contactType: "customer support" },
  };

  return (
    <Container className="space-y-12 py-6">
      <JsonLd data={orgSchema} />

      {/* 1. Hero Showcase + Subtle Live Ticker */}
      <div className="space-y-3">
        <HeroQuickOrder
          coinProduct={
            coinProd
              ? {
                  slug: coinProd.slug,
                  name: coinProd.name,
                  image: coinProd.image,
                  variants: coinProd.variants.map((v) => ({
                    id: v.id,
                    label: v.label,
                    priceCents: applySale(v.priceCents, coinSale),
                  })),
                }
              : null
          }
          currency={currency}
          rates={rates}
        />
        <LiveOrderTicker initial={ticker} />
      </div>

      {/* 2. Clean 5-Tile Category Row */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground">Browse by Category</h2>
          <Link href="/store" className="text-xs font-semibold text-brand hover:underline">
            Full Catalog →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => {
            const Icon = categoryIcons[c.icon as keyof typeof categoryIcons] ?? categoryIcons.Coins;
            return (
              <Link key={c.id} href={`/store/${c.slug}`} className="group">
                <Card className="flex h-full items-center gap-3.5 p-4 transition-colors hover:border-border-hover">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-foreground group-hover:text-brand">{c.name}</h3>
                    <p className="truncate text-xs text-muted">{c.tagline}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Curated 4-Card Featured Row */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">Featured Packages</h2>
            <p className="text-xs text-muted">Most ordered coins, cash, legendary cues and maxed accounts</p>
          </div>
          <Link href="/store" className={buttonClass("secondary", "sm")}>
            View All 16 Products <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} sale={saleFor(sales, p.slug)} />
          ))}
        </div>
      </section>

      {/* 4. Compact Reviews & Welcome Offer Row */}
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="grid gap-3 sm:grid-cols-3 lg:col-span-8">
          {reviews.map((r) => (
            <Card key={r.id} className="flex flex-col justify-between p-4">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <Stars rating={r.rating} />
                  <span className="font-mono text-[10px] text-muted">{r.country}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-foreground">&ldquo;{r.body}&rdquo;</p>
              </div>
              <p className="mt-3 text-[11px] text-muted">
                <strong className="text-foreground">{r.author}</strong> · {r.product.name}
              </p>
            </Card>
          ))}
        </div>

        <Card className="flex flex-col justify-between p-5 lg:col-span-4">
          <div>
            <p className="font-mono text-xs font-semibold text-brand">NEW PLAYER OFFER</p>
            <h3 className="mt-1 text-base font-bold text-foreground">Save 10% with code WELCOME10</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Apply <code className="font-mono font-bold text-foreground">WELCOME10</code> at checkout, plus earn 10 loyalty points per $1 spent.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Link href="/deals" className={buttonClass("primary", "sm")}>
              View Deals
            </Link>
            <Link href="/rewards" className="text-xs font-semibold text-brand hover:underline">
              Rewards &amp; Referrals →
            </Link>
          </div>
        </Card>
      </section>
    </Container>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <HomeBody />
    </Suspense>
  );
}
