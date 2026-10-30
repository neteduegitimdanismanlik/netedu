'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ConsentFields, { emptyConsent, validateConsent, consentMetadata, isMinor } from '../components/ConsentFields'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(emptyConsent)

  async function handleSubmit() {
    setLoading(true)
    setMessage('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else window.location.href = '/dashboard'
    } else {
      const invalid = validateConsent(consent, email)
      if (invalid) {
        setMessage(invalid)
        setLoading(false)
        return
      }
      // The consent travels as signup metadata; a database trigger stores it
      // in public.consents (see sql/consents.sql).
      //
      // We confirm by e-mailed link rather than a typed code: a 6-digit code
      // would need the "Confirm signup" template's body rewritten to include
      // {{ .Token }}, which Supabase only allows once custom SMTP is
      // configured — a real setup step (a sending provider, API key, DNS)
      // we're not requiring just to ship this. The default template already
      // works and just needs the link to land somewhere useful.
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: consentMetadata(consent),
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) setMessage(error.message)
      else {
        setMessage(
          isMinor(consent)
            ? "Account created! Check your email and click the confirmation link to finish signing up — we'll also e-mail your parent for approval."
            : 'Account created! Check your email and click the confirmation link to finish signing up.'
        )
      }
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-md shadow-sm">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {isLogin ? 'Continue your university journey.' : 'Start your path to your dream university.'}
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {!isLogin && <ConsentFields value={consent} onChange={setConsent} />}

          {message && (
            <div className={`text-sm px-4 py-3 rounded-xl ${message.includes('created') || message.includes('sent') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-900 text-white py-3 rounded-xl font-medium hover:bg-indigo-800 disabled:opacity-50 text-sm"
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Create account'}
          </button>

          <button
            onClick={() => {
              setIsLogin(!isLogin)
              // A password typed into one mode (say, a mistyped login
              // attempt) used to still be sitting in the field after
              // switching to sign-up or back — visible, and submittable
              // against the wrong flow.
              setPassword('')
              setMessage('')
            }}
            className="text-sm text-gray-500 hover:text-indigo-900 text-center transition-colors"
          >
            {isLogin ? 'No account? Sign up' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </main>
  )
}