'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ConsentFields, { emptyConsent, validateConsent } from '../components/ConsentFields'
import { supabase } from '@/lib/supabase'
import { authHeaders } from '@/lib/session'

/** Only same-site paths, so ?next= cannot bounce anyone to another domain. */
function safeNext(): string {
  if (typeof window === 'undefined') return '/dashboard'
  const n = new URLSearchParams(window.location.search).get('next') || ''
  return n.startsWith('/') && !n.startsWith('//') ? n : '/dashboard'
}

export default function ConsentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasRow, setHasRow] = useState(false)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(emptyConsent)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [parentStep, setParentStep] = useState<null | { sent: boolean }>(null)

  useEffect(() => {
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/auth'); return }
      setEmail(session.user.email ?? '')
      const { data } = await supabase.from('consents').select('user_id').eq('user_id', session.user.id).maybeSingle()
      setHasRow(Boolean(data))
      setLoading(false)
    })()
  }, [router])

  async function save() {
    setError(null)
    const err = validateConsent(consent, email, { checkboxesOnly: hasRow })
    if (err) { setError(err); return }

    setSaving(true)
    const res = await fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
      body: JSON.stringify(consent),
    })
    const json = await res.json().catch(() => ({}))
    setSaving(false)

    if (!res.ok) { setError(json.error || 'Could not save. Try again.'); return }
    if (json.minor) { setParentStep({ sent: Boolean(json.parentEmailSent) }); return }
    router.replace(safeNext())
  }

  if (loading) {
    return <main className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-400">Loading…</main>
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-md shadow-sm">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
        </Link>

        {parentStep ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">One more step for your parent</h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {parentStep.sent
                ? "We've e-mailed your parent a link to approve your account."
                : "We couldn't send the e-mail to your parent just now. You can resend it from the banner at the top of the page."}{' '}
              Until they approve, you can fill in your profile and explore NetEdu. Uploading work for AI feedback unlocks after.
            </p>
            <button
              onClick={() => router.replace(safeNext())}
              className="w-full bg-indigo-900 text-white py-3 rounded-xl font-medium hover:bg-indigo-800 text-sm"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {hasRow ? 'We updated our terms' : 'Before you continue'}
            </h1>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              {hasRow
                ? 'Our Privacy Notice and Terms of Use have changed. Please read and accept them to carry on.'
                : 'We need your date of birth and your agreement to our Privacy Notice and Terms of Use. It takes a minute.'}
            </p>

            <ConsentFields value={consent} onChange={setConsent} showBirth={!hasRow} />

            {error && <div className="mt-4 text-sm px-4 py-3 rounded-xl bg-red-50 text-red-600">{error}</div>}

            <button
              onClick={save}
              disabled={saving}
              className="mt-6 w-full bg-indigo-900 text-white py-3 rounded-xl font-medium hover:bg-indigo-800 disabled:opacity-50 text-sm"
            >
              {saving ? 'Saving…' : 'Accept and continue'}
            </button>
          </>
        )}
      </div>
    </main>
  )
}
