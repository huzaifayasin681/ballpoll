import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const [categories, products, posts] = await Promise.all([
    db.category.findMany({ select: { slug: true } }),
    db.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    db.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes = ["", "/store", "/deals", "/track", "/rewards", "/reviews", "/blog", "/help", "/legal/refund", "/legal/terms", "/legal/privacy"];
  return [
    ...staticRoutes.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "daily" as const, priority: p === "" ? 1 : 0.8 })),
    ...categories.map((c) => ({ url: `${site.url}/store/${c.slug}`, changeFrequency: "daily" as const, priority: 0.85 })),
    ...products.map((p) => ({ url: `${site.url}/product/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "daily" as const, priority: 0.9 })),
    ...posts.map((b) => ({ url: `${site.url}/blog/${b.slug}`, lastModified: b.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
