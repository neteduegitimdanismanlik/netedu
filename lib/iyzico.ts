import Iyzipay from 'iyzipay'

/**
 * One shared iyzico client for the Subscription product.
 *
 * Reads IYZIPAY_API_KEY / IYZIPAY_SECRET_KEY / IYZIPAY_URI straight from the
 * environment (the SDK itself falls back to these exact env var names if no
 * config is passed — this just makes that explicit). Point IYZIPAY_URI at
 * https://sandbox-api.iyzipay.com while testing, https://api.iyzipay.com
 * once the production merchant account is approved. Never hit production
 * with sandbox keys or vice versa — the reference codes are not compatible
 * across environments.
 *
 * Built lazily, on first actual use, rather than when this module loads —
 * same reasoning as lib/paddle.ts: constructing eagerly meant any route
 * that merely imported this file crashed Next's build-time "collecting page
 * data" step whenever the iyzico keys were unset. The Proxy keeps every
 * existing `iyzipay.someMethod(...)` call site working unchanged.
 */
let client: Iyzipay | null = null

function getClient(): Iyzipay {
  if (!client) {
    const apiKey = process.env.IYZIPAY_API_KEY
    const secretKey = process.env.IYZIPAY_SECRET_KEY
    if (!apiKey || !secretKey) {
      throw new Error(
        'IYZIPAY_API_KEY / IYZIPAY_SECRET_KEY are not set. Add them to .env.local for local dev, and to the Vercel project env vars for deploys.'
      )
    }
    client = new Iyzipay({
      apiKey,
      secretKey,
      uri: process.env.IYZIPAY_URI || 'https://sandbox-api.iyzipay.com',
    })
  }
  return client
}

export const iyzipay = new Proxy({} as Iyzipay, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver)
  },
})

/**
 * The merchant id (MID) from the iyzico panel — NOT the API key or secret
 * key. Only used to verify webhook signatures (see lib/iyzico-webhook.ts).
 */
export const IYZIPAY_MERCHANT_ID = process.env.IYZIPAY_MERCHANT_ID || ''

/** Turns iyzico's callback-style SDK calls into promises so routes can just await them. */
export function iyzicoCall<T = any>(
  fn: (params: Record<string, any>, cb: (err: any, result: any) => void) => void,
  params: Record<string, any>
): Promise<T> {
  return new Promise((resolve, reject) => {
    fn(params, (err: any, result: any) => {
      if (err) return reject(err)
      if (result?.status && result.status !== 'success') {
        return reject(new Error(result.errorMessage || `iyzico returned status "${result.status}"`))
      }
      resolve(result)
    })
  })
}
