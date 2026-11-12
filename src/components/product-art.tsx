import { cn } from "@/lib/utils";
import { Coins, Wand, UserRound, TrendingUp, KeyRound } from "lucide-react";

const imageMap: Record<
  string,
  {
    src: string;
    alt: string;
    tag: string;
    sub: string;
    position?: string;
  }
> = {
  coins: {
    src: "/images/pool/logo-8ball.jpg",
    alt: "8 Ball Pool Coins Top-Up",
    tag: "POOL COINS",
    sub: "Unique ID Transfer",
    position: "center 35%",
  },
  cash: {
    src: "/images/pool/match-red.jpg",
    alt: "8 Ball Pool Cash Bundles",
    tag: "POOL CASH",
    sub: "Instant Top-Up",
    position: "center center",
  },
  golden: {
    src: "/images/pool/rack-break.jpg",
    alt: "8 Ball Pool Golden Shot Bundles",
    tag: "GOLDEN SHOT",
    sub: "Legendary Chests",
    position: "center center",
  },
  scratch: {
    src: "/images/pool/tournament-coins.jpg",
    alt: "8 Ball Pool Scratch Card Refills",
    tag: "WIN REWARDS",
    sub: "Bonus Spins & Scratchers",
    position: "right center",
  },
  cue: {
    src: "/images/pool/cues-legendary.png",
    alt: "8 Ball Pool Legendary Cues",
    tag: "LEGENDARY CUE",
    sub: "20/20 Collection",
    position: "center center",
  },
  upgrade: {
    src: "/images/pool/cues-legendary.jpg",
    alt: "8 Ball Pool Cue Upgrade Service",
    tag: "MAX STATS",
    sub: "10/10 Force · Aim · Spin",
    position: "center center",
  },
  account: {
    src: "/images/pool/match-green.jpg",
    alt: "8 Ball Pool Maxed Account",
    tag: "PRO ACCOUNT",
    sub: "Full Email Ownership",
    position: "center center",
  },
  boost: {
    src: "/images/pool/match-white.jpg",
    alt: "8 Ball Pool League & Win Rate Boost",
    tag: "PRO BOOST",
    sub: "Diamond League #1",
    position: "center center",
  },
  ring: {
    src: "/images/pool/tables-venues.png",
    alt: "8 Ball Pool Ring Venues - Las Vegas, Tokyo, Venice",
    tag: "CITY RINGS",
    sub: "Berlin & Venice Tables",
    position: "center center",
  },
  key: {
    src: "/images/pool/match-blue.jpg",
    alt: "8 Ball Pool VIP Membership",
    tag: "VIP ACCESS",
    sub: "Black Diamond Tier",
    position: "center center",
  },
};

export function ProductArt({
  image,
  className,
  size = "md",
}: {
  image: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const item = imageMap[image] ?? imageMap.coins;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-[#081a14] select-none",
        size === "sm" ? "rounded-lg border border-border" : "border-b border-border",
        className,
      )}
    >
      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        style={{ objectPosition: item.position ?? "center center" }}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      {/* Rich studio vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05110d]/90 via-[#05110d]/25 to-black/20" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

      {size !== "sm" && (
        <div className="pointer-events-none absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#f3c474]/30 bg-black/75 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-[#f3c474] backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f3c474]" />
            {item.tag}
          </span>
          {size === "lg" && (
            <span className="rounded-md border border-white/15 bg-black/65 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-xs">
              {item.sub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export const categoryIcons = { Coins, Wand, UserRound, TrendingUp, KeyRound } as const;
