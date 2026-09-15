/**
 * `iyzipay` ships no TypeScript types. This is a deliberately loose ambient
 * declaration — just enough to stop "cannot find module" errors — not a
 * real type surface. Every call site still needs to match the SDK's actual
 * shape (verified against github.com/iyzico/iyzipay-node source, not just
 * its README) — see the comments in lib/iyzico.ts and the billing routes.
 */
declare module 'iyzipay' {
  export default class Iyzipay {
    constructor(config?: { apiKey?: string; secretKey?: string; uri?: string })

    subscriptionProduct: {
      create(params: Record<string, any>, cb: (err: any, result: any) => void): void
      retrieve(params: Record<string, any>, cb: (err: any, result: any) => void): void
      retrieveList(params: Record<string, any>, cb: (err: any, result: any) => void): void
    }
    subscriptionPricingPlan: {
      create(params: Record<string, any>, cb: (err: any, result: any) => void): void
      retrieveList(params: Record<string, any>, cb: (err: any, result: any) => void): void
    }
    subscriptionCheckoutForm: {
      initialize(params: Record<string, any>, cb: (err: any, result: any) => void): void
      retrieve(params: Record<string, any>, cb: (err: any, result: any) => void): void
    }
    subscription: {
      cancel(params: Record<string, any>, cb: (err: any, result: any) => void): void
      activate(params: Record<string, any>, cb: (err: any, result: any) => void): void
      upgrade(params: Record<string, any>, cb: (err: any, result: any) => void): void
      retrieve(params: Record<string, any>, cb: (err: any, result: any) => void): void
      search(params: Record<string, any>, cb: (err: any, result: any) => void): void
    }
    subscriptionPayment: {
      retry(params: Record<string, any>, cb: (err: any, result: any) => void): void
    }

    static LOCALE: { TR: string; EN: string }
    static CURRENCY: { TRY: string; EUR: string; USD: string; GBP: string }
    static SUBSCRIPTION_PRICING_PLAN_INTERVAL: { DAILY: string; WEEKLY: string; MONTHLY: string; YEARLY: string }
    static PLAN_PAYMENT_TYPE: { RECURRING: string }
    static SUBSCRIPTION_INITIAL_STATUS: { ACTIVE: string; PENDING: string }
    static SUBSCRIPTION_STATUS: {
      ACTIVE: string
      PENDING: string
      UNPAID: string
      CANCELED: string
      EXPIRED: string
      UPGRADED: string
    }
  }
}
