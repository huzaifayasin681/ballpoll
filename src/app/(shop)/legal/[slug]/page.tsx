import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card, Container, PageFallback } from "@/components/ui/primitives";
import { Markdown } from "@/components/markdown";
import { site } from "@/lib/site";

const pages: Record<string, { title: string; body: string }> = {
  refund: {
    title: "Dispute, Replacement & Refund Policy",
    body: `## 100% Delivery Guarantee
Every order on ${site.name} is backed by our delivery guarantee. If we cannot start or complete your order within the stated window, you are entitled to a **full refund**.

## When you are eligible for a full refund
- Your order is still in **Awaiting Payment** or **Paid: In Queue** and work has not started
- An item or account you ordered is out of stock
- We are unable to deliver within 48 hours of the estimated delivery time shown on the product page

## Partial deliveries & boosting
If a boosting or cue upgrade order is partially completed and you ask to stop early, we refund the remaining undelivered portion pro-rata.

## Completed orders & replacement guarantee
Once coins, cash, cues or accounts have been delivered to the Unique ID or account you supplied, the delivery is final. For **Account Marketplace** purchases, we include a **7-day replacement guarantee** covering access issues not caused by the buyer.

## Publisher enforcement disclaimer
Buying virtual currency, accounts or boosting from third parties may violate Miniclip's terms of service. ${site.name} is not responsible for publisher actions taken after delivery has been completed. We strongly recommend changing your password immediately after any credential-based service.

## How to open a dispute
Contact us at **${site.supportEmail}** or via the [Support Center](/help#contact) with your Order ID (\`GPS-XXXXXX\`). We review all disputes within 24 hours.`,
  },
  terms: {
    title: "Terms of Service",
    body: `## 1. Independent platform
${site.name} is an independent digital marketplace and service provider. We are **not** affiliated with, endorsed by, or sponsored by Miniclip SA.

## 2. Eligibility & accurate information
You must be at least 18 years old (or have parental consent) and provide an accurate email and Miniclip Unique ID at checkout. Orders sent to an incorrect Unique ID provided by the customer cannot be reversed once delivered.

## 3. Account-based services
When you order a service that requires temporary login access:
- Stay logged out of the game while your order is in **Processing** so you don't interrupt your booster
- Your credentials are encrypted with AES-256 and deleted automatically 72 hours after completion
- Change your password as soon as the order is marked **Completed**

## 4. Game publisher rules
Third-party top-ups, account transfers and boosting may conflict with the game publisher's terms of service. By ordering, you accept this risk.

## 5. Contact
Questions about these terms can be sent to **${site.supportEmail}**.`,
  },
  privacy: {
    title: "Privacy Policy",
    body: `## What we collect
- Account & order details: name, email, country, order items and Miniclip Unique ID
- Temporary game credentials (only when required by a service you choose)

## How we protect game credentials
Credentials submitted for boosting or cue services are encrypted with **AES-256-GCM** before touching the database. Only the staff member assigned to your order can view them while the order is in **Processing**, every view is written to an audit log, and the record is **automatically purged 72 hours after completion**.

Saved Unique IDs in your dashboard store your public 10-digit Unique ID only—never a password.

## Cookies
We use essential cookies for your sign-in session (\`gps_session\`), display currency (\`gps_currency\`) and referral attribution (\`gps_ref\`).

## Data deletion requests
Email **${site.supportEmail}** from the address on your account to request an export or deletion of your data.`,
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = pages[slug];
  return { title: p?.title ?? "Legal" };
}

async function LegalBody({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();
  return (
    <Container className="max-w-3xl space-y-6 py-10">
      <h1 className="font-display text-3xl font-bold text-foreground">{page.title}</h1>
      <Card className="p-6 sm:p-8">
        <Markdown body={page.body} />
      </Card>
    </Container>
  );
}

export default function LegalPage(props: PageProps<"/legal/[slug]">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <LegalBody {...props} />
    </Suspense>
  );
}
