import { NextResponse } from 'next/server'
import { requireUser, admin } from '@/lib/plan'
import { iyzipay, iyzicoCall } from '@/lib/iyzico'

/**
 * Cancels the caller's active subscription.
 *
 * Simplified v1 behaviour: Pro access ends immediately, not at the end of
 * the period already paid for. iyzico's subscription.retrieve does return
 * period-boundary dates, but tracking "keep Pro until current_period_end,
 * then downgrade" properly needs a scheduled job to do that downgrade later
 * — not built yet. If "access until period end" turns out to matter,
 * that's the missing piece, not this route.
 */
export async function POST(req: Request) {
  const gate = await requireUser(req)
  if (gate instanceof NextResponse) return gate

  const { data: row } = await admin
    .from('subscriptions')
    .select('id, provider_subscription_ref')
    .eq('user_id', gate.userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!row?.provider_subscription_ref) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
  }

  try {
    await iyzicoCall(iyzipay.subscription.cancel.bind(iyzipay.subscription), {
      subscriptionReferenceCode: row.provider_subscription_ref,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Could not cancel with iyzico' }, { status: 502 })
  }

  await admin
    .from('subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('id', row.id)
  await admin.from('profiles').update({ plan: 'free' }).eq('id', gate.userId)

  return NextResponse.json({ ok: true })
}
