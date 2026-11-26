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
    <div className="bg-cream">
      <Container className="space-y-14 py-6 sm:space-y-16 sm:py-8">
        <JsonLd data={orgSchema} />

        {/* 1. Clubhouse Felt Hero + Real Quick Order & Live Order Ticker */}
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

        {/* 2. Clubhouse Arched 5-Department Showcase with Real Category Photos */}
        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <SectionHeading
              eyebrow="8 Ball Pool Departments"
              title="Shop by Category"
              subtitle="Direct Unique ID top-ups, 20/20 Legendary Cues, maxed accounts & ring boosting"
            />
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/store"
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-felt hover:text-brass-dark"
              >
                Explore Full Catalog <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <WhatsAppCta
                message={`Hi ${site.name}! Help me pick the right 8 Ball Pool package.`}
                label="WhatsApp"
                size="sm"
                className="h-8 px-3 text-[10px]"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((c) => {
              const Icon = categoryIcons[c.icon as keyof typeof categoryIcons] ?? categoryIcons.Coins;
              const bgSrc = categoryBgMap[c.slug] ?? "/images/pool/logo-8ball.jpg";
              return (
                <Link key={c.id} href={`/store/${c.slug}`} className="group block">
                  <Card className="flex h-full flex-col overflow-hidden p-2.5 transition-colors hover:border-brass">
                    <div className="relative h-36 overflow-hidden bg-felt-deep p-2 pb-0 rounded-[4px]">
                      <div className="relative h-full w-full overflow-hidden arch-frame border border-brass/35">
                        <img
                          src={bgSrc}
                          alt={c.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-felt-deep/90 via-felt-deep/30 to-black/15" />
                        <div className="pointer-events-none absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-brass/40 bg-felt-deep/85 text-brass">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="inline-flex items-center gap-0.5 rounded-[2px] border border-paper/20 bg-felt-deep/85 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-cream">
                            {c._count.products} items <ArrowUpRight className="h-2.5 w-2.5 text-brass" />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-1.5 pb-1 pt-3">
                      <h3 className="truncate font-display text-base font-semibold text-ink group-hover:text-felt">
                        {c.name}
                      </h3>
                      <p className="mt-0.5 truncate text-[11px] text-muted">{c.tagline}</p>
                    </div>
                  </Card>
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
            <Link
              href="/store/coins-cash"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-felt hover:text-brass-dark"
            >
              Order Coins &amp; Cash <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid items-stretch gap-5 lg:grid-cols-12">
            <div className="felt-hero-surface flex flex-col justify-between overflow-hidden rounded-[6px] border border-brass/35 p-4 text-paper sm:p-5 lg:col-span-8">
              <div className="overflow-hidden rounded-[4px] border border-brass/40 bg-felt-deep">
                <ShowcaseVideo
                  src="/videos/instant-coin-topups.mp4"
                  poster="/images/pool/instant-coin-topups.jpg"
                  title="Instant Coin & Cash Top-Ups — Safe, Fast & Reliable 24/7 Service"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">
                    Unique ID Only · 24/7 Delivery
                  </p>
                  <h3 id="live-showcase-heading" className="mt-0.5 font-display text-lg font-semibold text-paper sm:text-xl">
                    Instant Coin &amp; Cash Top-Ups
                  </h3>
                  <p className="text-xs text-cream/80">
                    Zero password required—enter your 10-digit Miniclip Unique ID and track delivery live.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/store/coins-cash"
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[2px] border border-brass bg-brass px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink outline -outline-offset-[3px] outline-1 outline-ink/25 transition hover:bg-brass/90"
                  >
                    Top Up Now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <WhatsAppCta
                    message={`Hi ${site.name}! I want an instant 8 Ball Pool Coins & Cash top-up.`}
                    label="WhatsApp"
                    showNumber
                    size="sm"
                    className="rounded-[2px]"
                  />
                </div>
              </div>
            </div>

            <div className="felt-hero-surface flex flex-col justify-between overflow-hidden rounded-[6px] border border-brass/35 p-4 text-paper sm:p-5 lg:col-span-4">
              <div className="mx-auto w-full max-w-[245px] overflow-hidden rounded-[4px] border border-brass/40 bg-felt-deep">
                <ShowcaseVideo
                  src="/videos/elite-players-showcase.mp4"
                  poster="/images/pool/elite-players-showcase.jpg"
                  title="8 Ball Pool Services — Elite Players Edition"
                  aspect="portrait"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-paper/15 pt-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">
                    Elite Players Edition
                  </p>
                  <p className="truncate font-display text-base font-semibold text-paper">Pro Match &amp; Ring Action</p>
                </div>
                <WhatsAppCta
                  message={`Hi ${site.name}! I saw the Elite Players Edition showcase and want to order.`}
                  label="WhatsApp"
                  size="sm"
                  className="h-8 rounded-[2px] px-3 text-[10px]"
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
                className="h-8 rounded-[2px] px-3 text-[10px]"
              />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} sale={saleFor(sales, p.slug)} />
            ))}
          </div>
        </section>

        {/* 7. How Instant Delivery Works */}
        <section className="rounded-[6px] border border-border bg-paper p-5 sm:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <SectionHeading
              eyebrow="Fast & Ban-Safe"
              title="How an order works"
              subtitle="Three clear steps from selection to verified table delivery"
            />
            <Link
              href="/track"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-felt hover:text-brass-dark"
            >
              Track an order →
            </Link>
          </div>
          <AnimatedDeliverySteps />
        </section>

        {/* 8. Verified Player Reviews + Clubhouse Promo Card */}
        <section className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <SectionHeading
                eyebrow="Verified Feedback"
                title="Trusted by 8 Ball Pool Players"
                subtitle="Published after delivered orders"
              />
              <Link
                href="/reviews"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-felt hover:text-brass-dark"
              >
                All Reviews →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {reviews.map((r) => (
                <Card key={r.id} className="flex flex-col justify-between p-5 hover:border-brass">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <Stars rating={r.rating} />
                      <Badge tone="gold" className="text-[9px]">
                        <CheckCircle2 className="h-2.5 w-2.5" /> {r.country}
                      </Badge>
                    </div>
                    <blockquote className="mt-3 font-display text-[15px] italic leading-relaxed text-ink">
                      &ldquo;{r.body}&rdquo;
                    </blockquote>
                  </div>
                  <div className="mt-4 border-t border-border pt-3 text-[11px] text-muted">
                    <strong className="font-semibold text-ink">{r.author}</strong> ·{" "}
                    <Link href={`/product/${r.product.slug}`} className="text-felt hover:text-brass-dark hover:underline">
                      {r.product.name}
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="felt-hero-surface relative flex flex-col justify-between overflow-hidden rounded-[6px] border border-brass/35 p-6 text-paper lg:col-span-4">
            <img
              src="/images/pool/tournament-coins.jpg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-felt-deep/95 via-felt/90 to-felt-deep/95" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-brass/40 bg-felt-deep/85 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brass">
                <Sparkles className="h-3 w-3" /> New Player Bonus
              </span>
              <h3 className="mt-3 font-display text-2xl font-semibold leading-snug text-paper">
                Save 10% Instantly on Your First Order
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-cream/80">
                Enter promo code{" "}
                <code className="rounded-[2px] border border-brass/40 bg-felt-deep/80 px-1.5 py-0.5 font-mono font-semibold text-brass">
                  WELCOME10
                </code>{" "}
                at checkout, plus earn <strong className="text-paper">10 loyalty points per $1</strong> spent toward free coins.
              </p>
            </div>

            <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2.5">
              <Link
                href="/deals"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[2px] border border-brass bg-brass px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink outline -outline-offset-[3px] outline-1 outline-ink/25 transition hover:bg-brass/90"
              >
                Claim Offer <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <WhatsAppCta
                message={`Hi ${site.name}! I'd like to claim the WELCOME10 offer and order on WhatsApp.`}
                label="WhatsApp"
                showNumber
                size="sm"
                className="rounded-[2px]"
              />
              <Link href="/rewards" className="text-xs font-semibold text-brass hover:underline">
                Loyalty Program →
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <HomeBody />
    </Suspense>
  );
}
