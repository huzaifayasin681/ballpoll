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
