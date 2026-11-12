import "server-only";
import { z } from "zod";
import { db } from "@/lib/db";
import { encrypt, newTrackingId } from "@/lib/crypto";
import { applySale, getActiveSales, saleFor } from "@/lib/catalog";
import { notifyCustomer } from "@/lib/notify";
import { POINTS_PER_DOLLAR_OFF, POINTS_PER_USD, site, tierFor } from "@/lib/site";
import { getGateway } from "@/lib/payments";
import type { OrderStatus } from "@/generated/prisma/enums";

export const statusLabels: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Awaiting Payment",
  PAID: "Paid: In Queue",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  REFUNDED: "Refunded",
  CANCELLED: "Cancelled",
};

export const CREDENTIAL_TTL_HOURS = 72;

// ───────────────────────── Checkout ─────────────────────────

export const checkoutSchema = z.object({
  email: z.email("Enter a valid email"),
  name: z.string().max(80).optional(),
  gameUniqueId: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9\- ]*$/, "Unique ID should contain digits only")
    .optional(),
  login: z.string().max(200).optional(),
  secret: z.string().max(200).optional(),
  coupon: z.string().max(30).optional(),
  usePoints: z.boolean().optional(),
  paymentMethod: z.string().default("manual"),
  items: z
    .array(z.object({ variantId: z.string().min(1), quantity: z.number().int().min(1).max(99) }))
    .min(1, "Your cart is empty"),
  agree: z.literal(true, { error: "Please accept the Terms & Refund Policy" }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Server-side price calculation. Never trust client prices. */
export async function priceCart(items: { variantId: string; quantity: number }[], couponCode?: string) {
  const variants = await db.productVariant.findMany({
    where: { id: { in: items.map((i) => i.variantId) }, isActive: true, product: { isActive: true } },
    include: { product: true },
  });
  const sales = await getActiveSales();
  const lines = items
    .map((i) => {
      const v = variants.find((x) => x.id === i.variantId);
      if (!v) return null;
      const sale = saleFor(sales, v.product.slug);
      const unit = applySale(v.priceCents, sale);
      return { variant: v, quantity: i.quantity, unitCents: unit, baseCents: v.priceCents, sale };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = lines.reduce((s, l) => s + l.unitCents * l.quantity, 0);
  let coupon: { code: string; percentOff: number } | null = null;
  if (couponCode) {
    const c = await db.coupon.findUnique({ where: { code: couponCode.trim().toUpperCase() } });
    if (c && c.isActive && (!c.expiresAt || c.expiresAt > new Date()) && (c.maxUses == null || c.uses < c.maxUses)) {
      coupon = { code: c.code, percentOff: c.percentOff };
    }
  }
  const couponDiscount = coupon ? Math.round((subtotal * coupon.percentOff) / 100) : 0;
  return { lines, subtotal, coupon, couponDiscount };
}

export async function createOrder(input: CheckoutInput, ctx: { userId?: string | null; country?: string | null; currency: string; fxRate: number }) {
  const priced = await priceCart(input.items, input.coupon);
  if (!priced.lines.length) throw new Error("No valid items in cart");

  // Stock + required input validation
  for (const l of priced.lines) {
    if (l.variant.stock !== -1 && l.variant.stock < l.quantity) {
      throw new Error(`${l.variant.product.name} (${l.variant.label}) is out of stock`);
    }
  }
  const needsUniqueId = priced.lines.some((l) => l.variant.product.requiredInput === "UNIQUE_ID");
  const needsCreds = priced.lines.some((l) => l.variant.product.requiredInput === "CREDENTIALS");
  if (needsUniqueId && !input.gameUniqueId) throw new Error("Please enter your 8 Ball Pool Unique ID");
  if (needsCreds && (!input.login || !input.secret)) throw new Error("This service needs your game login to complete");

  const gateway = getGateway(input.paymentMethod) ?? getGateway("manual")!;

  // Loyalty redemption
  let pointsUsed = 0;
  let pointsDiscount = 0;
  if (input.usePoints && ctx.userId) {
    const u = await db.user.findUnique({ where: { id: ctx.userId }, select: { points: true } });
    const maxByTotal = (priced.subtotal - priced.couponDiscount) * 0.5; // max 50% off with points
    const usable = Math.min(u?.points ?? 0, Math.floor((maxByTotal / 100) * POINTS_PER_DOLLAR_OFF));
    pointsUsed = usable - (usable % POINTS_PER_DOLLAR_OFF);
    pointsDiscount = (pointsUsed / POINTS_PER_DOLLAR_OFF) * 100;
  }

  const discount = priced.couponDiscount + pointsDiscount;
  const total = Math.max(0, priced.subtotal - discount);
  const trackingId = newTrackingId();

  const order = await db.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: {
        trackingId,
        userId: ctx.userId ?? null,
        email: input.email.toLowerCase(),
        country: ctx.country,
        gameUniqueId: input.gameUniqueId?.replace(/\s/g, "") || null,
        currency: ctx.currency,
        fxRate: ctx.fxRate,
        subtotalCents: priced.subtotal,
        discountCents: discount,
        totalCents: total,
        couponCode: priced.coupon?.code,
        pointsUsed,
        paymentMethod: gateway.id,
        items: {
          create: priced.lines.map((l) => ({
            variantId: l.variant.id,
            name: `${l.variant.product.name}: ${l.variant.label}`,
            quantity: l.quantity,
            unitCents: l.unitCents,
          })),
        },
        events: { create: { status: "PENDING_PAYMENT", message: "Order placed. Awaiting payment confirmation." } },
        credential:
          needsCreds && input.login && input.secret
            ? { create: { loginEnc: encrypt(input.login), secretEnc: encrypt(input.secret) } }
            : undefined,
      },
    });
    if (priced.coupon) await tx.coupon.update({ where: { code: priced.coupon.code }, data: { uses: { increment: 1 } } });
    if (pointsUsed && ctx.userId) {
      await tx.user.update({ where: { id: ctx.userId }, data: { points: { decrement: pointsUsed } } });
      await tx.ledgerEntry.create({
        data: { userId: ctx.userId, type: "REDEEM", points: -pointsUsed, note: `Redeemed on order ${trackingId}`, orderId: o.id },
      });
    }
    return o;
  });

  const session = await gateway.createCheckout({ trackingId, totalCents: total, currency: "USD", email: order.email });
  await notifyCustomer(
    order.email,
    `Order ${trackingId} received`,
    `Thanks for your order! Track it any time at ${site.url}/track?id=${trackingId}\n\n${session.instructions ?? ""}`,
  );
  return { trackingId, redirectUrl: session.redirectUrl, instructions: session.instructions };
}

