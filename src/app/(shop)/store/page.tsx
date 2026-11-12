import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { Card, Container, Input, PageFallback, Select } from "@/components/ui/primitives";
import { Button, buttonClass } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";
import { getActiveSales, getCategories, getProducts, saleFor, type ProductFilters } from "@/lib/catalog";
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
  const [categories, products, sales] = await Promise.all([getCategories(), getProducts(filters), getActiveSales()]);
  const currentCat = categories.find((c) => c.slug === categorySlug);

  return (
    <Container className="py-8 sm:py-10">
      {/* Rich Store Header Banner */}
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
