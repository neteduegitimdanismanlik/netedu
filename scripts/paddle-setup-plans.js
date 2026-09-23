#!/usr/bin/env node
/**
 * One-time setup script — NOT part of the app's runtime.
 *
 * Creates the "NetEdu Pro" product in Paddle and its two USD prices
 * (monthly, annual), then prints the price ids to paste into
 * lib/billing-config.ts's PADDLE_PRICE_IDS. Run it once against sandbox
 * while developing, and again against production right before launch —
 * sandbox and production are separate Paddle accounts with separate ids,
 * a sandbox price id will not work in production.
 *
 * Usage:
 *   PADDLE_API_KEY=... PADDLE_ENV=sandbox node scripts/paddle-setup-plans.js
 */

const { Environment, Paddle } = require('@paddle/paddle-node-sdk')

const PRO_MONTHLY_USD = 49
const PRO_ANNUAL_USD = 400

const paddle = new Paddle(process.env.PADDLE_API_KEY, {
  environment: process.env.PADDLE_ENV === 'production' ? Environment.production : Environment.sandbox,
})

async function main() {
  console.log(`Creating against Paddle ${process.env.PADDLE_ENV === 'production' ? 'production' : 'sandbox'}\n`)

  const product = await paddle.products.create({ name: 'NetEdu Pro', taxCategory: 'standard' })
  console.log('Product created:', product.id)

  const monthly = await paddle.prices.create({
    description: 'NetEdu Pro — Monthly',
    productId: product.id,
    unitPrice: { amount: String(PRO_MONTHLY_USD * 100), currencyCode: 'USD' }, // Paddle prices are in the smallest currency unit — cents.
    billingCycle: { interval: 'month', frequency: 1 },
    taxMode: 'account_setting',
  })
  console.log(`Price monthly ($${PRO_MONTHLY_USD}):`, monthly.id)

  const annual = await paddle.prices.create({
    description: 'NetEdu Pro — Annual',
    productId: product.id,
    unitPrice: { amount: String(PRO_ANNUAL_USD * 100), currencyCode: 'USD' },
    billingCycle: { interval: 'year', frequency: 1 },
    taxMode: 'account_setting',
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
  console.error('\nSetup failed:', err.message || err)
  process.exit(1)
})
