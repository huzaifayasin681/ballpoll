import { cn } from "@/lib/utils";
import { Coins, Wand, UserRound, TrendingUp, KeyRound } from "lucide-react";

function StudioBackdrop({ id, glow }: { id: string; glow: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`glow-${id}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.28" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`gold-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fae09e" />
          <stop offset="45%" stopColor="#dca042" />
          <stop offset="100%" stopColor="#8c5412" />
        </linearGradient>
        <radialGradient id={`ball8-${id}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#454542" />
          <stop offset="40%" stopColor="#1b1b19" />
          <stop offset="100%" stopColor="#080807" />
        </radialGradient>
        <linearGradient id={`emerald-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e8262" />
          <stop offset="100%" stopColor="#0a3b2c" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="66" rx="85" ry="52" fill={`url(#glow-${id})`} />
      <ellipse cx="120" cy="104" rx="54" ry="8" fill="#000000" fillOpacity="0.12" />
    </>
  );
}

function CoinsVisual() {
  return (
    <svg viewBox="0 0 240 130" className="h-full w-full" fill="none" aria-hidden>
      <StudioBackdrop id="coins" glow="#d4933b" />
      {/* Stacked gold coins behind */}
      {[78, 68, 58, 48].map((y, i) => (
        <g key={i}>
          <ellipse cx="86" cy={y + 6} rx="26" ry="8" fill="#73430a" />
          <rect x="60" y={y} width="52" height="6" fill="#9c5d14" />
          <ellipse cx="86" cy={y} rx="26" ry="8" fill="url(#gold-coins)" stroke="#73430a" strokeWidth="0.8" />
        </g>
      ))}
      {/* Glossy 3D 8-Ball & Gold Medallion */}
      <circle cx="142" cy="64" r="32" fill="url(#gold-coins)" stroke="#73430a" strokeWidth="1.2" />
      <circle cx="142" cy="64" r="26" stroke="#fff3d1" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="142" cy="64" r="18" fill="url(#ball8-coins)" />
      <circle cx="136" cy="57" r="4" fill="#ffffff" fillOpacity="0.3" />
      <circle cx="142" cy="64" r="8.5" fill="#f7f5f0" />
      <text x="142" y="68" textAnchor="middle" fill="#141413" fontSize="11.5" fontWeight="800" fontFamily="sans-serif">
        8
      </text>
    </svg>
  );
}

function CashVisual() {
  return (
    <svg viewBox="0 0 240 130" className="h-full w-full" fill="none" aria-hidden>
      <StudioBackdrop id="cash" glow="#147a5a" />
      <g transform="rotate(-7 120 64)">
        <rect x="58" y="36" width="124" height="58" rx="6" fill="#0d4f3c" fillOpacity="0.35" stroke="#18805c" strokeWidth="1" />
      </g>
      <rect x="56" y="32" width="128" height="62" rx="6" fill="url(#emerald-cash)" stroke="#5ec29f" strokeOpacity="0.5" strokeWidth="1.2" />
      <rect x="63" y="39" width="114" height="48" rx="3" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="4 2" />
      <circle cx="120" cy="63" r="16" fill="url(#gold-cash)" />
      <text x="120" y="68.5" textAnchor="middle" fill="#2b1803" fontSize="16" fontWeight="800" fontFamily="sans-serif">
        $
      </text>
    </svg>
  );
}

function CueVisual() {
  return (
    <svg viewBox="0 0 240 130" className="h-full w-full" fill="none" aria-hidden>
      <StudioBackdrop id="cue" glow="#147a5a" />
      {/* Glossy 8-ball in background */}
      <circle cx="156" cy="64" r="26" fill="url(#ball8-cue)" />
      <circle cx="148" cy="55" r="5" fill="#ffffff" fillOpacity="0.25" />
      <circle cx="156" cy="64" r="10.5" fill="#f7f5f0" />
      <text x="156" y="68.5" textAnchor="middle" fill="#141413" fontSize="13" fontWeight="800" fontFamily="sans-serif">
        8
      </text>
      {/* Sleek diagonal Legendary Cue */}
      <g transform="rotate(-20 115 62)">
        <rect x="24" y="58" width="66" height="7" rx="3" fill="url(#gold-cue)" stroke="#5c3406" strokeWidth="0.8" />
        <polygon points="90,58.5 198,60 198,63 90,64.5" fill="#1e1e1c" />
        <rect x="198" y="59.8" width="6" height="3.4" fill="#f7f5f0" />
        <rect x="204" y="59.8" width="5" height="3.4" rx="1.5" fill="#18a073" />
      </g>
    </svg>
  );
}

function AccountVisual() {
  return (
    <svg viewBox="0 0 240 130" className="h-full w-full" fill="none" aria-hidden>
      <StudioBackdrop id="acct" glow="#d4933b" />
      {/* Championship Level 150 Hex Emblem */}
      <polygon
        points="120,20 156,40 156,82 120,102 84,82 84,40"
        fill="url(#emerald-acct)"
        stroke="url(#gold-acct)"
        strokeWidth="2.5"
      />
      <polygon
        points="120,28 148,44 148,78 120,94 92,78 92,44"
        stroke="#ffffff"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <text x="120" y="54" textAnchor="middle" fill="#f3c474" fontSize="8.5" fontWeight="700" fontFamily="monospace" letterSpacing="1.5">
        MAX LEVEL
      </text>
      <text x="120" y="75" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="800" fontFamily="sans-serif">
        150
      </text>
    </svg>
  );
}

function BoostVisual() {
  return (
    <svg viewBox="0 0 240 130" className="h-full w-full" fill="none" aria-hidden>
      <StudioBackdrop id="boost" glow="#147a5a" />
      <path
        d="M120 18 L158 32 V60 C158 82 141 98 120 106 C99 98 82 82 82 60 V32 Z"
        fill="url(#emerald-boost)"
        stroke="url(#gold-boost)"
        strokeWidth="2.2"
      />
      <path d="M104 64 L120 46 L136 64" stroke="url(#gold-boost)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M104 77 L120 59 L136 77" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KeyVisual() {
  return (
    <svg viewBox="0 0 240 130" className="h-full w-full" fill="none" aria-hidden>
      <StudioBackdrop id="key" glow="#d4933b" />
      <rect x="58" y="30" width="124" height="66" rx="8" fill="#181816" stroke="url(#gold-key)" strokeWidth="1.5" />
      <rect x="72" y="48" width="22" height="16" rx="3" fill="url(#gold-key)" />
      <circle cx="122" cy="56" r="9" stroke="url(#gold-key)" strokeWidth="2.2" />
      <line x1="131" y1="56" x2="162" y2="56" stroke="url(#gold-key)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="152" y1="56" x2="152" y2="63" stroke="url(#gold-key)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="160" y1="56" x2="160" y2="63" stroke="url(#gold-key)" strokeWidth="2.2" strokeLinecap="round" />
      <text x="72" y="82" fill="#f3c474" fontSize="8.5" fontWeight="700" fontFamily="monospace" letterSpacing="2">
        VIP PASS
      </text>
    </svg>
  );
}

const visuals: Record<string, () => React.JSX.Element> = {
  coins: CoinsVisual,
  cash: CashVisual,
  golden: CoinsVisual,
  scratch: CashVisual,
  cue: CueVisual,
  upgrade: CueVisual,
  account: AccountVisual,
  boost: BoostVisual,
  ring: BoostVisual,
  key: KeyVisual,
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
  const Visual = visuals[image] ?? CoinsVisual;
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-art select-none",
        size === "sm" ? "rounded border border-border" : "border-b border-border",
        className,
      )}
    >
      <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
        <Visual />
      </div>
    </div>
  );
}

export const categoryIcons = { Coins, Wand, UserRound, TrendingUp, KeyRound } as const;
