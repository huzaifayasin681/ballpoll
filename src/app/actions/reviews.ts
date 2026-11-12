"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getCountry } from "@/lib/money";
import { maskName } from "@/lib/utils";

const schema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  author: z.string().trim().min(2).max(50),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().min(10, "Review is too short").max(500),
});

export async function submitReviewAction(_: { ok?: boolean; error?: string } | undefined, form: FormData) {
  const parsed = schema.safeParse({
    productId: form.get("productId"),
    slug: form.get("slug"),
    author: form.get("author"),
    rating: form.get("rating"),
    body: form.get("body"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const user = await getCurrentUser();
  const country = (await getCountry()) || "US";
  // Verified if the signed-in user has a completed order containing this product
  const verified = user
    ? (await db.order.count({
        where: { userId: user.id, status: "COMPLETED", items: { some: { variant: { productId: parsed.data.productId } } } },
      })) > 0
    : false;

  await db.review.create({
    data: {
      productId: parsed.data.productId,
      userId: user?.id,
      author: maskName(parsed.data.author),
      country,
      rating: parsed.data.rating,
      body: parsed.data.body,
      verified,
      approved: true,
    },
  });
  revalidateTag("catalog", "max");
  revalidatePath(`/product/${parsed.data.slug}`);
  revalidatePath("/reviews");
  return { ok: true };
}
