import { initialsFrom } from './cas-privacy'
import { admin, planOf, countToday } from './plan'

/**
 * Server-side helpers shared by the /api/cas routes.
 *
 * These routes use the service_role key, so every one of them must establish
 * who the caller is (lib/api-auth callerId) and what they are allowed to see
 * before touching a row. Nothing here trusts anything sent by the client
 * except the ids it then re-checks.
 */
export const casAdmin = admin

// Plan and daily-count helpers live in lib/plan.ts so there is one definition
// of what Free means across the whole app.
export { planOf, countToday }

/** How many projects a student may ask to join in one day. */
export { DAILY_JOIN_LIMIT } from './plan-limits'

export type Membership =
  | { role: 'organizer' }
  | { role: 'member' }
  | { role: 'none' }

export async function membership(eventId: string, userId: string): Promise<Membership> {
  const { data: event } = await casAdmin
    .from('cas_events')
    .select('created_by')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) return { role: 'none' }
  if (event.created_by === userId) return { role: 'organizer' }

  const { data: application } = await casAdmin
    .from('cas_applications')
    .select('status')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .maybeSingle()

  return application?.status === 'accepted' ? { role: 'member' } : { role: 'none' }
}

/**
 * Maps user ids to initials. Real names are resolved here and never leave
 * the server — the client only ever receives two letters.
 */
export async function initialsMap(userIds: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(userIds)].filter(Boolean)
  if (unique.length === 0) return {}

  const { data: profiles } = await casAdmin
    .from('profiles')
    .select('*')
    .in('id', unique)

  const byId = new Map<string, Record<string, unknown>>()
  for (const p of profiles || []) byId.set(String(p.id), p as Record<string, unknown>)

  const out: Record<string, string> = {}
  for (const id of unique) out[id] = initialsFrom(byId.get(id) ?? null)
  return out
}

