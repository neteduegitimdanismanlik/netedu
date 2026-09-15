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
 */
export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY!,
  secretKey: process.env.IYZIPAY_SECRET_KEY!,
  uri: process.env.IYZIPAY_URI || 'https://sandbox-api.iyzipay.com',
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
