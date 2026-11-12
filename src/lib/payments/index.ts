import "server-only";

/**
 * Pluggable payment gateway layer.
 *
 * Payments are deferred for now: checkout creates an order in PENDING_PAYMENT and
 * staff confirm payment manually from the admin panel ("Mark as Paid").
 *
 * To add a gateway: implement `PaymentGateway`, register it below and add a
 * webhook route at /api/webhooks/[gateway].
 * [Insert Payment Gateway API Keys / Details Here] → see .env.example
 */

export type CheckoutSession = { redirectUrl: string | null; externalId: string; instructions?: string };

export type PaymentEvent = {
  externalId: string;
  orderTrackingId: string;
  status: "paid" | "failed" | "refunded";
  amountCents: number;
  currency: string;
  raw: unknown;
};

export interface PaymentGateway {
  id: string;
  label: string;
  description: string;
  enabled: () => boolean;
  createCheckout(order: { trackingId: string; totalCents: number; currency: string; email: string }): Promise<CheckoutSession>;
  verifyWebhook?(req: Request): Promise<PaymentEvent>;
  refund?(externalId: string, amountCents: number): Promise<void>;
}

const manual: PaymentGateway = {
  id: "manual",
  label: "Pay with support (manual)",
  description: "Place your order now. Our team will send secure payment details by email or WhatsApp.",
  enabled: () => true,
  async createCheckout(order) {
    return {
      redirectUrl: null,
      externalId: `manual_${order.trackingId}`,
      instructions: "Our team will contact you shortly with payment details.",
    };
  },
};

// ─── Placeholder adapters (disabled until keys are provided) ───
function placeholder(id: string, label: string, description: string, envKey: string): PaymentGateway {
  return {
    id,
    label,
    description,
    enabled: () => Boolean(process.env[envKey]),
    async createCheckout() {
      throw new Error(`${label} is not configured. [Insert Payment Gateway API Keys / Details Here]`);
    },
  };
}

const gateways: PaymentGateway[] = [
  manual,
  placeholder("stripe", "Credit / Debit Card", "Visa, Mastercard, Apple Pay via Stripe", "STRIPE_SECRET_KEY"),
  placeholder("paypal", "PayPal", "Pay with your PayPal balance or card", "PAYPAL_CLIENT_ID"),
  placeholder("coinbase", "Crypto (Coinbase Commerce)", "BTC, ETH, USDC and more", "COINBASE_COMMERCE_API_KEY"),
  placeholder("binancepay", "Binance Pay", "Pay from your Binance account", "BINANCE_PAY_API_KEY"),
  placeholder("nowpayments", "USDT (TRC20 / ERC20)", "Stablecoin payments via NOWPayments", "NOWPAYMENTS_API_KEY"),
];

export function listGateways() {
  return gateways.map((g) => ({ id: g.id, label: g.label, description: g.description, enabled: g.enabled() }));
}

export function getGateway(id: string) {
  const g = gateways.find((x) => x.id === id);
  if (!g || !g.enabled()) return null;
  return g;
}
