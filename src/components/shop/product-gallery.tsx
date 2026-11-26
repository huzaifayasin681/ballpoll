"use client";

import { useState } from "react";
import { POOL_IMAGE_MAP, ProductArt } from "@/components/product-art";
import { cn } from "@/lib/utils";

const SECONDARY_IMAGES: Record<string, string[]> = {
  coins: ["/images/pool/instant-coin-topups.jpg", "/images/pool/tournament-coins.jpg", "/images/pool/rack-break.jpg"],
  cash: ["/images/pool/logo-8ball.jpg", "/images/pool/tournament-coins.jpg", "/images/pool/match-blue.jpg"],
  cue: ["/images/pool/legendary-cues-maxed.jpg", "/images/pool/cues-legendary.jpg", "/images/pool/elite-players-showcase.jpg"],
  cue_maxed: ["/images/pool/cues-legendary.png", "/images/pool/cues-legendary.jpg", "/images/pool/elite-players-showcase.jpg"],
  upgrade: ["/images/pool/cues-legendary.png", "/images/pool/legendary-cues-maxed.jpg", "/images/pool/tables-venues.png"],
  boost_pro: ["/images/pool/tables-venues.png", "/images/pool/match-white.jpg", "/images/pool/elite-players-showcase.jpg"],
  ring: ["/images/pool/pro-account-boosting.jpg", "/images/pool/elite-players-showcase.jpg", "/images/pool/match-white.jpg"],
  account: ["/images/pool/pro-account-boosting.jpg", "/images/pool/cues-legendary.png", "/images/pool/tables-venues.png"],
  assist_tools: ["/images/pool/match-blue.jpg", "/images/pool/rack-break.jpg", "/images/pool/tables-venues.png"],
  combo_bundle: ["/images/pool/logo-8ball.jpg", "/images/pool/cues-legendary.png", "/images/pool/tables-venues.png"],
};

export function ProductGallery({
  slug,
  image,
  name,
  categoryName,
}: {
  slug: string;
  image: string;
  name: string;
  categoryName: string;
}) {
  const base = POOL_IMAGE_MAP[image] ?? POOL_IMAGE_MAP.coins;
  const extras = SECONDARY_IMAGES[image] ?? ["/images/pool/rack-break.jpg", "/images/pool/tables-venues.png", "/images/pool/match-green.jpg"];

  const slides = [
    { key: "main", src: base.src, label: base.tag },
    { key: "detail-1", src: extras[0], label: "IN-GAME" },
    { key: "detail-2", src: extras[1], label: "TABLE VIEW" },
    { key: "detail-3", src: extras[2], label: "PROOF" },
  ];

  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main Arched Felt Photo Window */}
      <div className="relative overflow-hidden rounded-[6px] border border-border bg-paper p-3">
        <div className="relative rounded-[4px] bg-felt-deep p-2.5 pb-0">
          <ProductArt
            image={image}
            slug={slug}
            srcOverride={slides[selected]?.src}
            arched
            size="lg"
            className="h-[300px] w-full sm:h-[380px]"
          />
        </div>
        <div className="mt-3 flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          <span>{categoryName}</span>
          <span className="text-brass-dark">{name}</span>
        </div>
      </div>

      {/* 4 real photo thumbnails */}
      <div className="grid grid-cols-4 gap-2.5">
        {slides.map((s, idx) => {
          const active = idx === selected;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setSelected(idx)}
              aria-label={`View ${s.label} photo`}
              className={cn(
                "overflow-hidden rounded-[4px] border bg-paper p-1 transition",
                active
                  ? "border-brass ring-1 ring-brass"
                  : "border-border opacity-80 hover:border-brass/60 hover:opacity-100",
              )}
            >
              <div className="relative h-16 overflow-hidden rounded-[2px] bg-felt-deep">
                <img src={s.src} alt={`${name} ${s.label}`} className="h-full w-full object-cover" />
                <span className="absolute bottom-1 left-1 rounded-[2px] bg-felt-deep/85 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-cream">
                  {s.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
