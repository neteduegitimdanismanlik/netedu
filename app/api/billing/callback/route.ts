import { NextResponse } from 'next/server'
import { admin } from '@/lib/plan'
import { iyzipay, iyzicoCall } from '@/lib/iyzico'
import { APP_URL } from '@/lib/billing-config'

/**
 * Where the customer's browser lands after they finish (or abandon) iyzico's
 * Checkout Form. `sub` in the query string is ours — we put it in
 * callbackUrl ourselves in /api/billing/checkout so we can find our pending
 * row again. `token` is iyzico's — we use it to ask iyzico directly what
 * actually happened, rather than trust anything else on this URL, since a
 * redirect is something anyone could forge by hand.
 */
async function handle(req: Request) {
  const url = new URL(req.url)
  let subId = url.searchParams.get('sub')
  let token = url.searchParams.get('token')

  if (!token && req.method === 'POST') {
    try {
      const contentType = req.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const body = await req.json()
        token = body.token || token
        subId = body.sub || subId
      } else {
        const form = await req.formData()
        token = (form.get('token') as string) || token
        subId = (form.get('sub') as string) || subId
      }
    } catch {
      // fall through — handled by the missing-token check below
    }
  }

  if (!token || !subId) {
    return NextResponse.redirect(`${APP_URL}/account?billing=error`)
  }

  const { data: row } = await admin.from('subscriptions').select('id, user_id').eq('id', subId).maybeSingle()
  if (!row) {
    return NextResponse.redirect(`${APP_URL}/account?billing=error`)
  }

  try {
    const result = await iyzicoCall(
      iyzipay.subscriptionCheckoutForm.retrieve.bind(iyzipay.subscriptionCheckoutForm),
      { checkoutFormToken: token }
    )
    const data = result.data || result

    const status = mapStatus(data.subscriptionStatus)

    await admin
      .from('subscriptions')
      .update({
        provider_subscription_ref: data.referenceCode,
        provider_customer_ref: data.customerReferenceCode,
        status,
        current_period_end: data.endDate ? new Date(data.endDate).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', row.id)

    if (status === 'active') {
      await admin.from('profiles').update({ plan: 'pro' }).eq('id', row.user_id)
      return NextResponse.redirect(`${APP_URL}/account?billing=success`)
    }
    if (status === 'pending') {
      return NextResponse.redirect(`${APP_URL}/account?billing=pending`)
    }
    return NextResponse.redirect(`${APP_URL}/account?billing=failed`)
  } catch {
    return NextResponse.redirect(`${APP_URL}/account?billing=error`)
  }
}

/** iyzico's SUBSCRIPTION_STATUS values, mapped down to what subscriptions.status accepts. */
function mapStatus(raw: string): 'active' | 'pending' | 'unpaid' | 'canceled' | 'expired' {
  switch (raw) {
    case 'ACTIVE':
    case 'UPGRADED':
      return 'active'
    case 'PENDING':
      return 'pending'
    case 'UNPAID':
      return 'unpaid'
    case 'CANCELED':
      return 'canceled'
    default:
      return 'expired'
  }
}

export async function GET(req: Request) {
  return handle(req)
}

export async function POST(req: Request) {
  return handle(req)
}
