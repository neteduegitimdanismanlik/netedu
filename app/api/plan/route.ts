import { NextResponse } from 'next/server'
import { callerId } from '@/lib/api-auth'
import { planOf, limitsWaived, countToday, DAILY_CHECKS, FREE_ROADMAP_PERIODS, FREE_UNIVERSITY_MATCHES } from '@/lib/plan'

/**
 * What the signed-in student is allowed to do, for the UI to render against.
 * The pages use this to draw locks; the limits themselves are enforced in the
 * endpoints that spend money, never here.
 */
export async function GET(req: Request) {
  const userId = await callerId(req)
  if (!userId) {
    return NextResponse.json({ plan: 'free', signedIn: false })
  }

  const plan = await planOf(userId)
  const waived = await limitsWaived(userId)
  const usedToday = plan === 'pro' && !waived ? await countToday('checker_reports', 'user_id', userId) : 0

  return NextResponse.json({
    plan,
    signedIn: true,
    unlimited: waived,
    limits: {
      roadmapPeriods: plan === 'pro' ? null : FREE_ROADMAP_PERIODS,
      universityMatches: plan === 'pro' ? null : FREE_UNIVERSITY_MATCHES,
      checksLeftToday: waived ? null : plan === 'pro' ? Math.max(0, DAILY_CHECKS - usedToday) : 0,
    },
  })
}
