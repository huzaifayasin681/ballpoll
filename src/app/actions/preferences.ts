"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { isCurrency } from "@/lib/currency";
import { CURRENCY_COOKIE } from "@/lib/money";

export async function setCurrencyAction(code: string) {
  if (!isCurrency(code)) return;
  const store = await cookies();
  store.set(CURRENCY_COOKIE, code, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  refresh();
}
