import Link from "next/link";
import { Lock, ShieldCheck, Clock, Headphones, Mail, MessageCircle, Send } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { Logo } from "./header";
import { acceptedPaymentChannels, site } from "@/lib/site";

const YEAR = new Date().getFullYear();

const cols = [
  {
    title: "8 Ball Pool Catalog",
    links: [
      { href: "/store/coins-cash", label: "Coins & Cash Top-Up" },
      { href: "/store/cues-unlocks", label: "Legendary Cues & Unlocks" },
      { href: "/store/accounts", label: "Pro Account Marketplace" },
      { href: "/store/boosting", label: "Berlin & Venice Ring Boost" },
      { href: "/store/vip-access", label: "Black Diamond VIP Keys" },
      { href: "/deals", label: "Flash Deals & Promo Codes" },
    ],
  },
  {
    title: "Account & Orders",
    links: [
      { href: "/track", label: "Live Order Tracker" },
      { href: "/dashboard", label: "Customer Dashboard" },
      { href: "/rewards", label: "Loyalty & Referrals" },
      { href: "/reviews", label: "Verified Reviews" },
      { href: "/blog", label: "8 Ball Pool Strategy Guides" },
    ],
  },
  {
    title: "Help & Policies",
    links: [
      { href: "/help", label: "Support Center & FAQ" },
      { href: "/help#contact", label: "Open a Support Ticket" },
      { href: "/legal/refund", label: "Refund & Dispute Policy" },
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/privacy", label: "Privacy Policy" },
    ],
  },
];

export function TrustStrip() {
  const items = [
    { Icon: Lock, title: "256-Bit SSL & AES Vault", sub: "Zero password needed for Unique ID coins" },
    { Icon: ShieldCheck, title: "100% Ban-Safe Transfer", sub: "Human-played match & gift fulfillment" },
    { Icon: Clock, title: "1–2 Hour Express Delivery", sub: "Real-time progress tracker on every order" },
    { Icon: Headphones, title: "24/7 Player Support", sub: "Live chat, ticket, WhatsApp & Telegram" },
  ];
  return (
    <div className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface shadow-2xs sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
      {items.map(({ Icon, title, sub }) => (
        <div
          key={title}
          className="flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-surface-2/50 sm:border-b sm:border-border lg:border-b-0"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-soft text-brand">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground sm:text-sm">{title}</p>
            <p className="mt-0.5 text-[11px] text-muted">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface sm:mt-24">
      <Container className="py-12 sm:py-14">
        <div className="mb-10">
          <TrustStrip />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-3.5 max-w-sm text-xs leading-relaxed text-muted">{site.description}</p>
            <div className="mt-4 flex flex-col items-start gap-2">
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-brand-border bg-brand-soft/60 px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-brand hover:bg-brand-soft"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0 text-brand" />
                <span>WhatsApp:</span>
                <span className="font-mono font-bold text-brand">{site.whatsapp}</span>
              </a>
              <a
                href={`mailto:${site.supportEmail}`}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted transition hover:border-border-hover hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-brand" />
                <span>Email:</span>
                <span className="font-mono font-semibold text-foreground">{site.supportEmail}</span>
              </a>
              <a
                href={site.telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted transition hover:border-border-hover hover:text-foreground"
              >
                <Send className="h-3.5 w-3.5 shrink-0 text-brand" />
                <span>Telegram:</span>
                <span className="font-mono font-semibold text-foreground">{site.telegram}</span>
              </a>
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="mb-3.5 text-xs font-bold uppercase tracking-wider text-foreground">{c.title}</p>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs text-muted transition-colors hover:text-brand">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Accepted Payment Channels */}
        <div className="mt-10 flex flex-col gap-3.5 border-t border-border pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground">
              Accepted Payment Channels
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Fast manual confirmation via WhatsApp &amp; instant order tracking
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {acceptedPaymentChannels.map(({ name, detail }) => (
              <div
                key={name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 shadow-2xs"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                <span className="whitespace-nowrap text-xs font-bold text-foreground">{name}</span>
                <span className="hidden whitespace-nowrap font-mono text-[10px] text-muted sm:inline">· {detail}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p className="leading-relaxed">
            {site.name} is an independent gaming marketplace and is not affiliated with or endorsed by Miniclip SA.{" "}
            <Link href="/legal/terms" className="underline hover:text-foreground">
              Terms
            </Link>{" "}
            ·{" "}
            <Link href="/legal/refund" className="underline hover:text-foreground">
              Refund Policy
            </Link>{" "}
            ·{" "}
            <Link href="/legal/privacy" className="underline hover:text-foreground">
              Privacy
            </Link>
          </p>
          <p className="shrink-0 font-mono text-[11px]">© {YEAR} {site.name}. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
