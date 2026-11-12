import { NextResponse } from "next/server";
import { getRecentOrdersForTicker } from "@/lib/catalog";

export async function GET() {
  const items = await getRecentOrdersForTicker(12);
  return NextResponse.json(items);
}
