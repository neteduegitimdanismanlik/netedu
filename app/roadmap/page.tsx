'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '../components/Navbar'
import Link from 'next/link'

const catColors: any = {
  'Academic': 'bg-blue-50 text-blue-700 border-blue-200',
  'Test Prep': 'bg-purple-50 text-purple-700 border-purple-200',
  'Portfolio': 'bg-green-50 text-green-700 border-green-200',
  'Research': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Activities': 'bg-red-50 text-red-700 border-red-200',
  'Applications': 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

const yearColors = [
  { dot: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200' },
  { dot: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50', border: 'border-green-200' },
  { dot: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200' },
  { dot: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200' },
]

export default function Roadmap() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [roadmap, setRoadmap] = useState<any>(null)
  const [progress, setProgress] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [activeYear, setActiveYear] = useState(0)
  const [activePeriod, setActivePeriod] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = '/auth'; return }
      setUser(data.user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      setProfile(p)
      if (p?.full_roadmap) setRoadmap(p.full_roadmap)
      setProgress(p?.roadmap_progress || [])
      setLoading(false)
    })
  }, [])

  function totalYearsFor(p: any) {
    const g = parseInt(String(p.grade).replace(/\D/g, '')) || 9
    return Math.max(1, Math.min(4, 13 - g))
  }

  async function fetchYear(yearIndex: number, totalYears: number) {
    const res = await fetch('/api/full-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, yearIndex, totalYears })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    if (!data.year?.periods) throw new Error('Incomplete response')
    return data.year
  }

  async function save(next: any) {
    setRoadmap(next)
    const res = await fetch('/api/full-roadmap', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, roadmap: next })
    })
    const d = await res.json()
    if (d.error) setError(`Could not save: ${d.error}`)
  }

  async function startRoadmap() {
    setBusy(true); setError(''); setStatus('Building your first year...')
    const totalYears = totalYearsFor(profile)
    try {
      const y = await fetchYear(0, totalYears)
      await save({
        totalYears,
        overview: `A ${totalYears}-year plan for ${profile.target_university} — ${profile.target_department}. Years unlock as you go.`,
        years: [y]
      })
      setProgress([])
    } catch (e: any) {
      setError(e.message)
    }
    setStatus(''); setBusy(false)
  }

  async function unlockYear(index: number) {
    setBusy(true); setError(''); setStatus(`Building year ${index + 1}...`)
    const totalYears = roadmap.totalYears || totalYearsFor(profile)
    try {
      const y = await fetchYear(index, totalYears)
      const years = [...roadmap.years]
      years[index] = y
      await save({ ...roadmap, years })
      setActiveYear(index)
      setActivePeriod(null)
    } catch (e: any) {
      setError(e.message)
    }
    setStatus(''); setBusy(false)
  }

  async function toggle(key: string) {
    const next = progress.includes(key) ? progress.filter(p => p !== key) : [...progress, key]
    setProgress(next)
    await fetch('/api/full-roadmap', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, progress: next })
    })
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>

  if (!profile?.gpa || !profile?.target_university) return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🗺</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Build your profile first</h1>
        <p className="text-sm text-gray-500 mb-6">Your roadmap is generated from your grade, GPA and target university.</p>
        <Link href="/onboarding" className="inline-block bg-indigo-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-800">
          Complete my profile →
        </Link>
      </div>
    </main>
  )

  if (!roadmap) return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🗺</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your long-term roadmap</h1>
        <p className="text-sm text-gray-500 mb-2">{profile.grade} · GPA {profile.gpa} · {profile.target_university}</p>
        <p className="text-xs text-gray-400 mb-8">We build your current year first — later years unlock when you need them.</p>
        <button onClick={startRoadmap} disabled={busy}
          className="bg-indigo-900 text-white px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-indigo-800 disabled:opacity-50">
          {busy ? (status || 'Building...') : 'Start my roadmap →'}
        </button>
        {error && <p className="text-xs text-red-500 mt-4">{error}</p>}
      </div>
    </main>
  )

  const totalYears = roadmap.totalYears || roadmap.years.length
  const year = roadmap.years?.[activeYear]
  const allTasks = roadmap.years?.flatMap((y: any, yi: number) =>
    y?.periods?.flatMap((p: any, pi: number) => p.tasks?.map((_: any, ti: number) => `${yi}-${pi}-${ti}`)) || []
  ) || []
  const donePct = allTasks.length ? Math.round((progress.length / allTasks.length) * 100) : 0

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Roadmap</h1>
            <p className="text-sm text-gray-500">{profile.grade} → {profile.target_university} · {profile.target_department}</p>
          </div>
          <button onClick={() => unlockYear(activeYear)} disabled={busy}
            className="text-xs border border-gray-200 px-3 py-2 rounded-xl text-gray-500 hover:bg-white disabled:opacity-50">
            {busy ? (status || '...') : '↻ Redo this year'}
          </button>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
            <p className="text-xs text-amber-700">⚠ {error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-indigo-100 p-5 mb-6">
          <p className="text-sm text-gray-600 leading-relaxed">{roadmap.overview}</p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-2 bg-gray-100 rounded-full">
              <div className="h-full bg-indigo-900 rounded-full transition-all" style={{ width: `${donePct}%` }}></div>
            </div>
            <span className="text-xs font-medium text-indigo-900">{progress.length}/{allTasks.length} done</span>
          </div>
        </div>

        <div className="relative mb-8">
          <div className="absolute top-7 left-0 right-0 h-2 bg-gray-200 rounded-full z-0"></div>
          <div className="relative z-10 flex justify-around">
            {Array.from({ length: totalYears }).map((_, i) => {
              const c = yearColors[i % yearColors.length]
              const built = !!roadmap.years?.[i]
              const active = activeYear === i && built
              return (
                <button key={i}
                  onClick={() => built ? (setActiveYear(i), setActivePeriod(null)) : unlockYear(i)}
                  disabled={busy}
                  className="flex flex-col items-center gap-2 disabled:opacity-60">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all ${active ? c.dot + ' scale-110' : built ? 'bg-gray-300' : 'bg-white border-2 border-dashed border-gray-300 text-gray-400'}`}>
                    {built ? i + 1 : '+'}
                  </div>
                  <span className={`text-xs font-semibold text-center ${active ? c.text : 'text-gray-400'}`}>
                    {built ? roadmap.years[i].label : `Year ${i + 1} · unlock`}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {year?.focus && (
          <div className={`${yearColors[activeYear % 4].light} ${yearColors[activeYear % 4].border} border rounded-2xl p-4 mb-4`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">This year's priority</p>
            <p className="text-sm text-gray-700">{year.focus}</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {year?.periods?.map((p: any, pi: number) => {
            const c = yearColors[activeYear % 4]
            const open = activePeriod === p.period
            const doneCount = p.tasks?.filter((_: any, ti: number) => progress.includes(`${activeYear}-${pi}-${ti}`)).length || 0
            return (
              <button key={pi} onClick={() => setActivePeriod(open ? null : p.period)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${open ? `${c.border} ${c.light}` : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <div className={`text-xs font-bold mb-1 ${open ? c.text : 'text-gray-400'}`}>{p.period}</div>
                <div className="text-xs text-gray-500">{doneCount}/{p.tasks?.length || 0} done</div>
                <div className={`mt-2 text-lg ${open ? '' : 'opacity-30'}`}>{open ? '▼' : '▶'}</div>
              </button>
            )
          })}
        </div>

        {activePeriod && year ? (
          <div className={`${yearColors[activeYear % 4].light} ${yearColors[activeYear % 4].border} border-2 rounded-2xl p-6`}>
            <h3 className={`font-semibold ${yearColors[activeYear % 4].text} mb-4`}>{year.label} · {activePeriod}</h3>
            <div className="flex flex-col gap-3">
              {year.periods.find((p: any) => p.period === activePeriod)?.tasks?.map((t: any, ti: number) => {
                const pi = year.periods.findIndex((p: any) => p.period === activePeriod)
                const key = `${activeYear}-${pi}-${ti}`
                const done = progress.includes(key)
                return (
                  <div key={ti} onClick={() => toggle(key)}
                    className={`flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 cursor-pointer transition-all ${done ? 'opacity-60' : 'hover:shadow-sm'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${done ? 'bg-indigo-900 border-indigo-900' : 'border-gray-300'}`}>
                      {done && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{t.task}</p>
                      {t.why && <p className="text-xs text-gray-400 mt-1">💡 {t.why}</p>}
                    </div>
                    {t.category && (
                      <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${catColors[t.category] || 'bg-gray-50 text-gray-500'}`}>
                        {t.category}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <div className="text-4xl mb-3">👆</div>
            <p className="text-sm text-gray-500">Select a period above to see your tasks</p>
          </div>
        )}
      </div>
    </main>
  )
}