"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.email(),
  trackingId: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10, "Message is too short").max(2000),
});

export async function createTicketAction(_: { ok?: boolean; error?: string } | undefined, form: FormData) {
  const parsed = schema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    trackingId: form.get("trackingId") || undefined,
    subject: form.get("subject"),
    message: form.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const user = await getCurrentUser();
  await db.supportTicket.create({ data: { ...parsed.data, userId: user?.id } });
  return { ok: true };
}
