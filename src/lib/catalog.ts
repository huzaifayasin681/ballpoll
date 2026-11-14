import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

/** Active flash sales keyed by product slug (or "*" for store-wide). */
export async function getActiveSales() {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  const now = new Date();
  return db.flashSale.findMany({
    where: { isActive: true, startsAt: { lte: now }, endsAt: { gt: now } },
    orderBy: { endsAt: "asc" },
  });
}

export type ActiveSale = Awaited<ReturnType<typeof getActiveSales>>[number];

export function saleFor(sales: ActiveSale[], productSlug: string) {
  return sales.find((s) => s.productSlug === productSlug) ?? sales.find((s) => !s.productSlug) ?? null;
}

export function applySale(priceCents: number, sale: ActiveSale | null) {
  if (!sale) return priceCents;
  return Math.round(priceCents * (1 - sale.percentOff / 100));
}

export async function getCategories() {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
}

const productCardInclude = {
  category: { select: { slug: true, name: true } },
  variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
  reviews: { where: { approved: true }, select: { rating: true } },
} satisfies Prisma.ProductInclude;

export type ProductCardData = Prisma.ProductGetPayload<{ include: typeof productCardInclude }>;

export type ProductFilters = {
  category?: string;
  q?: string;
  type?: string;
  speed?: "instant" | "fast" | "standard";
  region?: string;
  sort?: "popular" | "price-asc" | "price-desc" | "newest" | "fastest";
  featured?: boolean;
};

export async function getProducts(f: ProductFilters = {}) {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  const where: Prisma.ProductWhereInput = { isActive: true };
  if (f.category) where.category = { slug: f.category };
  if (f.featured) where.featured = true;
  if (f.type) where.type = f.type as Prisma.ProductWhereInput["type"];
  if (f.region) where.region = f.region;
  if (f.q) where.OR = [{ name: { contains: f.q, mode: "insensitive" } }, { shortDesc: { contains: f.q, mode: "insensitive" } }];
  if (f.speed === "instant") where.deliveryHours = { lte: 0 };
  if (f.speed === "fast") where.deliveryHours = { lte: 6 };
  if (f.speed === "standard") where.deliveryHours = { gt: 6 };

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    f.sort === "newest" ? [{ createdAt: "desc" }] : f.sort === "fastest" ? [{ deliveryHours: "asc" }] : [{ featured: "desc" }, { createdAt: "asc" }];

  const products = await db.product.findMany({ where, include: productCardInclude, orderBy });
  const minPrice = (p: ProductCardData) => Math.min(...p.variants.map((v) => v.priceCents), Infinity);
  if (f.sort === "price-asc") products.sort((a, b) => minPrice(a) - minPrice(b));
  if (f.sort === "price-desc") products.sort((a, b) => minPrice(b) - minPrice(a));
  return products;
}

export async function getProduct(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      account: true,
      reviews: { where: { approved: true }, orderBy: { createdAt: "desc" }, take: 12 },
    },
  });
}

export function ratingSummary(reviews: { rating: number }[]) {
  if (!reviews.length) return { avg: 0, count: 0 };
  return { avg: reviews.reduce((s, r) => s + r.rating, 0) / reviews.length, count: reviews.length };
}

export const LEGENDARY_CUE_PACK_SLUGS = [
  "starter-cue-box",
  "ultimate-collector-pack",
  "max-level-upgrade",
] as const;

export const GAMEPLAY_ASSIST_SLUGS = [
  "weekly-pass-key",
  "monthly-vip-key",
  "ultimate-season-pass",
] as const;

export const COMBO_BUNDLE_SLUGS = [
  "gamer-starter-combo",
  "king-master-bundle",
] as const;

export type PackVariantOption = {
  id: string;
  label: string;
  priceCents: number;
  compareCents: number | null;
};

export type LegendaryPackItem = {
  slug: string;
  name: string;
  image: string;
  variantId: string;
  variantLabel: string;
  priceCents: number;
  compareCents: number | null;
  salePercentOff: number | null;
};

export type BoostingPackItem = {
  slug: string;
  name: string;
  image: string;
  salePercentOff: number | null;
  variants: PackVariantOption[];
};

function mapVariantWithSale(
  v: ProductCardData["variants"][number],
  sale: ActiveSale | null,
): PackVariantOption {
  return {
    id: v.id,
    label: v.label,
    priceCents: applySale(v.priceCents, sale),
    compareCents: sale ? v.priceCents : v.compareCents,
  };
}

