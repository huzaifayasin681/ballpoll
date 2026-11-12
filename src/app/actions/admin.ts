"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { can, requireRole, STAFF_ROLES } from "@/lib/auth";
import { decrypt, encrypt } from "@/lib/crypto";
import { updateOrderStatus } from "@/lib/orders";
import type { OrderStatus, Role, TicketStatus } from "@/generated/prisma/enums";

export async function adminUpdateOrderAction(form: FormData) {
  const actor = await requireRole(STAFF_ROLES);
  const orderId = String(form.get("orderId") ?? "");
  const status = form.get("status") as OrderStatus | null;
  const assignedToId = form.get("assignedToId") as string | null;
  const message = String(form.get("message") ?? "");
  const staffNote = form.get("staffNote") as string | null;

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return;

  // Boosters can only act on orders assigned to them (or claim an unassigned order)
  if (actor.role === "BOOSTER" && order.assignedToId && order.assignedToId !== actor.id) return;
  if (status === "REFUNDED" && !can.refund(actor.role)) return;

  if (assignedToId !== null && (actor.role === "ADMIN" || actor.role === "SUPPORT" || !order.assignedToId)) {
    await db.order.update({ where: { id: orderId }, data: { assignedToId: assignedToId || null } });
  }
  if (staffNote !== null) {
    await db.order.update({ where: { id: orderId }, data: { staffNote } });
  }
  if (status && status !== order.status) {
    await updateOrderStatus(orderId, status, { message, actorId: actor.id });
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${orderId}`);
}

/** Audited credential reveal: only ADMIN or assigned BOOSTER while order is PROCESSING. */
export async function revealCredentialsAction(orderId: string) {
  const actor = await requireRole(["ADMIN", "BOOSTER"]);
  const order = await db.order.findUnique({ where: { id: orderId }, include: { credential: true } });
  if (!order?.credential) return { error: "No stored credentials for this order." };
  if (actor.role === "BOOSTER" && (order.assignedToId !== actor.id || order.status !== "PROCESSING")) {
    return { error: "Boosters can only view credentials while assigned and order is Processing." };
  }
  await db.auditLog.create({
    data: { actorId: actor.id, action: "credential.reveal", target: order.trackingId },
  });
  return {
    login: decrypt(order.credential.loginEnc),
    secret: decrypt(order.credential.secretEnc),
  };
}

// ─── Inventory Manager (ADMIN only) ───

export async function updateVariantAction(form: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const id = String(form.get("id") ?? "");
  const priceDollars = Number(form.get("price") ?? 0);
  const stock = Number(form.get("stock") ?? -1);
  const isActive = form.get("isActive") === "on";
  if (!id || Number.isNaN(priceDollars) || priceDollars < 0) return;

  await db.productVariant.update({
    where: { id },
    data: { priceCents: Math.round(priceDollars * 100), stock: Math.trunc(stock), isActive },
  });
  await db.auditLog.create({ data: { actorId: actor.id, action: "inventory.update", target: id } });
  revalidateTag("catalog", "max");
  revalidatePath("/admin/inventory");
  revalidatePath("/store");
}

export async function toggleProductStockAction(form: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const id = String(form.get("id") ?? "");
  const isActive = form.get("isActive") === "true";
  await db.product.update({ where: { id }, data: { isActive } });
  await db.auditLog.create({ data: { actorId: actor.id, action: `product.${isActive ? "enable" : "disable"}`, target: id } });
  revalidateTag("catalog", "max");
  revalidatePath("/admin/inventory");
  revalidatePath("/store");
}

export async function addLicenseKeysAction(form: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const variantId = String(form.get("variantId") ?? "");
  const raw = String(form.get("keys") ?? "");
  const keys = raw
    .split(/\r?\n/)
    .map((k) => k.trim())
    .filter(Boolean);
  if (!variantId || !keys.length) return;
  await db.licenseKey.createMany({ data: keys.map((k) => ({ variantId, keyEnc: encrypt(k) })) });
  await db.auditLog.create({ data: { actorId: actor.id, action: `keys.add(${keys.length})`, target: variantId } });
  revalidatePath("/admin/inventory");
}

// ─── Staff & Role Management (ADMIN only) ───

export async function updateUserRoleAction(form: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const userId = String(form.get("userId") ?? "");
  const role = form.get("role") as Role;
  if (!userId || userId === actor.id) return; // prevent locking yourself out
  await db.user.update({ where: { id: userId }, data: { role } });
  await db.auditLog.create({ data: { actorId: actor.id, action: `user.role.${role}`, target: userId } });
  revalidatePath("/admin/staff");
}

// ─── Support Tickets (ADMIN + SUPPORT) ───

export async function updateTicketStatusAction(form: FormData) {
  await requireRole(["ADMIN", "SUPPORT"]);
  const id = String(form.get("id") ?? "");
  const status = form.get("status") as TicketStatus;
  await db.supportTicket.update({ where: { id }, data: { status } });
  revalidatePath("/admin/tickets");
}
