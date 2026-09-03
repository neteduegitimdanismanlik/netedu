import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callerId } from './api-auth'
import { FREE_UNIVERSITY_MATCHES } from './plan-limits'

/**
 * What Free gets and what Pro gets — in one file, enforced on the server.
 *
 * The pricing page describes these limits; this is what actually applies them.
 * A limit checked only in the browser is decoration: anyone can call the API
 * directly, and every one of these endpoints spends money at Anthropic.
 */

export const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// The numbers themselves live in plan-limits.ts, which imports nothing, so
// client components can read the same values without pulling this file (and
// the service_role client) into the browser bundle.
export {
  FREE_ROADMAP_PERIODS,
  FREE_UNIVERSITY_MATCHES,
  DAILY_CHECKS,
  DAILY_JOIN_LIMIT,
} from './plan-limits'

export type Plan = 'free' | 'pro'

/**
 * Three values live in the database — 'free', 'pro' and 'unlimited' — but only
 * two ever reach the rest of the app.
 *
 * 'unlimited' is a test and staff tier. It reports as 'pro', so every feature
 * gate that asks `plan === 'pro'` keeps working untouched, and separately it
 * switches off the DAILY COUNTERS through limitsWaived(). That is the whole
 * difference: an unlimited account is a Pro account that never runs out.
 *
 * It deliberately does NOT grant admin-panel access — that is public.admins,
 * a separate thing. A test account should be able to use the product hard
 * without also being able to read other students' work.
 */
export async function planOf(userId: string): Promise<Plan> {
  const raw = await rawPlan(userId)
  return raw === 'pro' || raw === 'unlimited' ? 'pro' : 'free'
}

async function rawPlan(userId: string): Promise<string> {
  const { data } = await admin
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .maybeSingle()
  return typeof data?.plan === 'string' ? data.plan : 'free'
}

/**
 * True when this account should skip every daily counter — checker runs, CAS
 * join requests, message floods. Used for the accounts that test the product.
 */
export async function limitsWaived(userId: string): Promise<boolean> {
  return (await rawPlan(userId)) === 'unlimited'
}

/** Rows this user created since midnight UTC. */
export async function countToday(table: string, column: string, userId: string): Promise<number> {
  const since = new Date()
  since.setUTCHours(0, 0, 0, 0)

  const { count } = await admin
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq(column, userId)
    .gte('created_at', since.toISOString())

  return count ?? 0
}

/** 402 — the caller is signed in but on Free. The client turns this into an upgrade prompt. */
export function paymentRequired(message: string) {
  return NextResponse.json({ error: message, upgrade: true }, { status: 402 })
}

/** 429 — the caller is Pro but has used today's allowance. */
export function limitReached(message: string) {
  return NextResponse.json({ error: message, limitReached: true }, { status: 429 })
}

/**
 * Verified caller id, or a ready-made error response.
 *
 *   const gate = await requireUser(req)
 *   if (gate instanceof NextResponse) return gate
 *   const userId = gate.userId
 */
export async function requireUser(req: Request): Promise<{ userId: string } | NextResponse> {
  const userId = await callerId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return { userId }
}

/** As requireUser, but also refuses anyone who is not on Pro. */
export async function requirePro(
  req: Request,
  feature: string
): Promise<{ userId: string } | NextResponse> {
  const gate = await requireUser(req)
  if (gate instanceof NextResponse) return gate

  if ((await planOf(gate.userId)) !== 'pro') {
    return paymentRequired(`${feature} is part of Pro.`)
  }
  return gate
}
