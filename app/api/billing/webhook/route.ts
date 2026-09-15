import { NextResponse } from 'next/server'
import { admin } from '@/lib/plan'
import { verifyIyzicoWebhookSignature } from '@/lib/iyzico-webhook'
import type { IyzicoSubscriptionWebhookPayload } from '@/lib/iyzico-webhook'

/**
 * iyzico calls this on every subscription event after the first payment —
 * renewals, and renewal failures. This is the ONLY place a later charge
 * flips plan back to 'pro' or down to 'free'; the first charge is confirmed
 * in /api/billing/callback instead, since that path can call iyzico
 * directly to check rather than wait for this webhook to arrive.
 *
 * No user session here — the caller is iyzico's server, not a signed-in
 * browser. The X-IYZ-SIGNATURE-V3 check is what stands in for auth, so it
 * is not optional.
 */
export async function POST(req: Request) {
  const raw = await req.text()
  let payload: IyzicoSubscriptionWebhookPayload
  try {
    payload = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const signature = req.headers.get('x-iyz-signature-v3') || req.headers.get('X-IYZ-SIGNATURE-V3')
  if (!verifyIyzicoWebhookSignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const { data: row } = await admin
    .from('subscriptions')
    .select('id, user_id')
    .eq('provider_subscription_ref', payload.subscriptionReferenceCode)
    .maybeSingle()

  if (!row) {
    // A webhook for a subscription we have no record of — log and 200 so
    // iyzico doesn't retry forever, but this is worth noticing.
    console.error('iyzico webhook for unknown subscription', payload.subscriptionReferenceCode)
    return NextResponse.json({ ok: true })
  }

  if (payload.iyziEventType === 'subscription.order.success') {
    await admin
      .from('subscriptions')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', row.id)
    await admin.from('profiles').update({ plan: 'pro' }).eq('id', row.user_id)
  } else if (payload.iyziEventType === 'subscription.order.failure') {
    await admin
      .from('subscriptions')
      .update({ status: 'unpaid', updated_at: new Date().toISOString() })
      .eq('id', row.id)
    // A failed renewal charge loses Pro immediately — no grace period yet.
    // If that turns out too harsh in practice, this is the line to change.
    await admin.from('profiles').update({ plan: 'free' }).eq('id', row.user_id)
  }

  return NextResponse.json({ ok: true })
}
