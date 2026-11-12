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
      className="relative flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-foreground transition hover:bg-surface-2"
    >
      <ShoppingCart className="h-4 w-4" />
      {ready && count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-btn px-1 text-[10px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
