import { cn } from "@/lib/utils";
import { useId } from "react";

const BALL_COLORS: Record<number, string> = {
  1: "#EBB02D",
  2: "#2958B8",
  3: "#CE362B",
  4: "#6C3B9E",
  5: "#E37124",
  6: "#2B854B",
  7: "#812625",
  8: "#181715",
  9: "#EBB02D",
  10: "#2958B8",
  11: "#CE362B",
  12: "#6C3B9E",
  13: "#E37124",
  14: "#2B854B",
  15: "#812625",
};

/** Polished resin billiard ball 1–15 with soft highlight & authentic stripe/solid styling. */
export function BilliardBallSvg({
  num,
  cx,
  cy,
  r = 22,
}: {
  num: number;
  cx: number;
  cy: number;
  r?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const color = BALL_COLORS[num] ?? "#181715";
  const isStripe = num >= 9;
  const clipId = `ball-clip-${num}-${uid}`;
  const shadeId = `ball-shade-${num}-${uid}`;

  return (
    <g>
      {/* Soft felt drop shadow */}
      <ellipse cx={cx + 1.5} cy={cy + r * 0.92} rx={r * 0.85} ry={r * 0.24} fill="rgba(4,16,12,0.48)" />
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <radialGradient id={shadeId} cx="35%" cy="30%" r="72%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="82%" stopColor="rgba(0,0,0,0.22)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.48)" />
        </radialGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* Base */}
        <circle cx={cx} cy={cy} r={r} fill={isStripe ? "#F7F1E3" : color} />
        {/* Center stripe band for 9-15 */}
        {isStripe && <rect x={cx - r} y={cy - r * 0.5} width={r * 2} height={r} fill={color} />}
        {/* Specular + 3D shading */}
        <circle cx={cx} cy={cy} r={r} fill={`url(#${shadeId})`} />
        {/* Soft glossy spot */}
        <ellipse
          cx={cx - r * 0.34}
          cy={cy - r * 0.36}
          rx={r * 0.24}
          ry={r * 0.14}
          transform={`rotate(-28 ${cx - r * 0.34} ${cy - r * 0.36})`}
          fill="rgba(255,255,255,0.45)"
        />
      </g>

      {/* Number disc */}
      <circle cx={cx} cy={cy} r={r * 0.42} fill="#FBF7EE" />
      <text
        x={cx}
        y={cy + r * 0.14}
        textAnchor="middle"
        fontSize={r * 0.44}
        fontWeight="700"
        fontFamily="var(--font-inter), sans-serif"
        fill="#1B1A17"
      >
        {num}
      </text>
    </g>
  );
}

/** Hero 15-ball rack + rosewood-and-maple cue stick matching Page 1 & Page 3. */
export function HeroRackAndCue({ className }: { className?: string }) {
  const r = 21;
  const dx = r * 2.04;
  const dy = r * 1.78;
  const topX = 250;
  const topY = 66;

  const rows: number[][] = [[1], [9, 2], [10, 8, 3], [11, 7, 14, 4], [5, 13, 15, 6, 12]];

  return (
    <svg
      viewBox="0 0 460 360"
      className={cn("w-full max-w-[440px] select-none drop-shadow-[0_18px_28px_rgba(4,15,10,0.45)]", className)}
      aria-label="15-ball billiards triangle rack and rosewood cue"
    >
      {/* Subtle overhead felt spotlight */}
      <defs>
        <radialGradient id="hero-felt-glow" cx="55%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#1E6B50" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0F3D2E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cue-shaft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E9D6B0" />
          <stop offset="100%" stopColor="#D6BA8A" />
        </linearGradient>
        <linearGradient id="cue-butt" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A2A1A" />
          <stop offset="100%" stopColor="#7C3C24" />
        </linearGradient>
      </defs>
      <circle cx="250" cy="160" r="165" fill="url(#hero-felt-glow)" />

      {/* Cue stick angled toward bottom of rack */}
      <g transform="translate(52 325) rotate(-35)">
        {/* Drop shadow */}
        <rect x="4" y="9" width="290" height="7" rx="3.5" fill="rgba(4,16,12,0.45)" />
        {/* Rubber bumper */}
        <rect x="0" y="-1" width="12" height="10" rx="2" fill="#181614" />
        {/* Rosewood handle */}
        <rect x="10" y="0" width="96" height="8" rx="1.5" fill="url(#cue-butt)" />
        {/* Maple inlay points */}
        <polygon points="82,4 106,0.8 106,7.2" fill="#DFC597" />
        {/* Brass joint collar */}
        <rect x="106" y="0.6" width="10" height="6.8" fill="#C8A24A" />
        {/* Maple shaft tapering */}
        <polygon points="116,1 284,2.4 284,5.6 116,7" fill="url(#cue-shaft)" />
        {/* Ferrule & leather tip */}
        <rect x="284" y="2.4" width="6" height="3.2" fill="#FBF7EE" />
        <rect x="290" y="2.5" width="3" height="3" rx="1" fill="#2A4D69" />
      </g>

      {/* 15-ball pyramid */}
      {rows.map((row, rowIdx) =>
        row.map((num, colIdx) => {
          const cx = topX + (colIdx - rowIdx / 2) * dx;
          const cy = topY + rowIdx * dy;
          return <BilliardBallSvg key={num} num={num} cx={cx} cy={cy} r={r} />;
        }),
      )}
    </svg>
  );
}

