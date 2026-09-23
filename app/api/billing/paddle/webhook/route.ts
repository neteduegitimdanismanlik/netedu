import { NextResponse } from 'next/server'
import { EventName } from '@paddle/paddle-node-sdk'
import { paddle } from '@/lib/paddle'
import { admin } from '@/lib/plan'

/**
 * Paddle calls this for every subscription lifecycle event — created,
 * activated, a renewal charge, canceled, past due.
 *
 * paddle.webhooks.unmarshal() both verifies the Paddle-Signature header and
 * parses the body in one step — an invalid signature throws, so nothing
 * past that call is trusted without it. It needs the RAW body string, which
 * is why this reads req.text() and never req.json().
 *
 * Which of our users an event is about travels in customData — the
 * checkout button attaches { userId } via Paddle.Checkout.open(), and
 * Paddle copies that onto the transaction, then the subscription, then
 * every future renewal transaction automatically (their own documented
 * behaviour, not something we re-implement).
 */
export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get('paddle-signature') || ''
  const secretKey = process.env.PADDLE_WEBHOOK_SECRET || ''

  let eventData
  try {
    eventData = await paddle.webhooks.unmarshal(rawBody, secretKey, signature)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  if (!eventData) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const RELEVANT = new Set([
    EventName.SubscriptionCreated,
    EventName.SubscriptionUpdated,
    EventName.SubscriptionActivated,
    EventName.SubscriptionCanceled,
    EventName.SubscriptionPastDue,
  ])

  if (RELEVANT.has(eventData.eventType)) {
    const sub: any = eventData.data
    const userId = sub?.customData?.userId as string | undefined

    if (userId) {
      const status = mapPaddleStatus(sub.status)

      await admin.from('subscriptions').upsert(
        {
          user_id: userId,
          provider: 'paddle',
          provider_subscription_ref: sub.id,
          provider_customer_ref: sub.customerId,
          pricing_plan_ref: sub.items?.[0]?.price?.id || null,
          interval: sub.billingCycle?.interval === 'year' ? 'annual' : 'monthly',
          status,
          current_period_end: sub.currentBillingPeriod?.endsAt || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'provider_subscription_ref' }
      )

      // 'active' and 'trialing' both count as Pro. We don't currently sell
      // trials (see lib/billing-config.ts), so trialing shouldn't occur in
      // practice — mapped defensively anyway.
      await admin
        .from('profiles')
        .update({ plan: status === 'active' ? 'pro' : 'free' })
        .eq('id', userId)
    } else {
      // customData missing means this subscription wasn't started through
      // our checkout button — shouldn't happen, but note it rather than
      // silently doing nothing.
      console.error('Paddle webhook with no userId in customData', sub?.id)
    }
  }

  return NextResponse.json({ ok: true })
}

/** Paddle's SubscriptionStatus, mapped down to what subscriptions.status accepts. */
function mapPaddleStatus(raw: string): 'active' | 'unpaid' | 'canceled' {
  if (raw === 'active' || raw === 'trialing') return 'active'
  if (raw === 'past_due') return 'unpaid'
  return 'canceled' // 'canceled' | 'paused'
}
