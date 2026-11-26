"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";

export function QuickAddPlusButton({
  variantId,
  productSlug,
  productName,
  variantLabel,
  image,
  disabled,
  className,
}: {
  variantId: string;
  productSlug: string;
  productName: string;
  variantLabel: string;
  image: string;
  disabled?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={`Add ${productName} to cart`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add({ variantId, productSlug, productName, variantLabel, image });
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
      className={cn(
        "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[2px] border transition-colors",
        added
          ? "border-felt bg-felt text-paper"
          : "border-[#D4C9B2] bg-paper text-ink hover:border-felt hover:bg-felt hover:text-paper",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
    >
      {added ? <Check className="h-4 w-4 stroke-[2]" /> : <Plus className="h-4 w-4 stroke-[1.8]" />}
    </button>
  );
}
