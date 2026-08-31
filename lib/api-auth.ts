import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Server-side helpers for API routes.
 *
 * The routes talk to Supabase with the service_role key, which bypasses RLS.
 * That makes it essential that they establish WHO is calling before touching
 * anyone's data — a userId taken from the request body or query string is
 * attacker-controlled and must never be trusted.
 */

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/** Verified id of the calling user, or null when the request carries no valid session. */
export async function callerId(req: Request): Promise<string | null> {
  const header = req.headers.get('authorization') || ''
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : ''
  if (!token) return null

  const { data, error } = await admin.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user.id
}

/** True when the verified caller is listed in public.admins. */
export async function callerIsAdmin(req: Request): Promise<boolean> {
  const uid = await callerId(req)
  if (!uid) return false
  const { data } = await admin.from('admins').select('user_id').eq('user_id', uid).maybeSingle()
  return Boolean(data)
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
