import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Coins, ShieldCheck, Zap } from "lucide-react";
import { Container, PageFallback } from "@/components/ui/primitives";
import { ShowcaseVideo } from "@/components/ui/showcase-video";
import { WhatsAppCta } from "@/components/ui/whatsapp-cta";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import { LegendaryCuesShop } from "@/components/shop/legendary-cues-shop";
import { ProBoostingShop } from "@/components/shop/pro-boosting-shop";
import { GameplayAssistShop } from "@/components/shop/gameplay-assist-shop";
import { StoreCatalogClient, type CatalogItem } from "@/components/shop/store-catalog-client";
import {
  applySale,
  getActiveSales,
  getCategories,
  getProducts,
  ratingSummary,
  saleFor,
  toBoostingShopData,
  toGameplayAssistPacks,
  toLegendaryPackItems,
  type ProductFilters,
} from "@/lib/catalog";
import { getMoneyContext } from "@/lib/money";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Store: Coins, Cash, Cues, Accounts & Boosting",
  description: "Browse 8 Ball Pool coins, cash, legendary cues, accounts, rank boosting and VIP memberships.",
};

function inferTier(badge: string | null, slug: string): CatalogItem["tier"] {
  const b = `${badge ?? ""} ${slug}`.toLowerCase();
  if (b.includes("legend") || b.includes("king") || b.includes("max") || b.includes("venice") || b.includes("vip")) {
    return "Legendary";
  }
  if (b.includes("pro") || b.includes("epic") || b.includes("popular") || b.includes("combo")) {
    return "Epic";
  }
  return "Rare";
}

