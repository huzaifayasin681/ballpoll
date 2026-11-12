import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, PageFallback, SectionHeading } from "@/components/ui/primitives";
import { CartClient } from "@/components/cart/cart-client";
import { getMoneyContext } from "@/lib/money";

export const metadata: Metadata = { title: "Your Cart", robots: { index: false } };

async function CartBody() {
  const { currency, rates } = await getMoneyContext();
  return (
    <Container className="space-y-8 py-10">
      <SectionHeading eyebrow="Cart" title="Your Shopping Cart" />
      <CartClient currency={currency} rates={rates} />
    </Container>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <CartBody />
    </Suspense>
  );
}
