import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Sparkles, ShieldCheck, Zap, Coins } from "lucide-react";
import { Card, Container, Input, PageFallback, Select } from "@/components/ui/primitives";
import { ShowcaseVideo } from "@/components/ui/showcase-video";
import { Button, buttonClass } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";
import { LegendaryCuesShop } from "@/components/shop/legendary-cues-shop";
import { ProBoostingShop } from "@/components/shop/pro-boosting-shop";
import { GameplayAssistShop } from "@/components/shop/gameplay-assist-shop";
import {
  getActiveSales,
  getCategories,
  getProducts,
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
    isCueShop || isBoostingShop || isVipToolsShop ? getMoneyContext() : Promise.resolve(null),
  ]);
  const currentCat = categories.find((c) => c.slug === categorySlug);
  const cuePacks = isCueShop ? toLegendaryPackItems(cueCatalogProducts, sales) : [];
  const boostingShopData = isBoostingShop
    ? toBoostingShopData(boostingCatalogProducts, accountCatalogProducts, sales)
    : null;
  const assistPacks = isVipToolsShop ? toGameplayAssistPacks(vipToolsCatalogProducts, sales) : [];

  return (
    <Container className="py-8 sm:py-10">
      {isCueShop && money ? (
        <div className="mb-8">
          <LegendaryCuesShop
            packs={cuePacks}
            currency={money.currency}
            rates={money.rates}
            whatsappHref={site.whatsappHref}
            siteName={site.name}
            headingTag="h1"
          />
        </div>
      ) : isBoostingShop && money && boostingShopData ? (
        <div className="mb-8">
          <ProBoostingShop
            packs={boostingShopData.packs}
            startingAccountPriceCents={boostingShopData.startingAccountPriceCents}
            currency={money.currency}
            rates={money.rates}
            headingTag="h1"
          />
        </div>
      ) : isVipToolsShop && money ? (
        <div className="mb-8">
          <GameplayAssistShop
            packs={assistPacks}
            currency={money.currency}
            rates={money.rates}
            headingTag="h1"
          />
        </div>
      ) : categorySlug === "coins-cash" ? (
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#1f4537] bg-[#081913] text-[#f5f3ed] shadow-lg ring-1 ring-white/5">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#24916a]/20 blur-3xl" />
            <div className="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-[#f3c474]/15 blur-3xl" />
          </div>
          <div className="relative z-10 grid items-center gap-6 p-5 sm:gap-8 sm:p-8 lg:grid-cols-12 lg:p-10">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f3c474]/35 bg-black/50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#f3c474] backdrop-blur-xs">
                <Coins className="h-3 w-3" /> Coins, Cash &amp; Golden Shots
              </span>
              <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-[2rem] lg:leading-[1.15]">
                Instant Coin &amp; Cash Top-Ups{" "}
                <span className="bg-gradient-to-r from-[#f8d896] via-[#f3c474] to-[#e2a33b] bg-clip-text text-transparent">
                  | Unique ID Delivery
                </span>
              </h1>
              <p className="mt-2.5 max-w-xl text-xs leading-relaxed text-[#c6d3cd] sm:text-sm">
                {currentCat?.description ??
                  "Safe, fast & reliable 24/7 delivery using only your 10-digit Miniclip Unique ID—zero password needed."}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#b4c4bc]">
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#f3c474]" /> 1–2 Hour Express Transfer
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#68d8ae]" /> Unique ID Only · Ban-Safe
                </span>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-xl border border-[#f3c474]/35 bg-black/50 shadow-2xl ring-1 ring-white/10">
                <ShowcaseVideo
                  src="/videos/instant-coin-topups.mp4"
                  poster="/images/pool/instant-coin-topups.jpg"
                  title="Instant Coin & Cash Top-Ups — Safe, Fast & Reliable 24/7 Delivery"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Rich Store Header Banner */
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#1f4537] bg-[#081913] p-6 text-white shadow-sm sm:p-8">
          <img
            src="/images/pool/cues-legendary.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#06140f]/95 via-[#091f17]/85 to-[#06140f]/90" />
          <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#68d8ae]/30 bg-[#0d2d22]/85 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#68d8ae]">
                <Sparkles className="h-3 w-3 text-[#f3c474]" /> Official Catalog
              </span>
              <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {currentCat ? currentCat.name : "All 8 Ball Pool Products & Services"}
              </h1>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-[#b8c7bf]">
                {currentCat
                  ? currentCat.description
                  : "Filter by department, asset type, delivery speed, or price. Every order includes live status tracking."}
              </p>
            </div>
            <div className="shrink-0 font-mono text-xs text-[#f3c474]">
              Showing <strong>{products.length}</strong> available packages
            </div>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
        <Link
          href="/store"
          className={cn(
            "shrink-0 whitespace-nowrap rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all",
            !categorySlug
              ? "border-brand bg-brand-btn text-white shadow-2xs"
              : "border-border bg-surface text-muted hover:border-border-hover hover:text-foreground",
          )}
        >
          All Departments
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/store/${c.slug}`}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all",
              categorySlug === c.slug
                ? "border-brand bg-brand-btn text-white shadow-2xs"
                : "border-border bg-surface text-muted hover:border-border-hover hover:text-foreground",
            )}
          >
            {c.name} <span className="ml-1 opacity-75">({c._count.products})</span>
          </Link>
        ))}
      </div>

      {/* Filter form */}
      <Card className="mb-8 p-3.5 sm:p-4">
        <form className="grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5">
          <Input
            name="q"
            defaultValue={filters.q}
            placeholder="Search coins, Archangel, Venice ring…"
            className="lg:col-span-2"
          />
          <Select name="type" defaultValue={filters.type ?? ""}>
            <option value="">All asset types</option>
            <option value="CURRENCY">Currency & Top-Ups</option>
            <option value="ITEM">Cues & Items</option>
            <option value="ACCOUNT">Accounts</option>
            <option value="SERVICE">Boosting & Services</option>
            <option value="LICENSE_KEY">VIP & License Keys</option>
          </Select>
          <Select name="speed" defaultValue={filters.speed ?? ""}>
            <option value="">Any delivery speed</option>
            <option value="instant">Instant</option>
            <option value="fast">Fast (≤ 6 hours)</option>
            <option value="standard">Standard (6h+)</option>
          </Select>
          <div className="flex gap-2">
            <Select name="sort" defaultValue={filters.sort} className="min-w-0 flex-1">
              <option value="popular">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="fastest">Fastest delivery</option>
              <option value="newest">Newest</option>
            </Select>
            <Button type="submit" size="md" className="h-10 shrink-0">
              Apply
            </Button>
          </div>
        </form>
      </Card>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="font-display text-lg font-bold text-foreground">No matching products</p>
          <p className="mt-1 text-sm text-muted">Try clearing a filter or searching for something else.</p>
          <Link href={categorySlug ? `/store/${categorySlug}` : "/store"} className={buttonClass("secondary", "sm", "mt-4")}>
            Reset filters
          </Link>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} sale={saleFor(sales, p.slug)} />
          ))}
        </div>
      )}
    </Container>
  );
}

async function StoreBody({ searchParams }: PageProps<"/store">) {
  return <StoreView searchParams={await searchParams} />;
}

export default function StorePage(props: PageProps<"/store">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <StoreBody {...props} />
    </Suspense>
  );
}
