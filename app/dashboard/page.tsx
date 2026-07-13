'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [parentEmail, setParentEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState('')
  const [showInvite, setShowInvite] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) window.location.href = '/auth'
      else {
        setUser(data.user)
        const { data: profileData } = await supabase
          .from('profiles').select('*').eq('id', data.user.id).single()
        setProfile(profileData)
      }
    })
  }, [])

  async function inviteParent() {
    if (!parentEmail) return
    setInviting(true)
    const { data: existing } = await supabase
      .from('parent_links')
      .select('*')
      .eq('student_id', user.id)
      .eq('parent_email', parentEmail)
      .single()

    if (!existing) {
      await supabase.from('parent_links').insert({
        student_id: user.id,
        parent_email: parentEmail,
        status: 'accepted'
      })
    }

    await fetch('/api/parent-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentEmail, studentName: profile?.grade || 'your child' })
    })

    setInviteSuccess(`Invitation sent to ${parentEmail}!`)
    setParentEmail('')
    setShowInvite(false)
    setInviting(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden sm:block">{user?.email}</span>
          <button onClick={signOut} className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Sign out</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back! 👋</h1>
          <p className="text-sm text-gray-500">Your university journey dashboard.</p>
        </div>

        {inviteSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-700">✅ {inviteSuccess}</p>
          </div>
        )}

        {profile && (
          <div className="bg-white rounded-2xl border border-indigo-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Your Profile</h2>
              <Link href="/onboarding" className="text-xs text-indigo-700 hover:underline">Update →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-indigo-900">{profile.gpa}</div>
                <div className="text-xs text-gray-400">GPA</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-sm font-bold text-indigo-700">{profile.grade}</div>
                <div className="text-xs text-gray-400">Grade</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-sm font-bold text-gray-700 truncate">{profile.target_university || '—'}</div>
                <div className="text-xs text-gray-400">Target University</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-sm font-bold text-gray-700 truncate">{profile.target_department || '—'}</div>
                <div className="text-xs text-gray-400">Department</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Roadmap</h2>
            <p className="text-sm text-gray-500 mb-4">Get your personalized step-by-step plan to reach your target university.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/onboarding" className="bg-indigo-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800 inline-block">
                {profile ? 'Update roadmap →' : 'Build my roadmap →'}
              </Link>
              <Link href="/roadmap" className="border border-indigo-900 text-indigo-900 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 inline-block">
                View 3-year plan →
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">University Match</h2>
            <p className="text-sm text-gray-500 mb-6">Find your Reach, Match and Safety universities.</p>
            <Link href="/match" className="bg-indigo-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800 inline-block">Find universities →</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-2">Portfolio</h2>
            <p className="text-sm text-gray-500 mb-4">Add your certificates and projects.</p>
            <Link href="/portfolio" className="text-xs bg-indigo-900 text-white px-3 py-1.5 rounded-full hover:bg-indigo-800 inline-block">View →</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-2">Alumni Corner</h2>
            <p className="text-sm text-gray-500 mb-4">Learn from students who got in.</p>
            <Link href="/alumni" className="text-xs bg-indigo-900 text-white px-3 py-1.5 rounded-full hover:bg-indigo-800 inline-block">View →</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-2">CAS Activities</h2>
            <p className="text-sm text-gray-500 mb-4">Find volunteer opportunities.</p>
            <Link href="/cas" className="text-xs bg-indigo-900 text-white px-3 py-1.5 rounded-full hover:bg-indigo-800 inline-block">View →</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-2">Coach Corner</h2>
            <p className="text-sm text-gray-500 mb-4">Essays, interviews, EE and oral exam prep.</p>
            <Link href="/coach" className="text-xs bg-indigo-900 text-white px-3 py-1.5 rounded-full hover:bg-indigo-800 inline-block">Open →</Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-semibold text-gray-800">Parent Panel</h2>
              <p className="text-sm text-gray-500 mt-0.5">Invite your parent to track your progress.</p>
            </div>
            <button onClick={() => setShowInvite(!showInvite)}
              className="text-xs bg-indigo-900 text-white px-3 py-1.5 rounded-full hover:bg-indigo-800">
              Invite parent →
            </button>
          </div>
          {showInvite && (
            <div className="mt-4 flex gap-3">
              <input value={parentEmail} onChange={e => setParentEmail(e.target.value)}
                placeholder="Parent's email address"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              <button onClick={inviteParent} disabled={inviting || !parentEmail}
                className="bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
                {inviting ? 'Sending...' : 'Send invite'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}