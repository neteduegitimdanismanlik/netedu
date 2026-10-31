import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callerId } from './api-auth'
import { FREE_UNIVERSITY_MATCHES } from './plan-limits'
import { consentGate } from './consent'

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
  DAILY_INTERVIEWS,
  DAILY_ORAL_PREPS,
  FREE_DAILY_PROFILE_ANALYSES,
  FREE_DAILY_ROADMAP_BUILDS,
  PRO_MONTHLY_CHECKS,
  PRO_MONTHLY_INTERVIEWS,
  PRO_MONTHLY_ORAL_PREPS,
  PRO_MONTHLY_ORAL_REVIEWS,
  PRO_MONTHLY_TOPIC_SEARCHES,
  PRO_MONTHLY_PROFILE_ANALYSES,
  PRO_MONTHLY_ROADMAP_BUILDS,
  PRO_MONTHLY_ROADMAP_YEARS,
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

/**
 * Rows this user created since midnight UTC.
 *
 * `extra` narrows to one more column — used by shared tables like
 * feature_usage, where several features share one table and a count for
 * "interview" must not see rows written for "oral-prep".
 */
export async function countToday(
  table: string,
  column: string,
  userId: string,
  extra?: { column: string; value: string }
): Promise<number> {
  const since = new Date()
  since.setUTCHours(0, 0, 0, 0)
  return countSince(table, column, userId, since, extra)
}

async function countSince(
  table: string,
  column: string,
  userId: string,
  since: Date,
  extra?: { column: string; value: string }
): Promise<number> {
  let query = admin
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq(column, userId)
    .gte('created_at', since.toISOString())

  if (extra) query = query.eq(extra.column, extra.value)

  const { count } = await query

  return count ?? 0
}

/* ------------------------------------------------------------------ */
/* Pro monthly allowances                                              */
/* ------------------------------------------------------------------ */

function startOfMonthUTC(): Date {
  const d = new Date()
  d.setUTCDate(1)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

/**
 * Where this student's monthly allowance starts counting from: the 1st of
 * the month (UTC), or the moment their package was last renewed if that is
 * later. Renewals live in public.quota_resets, which has RLS on and no
 * policies — only the server can read or write it. (Not a column on
 * profiles: the browser writes to profiles directly during onboarding, so a
 * student could have reset their own counters.)
 *
 * If the table doesn't exist yet (sql/quota-resets.sql not run), the query
 * errors and this falls back to the 1st of the month — limits still work,
 * renewal just isn't possible until the table is there.
 */
export async function allowancePeriodStart(userId: string): Promise<Date> {
  const monthStart = startOfMonthUTC()
  const { data, error } = await admin
    .from('quota_resets')
    .select('reset_at')
    .eq('user_id', userId)
    .order('reset_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data?.reset_at) return monthStart
  const reset = new Date(data.reset_at)
  return !isNaN(reset.getTime()) && reset > monthStart ? reset : monthStart
}

/**
 * True when a Pro student has used up a monthly allowance. Always false for
 * 'unlimited' accounts.
 */
export async function proMonthlyCapHit(
  userId: string,
  cap: number,
  table: string,
  column: string,
  extra?: { column: string; value: string }
): Promise<boolean> {
  if (await limitsWaived(userId)) return false
  const since = await allowancePeriodStart(userId)
  return (await countSince(table, column, userId, since, extra)) >= cap
}

/**
 * 429 with `renew: true` — RenewGate in the browser turns this into the
 * "renew your package" window. `what` is e.g. "20 IA checks".
 */
export function monthlyLimitReached(what: string, feature: string) {
  const next = startOfMonthUTC()
  next.setUTCMonth(next.getUTCMonth() + 1)
  const resets = next.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' })
  return NextResponse.json(
    {
      error: `You've used this month's ${what}. Renew your package for a fresh allowance now — otherwise it resets on ${resets}.`,
      limitReached: true,
      renew: true,
      feature,
    },
    { status: 429 }
  )
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

  // No accepted Privacy Notice, no processing. 403 with a message the page can show.
  const blocked = await consentGate(userId, 'account')
  if (blocked) return blocked

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

  // Every Pro feature sends the student's own work to Anthropic. A minor
  // needs a parent's approval on file before that can happen.
  const blocked = await consentGate(gate.userId, 'content')
  if (blocked) return blocked

  return gate
}
