#!/usr/bin/env node
/**
 * One-time setup script — NOT part of the app's runtime.
 *
 * Creates the "NetEdu Pro" product in iyzico and its four pricing plans
 * (monthly/annual × TRY/USD), then prints the reference codes to paste into
 * lib/billing-config.ts's IYZICO_PLAN_REFS. Run it once against sandbox
 * while developing, and once again against production right before launch
 * (production plans are a separate set of reference codes — sandbox ones
 * will not work there).
 *
 * Usage:
 *   IYZIPAY_API_KEY=... IYZIPAY_SECRET_KEY=... IYZIPAY_URI=https://sandbox-api.iyzipay.com \
 *     node scripts/iyzico-setup-plans.js
 *
 * Prices are duplicated here rather than imported from lib/billing-config.ts
 * (a plain Node script can't easily import a TS file without a build step).
 * If you change PRO_MONTHLY_USD/PRO_ANNUAL_USD/TRY_PER_USD there, update the
 * numbers below to match before re-running this — or just re-run it, it's
 * safe to create a fresh set of plans and repoint IYZICO_PLAN_REFS at them.
 */

const Iyzipay = require('iyzipay')

const TRY_PER_USD = 48.5
const PRO_MONTHLY_USD = 49
const PRO_ANNUAL_USD = 400
const tryPrice = (usd) => Math.round((usd * TRY_PER_USD) / 10) * 10

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: process.env.IYZIPAY_URI || 'https://sandbox-api.iyzipay.com',
})

function call(fn, params) {
  return new Promise((resolve, reject) => {
    fn(params, (err, result) => {
      if (err) return reject(err)
      if (result && result.status && result.status !== 'success') {
        return reject(new Error(result.errorMessage || JSON.stringify(result)))
      }
      resolve(result)
    })
  })
}

async function main() {
  console.log(`Creating against: ${process.env.IYZIPAY_URI || 'https://sandbox-api.iyzipay.com'}\n`)

  const product = await call(iyzipay.subscriptionProduct.create.bind(iyzipay.subscriptionProduct), {
    locale: Iyzipay.LOCALE.TR,
    conversationId: 'netedu-pro-setup',
    name: 'NetEdu Pro',
    description: 'NetEdu Pro subscription',
  })
  console.log('Product created:', product.data.referenceCode)

  const plans = [
    { key: 'monthly/TRY', interval: 'monthly', currency: 'TRY', price: tryPrice(PRO_MONTHLY_USD), iyzInterval: Iyzipay.SUBSCRIPTION_PRICING_PLAN_INTERVAL.MONTHLY },
    { key: 'monthly/USD', interval: 'monthly', currency: 'USD', price: PRO_MONTHLY_USD, iyzInterval: Iyzipay.SUBSCRIPTION_PRICING_PLAN_INTERVAL.MONTHLY },
    { key: 'annual/TRY', interval: 'annual', currency: 'TRY', price: tryPrice(PRO_ANNUAL_USD), iyzInterval: Iyzipay.SUBSCRIPTION_PRICING_PLAN_INTERVAL.YEARLY },
    { key: 'annual/USD', interval: 'annual', currency: 'USD', price: PRO_ANNUAL_USD, iyzInterval: Iyzipay.SUBSCRIPTION_PRICING_PLAN_INTERVAL.YEARLY },
  ]

  const refs = { monthly: {}, annual: {} }

  for (const plan of plans) {
    const result = await call(iyzipay.subscriptionPricingPlan.create.bind(iyzipay.subscriptionPricingPlan), {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `netedu-pro-${plan.key}`,
      productReferenceCode: product.data.referenceCode,
      name: `NetEdu Pro — ${plan.key}`,
      price: plan.price,
      currencyCode: Iyzipay.CURRENCY[plan.currency],
      paymentInterval: plan.iyzInterval,
      paymentIntervalCount: 1,
      planPaymentType: Iyzipay.PLAN_PAYMENT_TYPE.RECURRING,
    })
    refs[plan.interval][plan.currency] = result.data.referenceCode
    console.log(`Plan ${plan.key} (${plan.price} ${plan.currency}):`, result.data.referenceCode)
  }

  console.log('\nPaste this into lib/billing-config.ts, replacing IYZICO_PLAN_REFS:\n')
  console.log(
    `export const IYZICO_PLAN_REFS: Record<BillingInterval, Record<ChargeCurrency, string>> = ${JSON.stringify(
      refs,
      null,
      2
    )}`
  )
}

main().catch((err) => {
  console.error('\nSetup failed:', err.message)
  process.exit(1)
})
