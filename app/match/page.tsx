'use client'
import { useState } from 'react'
import Link from 'next/link'
import { authHeaders } from '@/lib/session'
import Navbar from '../components/Navbar'
import { SUBJECT_AREAS, COVERED_COUNTRIES } from '../universities'

/**
 * University matching.
 *
 * Nothing on this page is generated. Every requirement shown was read off an
 * official university page, and every card carries the date it was checked so
 * a student can see how fresh it is.
 *
 * Every field below is optional on purpose. A student on the Turkish national
 * curriculum, or one who has not sat IELTS yet, still gets a useful answer —
 * missing information comes back as "add this to sharpen it", never as a
 * rejection.
 */

const verdictStyle: Record<string, string> = {
  match: 'bg-blue-50 text-blue-700 border-blue-200',
  safety: 'bg-green-50 text-green-700 border-green-200',
  reach: 'bg-amber-50 text-amber-700 border-amber-200',
  unknown: 'bg-gray-50 text-gray-600 border-gray-200',
}

const verdictLabel: Record<string, string> = {
  match: 'Match',
  safety: 'Safety',
  reach: 'Reach',
  unknown: 'Needs more information',
}

export default function Match() {
  const [area, setArea] = useState('')
  const [country, setCountry] = useState('')
  const [ibPredicted, setIbPredicted] = useState('')
  const [hlSubjects, setHlSubjects] = useState('')
  const [mebAverage, setMebAverage] = useState('')
  const [ielts, setIelts] = useState('')
  const [budget, setBudget] = useState('')
  const [needsYok, setNeedsYok] = useState(false)

  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function getMatches() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
      body: JSON.stringify({
        area,
        country: country || undefined,
        ibPredicted: ibPredicted || undefined,
        hlSubjects: hlSubjects
          ? hlSubjects.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
        mebAverage: mebAverage || undefined,
        ielts: ielts || undefined,
        budgetPerYear: budget || undefined,
        budgetCurrency: 'EUR',
        needsYok,
      }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(res.status === 401 ? 'Sign in to see your matches.' : data.error || 'Could not load your matches.')
      return
    }
    setResult(data)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">University Matches</h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Matched against requirements read from each university&apos;s own admissions pages — not estimates.
          Fill in what you have; everything here is optional.
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col gap-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject area <span className="text-red-500">*</span>
                </label>
                <select value={area} onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                  <option value="">Select a subject</option>
                  {SUBJECT_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                  <option value="">All countries we cover</option>
                  {COVERED_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Predicted IB total</label>
                <input type="number" min={24} max={45} value={ibPredicted} onChange={(e) => setIbPredicted(e.target.value)}
                  placeholder="38" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Turkish diploma <span className="text-gray-400 font-normal">/100</span>
                </label>
                <input type="number" value={mebAverage} onChange={(e) => setMebAverage(e.target.value)}
                  placeholder="88" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IELTS</label>
                <input type="number" step="0.5" value={ielts} onChange={(e) => setIelts(e.target.value)}
                  placeholder="7.0" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Higher Level subjects</label>
              <input value={hlSubjects} onChange={(e) => setHlSubjects(e.target.value)}
                placeholder="Mathematics AA, Physics, Economics"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Separate them with commas. This matters more than your total — a missing HL subject can rule a course out entirely,
                and we would rather tell you now than after you have spent a choice on it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tuition budget <span className="text-gray-400 font-normal">€ per year</span>
                </label>
                <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)}
                  placeholder="20000" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 pb-2.5">
                <input type="checkbox" checked={needsYok} onChange={(e) => setNeedsYok(e.target.checked)} className="w-4 h-4" />
                I plan to return to Turkey (YÖK recognition matters)
              </label>
            </div>

            <button onClick={getMatches} disabled={loading || !area}
              className="w-full bg-indigo-900 text-white py-3 rounded-xl font-medium text-sm disabled:opacity-50 hover:bg-indigo-800">
              {loading ? 'Matching…' : 'Find my universities'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {result?.notCovered && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <p className="text-sm text-amber-900 font-medium mb-1">We do not hold data for {result.notCovered} yet</p>
            <p className="text-xs text-amber-800 leading-relaxed">{result.coverageNote}</p>
          </div>
        )}

        {result?.universities?.length > 0 && (
          <div className="flex flex-col gap-4">
            {result.universities.map((u: any) => (
              <div key={u.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{u.name}</h3>
                    <p className="text-xs text-gray-400">{u.city} · {u.country}{u.course ? ` · ${u.course}` : ''}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${verdictStyle[u.verdict] || verdictStyle.unknown}`}>
                    {verdictLabel[u.verdict] || u.verdict}
                  </span>
                </div>

                {u.headline && (
                  <p className="text-xs text-indigo-800 bg-indigo-50 rounded-lg px-3 py-2 mb-3 leading-relaxed">{u.headline}</p>
                )}

                <ul className="flex flex-col gap-1.5 mb-3">
                  {u.reasons.map((r: string, i: number) => (
                    <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                      <span className="text-gray-300 shrink-0">·</span>{r}
                    </li>
                  ))}
                </ul>

                {u.missing?.length > 0 && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
                    {u.missing.map((m: string, i: number) => (
                      <p key={i} className="text-xs text-gray-500 leading-relaxed">{m}</p>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 border-t border-gray-100 pt-3">
                  {u.tuition && <span>💶 {u.tuition}</span>}
                  {u.language && <span>🗣 {u.language}</span>}
                  {u.admissionsTest && <span>📝 {u.admissionsTest}</span>}
                  <span>Checked {u.checkedOn} · {u.cycle}</span>
                  {u.source && (
                    <a href={u.source} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
                      Official page
                    </a>
                  )}
                </div>
              </div>
            ))}

            {result.locked > 0 && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
                <div className="text-2xl mb-2">🔒</div>
                <p className="text-sm font-medium text-gray-700 mb-1">{result.locked} more matches</p>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Free shows one Reach, one Match and one Safety. Pro shows every university we hold for your subject.
                </p>
                <Link href="/pricing" className="inline-block bg-indigo-900 text-white text-sm px-6 py-2.5 rounded-xl">See Pro →</Link>
              </div>
            )}
          </div>
        )}

        {result?.notEligible?.length > 0 && (
          <div className="bg-white rounded-2xl border border-red-100 p-6 mt-6">
            <h2 className="font-semibold text-gray-800 mb-1">Closed to you as things stand</h2>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              These are not long shots — the application cannot be made. Worth knowing before you spend a choice on one.
            </p>
            <div className="flex flex-col gap-3">
              {result.notEligible.map((n: any, i: number) => (
                <div key={i} className="border-l-2 border-red-200 pl-3">
                  <p className="text-sm font-medium text-gray-700">{n.name}{n.course ? ` · ${n.course}` : ''}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{n.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && result.universities?.length === 0 && !result.notCovered && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-sm text-gray-500">
              No university in our tables runs {result.area} in a form you can apply to
              {result.country ? ` in ${result.country}` : ''}. Try removing the country filter.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
