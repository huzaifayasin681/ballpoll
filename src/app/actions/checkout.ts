"use server";

import { checkoutSchema, createOrder } from "@/lib/orders";
import { getCurrentUser } from "@/lib/auth";
import { getCountry, getMoneyContext } from "@/lib/money";

export async function placeOrderAction(raw: unknown) {
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    const [user, country, { currency, rates }] = await Promise.all([getCurrentUser(), getCountry(), getMoneyContext()]);
    const res = await createOrder(parsed.data, {
      userId: user?.id,
      country,
      currency,
      fxRate: rates[currency] ?? 1,
    });
    return { ok: true, trackingId: res.trackingId, redirectUrl: res.redirectUrl };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not place order" };
  }
}
