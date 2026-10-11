'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { authHeaders } from '@/lib/session'
import { NOTICE_VERSION, ADULT_AGE, ageOn } from '@/lib/consent-shared'

/**
 * Mounted once in app/layout.tsx.
 *
 *  - A signed-in user with no consent on file, or one who accepted an older
 *    NOTICE_VERSION, is sent to /consent.
 *  - A minor whose parent has not approved yet sees a slim banner, and the
 *    first approval e-mail goes out automatically on their first visit.
 *
 * This is the friendly half. The real lock is on the server (lib/consent.ts),
 * so skipping this component in the browser unlocks nothing.
 */

const OPEN_PATHS = new Set(['/', '/auth', '/privacy', '/terms', '/consent', '/pricing', '/contribute'])
const OPEN_PREFIXES = ['/parent-consent', '/admin']

interface Row {
  notice_version: string
  birth_date: string
  parent_email: string | null
  parent_email_sent_at: string | null
  parent_approved_at: string | null
}

export default function ConsentGate() {
  const pathname = usePathname()
  const router = useRouter()
  const [waiting, setWaiting] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    setWaiting(false)
    if (!pathname || OPEN_PATHS.has(pathname) || OPEN_PREFIXES.some((p) => pathname.startsWith(p))) return

    let cancelled = false
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || cancelled) return

      const { data, error } = await supabase
        .from('consents')
        .select('notice_version, birth_date, parent_email, parent_email_sent_at, parent_approved_at')
        .eq('user_id', session.user.id)
        .maybeSingle<Row>()
      if (cancelled || error) return // a network blip must not lock anyone out

      if (!data || data.notice_version !== NOTICE_VERSION) {
        router.replace(`/consent?next=${encodeURIComponent(pathname)}`)
        return
      }

      const awaiting = ageOn(data.birth_date) < ADULT_AGE && !data.parent_approved_at
      setWaiting(awaiting)

      // Signed up through the form: the trigger stored the parent's address but
      // nothing has been sent yet. Send the first e-mail now.
      if (awaiting && data.parent_email && !data.parent_email_sent_at) {
        await fetch('/api/parent-consent', { method: 'POST', headers: await authHeaders() })
      }
    })()

    return () => { cancelled = true }
  }, [pathname, router])

  async function resend() {
    setSending(true)
    setNote(null)
    const res = await fetch('/api/parent-consent', { method: 'POST', headers: await authHeaders() })
    const json = await res.json().catch(() => ({}))
    setSending(false)
    setNote(res.ok ? 'Sent. Ask them to check their inbox and spam folder.' : json.error || 'Could not send.')
  }

  if (!waiting) return null

  return (
    <div className="bg-amber-50 border-b border-amber-100 px-6 py-2.5 text-xs text-amber-900 flex flex-wrap items-center gap-x-3 gap-y-1">
      <span>Waiting for your parent&apos;s approval. Uploading work for AI feedback unlocks once they approve.</span>
      <button onClick={resend} disabled={sending} className="underline disabled:opacity-50">
        {sending ? 'Sending…' : 'Resend the e-mail'}
      </button>
      {note && <span className="text-amber-700">{note}</span>}
    </div>
  )
}
