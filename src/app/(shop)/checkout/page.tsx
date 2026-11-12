import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, PageFallback, SectionHeading } from "@/components/ui/primitives";
import { CheckoutClient } from "@/components/cart/checkout-client";
import { getCurrentUser } from "@/lib/auth";
import { getMoneyContext } from "@/lib/money";
import { listGateways } from "@/lib/payments";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

async function CheckoutBody() {
  const [user, { currency, rates }] = await Promise.all([getCurrentUser(), getMoneyContext()]);
  const savedIds = user ? await db.savedGameId.findMany({ where: { userId: user.id } }) : [];
  return (
    <Container className="space-y-8 py-10">
      <SectionHeading eyebrow="Secure Checkout" title="Complete Your Order" />
      <CheckoutClient
        user={user ? { email: user.email, name: user.name, points: user.points } : null}
        savedIds={savedIds}
        gateways={listGateways()}
        currency={currency}
        rates={rates}
      />
    </Container>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <CheckoutBody />
    </Suspense>
  );
}
