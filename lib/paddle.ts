import { Environment, Paddle } from '@paddle/paddle-node-sdk'

/**
 * One shared Paddle client (Paddle Billing — the current product; the SDK
 * does not support the legacy Paddle Classic at all).
 *
 * Sandbox and production are entirely separate accounts with separate API
 * keys — set PADDLE_ENV=production and swap PADDLE_API_KEY together, never
 * one without the other, or requests will silently hit the wrong account.
 */
export const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: process.env.PADDLE_ENV === 'production' ? Environment.production : Environment.sandbox,
})
