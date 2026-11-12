"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";
import { newReferralCode } from "@/lib/crypto";

export type AuthState = { error?: string } | undefined;

function safeNext(next: unknown) {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard";
}

const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });

export async function loginAction(_: AuthState, form: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "Enter your email and password." };
  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user?.passwordHash || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }
  await createSession({ userId: user.id, role: user.role });
  redirect(safeNext(form.get("next")));
}

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(60),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  ref: z.string().max(20).optional(),
});

export async function registerAction(_: AuthState, form: FormData): Promise<AuthState> {
  const store = await cookies();
  const parsed = registerSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    password: form.get("password"),
    ref: (form.get("ref") as string) || store.get("gps_ref")?.value || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const email = parsed.data.email.toLowerCase();
  if (await db.user.findUnique({ where: { email } })) return { error: "An account with this email already exists." };

  const referrer = parsed.data.ref ? await db.user.findUnique({ where: { referralCode: parsed.data.ref.toUpperCase() } }) : null;
  const user = await db.user.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
      referralCode: newReferralCode(),
      referredById: referrer?.id,
    },
  });
  // Attach previous guest orders placed with the same email
  await db.order.updateMany({ where: { email, userId: null }, data: { userId: user.id } });
  await createSession({ userId: user.id, role: user.role });
  redirect(safeNext(form.get("next")));
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
