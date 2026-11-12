import Link from "next/link";
import { Lock, ShieldCheck, Clock, Headphones, Mail, MessageCircle, Send } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { Logo } from "./header";
import { site } from "@/lib/site";

const YEAR = new Date().getFullYear();

const cols = [
  {
    title: "Catalog",
    links: [
      { href: "/store/coins-cash", label: "Coins & Cash Top-Up" },
      { href: "/store/cues-unlocks", label: "Cue Sticks & Unlocks" },
      { href: "/store/accounts", label: "Account Marketplace" },
      { href: "/store/boosting", label: "Rank & Ring Boosting" },
      { href: "/store/vip-access", label: "VIP & Access Keys" },
      { href: "/deals", label: "Deals & Promo Codes" },
    ],
  },
  {
    title: "Account & Orders",
    links: [
      { href: "/track", label: "Track an Order" },
      { href: "/dashboard", label: "Customer Dashboard" },
      { href: "/rewards", label: "Loyalty & Referrals" },
      { href: "/reviews", label: "Customer Reviews" },
      { href: "/blog", label: "8 Ball Pool Guides" },
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
    { Icon: Lock, title: "256-Bit SSL Checkout", sub: "AES-256 credential vault" },
    { Icon: ShieldCheck, title: "Delivery Guarantee", sub: "Delivered on time or refunded" },
    { Icon: Clock, title: "1–4 Hour Fulfillment", sub: "Live status tracking on every order" },
    { Icon: Headphones, title: "24/7 Support Desk", sub: "Ticket, email, WhatsApp & Telegram" },
  ];
  return (
    <div className="grid grid-cols-2 divide-y divide-border rounded-md border border-border bg-surface lg:grid-cols-4 lg:divide-x lg:divide-y-0">
      {items.map(({ Icon, title, sub }) => (
        <div key={title} className="flex items-center gap-3 px-4 py-3">
          <Icon className="h-4 w-4 shrink-0 text-brand" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground">{title}</p>
            <p className="truncate text-[11px] text-muted">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted">{site.description}</p>
            <div className="mt-4 space-y-1.5 text-xs">
              <a
                href={`mailto:${site.supportEmail}`}
                className="flex items-center gap-2 text-muted hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5 text-brand" /> {site.supportEmail}
              </a>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-muted hover:text-foreground"
              >
                <MessageCircle className="h-3.5 w-3.5 text-brand" /> WhatsApp: {site.whatsapp}
              </a>
              <a
                href={site.telegramHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-muted hover:text-foreground"
              >
                <Send className="h-3.5 w-3.5 text-brand" /> Telegram: {site.telegram}
              </a>
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">{c.title}</p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs text-muted transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p>
            {site.name} is an independent marketplace and is not affiliated with or endorsed by Miniclip SA.{" "}
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
          <p className="shrink-0">© {YEAR} {site.name}</p>
        </div>
      </Container>
    </footer>
  );
}
