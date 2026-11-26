import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { Card, Container } from "@/components/ui/primitives";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

const POLICY_NAV = [
  { slug: "terms", label: "Terms of service" },
  { slug: "refund", label: "Refund policy" },
  { slug: "privacy", label: "Privacy policy" },
  { slug: "cookie", label: "Cookie policy" },
] as const;

const pages: Record<string, { title: string; updated: string; body: string }> = {
  refund: {
    title: "Refund policy",
    updated: "1 November 2026",
    body: `
## 1. Eligibility for refunds

Orders are eligible for a full refund in the following cases:

- **Non-delivery** — we cannot deliver the product within the advertised SLA.
- **Wrong item or shortfall** — the delivered amount is lower than ordered and we do not top up within 6 hours.
- **Pre-fulfillment cancellation** — you cancel while the order is still Pending payment or Paid (before delivery starts).

## 2. Non-refundable cases

- Orders already delivered to the Unique ID submitted at checkout (Unique IDs cannot be reversed once credited).
- Digital accounts whose credentials were viewed and verified by the buyer.
- Incorrect Miniclip Unique ID entered by the buyer after delivery has already completed.

## 3. How to request a refund

Open a ticket at [Help & Support](/help) or email support@globalpoolstore.com with your tracking ID (e.g. \`GPS-7F3K9Q\`). Refunds are processed within 24–72 hours back to the original payment method.
`,
  },
  terms: {
    title: "Terms of service",
    updated: "1 November 2026",
    body: `
## 1. Nature of service

GlobalPoolStore is an independent digital fulfillment marketplace offering 8 Ball Pool top-ups, cues, accounts, passes, and boosting services. We are not affiliated with or endorsed by Miniclip SA.

## 2. Buyer responsibilities

- Provide accurate Miniclip Unique IDs and contact details.
- For credential-required services (accounts / boosting), ensure 2FA backup codes are available and do not log in during the active fulfillment window.

## 3. Delivery timelines

Coins, passes, and license keys deliver in 5–30 minutes when paid. Boosting services quote an estimated window on each product page.

## 4. Governing terms

By placing an order you confirm you are at least 18 years old or have guardian consent, and that payment instruments used belong to you.
`,
  },
  privacy: {
    title: "Privacy policy",
    updated: "1 November 2026",
    body: `
## 1. Data we collect

- **Account data:** email, display name, hashed password (bcrypt), preferred currency.
- **Order data:** Miniclip Unique ID, items ordered, payment gateway status, IP/audit logs for fraud prevention.
- **Credential vault:** when an order requires temporary game login (e.g. rank boosting), login details are encrypted with AES-256-GCM and purged automatically upon order completion.

## 2. How we use data

We use your data strictly to deliver orders, prevent payment fraud, send order tracking updates, and administer loyalty points. We never sell customer lists or emails to third parties.

## 3. Data deletion

Write to support@globalpoolstore.com from your registered email to request account erasure at any time.
`,
  },
  cookie: {
    title: "Cookie policy",
    updated: "1 November 2026",
    body: `
## 1. Essential cookies

GlobalPoolStore uses strictly necessary HTTP-only cookies to keep your signed-in session active, remember your preferred display currency, and preserve items in your shopping cart between visits.

## 2. Analytics and preferences

We do not deploy third-party advertising trackers or sell browsing profiles. Your cart contents and saved Unique IDs stay local to your account or browser storage.

## 3. Managing cookies

You can clear or block cookies in your browser settings at any time. Disabling essential session cookies may require re-entering your email at checkout or re-selecting your preferred currency.
`,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = pages[slug];
  return p ? { title: p.title } : {};
}

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <div className="bg-cream pb-16">
      <ClubhousePageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Legal", href: "/legal/terms" },
          { label: page.title },
        ]}
        eyebrow="LEGAL"
        title={page.title}
        subtitle={`Last updated ${page.updated}`}
      />

      <Container className="mt-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <Card className="p-6 md:p-10">
              <Markdown body={page.body} />
            </Card>
          </div>

          <aside className="lg:sticky lg:top-24 lg:col-span-4">
            <Card className="p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
                POLICIES
              </div>
              <nav aria-label="Legal policies" className="mt-4 divide-y divide-border border-t border-border">
                {POLICY_NAV.map((item) => {
                  const active = item.slug === slug;
                  return (
                    <Link
                      key={item.slug}
                      href={`/legal/${item.slug}`}
                      className={cn(
                        "flex items-center justify-between border-l-2 py-3 pl-3.5 pr-2 text-sm transition",
                        active
                          ? "border-brass font-semibold text-ink bg-cream/50"
                          : "border-transparent text-muted hover:border-brass/50 hover:text-ink",
                      )}
                    >
                      <span>{item.label}</span>
                      {active && (
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brass-dark">
                          ACTIVE
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </Card>
          </aside>
        </div>
      </Container>
    </div>
  );
}