/** Rosewood-and-maple cue stick with brass joint on felt. */
export function RosewoodCueArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 150" className={cn("w-full h-full select-none", className)} aria-hidden="true">
      <defs>
        <linearGradient id="rc-shaft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EAD7B3" />
          <stop offset="100%" stopColor="#D1B27D" />
        </linearGradient>
        <linearGradient id="rc-butt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#492014" />
          <stop offset="55%" stopColor="#6D3220" />
          <stop offset="100%" stopColor="#4C2215" />
        </linearGradient>
      </defs>
      <g transform="translate(26 118) rotate(-22)">
        <rect x="6" y="10" width="240" height="6" rx="3" fill="rgba(4,16,12,0.42)" />
        <rect x="0" y="-1" width="11" height="9" rx="2" fill="#181614" />
        <rect x="10" y="0" width="84" height="7" rx="1" fill="url(#rc-butt)" />
        <rect x="34" y="0" width="28" height="7" fill="#26130C" opacity="0.55" />
        <polygon points="74,3.5 94,0.8 94,6.2" fill="#DFC597" />
        <rect x="94" y="0.4" width="9" height="6.2" fill="#C8A24A" />
        <polygon points="103,0.8 238,2.1 238,4.9 103,6.2" fill="url(#rc-shaft)" />
        <rect x="238" y="2.1" width="6" height="2.8" fill="#FBF7EE" />
        <rect x="244" y="2.2" width="3" height="2.6" rx="1" fill="#2A4D69" />
      </g>
    </svg>
  );
}

