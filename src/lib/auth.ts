import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { readSession } from "@/lib/session";
import type { Role } from "@/generated/prisma/enums";

/** Current user (deduped per request). Returns null for guests. */
export const getCurrentUser = cache(async () => {
  const session = await readSession();
  if (!session) return null;
  return db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      points: true,
      lifetimeSpend: true,
      referralCode: true,
      currency: true,
      createdAt: true,
    },
  });
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function requireUser(next = "/dashboard") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export const STAFF_ROLES: Role[] = ["ADMIN", "SUPPORT", "BOOSTER"];

/** Role-based guard for admin area. Throws a redirect if unauthorised. */
export async function requireRole(roles: Role[]) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!roles.includes(user.role)) redirect("/");
  return user;
}

/** Permission matrix: boosters/support never see financial data. */
export const can = {
  viewFinancials: (r: Role) => r === "ADMIN",
  manageCatalog: (r: Role) => r === "ADMIN",
  manageUsers: (r: Role) => r === "ADMIN",
  manageContent: (r: Role) => r === "ADMIN" || r === "SUPPORT",
  viewAllOrders: (r: Role) => r === "ADMIN" || r === "SUPPORT",
  fulfillOrders: (r: Role) => r === "ADMIN" || r === "BOOSTER",
  viewCredentials: (r: Role) => r === "ADMIN" || r === "BOOSTER",
  refund: (r: Role) => r === "ADMIN",
  tickets: (r: Role) => r === "ADMIN" || r === "SUPPORT",
};
