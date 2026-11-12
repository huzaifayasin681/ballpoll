import { Suspense } from "react";
import { formatMoney, staticRates, type CurrencyCode, type Rates } from "@/lib/currency";
import { getMoneyContext } from "@/lib/money";
import { cn } from "@/lib/utils";

type Props = {
  cents: number;
  compare?: number | null;
  className?: string;
  compareClassName?: string;
};

function PriceSpan({
  cents,
  compare,
  className,
  compareClassName,
  currency,
  rates,
}: Props & { currency: CurrencyCode; rates: Rates }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className={cn("font-semibold text-foreground", className)}>{formatMoney(cents, currency, rates)}</span>
      {compare && compare > cents ? (
        <span className={cn("text-xs text-muted line-through", compareClassName)}>
          {formatMoney(compare, currency, rates)}
        </span>
      ) : null}
    </span>
  );
}

async function LocalizedPrice(props: Props) {
  const { currency, rates } = await getMoneyContext();
  return <PriceSpan {...props} currency={currency} rates={rates} />;
}

export function Price(props: Props) {
  return (
    <Suspense fallback={<PriceSpan {...props} currency="USD" rates={staticRates} />}>
      <LocalizedPrice {...props} />
    </Suspense>
  );
}