/** Gold coin stack illustration on felt. */
export function GoldCoinStackArt({ className }: { className?: string }) {
  const stack = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 180 150" className={cn("w-full h-full select-none", className)} aria-hidden="true">
      <defs>
        <linearGradient id="coin-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8E6C23" />
          <stop offset="35%" stopColor="#D6B159" />
          <stop offset="68%" stopColor="#AA8432" />
          <stop offset="100%" stopColor="#775819" />
        </linearGradient>
        <radialGradient id="coin-top" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#F1D58A" />
          <stop offset="65%" stopColor="#C8A24A" />
          <stop offset="100%" stopColor="#9C7A2B" />
        </radialGradient>
      </defs>
      <ellipse cx="90" cy="118" rx="44" ry="12" fill="rgba(4,16,12,0.45)" />
      {stack.map((idx) => {
        const y = 104 - idx * 9.5;
        const offsetX = idx === 4 ? -3 : idx === 2 ? 2 : 0;
        return (
          <g key={idx}>
            <path
              d={`M ${56 + offsetX} ${y} v 8 a 34 11 0 0 0 68 0 v -8 z`}
              fill="url(#coin-side)"
              stroke="#7A5B1C"
              strokeWidth="0.6"
            />
            <ellipse
              cx={90 + offsetX}
              cy={y}
              rx="34"
              ry="11"
              fill="url(#coin-top)"
              stroke="#EAD189"
              strokeWidth="0.7"
            />
          </g>
        );
      })}
      {/* Top coin inner recessed rim */}
      <ellipse cx="90" cy={104 - 5 * 9.5} rx="25" ry="7.5" fill="none" stroke="#8C6B23" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

/** Ring with sapphire illustration on felt. */
export function SapphireRingArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 150" className={cn("w-full h-full select-none", className)} aria-hidden="true">
      <defs>
        <linearGradient id="ring-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0D388" />
          <stop offset="50%" stopColor="#C8A24A" />
          <stop offset="100%" stopColor="#86641F" />
        </linearGradient>
        <linearGradient id="sapphire-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8CE4FF" />
          <stop offset="45%" stopColor="#3B8AC4" />
          <stop offset="100%" stopColor="#1B4D7E" />
        </linearGradient>
      </defs>
      <ellipse cx="90" cy="122" rx="36" ry="8" fill="rgba(4,16,12,0.45)" />
      {/* Gold band */}
      <circle cx="90" cy="84" r="32" fill="none" stroke="url(#ring-gold)" strokeWidth="10" />
      <circle cx="90" cy="84" r="37" fill="none" stroke="#F4DC9B" strokeWidth="0.9" opacity="0.6" />
      <circle cx="90" cy="84" r="27" fill="none" stroke="#7A5B1C" strokeWidth="0.9" opacity="0.7" />
      {/* Bezel setting */}
      <polygon points="90,34 106,46 100,60 80,60 74,46" fill="url(#ring-gold)" stroke="#6D4F16" strokeWidth="1" />
      {/* Faceted sapphire */}
      <polygon points="90,36 102,46 97,56 83,56 78,46" fill="url(#sapphire-grad)" stroke="#D9F4FF" strokeWidth="0.8" />
      <polygon points="90,36 96,46 90,54 84,46" fill="rgba(255,255,255,0.28)" />
    </svg>
  );
}

/** VIP Members Pass card illustration on felt. */
export function VipMembersPassArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={cn("w-full h-full select-none", className)} aria-hidden="true">
      <defs>
        <linearGradient id="vip-card-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#123C2D" />
          <stop offset="100%" stopColor="#082018" />
        </linearGradient>
      </defs>
      <rect x="38" y="34" width="128" height="84" rx="5" fill="rgba(4,16,12,0.5)" />
      <rect x="35" y="30" width="128" height="84" rx="5" fill="url(#vip-card-bg)" stroke="#C8A24A" strokeWidth="1.5" />
      <rect x="40" y="35" width="118" height="74" rx="3" fill="none" stroke="#C8A24A" strokeOpacity="0.38" strokeWidth="0.8" />
      <text
        x="99"
        y="74"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fontFamily="var(--font-playfair), Georgia, serif"
        fill="#C8A24A"
      >
        VIP
      </text>
      <text
        x="99"
        y="93"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="600"
        letterSpacing="2.4"
        fontFamily="var(--font-inter), sans-serif"
        fill="#E9DFC9"
      >
        MEMBERS PASS
      </text>
    </svg>
  );
}

/** Player Badge with level 150 pill on felt. */
export function PlayerBadgeArt({ level = "150", className }: { level?: string; className?: string }) {
  return (
    <svg viewBox="0 0 180 150" className={cn("w-full h-full select-none", className)} aria-hidden="true">
      <defs>
        <clipPath id="player-clip">
          <circle cx="90" cy="76" r="35" />
        </clipPath>
      </defs>
      <circle cx="90" cy="80" r="36" fill="rgba(4,16,12,0.45)" />
      <circle cx="90" cy="76" r="36" fill="#0A2A20" stroke="#C8A24A" strokeWidth="2.5" />
      <g clipPath="url(#player-clip)">
        <circle cx="90" cy="65" r="12" fill="#FBF7EE" />
        <path d="M 60 112 C 62 91 74 84 90 84 C 106 84 118 91 120 112 Z" fill="#FBF7EE" />
      </g>
      <circle cx="122" cy="48" r="14" fill="#C8A24A" stroke="#0A2A20" strokeWidth="2" />
      <text
        x="122"
        y="52"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fontFamily="var(--font-inter), sans-serif"
        fill="#14110D"
      >
        {level}
      </text>
    </svg>
  );
}