export async function StoreView({
  categorySlug,
  searchParams,
}: {
  categorySlug?: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const str = (k: string) => (typeof searchParams[k] === "string" ? (searchParams[k] as string) : undefined);
  const filters: ProductFilters = {
    category: categorySlug,
    q: str("q"),
    type: str("type"),
    speed: str("speed") as ProductFilters["speed"],
    sort: (str("sort") as ProductFilters["sort"]) ?? "popular",
  };

  const isCueShop = categorySlug === "cues-unlocks";
  const isBoostingShop = categorySlug === "boosting";
  const isVipToolsShop = categorySlug === "vip-access";

  const [
    categories,
    products,
    sales,
    cueCatalogProducts,
    boostingCatalogProducts,
    accountCatalogProducts,
    vipToolsCatalogProducts,
    money,
  ] = await Promise.all([
    getCategories(),
    getProducts(filters),
    getActiveSales(),
    isCueShop ? getProducts({ category: "cues-unlocks" }) : Promise.resolve([]),
    isBoostingShop ? getProducts({ category: "boosting" }) : Promise.resolve([]),
    isBoostingShop ? getProducts({ category: "accounts" }) : Promise.resolve([]),
    isVipToolsShop ? getProducts({ category: "vip-access" }) : Promise.resolve([]),
    getMoneyContext(),
  ]);

  const currentCat = categories.find((c) => c.slug === categorySlug);
  const cuePacks = isCueShop ? toLegendaryPackItems(cueCatalogProducts, sales) : [];
  const boostingShopData = isBoostingShop
    ? toBoostingShopData(boostingCatalogProducts, accountCatalogProducts, sales)
    : null;
  const assistPacks = isVipToolsShop ? toGameplayAssistPacks(vipToolsCatalogProducts, sales) : [];

  const title = currentCat ? currentCat.name : "The Store";
  const subtitle =
    currentCat?.description ??
    "Direct Unique ID coin transfers, maxed legendary cues, championship accounts, and rank boosting.";

  const items: CatalogItem[] = products
    .filter((p) => p.variants.length > 0)
    .map((p) => {
      const prices = p.variants.map((v) => v.priceCents);
      const minRaw = prices.length ? Math.min(...prices) : 0;
      const sale = saleFor(sales, p.slug);
      const minPriceCents = applySale(minRaw, sale ?? null);
      const firstVar = p.variants.find((v) => v.priceCents === minRaw) ?? p.variants[0];
      const compareCents = sale ? minRaw : firstVar?.compareCents ?? null;
      const discountPct =
        sale?.percentOff ??
        (compareCents && compareCents > minPriceCents
          ? Math.round(((compareCents - minPriceCents) / compareCents) * 100)
          : null);
      const { avg, count } = ratingSummary(p.reviews);
      const allOut = p.variants.every((v) => v.stock === 0);

      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        shortDesc: p.shortDesc,
        image: p.image,
        badge: p.badge,
        requiredInput: p.requiredInput,
        deliveryHours: p.deliveryHours,
        categorySlug: p.category.slug,
        categoryName: p.category.name,
        tier: inferTier(p.badge, p.slug),
        ratingAvg: count > 0 ? avg : 5,
        ratingCount: count,
        minPriceCents,
        compareCents,
        discountPct,
        defaultVariantId: firstVar.id,
        defaultVariantLabel: firstVar.label,
        soldOut: allOut,
      };
    });

  return (
    <div className="bg-cream pb-16">
      <ClubhousePageHero
        crumbs={
          currentCat
            ? [{ label: "Home", href: "/" }, { label: "Store", href: "/store" }, { label: currentCat.name }]
            : [{ label: "Home", href: "/" }, { label: "Store" }]
        }
        eyebrow="8 BALL POOL CATALOG"
        title={title}
        subtitle={subtitle}
      />

      <Container className="mt-8 space-y-8">
        {/* Category Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/store"
            className={cn(
              "rounded-[2px] border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition",
              !categorySlug
                ? "border-felt bg-felt text-paper"
                : "border-border bg-paper text-ink hover:border-brass",
            )}
          >
            All Categories
          </Link>
          {categories.map((c) => {
            const active = c.slug === categorySlug;
            return (
              <Link
                key={c.id}
                href={`/store/${c.slug}`}
                className={cn(
                  "rounded-[2px] border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition",
                  active
                    ? "border-felt bg-felt text-paper"
                    : "border-border bg-paper text-ink hover:border-brass",
                )}
              >
                {c.name} ({c._count.products})
              </Link>
            );
          })}
        </div>

        {/* Category Specialty Showcase preserved from user data */}
        {isCueShop ? (
          <LegendaryCuesShop
            packs={cuePacks}
            currency={money.currency}
            rates={money.rates}
            whatsappHref={site.whatsappHref}
            siteName={site.name}
            headingTag="h2"
          />
        ) : isBoostingShop && boostingShopData ? (
          <ProBoostingShop
            packs={boostingShopData.packs}
            startingAccountPriceCents={boostingShopData.startingAccountPriceCents}
            currency={money.currency}
            rates={money.rates}
            headingTag="h2"
          />
        ) : isVipToolsShop ? (
          <GameplayAssistShop
            packs={assistPacks}
            currency={money.currency}
            rates={money.rates}
            headingTag="h2"
          />
        ) : categorySlug === "coins-cash" ? (
          <div className="felt-hero-surface relative overflow-hidden rounded-[6px] border border-brass/35 p-5 text-paper sm:p-8 lg:p-10">
            <div className="relative z-10 grid items-center gap-6 sm:gap-8 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-brass/40 bg-felt-deep/85 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">
                  <Coins className="h-3 w-3" /> Coins, Cash &amp; Golden Shots
                </span>
                <h2 className="mt-3.5 font-display text-2xl font-semibold tracking-[-0.02em] text-paper sm:text-3xl">
                  Instant Coin &amp; Cash Top-Ups{" "}
                  <span className="font-normal italic text-brass">| Unique ID Delivery</span>
                </h2>
                <p className="mt-2.5 max-w-xl text-xs leading-relaxed text-cream/85 sm:text-sm">
                  {currentCat?.description ??
                    "Safe, fast & reliable 24/7 delivery using only your 10-digit Miniclip Unique ID—zero password needed."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-cream/75">
                  <span className="inline-flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-brass" /> 1–2 Hour Express Transfer
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-brass" /> Unique ID Only · Ban-Safe
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <WhatsAppCta
                    message={`Hi ${site.name}! I want to buy 8 Ball Pool Coins & Cash via Unique ID.`}
                    label="WhatsApp"
                    showNumber
                    size="sm"
                    className="rounded-[2px]"
                  />
                  <Link
                    href="/track"
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-brass hover:underline"
                  >
                    Track an order →
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="relative overflow-hidden rounded-[4px] border border-brass/35 bg-felt-deep">
                  <ShowcaseVideo
                    src="/videos/instant-coin-topups.mp4"
                    poster="/images/pool/instant-coin-topups.jpg"
                    title="Instant Coin & Cash Top-Ups — Safe, Fast & Reliable 24/7 Service"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <StoreCatalogClient
          items={items}
          initialQuery={str("q") ?? ""}
          currency={money.currency}
          rates={money.rates}
        />
      </Container>
    </div>
  );
}

async function StorePageBody({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <StoreView searchParams={await searchParams} />;
}

export default function StorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<PageFallback />}>
      <StorePageBody searchParams={searchParams} />
    </Suspense>
  );
}