// ───────────────────────── Status workflow ─────────────────────────

const allowed: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "COMPLETED", "REFUNDED"],
  PROCESSING: ["COMPLETED", "REFUNDED", "PAID"],
  COMPLETED: ["REFUNDED"],
  REFUNDED: [],
  CANCELLED: [],
};

export function nextStatuses(s: OrderStatus) {
  return allowed[s];
}

const defaultMessages: Partial<Record<OrderStatus, string>> = {
  PAID: "Payment confirmed. Your order is in the delivery queue.",
  PROCESSING: "A team member is now working on your order.",
  COMPLETED: "Your order has been delivered. Enjoy!",
  REFUNDED: "Your order has been refunded.",
  CANCELLED: "Your order was cancelled.",
};

export async function updateOrderStatus(orderId: string, status: OrderStatus, opts: { message?: string; actorId?: string } = {}) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { variant: { include: { product: true } } } }, user: true },
  });
  if (!order) throw new Error("Order not found");
  if (order.status === status) return order;
  if (!allowed[order.status].includes(status)) throw new Error(`Cannot move order from ${order.status} to ${status}`);

  const message = opts.message?.trim() || defaultMessages[status] || statusLabels[status];

  await db.$transaction(async (tx) => {
    await tx.order.update({ where: { id: orderId }, data: { status } });
    await tx.orderEvent.create({ data: { orderId, status, message } });

    if (status === "PAID") {
      // Reserve stock
      for (const it of order.items) {
        if (it.variant.stock !== -1) {
          await tx.productVariant.update({ where: { id: it.variantId }, data: { stock: { decrement: it.quantity } } });
        }
        if (it.variant.product.type === "ACCOUNT") {
          await tx.accountListing.updateMany({ where: { productId: it.variant.productId }, data: { sold: true } });
        }
      }
    }
    if (status === "COMPLETED") {
      await tx.orderCredential.updateMany({
        where: { orderId },
        data: { purgeAfter: new Date(Date.now() + CREDENTIAL_TTL_HOURS * 36e5) },
      });
      if (order.userId && order.user) {
        const { current } = tierFor(order.user.lifetimeSpend);
        const earned = Math.floor((order.totalCents / 100) * POINTS_PER_USD * current.multiplier);
        await tx.user.update({ where: { id: order.userId }, data: { points: { increment: earned }, lifetimeSpend: { increment: order.totalCents } } });
        await tx.ledgerEntry.create({ data: { userId: order.userId, type: "EARN_PURCHASE", points: earned, note: `Order ${order.trackingId}`, orderId } });
        // Referral commission (as points: 1 point = 1 cent ÷ (100/POINTS_PER_DOLLAR_OFF))
        if (order.user.referredById) {
          const commissionCents = Math.floor((order.totalCents * site.referralPercent) / 100);
          const pts = Math.floor((commissionCents / 100) * POINTS_PER_DOLLAR_OFF);
          if (pts > 0) {
            await tx.user.update({ where: { id: order.user.referredById }, data: { points: { increment: pts } } });
            await tx.ledgerEntry.create({
              data: { userId: order.user.referredById, type: "REFERRAL_COMMISSION", points: pts, note: `Referral commission: ${order.trackingId}`, orderId },
            });
          }
        }
      }
    }
    if (status === "REFUNDED" || status === "CANCELLED") {
      await tx.orderCredential.deleteMany({ where: { orderId } });
      if (order.pointsUsed && order.userId) {
        await tx.user.update({ where: { id: order.userId }, data: { points: { increment: order.pointsUsed } } });
        await tx.ledgerEntry.create({ data: { userId: order.userId, type: "ADJUSTMENT", points: order.pointsUsed, note: `Points returned: ${order.trackingId}`, orderId } });
      }
    }
    if (opts.actorId) {
      await tx.auditLog.create({ data: { actorId: opts.actorId, action: `order.status.${status}`, target: order.trackingId } });
    }
  });

  // Instant delivery: license keys auto-assigned once paid
  if (status === "PAID") await tryInstantDelivery(orderId);

  await notifyCustomer(order.email, `Order ${order.trackingId}: ${statusLabels[status]}`, `${message}\n\nTrack: ${site.url}/track?id=${order.trackingId}`);
  return order;
}