/** Multi-ball composition for cue boxes / combo bundles / level upgrades. */
export function BallClusterArt({
  balls,
  withCoins = false,
  className,
}: {
  balls: number[];
  withCoins?: boolean;
  className?: string;
}) {
  if (withCoins) {
    return (
      <svg viewBox="0 0 210 150" className={cn("w-full h-full select-none", className)} aria-hidden="true">
        <g transform="translate(-24 6) scale(0.9)">
          <GoldCoinStackArt />
        </g>
        {balls[0] && <BilliardBallSvg num={balls[0]} cx={140} cy={62} r={19} />}
        {balls[1] && <BilliardBallSvg num={balls[1]} cx={136} cy={104} r={17} />}
      </svg>
    );
  }

  if (balls.length === 2) {
    return (
      <svg viewBox="0 0 180 150" className={cn("w-full h-full select-none", className)} aria-hidden="true">
        <BilliardBallSvg num={balls[0]} cx={66} cy={76} r={24} />
        <BilliardBallSvg num={balls[1]} cx={116} cy={76} r={24} />
      </svg>
    );
  }

  if (balls.length >= 3) {
    return (
      <svg viewBox="0 0 200 150" className={cn("w-full h-full select-none", className)} aria-hidden="true">
        <BilliardBallSvg num={balls[0]} cx={56} cy={78} r={21} />
        <BilliardBallSvg num={balls[1]} cx={100} cy={78} r={21} />
        <BilliardBallSvg num={balls[2]} cx={144} cy={78} r={21} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 180 150" className={cn("w-full h-full select-none", className)} aria-hidden="true">
      <BilliardBallSvg num={balls[0] ?? 8} cx={90} cy={76} r={28} />
    </svg>
  );
}

/** Maps any product slug or image key to the exact Clubhouse vector illustration. */
export function ProductVectorArt({
  slug,
  image,
  className,
}: {
  slug?: string;
  image?: string;
  className?: string;
}) {
  if (slug === "starter-cue-box" || image === "golden") {
    return <BallClusterArt balls={[9, 4, 12]} className={className} />;
  }
  if (slug === "max-level-upgrade" || slug === "legendary-cue-upgrade" || image === "upgrade") {
    return <BallClusterArt balls={[1, 8]} className={className} />;
  }
  if (slug === "king-master-bundle" || slug === "gamer-starter-combo" || image === "combo_bundle") {
    return <BallClusterArt balls={[8, 3]} withCoins className={className} />;
  }
  if (
    slug?.includes("cue") ||
    slug === "ultimate-collector-pack" ||
    image === "cue" ||
    image === "cue_maxed"
  ) {
    return <RosewoodCueArt className={className} />;
  }
  if (
    slug?.includes("ring") ||
    slug === "league-rank-boost" ||
    slug === "win-rate-boost" ||
    slug === "account-level-progression" ||
    image === "ring" ||
    image === "boost" ||
    image === "boost_pro"
  ) {
    return <SapphireRingArt className={className} />;
  }
  if (slug?.includes("account") || image === "account") {
    return <PlayerBadgeArt level={slug?.includes("100") ? "100" : "150"} className={className} />;
  }
  if (slug?.includes("pass") || slug?.includes("vip") || image === "key" || image === "assist_tools") {
    return <VipMembersPassArt className={className} />;
  }
  if (slug?.includes("coins") || slug?.includes("cash") || image === "coins" || image === "cash" || image === "scratch") {
    return <GoldCoinStackArt className={className} />;
  }
  return <BallClusterArt balls={[8]} className={className} />;
}

/** Arched felt window container like club windows and trophy cabinets. */
export function ArchedFeltFrame({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden arch-frame felt-window p-2", className)}>
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden arch-frame border border-brass/30",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