function toSingleVariantPackItems(
  slugs: readonly string[],
  products: ProductCardData[],
  sales: ActiveSale[],
): LegendaryPackItem[] {
  return slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is ProductCardData => Boolean(p && p.variants.length > 0))
    .map((p) => {
      const sale = saleFor(sales, p.slug);
      const first = mapVariantWithSale(p.variants[0], sale);
      return {
        slug: p.slug,
        name: p.name,
        image: p.image,
        variantId: first.id,
        variantLabel: first.label,
        priceCents: first.priceCents,
        compareCents: first.compareCents,
        salePercentOff: sale?.percentOff ?? null,
      };
    });
}

/** Maps the three orderable Legendary Cue Shop tiers from catalog products + active sales. */
export function toLegendaryPackItems(products: ProductCardData[], sales: ActiveSale[]): LegendaryPackItem[] {
  return toSingleVariantPackItems(LEGENDARY_CUE_PACK_SLUGS, products, sales);
}

/** Maps the three Gameplay Assist & License Key tiers from catalog products + active sales. */
export function toGameplayAssistPacks(products: ProductCardData[], sales: ActiveSale[]): LegendaryPackItem[] {
  return toSingleVariantPackItems(GAMEPLAY_ASSIST_SLUGS, products, sales);
}

/** Maps Section 5 Mega Combo Bundles from catalog products + active sales. */
export function toComboBundlePacks(products: ProductCardData[], sales: ActiveSale[]): LegendaryPackItem[] {
  return toSingleVariantPackItems(COMBO_BUNDLE_SLUGS, products, sales);
}

export const BOOSTING_PACKAGE_SLUGS = [
  "high-tier-ring-grinding",
  "venice-elite-ring-package",
  "account-level-progression",
] as const;

/** Maps Section 3 Boosting packages + lowest in-stock Ready-Made Pro Account price. */
export function toBoostingShopData(
  boostingProducts: ProductCardData[],
  accountProducts: ProductCardData[],
  sales: ActiveSale[],
): { packs: BoostingPackItem[]; startingAccountPriceCents: number | null } {
  const packs = BOOSTING_PACKAGE_SLUGS.map((slug) => boostingProducts.find((p) => p.slug === slug))
    .filter((p): p is ProductCardData => Boolean(p && p.variants.length > 0))
    .map((p) => {
      const sale = saleFor(sales, p.slug);
      return {
        slug: p.slug,
        name: p.name,
        image: p.image,
        salePercentOff: sale?.percentOff ?? null,
        variants: p.variants.map((v) => mapVariantWithSale(v, sale)),
      };
    });

  const proAccounts = accountProducts.filter((p) => p.slug !== "starter-cash-account");
  const accountPool = proAccounts.length > 0 ? proAccounts : accountProducts;
  const inStockPrices = accountPool.flatMap((p) => {
    const sale = saleFor(sales, p.slug);
    return p.variants.filter((v) => v.stock !== 0).map((v) => applySale(v.priceCents, sale));
  });
  const startingAccountPriceCents = inStockPrices.length > 0 ? Math.min(...inStockPrices) : null;

  return { packs, startingAccountPriceCents };
}

/** Real, anonymised recent orders for the live ticker (no fake data). */
export async function getRecentOrdersForTicker(limit = 12) {
  "use cache";
  cacheLife("seconds");
  cacheTag("orders");
  const orders = await db.order.findMany({
    where: { status: { in: ["PAID", "PROCESSING", "COMPLETED"] } },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      country: true,
      createdAt: true,
      user: { select: { name: true } },
      items: { select: { name: true }, take: 1 },
    },
  });
  return orders.map((o) => ({
    id: o.id,
    who: o.user?.name ? o.user.name.split(" ")[0] : "A player",
    country: o.country,
    item: o.items[0]?.name ?? "an order",
    at: o.createdAt.toISOString(),
  }));
}

export async function getStoreStats() {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  const [orders, completed, reviews] = await Promise.all([
    db.order.count(),
    db.order.count({ where: { status: "COMPLETED" } }),
    db.review.aggregate({ _avg: { rating: true }, _count: true, where: { approved: true } }),
  ]);
  return { orders, completed, avgRating: reviews._avg.rating ?? 5, reviewCount: reviews._count };
}
