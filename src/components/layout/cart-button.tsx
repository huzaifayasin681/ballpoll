"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";

export function CartButton() {
  const { count, ready } = useCart();
  return (
    <Link
      href="/cart"
      aria-label={`Cart (${count} items)`}
      className="relative flex h-9 w-9 items-center justify-center rounded-[2px] text-ink transition hover:bg-surface-2/70"
    >
      <ShoppingCart className="h-[18px] w-[18px] stroke-[1.8]" />
      {ready && count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brass px-1 text-[9px] font-bold text-mahogany">
          {count}
        </span>
      )}
    </Link>
  );
}
