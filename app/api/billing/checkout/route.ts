import { NextResponse } from 'next/server'
import { requireUser, admin } from '@/lib/plan'
import { iyzipay, iyzicoCall } from '@/lib/iyzico'
import { IYZICO_PLAN_REFS, APP_URL } from '@/lib/billing-config'
import type { BillingInterval, ChargeCurrency } from '@/lib/billing-config'

/**
 * Starts a Pro subscription. The customer never sends card data to us — it
 * goes straight into iyzico's hosted Checkout Form (the `checkoutFormContent`
 * HTML this returns). We only find out whether the payment actually
 * succeeded later, in /api/billing/callback (when the browser returns) and
 * /api/billing/webhook (on every renewal after that) — never here.
 */
export async function POST(req: Request) {
  try {
    const gate = await requireUser(req)
    if (gate instanceof NextResponse) return gate

    const body = await req.json()
    const interval: BillingInterval = body.interval
    const currency: ChargeCurrency = body.currency
    const customer = body.customer

    if (interval !== 'monthly' && interval !== 'annual') {
      return NextResponse.json({ error: 'interval must be "monthly" or "annual"' }, { status: 400 })
    }
    if (currency !== 'TRY' && currency !== 'USD') {
      return NextResponse.json({ error: 'currency must be "TRY" or "USD"' }, { status: 400 })
    }

    const pricingPlanReferenceCode = IYZICO_PLAN_REFS[interval][currency]
    if (!pricingPlanReferenceCode) {
      // scripts/iyzico-setup-plans.js hasn't been run yet (or its output
      // hasn't been pasted into lib/billing-config.ts).
      return NextResponse.json(
        { error: `No iyzico pricing plan configured for ${interval}/${currency} yet.` },
        { status: 500 }
      )
    }

    const required = ['name', 'surname', 'identityNumber', 'email', 'gsmNumber']
    for (const f of required) {
      if (!customer?.[f]) {
        return NextResponse.json({ error: `Missing customer.${f}` }, { status: 400 })
      }
    }
    const addr = customer.address || {}
    for (const f of ['city', 'country', 'address', 'zipCode']) {
      if (!addr[f]) {
        return NextResponse.json({ error: `Missing customer.address.${f}` }, { status: 400 })
      }
    }

    // Our own row exists before iyzico's subscription does. Its id rides
    // along in callbackUrl so /api/billing/callback can find it again —
    // the webhook payload itself carries no field of ours to match on.
    const { data: row, error: insertError } = await admin
      .from('subscriptions')
      .insert({
        user_id: gate.userId,
        provider: 'iyzico',
        pricing_plan_ref: pricingPlanReferenceCode,
        interval,
        status: 'pending',
      })
      .select('id')
      .single()

    if (insertError || !row) {
      return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 })
    }

    const billingAddress = {
      contactName: `${customer.name} ${customer.surname}`,
      city: addr.city,
      district: addr.district || addr.city,
      country: addr.country,
      address: addr.address,
      zipCode: addr.zipCode,
    }

    try {
      const result = await iyzicoCall(iyzipay.subscriptionCheckoutForm.initialize.bind(iyzipay.subscriptionCheckoutForm), {
        locale: 'tr',
        conversationId: row.id,
        callbackUrl: `${APP_URL}/api/billing/callback?sub=${row.id}`,
        pricingPlanReferenceCode,
        subscriptionInitialStatus: 'ACTIVE',
        customer: {
          name: customer.name,
          surname: customer.surname,
          identityNumber: customer.identityNumber,
          email: customer.email,
          gsmNumber: customer.gsmNumber,
          billingAddress,
          shippingAddress: billingAddress,
        },
      })

      return NextResponse.json({ checkoutFormContent: result.checkoutFormContent, token: result.token })
    } catch (iyzicoError: any) {
      await admin.from('subscriptions').update({ status: 'expired' }).eq('id', row.id)
      return NextResponse.json({ error: iyzicoError.message || 'iyzico checkout failed' }, { status: 502 })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
