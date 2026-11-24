'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

/**
 * Where the "reset your password" e-mail lands. Supabase signs the user in
 * from the link (the token in the URL), then this page lets them choose a new
 * password. Add https://neteduapp.com/** to Supabase > Authentication > URL
 * Configuration > Redirect URLs, or Supabase sends the link to the Site URL
 * instead of here.
 */

export default function ResetPassword() {
  const [ready, setReady] = useState(false)
  const [checked, setChecked] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true)
    })
    // The client may have finished reading the link before this listener was attached.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
      setChecked(true)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function save() {
    setError('')
    if (password.length < 6) return setError('Use at least 6 characters.')
    if (password !== confirm) return setError("The two passwords don't match.")
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return setError(error.message)
    setDone(true)
    setTimeout(() => { window.location.href = '/dashboard' }, 1500)
  }

  const input =
    'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-md shadow-sm">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set a new password</h1>

        {done ? (
          <p className="text-sm px-4 py-3 rounded-xl bg-green-50 text-green-700">Password changed. Taking you to your dashboard…</p>
        ) : !ready ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">
              {checked
                ? 'This link has expired or was already used. Ask for a new one from the login page.'
                : 'Checking your link…'}
            </p>
            {checked && (
              <Link href="/auth" className="text-sm text-indigo-700 hover:underline">Back to login →</Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 mb-4">Choose a new password for your NetEdu account.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 6 characters" className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repeat new password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && !loading && save()} autoComplete="new-password" className={input} />
            </div>
            {error && <p className="text-sm px-4 py-3 rounded-xl bg-red-50 text-red-600">{error}</p>}
            <button onClick={save} disabled={loading} className="w-full bg-indigo-900 text-white py-3 rounded-xl font-medium hover:bg-indigo-800 disabled:opacity-50 text-sm">
              {loading ? 'Saving…' : 'Save new password'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
