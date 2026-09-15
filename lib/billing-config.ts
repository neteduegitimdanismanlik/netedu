/**
 * Pro plan pricing — the one place these numbers live.
 *
 * The advertised price is always in USD ("$49/mo, $360/yr"). What actually
 * gets charged depends on the card:
 *
 *   - Turkish-issued cards CANNOT be charged in a foreign currency for a
 *     domestic transaction — this is a hard block under Turkish FX-contract
 *     rules (Decree No. 32), enforced by the card issuer/network itself, not
 *     something we have to detect ourselves. So Turkish customers pay the
 *     TRY-equivalent price below.
 *   - Foreign-issued cards pay the USD price directly, through iyzico's
 *     Multi-Currency add-on.
 *
 * TRY_PER_USD is a manually maintained reference rate, NOT a live feed.
 * Update it here when it drifts meaningfully — every TRY price below moves
 * with it automatically, and nothing else in the codebase hardcodes a TRY
 * amount. (Set 2026-09-15 against ≈48.5 TRY/USD — verify before relying on
 * it if this file hasn't been touched in a while.)
 */
export const TRY_PER_USD = 48.5

export const PRO_MONTHLY_USD = 49
/** Priced for ~9 months of real use, not 12 — students are off in the summer. */
export const PRO_ANNUAL_USD = 400

/** Rounded to the nearest 10 TL so the sticker isn't a jagged FX artifact. */
function tryPrice(usd: number): number {
  return Math.round((usd * TRY_PER_USD) / 10) * 10
}

export const PRO_MONTHLY_TRY = tryPrice(PRO_MONTHLY_USD)
export const PRO_ANNUAL_TRY = tryPrice(PRO_ANNUAL_USD)

export type BillingInterval = 'monthly' | 'annual'
export type ChargeCurrency = 'TRY' | 'USD'

/** Base URL iyzico redirects back to after checkout. Same convention the rest of the app uses. */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://netedu.vercel.app'

/**
 * iyzico pricing-plan reference codes. Four plans total: each interval has
 * a TRY-denominated plan (for Turkish cards) and a USD-denominated plan
 * (for foreign cards) — same product, same feature access, different
 * currency because iyzico requires it.
 *
 * Empty until the one-time setup script creates these plans against the
 * iyzico account (sandbox first, then production) and the resulting
 * referenceCodes are pasted in here.
 */
export const IYZICO_PLAN_REFS: Record<BillingInterval, Record<ChargeCurrency, string>> = {
  monthly: { TRY: '', USD: '' },
  annual: { TRY: '', USD: '' },
}

export function priceFor(interval: BillingInterval, currency: ChargeCurrency): number {
  if (interval === 'monthly') return currency === 'TRY' ? PRO_MONTHLY_TRY : PRO_MONTHLY_USD
  return currency === 'TRY' ? PRO_ANNUAL_TRY : PRO_ANNUAL_USD
}
