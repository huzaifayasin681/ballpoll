import { cn } from "@/lib/utils";
import { Coins, Wand, UserRound, TrendingUp, KeyRound } from "lucide-react";

const imageMap: Record<
  string,
  {
    src: string;
    alt: string;
    tag: string;
    position?: string;
  }
> = {
  coins: {
    src: "/images/pool/logo-8ball.jpg",
    alt: "8 Ball Pool Coins Top-Up",
    tag: "POOL COINS",
    position: "center 35%",
  },
  cash: {
    src: "/images/pool/match-red.jpg",
    alt: "8 Ball Pool Cash Bundles",
    tag: "POOL CASH",
    position: "center center",
  },
  golden: {
    src: "/images/pool/rack-break.jpg",
    alt: "8 Ball Pool Golden Shot Bundles",
    tag: "GOLDEN SHOT",
    position: "center center",
  },
  scratch: {
    src: "/images/pool/tournament-coins.jpg",
    alt: "8 Ball Pool Scratch Card Refills",
    tag: "WIN REWARDS",
    position: "right center",
  },
  cue: {
    src: "/images/pool/cues-legendary.png",
    alt: "8 Ball Pool Legendary Cues",
    tag: "LEGENDARY CUE",
    position: "center center",
  },
  upgrade: {
    src: "/images/pool/cues-legendary.jpg",
    alt: "8 Ball Pool Cue Upgrade Service",
    tag: "MAX STATS",
    position: "center center",
  },
  account: {
    src: "/images/pool/match-green.jpg",
    alt: "8 Ball Pool Maxed Account",
    tag: "PRO ACCOUNT",
    position: "center center",
  },
  boost: {
    src: "/images/pool/match-white.jpg",
    alt: "8 Ball Pool League & Win Rate Boost",
    tag: "PRO BOOST",
    position: "center center",
  },
  ring: {
    src: "/images/pool/tables-venues.png",
    alt: "8 Ball Pool Ring Venues - Las Vegas, Tokyo, Venice",
    tag: "CITY RINGS",
    position: "center center",
  },
  key: {
    src: "/images/pool/match-blue.jpg",
    alt: "8 Ball Pool VIP Membership",
    tag: "VIP ACCESS",
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
        "relative flex items-center justify-center overflow-hidden bg-[#0c1f18] select-none",
        size === "sm" ? "rounded border border-border" : "border-b border-border",
        className,
      )}
    >
      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        style={{ objectPosition: item.position ?? "center center" }}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      {size !== "sm" && (
        <span className="pointer-events-none absolute bottom-2 left-2.5 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-[#f3c474] backdrop-blur-xs">
          {item.tag}
        </span>
      )}
    </div>
  );
}

export const categoryIcons = { Coins, Wand, UserRound, TrendingUp, KeyRound } as const;
