"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { ReviewForm } from "@/components/shop/review-form";
import { cn } from "@/lib/utils";

type TabKey = "details" | "delivery" | "faq";

export function ProductDetailTabs({
  requiredInput,
  deliveryHours,
}: {
  requiredInput: "UNIQUE_ID" | "CREDENTIALS" | "NONE";
  deliveryHours: number;
}) {
  const [tab, setTab] = useState<TabKey>("details");

  const items: Record<TabKey, string[]> = {
    details: [
      requiredInput === "UNIQUE_ID"
        ? "Delivered to the account linked to your Unique ID"
        : requiredInput === "CREDENTIALS"
          ? "Delivered directly to your account via encrypted vault"
          : "Delivered immediately to your order tracker and email",
      "Progress updates on WhatsApp and the tracking page",
      "Hand-played by our team, no automated tools",
      "Full refund if we cannot complete it",
    ],
    delivery: [
      `Estimated turnaround: ${deliveryHours === 0 ? "Instant automated delivery" : `Within ${deliveryHours} hours`}`,
      "Live four-stage timeline available immediately after checkout",
      "Manual payment confirmation typically within 15 minutes",
      "24/7 concierge assistance over WhatsApp and Telegram",
    ],
    faq: [
      "Unique ID orders never require your game password",
      "Temporary login credentials are AES-256 encrypted and purged after 72h",
      "You receive loyalty points automatically once the order completes",
      "Full refund issued to your original payment method if we cannot deliver",
    ],
  };

  return (
    <div className="rounded-[4px] bg-paper p-5 text-ink sm:p-6">
      <div className="flex gap-6 border-b border-border">
        {(
          [
            { key: "details", label: "Details" },
            { key: "delivery", label: "Delivery" },
            { key: "faq", label: "FAQ" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "cursor-pointer border-b-2 pb-3 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors",
              tab === t.key ? "border-brass text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="mt-5 space-y-3">
        {items[tab].map((line) => (
          <li key={line} className="flex items-start gap-2.5 text-sm text-ink">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WriteReviewToggle({
  productId,
  slug,
  defaultName,
}: {
  productId: string;
  slug: string;
  defaultName?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer rounded-[2px] border border-[#D4C9B2] bg-paper px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:border-brass"
      >
        {open ? "Close form" : "Write a review"}
      </button>

      {open && (
        <div className="mt-4 rounded-[6px] border border-border bg-paper p-5">
          <ReviewForm productId={productId} slug={slug} defaultName={defaultName} />
        </div>
      )}
    </div>
  );
}
