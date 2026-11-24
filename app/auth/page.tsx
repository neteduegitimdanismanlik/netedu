'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ConsentFields, { emptyConsent, validateConsent, consentMetadata, isMinor } from '../components/ConsentFields'

/**
 * Sign in, sign up and "forgot password".
 *
 * Sign-up confirmation and password-reset e-mails are sent by Supabase, not
 * by our code. They only reach real users once Supabase > Authentication >
 * SMTP Settings points at Resend (see lib/email-config.ts) — Supabase's
 * built-in sender delivers to project team members only.
 */

type Mode = 'login' | 'signup' | 'forgot'

/**
 * Supabase rejects an address with a stray space ("Unable to validate email
 * address: invalid format") — and phone keyboards add one after autocomplete.
 * Strip whitespace and invisible characters before every call.
 */
function cleanEmail(raw: string): string {
  return raw.replace(/[\s\u200B-\u200D\uFEFF]/g, '').toLowerCase()
}

function friendly(message: string): string {
  if (/invalid format|validate email/i.test(message)) return 'That e-mail address doesn\'t look right. Check it for typos.'
  if (/already registered|already been registered/i.test(message)) return 'This e-mail already has an account. Log in instead, or use "Forgot password?".'
  return message
}
type Note = { kind: 'ok' | 'error'; text: string } | null

export default function Auth() {
  const [rawEmail, setRawEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState<Note>(null)
  const [consent, setConsent] = useState(emptyConsent)
  // Offered after sign-up, or when a login fails because the address isn't confirmed yet.
  const [canResend, setCanResend] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    // A password typed into one mode shouldn't still be sitting there,
    // submittable, after switching to another.
    setPassword('')
    setNote(null)
    setCanResend(false)
  }

  async function resendConfirmation() {
    const email = cleanEmail(rawEmail)
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })
    setNote(
      error
        ? { kind: 'error', text: friendly(error.message) }
        : { kind: 'ok', text: `We sent the confirmation link to ${email} again. Check your spam folder too.` }
    )
    setLoading(false)
  }

  async function handleSubmit() {
    const email = cleanEmail(rawEmail)
    setRawEmail(email)
    setLoading(true)
    setNote(null)
    setCanResend(false)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error) {
        window.location.href = '/dashboard'
        return
      }
      if (/not confirmed/i.test(error.message)) {
        setNote({ kind: 'error', text: "Your e-mail address isn't confirmed yet. Click the link in the e-mail we sent you — or send it again below." })
        setCanResend(true)
      } else if (/invalid login credentials/i.test(error.message)) {
        setNote({ kind: 'error', text: 'Wrong e-mail or password.' })
      } else {
        setNote({ kind: 'error', text: friendly(error.message) })
      }
    } else if (mode === 'forgot') {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setNote({ kind: 'error', text: 'Enter the e-mail address you signed up with.' })
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset`,
        })
        setNote(
          error
            ? { kind: 'error', text: friendly(error.message) }
            : { kind: 'ok', text: `If ${email} has a NetEdu account, a link to set a new password is on its way. Check your spam folder too.` }
        )
      }
    } else {
      const invalid = !/^[^@]+@[^@]+\.[a-z]{2,}$/.test(email)
        ? "That e-mail address doesn't look right. Check it for typos."
        : validateConsent(consent, email)
      if (invalid) {
        setNote({ kind: 'error', text: invalid })
        setLoading(false)
        return
      }
      // The consent travels as signup metadata; a database trigger stores it
      // in public.consents (see sql/consents.sql).
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: consentMetadata(consent),
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) {
        setNote({ kind: 'error', text: friendly(error.message) })
      } else if (data.session) {
        // E-mail confirmation is switched off in Supabase: already signed in.
        window.location.href = '/dashboard'
        return
      } else {
        setNote({
          kind: 'ok',
          text: isMinor(consent)
            ? `Almost done! We sent a confirmation link to ${email} — click it to finish signing up. We'll also e-mail your parent for approval.`
            : `Almost done! We sent a confirmation link to ${email} — click it to finish signing up.`,
        })
        setCanResend(true)
      }
    }
    setLoading(false)
  }

  const title = mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset your password'
  const subtitle =
    mode === 'login'
      ? 'Continue your university journey.'
      : mode === 'signup'
        ? 'Start your path to your dream university.'
        : "Enter your e-mail and we'll send you a link to set a new password."
  const button = mode === 'login' ? 'Login' : mode === 'signup' ? 'Create account' : 'Send reset link'

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-md shadow-sm">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-8">{subtitle}</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={rawEmail}
              onChange={e => setRawEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                {mode === 'login' && (
                  <button type="button" onClick={() => switchMode('forgot')} className="text-xs text-indigo-700 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !loading && mode === 'login' && handleSubmit()}
                placeholder="At least 6 characters"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          )}

          {mode === 'signup' && <ConsentFields value={consent} onChange={setConsent} />}

          {note && (
            <div className={`text-sm px-4 py-3 rounded-xl ${note.kind === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {note.text}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-900 text-white py-3 rounded-xl font-medium hover:bg-indigo-800 disabled:opacity-50 text-sm"
          >
            {loading ? 'Loading...' : button}
          </button>

          {canResend && (
            <button
              type="button"
              onClick={resendConfirmation}
              disabled={loading}
              className="text-sm text-indigo-700 hover:underline disabled:opacity-50"
            >
              Didn&apos;t get the e-mail? Send it again
            </button>
          )}

          {mode === 'forgot' ? (
            <button onClick={() => switchMode('login')} className="text-sm text-gray-500 hover:text-indigo-900 text-center transition-colors">
              Back to login
            </button>
          ) : (
            <button
              onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm text-gray-500 hover:text-indigo-900 text-center transition-colors"
            >
              {mode === 'login' ? 'No account? Sign up' : 'Already have an account? Login'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
