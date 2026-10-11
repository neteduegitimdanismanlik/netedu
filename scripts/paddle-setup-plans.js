#!/usr/bin/env node
/**
 * One-time setup script — NOT part of the app's runtime.
 *
 * Creates the single "NetEdu Pro" product in Paddle and its two USD prices
 * (monthly, annual) — one plan, same price for everyone, no trial. This is
 * the plan actually wired into the app (lib/billing-config.ts, the pricing
 * page, the checkout button) — nothing tiered, nothing trial-gated.
 *
 * Uses Node's built-in fetch — no SDK install needed to just run this once.
 *
 * Usage:
 *   PADDLE_API_KEY=pdl_sdbx_... PADDLE_ENV=sandbox node scripts/paddle-setup-plans.js
 */

const API_KEY = process.env.PADDLE_API_KEY
const BASE_URL = process.env.PADDLE_ENV === 'production'
  ? 'https://api.paddle.com'
  : 'https://sandbox-api.paddle.com'

if (!API_KEY) {
  console.error('Set PADDLE_API_KEY first, e.g.:\n  PADDLE_API_KEY=pdl_sdbx_... node scripts/paddle-setup-plans.js')
  process.exitCode = 1
  return
}

const PRO_MONTHLY_USD = 49
const PRO_ANNUAL_USD = 400

async function paddle(method, endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(`${method} ${endpoint} -> ${res.status}: ${JSON.stringify(json.error || json)}`)
  }
  return json.data
}

async function main() {
  console.log(`Creating against: ${BASE_URL}\n`)

  const product = await paddle('POST', '/products', {
    name: 'NetEdu Pro',
    tax_category: 'standard',
    description: 'NetEdu Pro subscription',
  })
  console.log('Product created:', product.id)

  const monthly = await paddle('POST', '/prices', {
    description: 'NetEdu Pro — Monthly',
    product_id: product.id,
    unit_price: { amount: String(PRO_MONTHLY_USD * 100), currency_code: 'USD' },
    billing_cycle: { interval: 'month', frequency: 1 },
    tax_mode: 'account_setting',
  })
  console.log(`Price monthly ($${PRO_MONTHLY_USD}):`, monthly.id)

  const annual = await paddle('POST', '/prices', {
    description: 'NetEdu Pro — Annual',
    product_id: product.id,
    unit_price: { amount: String(PRO_ANNUAL_USD * 100), currency_code: 'USD' },
    billing_cycle: { interval: 'year', frequency: 1 },
    tax_mode: 'account_setting',
  })
  console.log(`Price annual ($${PRO_ANNUAL_USD}):`, annual.id)

  console.log('\nPaste this into lib/billing-config.ts, replacing PADDLE_PRICE_IDS:\n')
  console.log(
    `export const PADDLE_PRICE_IDS: Record<BillingInterval, string> = ${JSON.stringify(
      { monthly: monthly.id, annual: annual.id },
      null,
      2
    )}`
  )
}

main().catch((err) => {
  console.error('\nSetup failed:', err.message)
  process.exitCode = 1
})
