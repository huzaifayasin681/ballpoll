import Link from "next/link";
import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { ArrowRight, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { Badge, Card, Container, PageFallback, SectionHeading, Stars } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button";
import { ShowcaseVideo } from "@/components/ui/showcase-video";
import { WhatsAppCta } from "@/components/ui/whatsapp-cta";
import { HeroQuickOrder } from "@/components/shop/hero-carousel";
import { AnimatedDeliverySteps, LiveSpotlightCarousel } from "@/components/shop/landing-dynamic-showcase";
import { LiveOrderTicker } from "@/components/shop/live-ticker";
import { ProductCard } from "@/components/shop/product-card";
import { LegendaryCuesShop } from "@/components/shop/legendary-cues-shop";
import { ProBoostingShop } from "@/components/shop/pro-boosting-shop";
import { GameplayAssistShop } from "@/components/shop/gameplay-assist-shop";
import { ComboBundlesShop } from "@/components/shop/combo-bundles-shop";
import { categoryIcons } from "@/components/product-art";
import { JsonLd } from "@/components/json-ld";
import { db } from "@/lib/db";
import {
  applySale,
  getActiveSales,
  getCategories,
  getProducts,
  getRecentOrdersForTicker,
  saleFor,
  toBoostingShopData,
  toComboBundlePacks,
  toGameplayAssistPacks,
  toLegendaryPackItems,
} from "@/lib/catalog";
import { getMoneyContext } from "@/lib/money";
import { site } from "@/lib/site";

const categoryBgMap: Record<string, string> = {
  "coins-cash": "/images/pool/logo-8ball.jpg",
  "cues-unlocks": "/images/pool/cues-legendary.png",
  accounts: "/images/pool/match-green.jpg",
  boosting: "/images/pool/tables-venues.png",
  "vip-access": "/images/pool/match-blue.jpg",
};

async function getHomeContent() {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  const [
    categories,
    featured,
    sales,
    coinCashProducts,
    cueProducts,
    boostingProducts,
    accountProducts,
    vipToolsProducts,
    reviews,
  ] = await Promise.all([
    getCategories(),
    getProducts({ featured: true }),
    getActiveSales(),
    getProducts({ category: "coins-cash" }),
    getProducts({ category: "cues-unlocks" }),
    getProducts({ category: "boosting" }),
    getProducts({ category: "accounts" }),
    getProducts({ category: "vip-access" }),
    db.review.findMany({
      where: { approved: true },
      include: { product: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);
  return {
    categories,
    featured: featured.slice(0, 4),
    sales,
    coinCashProducts,
    cueProducts,
    boostingProducts,
    accountProducts,
    vipToolsProducts,
    reviews,
  };
}

async function HomeBody() {
  const [
    {
      categories,
      featured,
      sales,
      coinCashProducts,
      cueProducts,
      boostingProducts,
      accountProducts,
      vipToolsProducts,
      reviews,
    },
    ticker,
    { currency, rates },
  ] = await Promise.all([
    getHomeContent(),
    getRecentOrdersForTicker(8),
    getMoneyContext(),
  ]);

  const coinProd = featured.find((p) => p.slug === "8-ball-pool-coins") ?? featured[0] ?? null;
  const coinSale = coinProd ? saleFor(sales, coinProd.slug) : null;
  const cuePacks = toLegendaryPackItems(cueProducts, sales);
  const boostingData = toBoostingShopData(boostingProducts, accountProducts, sales);
  const assistPacks = toGameplayAssistPacks(vipToolsProducts, sales);
  const comboPacks = toComboBundlePacks(coinCashProducts, sales);
  const totalProducts = categories.reduce((sum, c) => sum + c._count.products, 0);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    contactPoint: { "@type": "ContactPoint", email: site.supportEmail, contactType: "customer support" },
  };

  return (
    <Container className="space-y-14 py-6 sm:space-y-16 sm:py-8">
      <JsonLd data={orgSchema} />

      {/* 1. Hero Showcase + Live Order Ticker */}
      <div className="space-y-3.5">
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

      {/* 2. Visual 5-Tile Category Showcase */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <SectionHeading
            eyebrow="8 Ball Pool Departments"
            title="Shop by Category"
            subtitle="Direct Unique ID top-ups, 20/20 Legendary Cues, maxed accounts & ring boosting"
          />
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/store" className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline">
              Explore Full Catalog <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <WhatsAppCta
              message={`Hi ${site.name}! Help me pick the right 8 Ball Pool package.`}
              label="WhatsApp"
              size="sm"
              className="h-8 rounded-lg px-3 text-[11px]"
            />
          </div>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => {
            const Icon = categoryIcons[c.icon as keyof typeof categoryIcons] ?? categoryIcons.Coins;
            const bgSrc = categoryBgMap[c.slug] ?? "/images/pool/logo-8ball.jpg";
            return (
              <Link key={c.id} href={`/store/${c.slug}`} className="group block">
                <div className="relative flex h-36 flex-col justify-between overflow-hidden rounded-xl border border-[#1d3b30] bg-[#091b14] p-4 text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#68d8ae]/60 hover:shadow-md">
                  <img
                    src={bgSrc}
                    alt={c.name}
                    loading="lazy"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05120d]/95 via-[#071912]/65 to-black/30" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-[#f3c474] backdrop-blur-xs">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="inline-flex items-center gap-0.5 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 font-mono text-[10px] font-semibold text-white/90 backdrop-blur-xs">
                      {c._count.products} items <ArrowUpRight className="h-3 w-3 text-[#68d8ae]" />
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="truncate text-sm font-bold text-white group-hover:text-[#f3c474]">{c.name}</h3>
                    <p className="mt-0.5 truncate text-[11px] text-[#b4c4bc]">{c.tagline}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 2A-0. Auto-Rotating Live Marketplace Spotlight */}
      <LiveSpotlightCarousel />

      {/* 2A. Instant Coin & Cash Top-Ups + Elite Players Edition Video Showcase */}
      <section aria-labelledby="live-showcase-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <SectionHeading
            eyebrow="24/7 Live Service"
            title="Instant Coin Top-Ups & Elite Players Showcase"
            subtitle="Watch our Unique ID coin transfers and elite pro pool sessions in action"
          />
          <Link href="/store/coins-cash" className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline">
            Order Coins &amp; Cash <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid items-stretch gap-5 lg:grid-cols-12">
          <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1f4537] bg-[#081913] p-4 text-white shadow-lg sm:p-5 lg:col-span-8">
            <div className="overflow-hidden rounded-xl border border-[#f3c474]/35 bg-black/50 shadow-xl">
              <ShowcaseVideo
                src="/videos/instant-coin-topups.mp4"
                poster="/images/pool/instant-coin-topups.jpg"
                title="Instant Coin & Cash Top-Ups — Safe, Fast & Reliable 24/7 Service"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#68d8ae]">
                  Unique ID Only · 24/7 Delivery
                </p>
                <h3 id="live-showcase-heading" className="mt-0.5 text-base font-extrabold text-white sm:text-lg">
                  Instant Coin &amp; Cash Top-Ups
                </h3>
                <p className="text-xs text-[#b8c7bf]">
                  Zero password required—enter your 10-digit Miniclip Unique ID and track delivery live.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/store/coins-cash"
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-[#f6cf86] to-[#e5ad4c] px-4 text-xs font-bold text-[#1b1406] shadow-xs transition hover:brightness-105"
                >
                  Top Up Now <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <WhatsAppCta
                  message={`Hi ${site.name}! I want an instant 8 Ball Pool Coins & Cash top-up.`}
                  label="WhatsApp"
                  showNumber
                  size="sm"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1f4537] bg-[#081913] p-4 text-white shadow-lg sm:p-5 lg:col-span-4">
            <div className="mx-auto w-full max-w-[245px] overflow-hidden rounded-xl border border-[#f3c474]/35 bg-black/60 shadow-xl">
              <ShowcaseVideo
                src="/videos/elite-players-showcase.mp4"
                poster="/images/pool/elite-players-showcase.jpg"
                title="8 Ball Pool Services — Elite Players Edition"
                aspect="portrait"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#f3c474]">
                  Elite Players Edition
                </p>
                <p className="truncate text-sm font-bold text-white">Pro Match &amp; Ring Action</p>
              </div>
              <WhatsAppCta
                message={`Hi ${site.name}! I saw the Elite Players Edition showcase and want to order.`}
                label="WhatsApp"
                size="sm"
                className="h-8 rounded-lg px-3 text-[11px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2B. Legendary Cues & Max Stats Shop */}
      <LegendaryCuesShop
        packs={cuePacks}
        currency={currency}
        rates={rates}
        whatsappHref={site.whatsappHref}
        siteName={site.name}
        headingTag="h2"
        showCatalogLink
      />

      {/* 3. Pro Account Boosting & Ring Grinding */}
      <ProBoostingShop
        packs={boostingData.packs}
        startingAccountPriceCents={boostingData.startingAccountPriceCents}
        currency={currency}
        rates={rates}
        headingTag="h2"
        showCatalogLink
      />

      {/* 4. Advanced Gameplay Assist & Tools */}
      <GameplayAssistShop
        packs={assistPacks}
        currency={currency}
        rates={rates}
        headingTag="h2"
        showCatalogLink
      />

      {/* 5. Mega Combo Bundles & Custom Services */}
      <ComboBundlesShop
        packs={comboPacks}
        currency={currency}
        rates={rates}
        whatsappHref={site.whatsappHref}
        siteName={site.name}
        headingTag="h2"
        showDealsLink
      />

      {/* 6. Curated 4-Card Featured Packages Row */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            eyebrow="Top Sellers"
            title="Featured 8 Ball Pool Packages"
            subtitle="Most ordered coins, cash, legendary cues and championship accounts"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/store" className={buttonClass("secondary", "sm")}>
              View All {totalProducts} Products <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <WhatsAppCta
              message={`Hi ${site.name}! I want to order one of your Featured 8 Ball Pool Packages.`}
              label="WhatsApp"
              size="sm"
              className="h-8 rounded-lg px-3 text-[11px]"
            />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} sale={saleFor(sales, p.slug)} />
          ))}
        </div>
      </section>

      {/* 4. How Instant Delivery Works (3-Step Visual Strip) */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-2xs sm:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <SectionHeading
            eyebrow="Fast & Ban-Safe"
            title="How 8 Ball Pool Delivery Works"
            subtitle="Streamlined fulfillment designed for zero downtime and complete account safety"
          />
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/track" className="text-xs font-bold text-brand hover:underline">
              Live Order Tracker →
            </Link>
            <WhatsAppCta
              message={`Hi ${site.name}! I have a question about order delivery or tracking.`}
              label="WhatsApp"
              showNumber
              size="sm"
              className="h-8 rounded-lg px-3 text-[11px]"
            />
          </div>
        </div>
        <AnimatedDeliverySteps />
      </section>

      {/* 5. Verified Reviews & Dark-Emerald Welcome Offer Banner */}
      <section className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">Verified Player Reviews</h2>
              <p className="text-xs text-muted">Rated 4.9/5 across thousands of 8 Ball Pool deliveries</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link href="/reviews" className="text-xs font-bold text-brand hover:underline">
                All Reviews →
              </Link>
              <WhatsAppCta
                message={`Hi ${site.name}! I want to place an order on WhatsApp.`}
                label="WhatsApp"
                size="sm"
                className="h-8 rounded-lg px-3 text-[11px]"
              />
            </div>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-3">
            {reviews.map((r) => (
              <Card key={r.id} className="flex flex-col justify-between p-4 hover:border-border-hover">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <Stars rating={r.rating} />
                    <Badge tone="green" className="text-[10px]">
                      <CheckCircle2 className="h-2.5 w-2.5" /> {r.country}
                    </Badge>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-foreground">&ldquo;{r.body}&rdquo;</p>
                </div>
                <div className="mt-4 border-t border-border pt-2.5 text-[11px] text-muted">
                  <strong className="font-semibold text-foreground">{r.author}</strong> ·{" "}
                  <Link href={`/product/${r.product.slug}`} className="text-brand hover:underline">
                    {r.product.name}
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Rich Dark-Emerald & Gold Promo Card */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1f4537] bg-[#081913] p-6 text-white shadow-md lg:col-span-4">
          <img
            src="/images/pool/tournament-coins.jpg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#071913]/95 via-[#0b251c]/90 to-[#06140f]/95" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f3c474]/40 bg-black/50 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#f3c474]">
              <Sparkles className="h-3 w-3" /> New Player Bonus
            </span>
            <h3 className="mt-3 text-xl font-extrabold text-white">Save 10% Instantly on Your First Order</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#b8c7bf]">
              Enter promo code{" "}
              <code className="rounded border border-[#f3c474]/40 bg-black/50 px-1.5 py-0.5 font-mono font-bold text-[#f3c474]">
                WELCOME10
              </code>{" "}
              at checkout, plus earn <strong className="text-white">10 loyalty points per $1</strong> spent toward free coins.
            </p>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2.5">
            <Link
              href="/deals"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-[#f6cf86] to-[#e5ad4c] px-4 text-xs font-bold text-[#1b1406] shadow-xs transition hover:brightness-105"
            >
              Claim Offer <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <WhatsAppCta
              message={`Hi ${site.name}! I'd like to claim the WELCOME10 offer and order on WhatsApp.`}
              label="WhatsApp"
              showNumber
              size="sm"
              className="rounded-lg"
            />
            <Link href="/rewards" className="text-xs font-semibold text-[#68d8ae] hover:underline">
              Loyalty Program →
            </Link>
          </div>
        </div>
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
