/**
 * Currency support. Prices are stored in USD cents and converted for display.
 * Rates are refreshed from OpenExchangeRates when OPENEXCHANGERATES_APP_ID is set,
 * otherwise these static fallbacks are used.
 */
export const currencies = {
  USD: { symbol: "$", rate: 1, label: "US Dollar" },
  EUR: { symbol: "€", rate: 0.92, label: "Euro" },
  GBP: { symbol: "£", rate: 0.79, label: "British Pound" },
  AED: { symbol: "AED ", rate: 3.67, label: "UAE Dirham" },
  SAR: { symbol: "SAR ", rate: 3.75, label: "Saudi Riyal" },
  INR: { symbol: "₹", rate: 83.2, label: "Indian Rupee" },
  PKR: { symbol: "Rs ", rate: 278, label: "Pakistani Rupee" },
  TRY: { symbol: "₺", rate: 32.5, label: "Turkish Lira" },
  CAD: { symbol: "C$", rate: 1.36, label: "Canadian Dollar" },
  AUD: { symbol: "A$", rate: 1.52, label: "Australian Dollar" },
} as const;

export type CurrencyCode = keyof typeof currencies;
export type Rates = Record<CurrencyCode, number>;

export const staticRates: Rates = Object.fromEntries(
  Object.entries(currencies).map(([k, v]) => [k, v.rate]),
) as Rates;

export function isCurrency(c: string | undefined | null): c is CurrencyCode {
  return !!c && c in currencies;
}

/** Map visitor country (ISO-2) to a default currency. */
const countryCurrency: Record<string, CurrencyCode> = {
  GB: "GBP",
  AE: "AED",
  SA: "SAR",
  IN: "INR",
  PK: "PKR",
  TR: "TRY",
  CA: "CAD",
  AU: "AUD",
};
const euro = ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "IE", "PT", "FI", "GR", "SK", "SI", "LT", "LV", "EE", "LU", "MT", "CY", "HR"];

export function currencyForCountry(country?: string | null): CurrencyCode {
  if (!country) return "USD";
  const c = country.toUpperCase();
  if (euro.includes(c)) return "EUR";
  return countryCurrency[c] ?? "USD";
}

export function formatMoney(usdCents: number, code: CurrencyCode = "USD", rates: Rates = staticRates) {
  const value = (usdCents / 100) * (rates[code] ?? 1);
  const decimals = value >= 1000 && ["INR", "PKR", "TRY"].includes(code) ? 0 : 2;
  return (
    currencies[code].symbol +
    value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  );
}
