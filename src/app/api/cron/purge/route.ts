import { NextResponse } from "next/server";
import { purgeExpiredCredentials } from "@/lib/orders";

export async function POST() {
  const purged = await purgeExpiredCredentials();
  return NextResponse.json({ purged });
}
