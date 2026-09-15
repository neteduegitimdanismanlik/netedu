import { NextResponse } from 'next/server'
import { requireUser, admin } from '@/lib/plan'

/** The signed-in user's most recent subscription — for an account page to show "renews on X" / "canceled". */
export async function GET(req: Request) {
  const gate = await requireUser(req)
  if (gate instanceof NextResponse) return gate

  const { data } = await admin
    .from('subscriptions')
    .select('id, interval, status, current_period_end, created_at')
    .eq('user_id', gate.userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ subscription: data || null })
}
