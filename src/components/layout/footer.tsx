import Link from "next/link";
import { Mail, MessageSquare, Send } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { Logo } from "./header";
import { site } from "@/lib/site";

const YEAR = new Date().getFullYear();

const cols = [
  {
    title: "Shop",
    links: [
      { href: "/store/coins-cash", label: "Coins & Cash" },
      { href: "/store/cues-unlocks", label: "Cues & Unlocks" },
      { href: "/store/accounts", label: "Pro Accounts" },
      { href: "/store/boosting", label: "Ring Boosting" },
      { href: "/store/vip-access", label: "Passes & VIP" },
      { href: "/deals", label: "Flash deals" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/track", label: "Track order" },
      { href: "/rewards", label: "Rewards club" },
      { href: "/dashboard#saved-ids", label: "Saved IDs" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/help", label: "Support" },
      { href: "/blog", label: "Guides" },
      { href: "/legal/refund", label: "Refund policy" },
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/privacy", label: "Privacy" },
    ],
  },
];

const paymentTags = ["JazzCash", "Easypaisa", "Bank transfer", "USDT · Binance Pay"];

export function Footer() {
  return (
    <footer className="bg-mahogany text-paper/80">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo inverted />
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-paper/60">
              Coins, cues, passes and pro boosting for 8 Ball Pool. Delivered by real people, tracked live.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-paper/15 text-brass transition hover:border-brass hover:bg-white/5"
              >
                <MessageSquare className="h-3.5 w-3.5 stroke-[1.8]" />
              </a>
              <a
                href={site.telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-paper/15 text-brass transition hover:border-brass hover:bg-white/5"
              >
                <Send className="h-3.5 w-3.5 stroke-[1.8]" />
              </a>
              <a
                href={`mailto:${site.supportEmail}`}
                aria-label="Email"
                className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-paper/15 text-brass transition hover:border-brass hover:bg-white/5"
              >
                <Mail className="h-3.5 w-3.5 stroke-[1.8]" />
              </a>
            </div>
          </div>

          {/* 3 Link columns */}
          <div className="grid grid-cols-3 gap-6 sm:col-span-2 lg:col-span-5">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="mb-3.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-brass">
                  {c.title}
                </p>
                <ul className="space-y-2">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-xs text-paper/70 transition-colors hover:text-paper">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* We accept */}
          <div className="lg:col-span-3">
            <p className="mb-3.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-brass">
              We accept
            </p>
            <div className="flex flex-wrap gap-2">
              {paymentTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[2px] border border-paper/15 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-paper/85"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-paper/50">
              Payments confirmed by hand over WhatsApp.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-paper/10 pt-6 text-[11px] text-paper/45 sm:flex-row sm:items-center">
          <p>
            GlobalPoolStore is independent and not affiliated with or endorsed by the publisher of 8 Ball Pool.
          </p>
          <p className="shrink-0">© {YEAR} {site.name}</p>
        </div>
      </Container>
    </footer>
  );
}