async function tryInstantDelivery(orderId: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { variant: { include: { product: true } }, licenseKey: true } } },
  });
  if (!order) return;
  const allInstant = order.items.every((i) => i.variant.product.deliveryMode === "INSTANT");
  for (const it of order.items) {
    if (it.variant.product.type !== "LICENSE_KEY" || it.licenseKey) continue;
    const key = await db.licenseKey.findFirst({ where: { variantId: it.variantId, orderItemId: null } });
    if (key) await db.licenseKey.update({ where: { id: key.id }, data: { orderItemId: it.id } });
  }
  if (allInstant) {
    const missing = await db.orderItem.count({ where: { orderId, licenseKey: null, variant: { product: { type: "LICENSE_KEY" } } } });
    if (missing === 0) {
      await db.order.update({ where: { id: orderId }, data: { status: "COMPLETED" } });
      await db.orderEvent.create({ data: { orderId, status: "COMPLETED", message: "Delivered instantly. Your key is shown on this page." } });
      await db.orderCredential.updateMany({ where: { orderId }, data: { purgeAfter: new Date() } });
    }
  }
}

/** Delete stored credentials whose retention window passed. Run from a cron (see /api/cron/purge). */
export async function purgeExpiredCredentials() {
  const r = await db.orderCredential.deleteMany({ where: { purgeAfter: { lte: new Date() } } });
  return r.count;
}

// ───────────────────────── Tracking ─────────────────────────

/** Public tracker lookup: requires tracking ID + (email OR unique ID) to prevent enumeration. */
export async function lookupOrder(trackingId: string, verifier: string) {
  const t = trackingId.trim().toUpperCase();
  const v = verifier.trim().toLowerCase().replace(/\s/g, "");
  if (!t || !v) return null;
  const order = await db.order.findUnique({
    where: { trackingId: t },
    include: {
      items: { include: { licenseKey: true, variant: { include: { product: { select: { slug: true, image: true, deliveryHours: true } } } } } },
      events: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) return null;
  const ok = order.email === v || (order.gameUniqueId && order.gameUniqueId.replace(/[\s-]/g, "") === v.replace(/-/g, ""));
  return ok ? order : null;
}
