import { Environment, Paddle } from '@paddle/paddle-node-sdk'

/**
 * One shared Paddle client (Paddle Billing — the current product; the SDK
 * does not support the legacy Paddle Classic at all).
 *
 * Sandbox and production are entirely separate accounts with separate API
 * keys — set PADDLE_ENV=production and swap PADDLE_API_KEY together, never
 * one without the other, or requests will silently hit the wrong account.
 *
 * Built lazily, on first actual use, rather than when this module loads.
 * Constructing eagerly meant ANY route that merely imported this file —
 * even one that never touches Paddle — crashed during Next's build-time
 * "collecting page data" step whenever PADDLE_API_KEY was unset (a fresh
 * checkout, a preview deploy, CI without the secret configured yet). The
 * Proxy keeps every existing `paddle.webhooks.unmarshal(...)`-style call
 * site working unchanged.
 */
let client: Paddle | null = null

function getClient(): Paddle {
  if (!client) {
    const apiKey = process.env.PADDLE_API_KEY
    if (!apiKey) {
      throw new Error(
        'PADDLE_API_KEY is not set. Add it to .env.local for local dev, and to the Vercel project env vars for deploys.'
      )
    }
    client = new Paddle(apiKey, {
      environment: process.env.PADDLE_ENV === 'production' ? Environment.production : Environment.sandbox,
    })
  }
  return client
}

export const paddle = new Proxy({} as Paddle, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver)
  },
})
