function cleanEnv(val: string | undefined, fallback: string) {
  if (!val || val.includes("[Insert")) return fallback;
  return val;
}

export const site = {
  name: cleanEnv(process.env.NEXT_PUBLIC_SITE_NAME, "GlobalPoolStore"),
  url: cleanEnv(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  tagline: "8 Ball Pool Coins, Cash, Cues, Accounts & Boosting",
  description:
    "Buy 8 Ball Pool coins, cash, legendary cues, verified accounts and rank boosting. Fast delivery, encrypted checkout and 24/7 customer support.",
  supportEmail: cleanEnv(process.env.NEXT_PUBLIC_SUPPORT_EMAIL, "support@globalpoolstore.com"),
  whatsapp: cleanEnv(process.env.NEXT_PUBLIC_WHATSAPP, "+1 (555) 234-5678"),
  whatsappHref: "https://wa.me/15552345678",
  telegram: cleanEnv(process.env.NEXT_PUBLIC_TELEGRAM, "@GlobalPoolSupport"),
  telegramHref: "https://t.me/GlobalPoolSupport",
  referralPercent: Number(process.env.NEXT_PUBLIC_REFERRAL_PERCENT || 5),
};

export const mainNav = [
  { href: "/store", label: "Catalog" },
  { href: "/store/coins-cash", label: "Coins & Cash" },
  { href: "/store/cues-unlocks", label: "Cues" },
  { href: "/store/accounts", label: "Accounts" },
  { href: "/store/boosting", label: "Boosting" },
  { href: "/deals", label: "Deals" },
];

/** Loyalty: points earned per 1 USD spent; 100 points = $1 off. */
export const POINTS_PER_USD = 10;
export const POINTS_PER_DOLLAR_OFF = 100;

export const tiers = [
  { name: "Bronze", min: 0, multiplier: 1, color: "bg-amber-700" },
  { name: "Silver", min: 100_00, multiplier: 1.1, color: "bg-slate-400" },
  { name: "Gold", min: 500_00, multiplier: 1.25, color: "bg-amber-400" },
  { name: "Platinum", min: 1500_00, multiplier: 1.5, color: "bg-sky-400" },
  { name: "Diamond", min: 5000_00, multiplier: 2, color: "bg-indigo-400" },
] as const;

export function tierFor(lifetimeSpendCents: number) {
  let current: (typeof tiers)[number] = tiers[0];
  for (const t of tiers) if (lifetimeSpendCents >= t.min) current = t;
  const idx = tiers.indexOf(current);
  const next = tiers[idx + 1];
  const progress = next
    ? Math.min(100, ((lifetimeSpendCents - current.min) / (next.min - current.min)) * 100)
    : 100;
  return { current, next, progress };
}
