import { NextRequest, NextResponse } from "next/server";
import { priceCart } from "@/lib/orders";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    items?: { variantId: string; quantity: number }[];
    coupon?: string;
  };
  if (!Array.isArray(body.items) || !body.items.length) {
    return NextResponse.json({ lines: [], subtotal: 0, coupon: null, couponDiscount: 0, needsUniqueId: false, needsCreds: false });
  }
  const priced = await priceCart(body.items, body.coupon);
  return NextResponse.json({
    lines: priced.lines.map((l) => ({
      variantId: l.variant.id,
      productName: l.variant.product.name,
      productSlug: l.variant.product.slug,
      variantLabel: l.variant.label,
      image: l.variant.product.image,
      quantity: l.quantity,
      unitCents: l.unitCents,
    })),
    subtotal: priced.subtotal,
    coupon: priced.coupon,
    couponDiscount: priced.couponDiscount,
    needsUniqueId: priced.lines.some((l) => l.variant.product.requiredInput === "UNIQUE_ID"),
    needsCreds: priced.lines.some((l) => l.variant.product.requiredInput === "CREDENTIALS"),
  });
}
