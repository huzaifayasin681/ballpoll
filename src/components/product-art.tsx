import { cn } from "@/lib/utils";
import { Coins, Wand, UserRound, TrendingUp, KeyRound } from "lucide-react";

export const POOL_IMAGE_MAP: Record<
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
  cue_maxed: {
    src: "/images/pool/legendary-cues-maxed.jpg",
    alt: "Maxed Out Legendary Cues — 8 Ball Pool Cue Shop",
    tag: "MAXED CUES",
    sub: "Force · Aim · Spin · Time",
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
  boost_pro: {
    src: "/images/pool/pro-account-boosting.jpg",
    alt: "8 Ball Pool Pro Account Boosting & Level Up",
    tag: "LEVEL & RINGS",
    sub: "Hand-Played Pro Boost",
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
  assist_tools: {
    src: "/images/pool/gameplay-assist-tools.jpg",
    alt: "8 Ball Pool Pro Aim Assist & Extended Guideline Tools",
    tag: "PRO ASSIST",
    sub: "Extended Guideline · Instant Key",
    position: "center center",
  },
  combo_bundle: {
    src: "/images/pool/combo-bundles-deals.jpg",
    alt: "8 Ball Pool Combo Deals & Custom Service Packages",
    tag: "COMBO DEAL",
    sub: "Save Up to 40% Bundle",
    position: "center center",
  },
};

export function ProductArt({
  image,
  className,
  size = "md",
  arched = false,
  srcOverride,
}: {
  image: string;
  slug?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  arched?: boolean;
  srcOverride?: string;
}) {
  const item = POOL_IMAGE_MAP[image] ?? POOL_IMAGE_MAP.coins;
  const imgSrc = srcOverride ?? item.src;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-felt-deep select-none",
        arched && "arch-frame border border-brass/35",
        !arched && (size === "sm" ? "rounded-[4px] border border-border" : "rounded-[4px] border-b border-border"),
        className,
      )}
    >
      <img
        src={imgSrc}
        alt={item.alt}
        loading="lazy"
        style={{ objectPosition: item.position ?? "center center" }}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      {/* Warm clubhouse vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-felt-deep/90 via-felt-deep/20 to-black/15" />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 ring-1 ring-inset ring-brass/20",
          arched && "arch-frame",
        )}
      />

      {size !== "sm" && (
        <div className="pointer-events-none absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-brass/40 bg-felt-deep/85 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brass backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-brass" />
            {item.tag}
          </span>
          {size === "lg" && (
            <span className="rounded-[2px] border border-paper/20 bg-felt-deep/75 px-2.5 py-0.5 text-[11px] font-medium text-cream backdrop-blur-xs">
              {item.sub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export const categoryIcons = { Coins, Wand, UserRound, TrendingUp, KeyRound } as const;
