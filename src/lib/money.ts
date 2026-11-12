import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { cacheLife } from "next/cache";
import { currencies, currencyForCountry, isCurrency, staticRates, type CurrencyCode, type Rates } from "@/lib/currency";

export const CURRENCY_COOKIE = "gps_currency";

/** Live FX rates (hourly cached). Falls back to static rates. */
export async function getRates(): Promise<Rates> {
  "use cache";
  cacheLife("hours");
  const appId = process.env.OPENEXCHANGERATES_APP_ID;
  if (!appId) return staticRates;
  try {
    const res = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${appId}&base=USD`);
    if (!res.ok) return staticRates;
    const json = (await res.json()) as { rates: Record<string, number> };
    const out = { ...staticRates };
    for (const code of Object.keys(currencies) as CurrencyCode[]) {
      if (json.rates[code]) out[code] = json.rates[code];
    }
    return out;
  } catch {
    return staticRates;
  }
}

/** Visitor country from edge/CDN geo headers (Vercel / Cloudflare). */
export const getCountry = cache(async () => {
  const h = await headers();
  return h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || null;
});

/** Visitor's display currency: cookie > geo-IP > USD. */
export const getCurrency = cache(async (): Promise<CurrencyCode> => {
  const store = await cookies();
  const c = store.get(CURRENCY_COOKIE)?.value;
  if (isCurrency(c)) return c;
  return currencyForCountry(await getCountry());
});

export async function getMoneyContext() {
  const [currency, rates] = await Promise.all([getCurrency(), getRates()]);
  return { currency, rates };
}
