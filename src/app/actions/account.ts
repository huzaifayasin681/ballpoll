"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const gameIdSchema = z.object({
  label: z.string().trim().min(1).max(40),
  uniqueId: z.string().trim().min(4).max(20).regex(/^[0-9\- ]+$/, "Digits and dashes only"),
});

export async function addSavedGameIdAction(form: FormData) {
  const user = await requireUser();
  const parsed = gameIdSchema.safeParse({ label: form.get("label"), uniqueId: form.get("uniqueId") });
  if (!parsed.success) return;
  await db.savedGameId
    .create({ data: { userId: user.id, label: parsed.data.label, uniqueId: parsed.data.uniqueId } })
    .catch(() => {});
  revalidatePath("/dashboard");
}

export async function deleteSavedGameIdAction(form: FormData) {
  const user = await requireUser();
  const id = String(form.get("id") ?? "");
  await db.savedGameId.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/dashboard");
}
