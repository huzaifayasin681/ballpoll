import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, PageFallback } from "@/components/ui/primitives";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
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
    <div className="bg-cream">
      <ClubhousePageHero
        crumbs={[
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
        eyebrow="Secure checkout"
        title="Checkout"
        subtitle="Three quick steps. No game password needed for coin orders."
      />

      <Container className="py-10 sm:py-12">
        <CheckoutClient
          user={user ? { email: user.email, name: user.name, points: user.points } : null}
          savedIds={savedIds}
          gateways={listGateways()}
          currency={currency}
          rates={rates}
        />
      </Container>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <CheckoutBody />
    </Suspense>
  );
}
