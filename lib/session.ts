import { supabase } from './supabase'

/**
 * Authorization header carrying the current session's access token.
 * API routes verify this token instead of trusting a userId sent in the body
 * or query string — otherwise anyone could read or write another user's data.
 *
 * Usage:
 *   await fetch('/api/portfolio', { headers: { ...(await authHeaders()) } })
 */
export async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}
