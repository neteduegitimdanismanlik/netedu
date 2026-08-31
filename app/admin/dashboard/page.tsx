'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { signRows } from '@/lib/storage'
import Link from 'next/link'

const ADMIN_EMAIL = 'neteduegitimdanismanlik@gmail.com'

/** accepted_universities / rejected_universities may be a text[] or a plain string. */
function asList(v: any): string {
  if (v === null || v === undefined || v === '') return '—'
  if (Array.isArray(v)) return v.length ? v.join(', ') : '—'
  return String(v)
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [portfolioItems, setPortfolioItems] = useState<any[]>([])
  const [casProofs, setCasProofs] = useState<any[]>([])
  const [alumniItems, setAlumniItems] = useState<any[]>([])
  const [admissionItems, setAdmissionItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('portfolio')
  const [actionNote, setActionNote] = useState<any>({})
  const [processing, setProcessing] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user || data.user.email !== ADMIN_EMAIL) {
        window.location.href = '/dashboard'
        return
      }
      setUser(data.user)
      await loadAll()
    })
  }, [])

  async function loadAll() {
    setLoading(true)
    setNotice(null)

    const { data: portfolio, error: pErr } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (pErr) setNotice('Portfolio could not be loaded: ' + pErr.message)
    // Buckets are private: swap stored paths for short-lived signed URLs.
    setPortfolioItems(await signRows(portfolio || [], 'portfolio-files', 'file_url'))

    const { data: proofs, error: cErr } = await supabase
      .from('cas_proofs')
      .select('*, cas_events(title, cas_category, location, event_date)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (cErr) setNotice('CAS proofs could not be loaded: ' + cErr.message)
    setCasProofs(await signRows(proofs || [], 'cas-proofs', 'photo_url'))

    // Only the count is shown here — alumni curation lives on /admin/alumni.
    const { data: alumni, error: aErr } = await supabase
      .from('alumni_submissions')
      .select('id, status')
      .order('created_at', { ascending: false })
    if (aErr) setNotice('Alumni submissions could not be loaded: ' + aErr.message)
    setAlumniItems(alumni || [])

    const { data: admissions, error: dErr } = await supabase
      .from('admission_data')
      .select('*')
      .order('created_at', { ascending: false })
    if (dErr) setNotice('Admission stories could not be loaded: ' + dErr.message)
    setAdmissionItems(admissions || [])

    setLoading(false)
  }

  const alumniPending = alumniItems.filter(a => !a.status || a.status === 'pending')

  async function setPortfolioStatus(id: string, status: string) {
    setProcessing(id)
    setNotice(null)
    try {
      const res = await fetch('/api/portfolio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: id, status })
      })
      if (!res.ok) setNotice('Portfolio item could not be updated (HTTP ' + res.status + ').')
    } catch (e: any) {
      setNotice('Portfolio item could not be updated: ' + (e?.message || 'network error'))
    }
    await loadAll()
    setProcessing(null)
  }

  async function setCasProofStatus(id: string, status: string) {
    setProcessing(id)
    setNotice(null)
    const { error } = await supabase.from('cas_proofs').update({ status }).eq('id', id)
    if (error) setNotice('CAS proof could not be updated: ' + error.message)
    await loadAll()
    setProcessing(null)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>

  const tabBtn = (key: string, label: string) => (
    <button onClick={() => setTab(key)}
      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === key ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
      {label}
    </button>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu Admin</span>
        </div>
        <Link href="/dashboard" className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">← Back to dashboard</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Panel</h1>
          <p className="text-sm text-gray-500">Review submissions and browse alumni data.</p>
        </div>

        {notice && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start justify-between gap-4">
            <span>{notice}</span>
            <button onClick={() => setNotice(null)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-yellow-200 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{portfolioItems.length}</div>
            <div className="text-sm text-gray-500">Portfolio items pending</div>
          </div>
          <div className="bg-white rounded-2xl border border-yellow-200 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{casProofs.length}</div>
            <div className="text-sm text-gray-500">CAS proofs pending</div>
          </div>
          <Link href="/admin/alumni" className="bg-white rounded-2xl border border-yellow-200 p-6 text-center hover:border-yellow-400 transition-colors">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{alumniPending.length}</div>
            <div className="text-sm text-gray-500">Alumni IAs pending →</div>
          </Link>
          <div className="bg-white rounded-2xl border border-indigo-200 p-6 text-center">
            <div className="text-3xl font-bold text-indigo-900 mb-1">{admissionItems.length}</div>
            <div className="text-sm text-gray-500">Admission stories</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabBtn('portfolio', `Portfolio (${portfolioItems.length})`)}
          {tabBtn('cas', `CAS Proofs (${casProofs.length})`)}
          {tabBtn('admission', `Admission Stories (${admissionItems.length})`)}
        </div>

        {tab === 'portfolio' && (
          <div className="flex flex-col gap-4">
            {portfolioItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-semibold text-gray-800">All caught up!</h3>
                <p className="text-sm text-gray-500 mt-1">No pending portfolio items.</p>
              </div>
            ) : portfolioItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full">{item.type}</span>
                      {item.ai_category && <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-1 rounded-full">{item.ai_category}</span>}
                    </div>
                  </div>
                  {item.ai_score && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-900">{item.ai_score}</div>
                      <div className="text-xs text-gray-400">AI Score</div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                {item.ai_feedback && (
                  <div className="bg-indigo-50 rounded-xl p-3 mb-3">
                    <p className="text-xs font-medium text-indigo-700 mb-1">AI Feedback</p>
                    <p className="text-xs text-indigo-600">{item.ai_feedback}</p>
                  </div>
                )}
                {item.file_url && (
                  <a href={item.file_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-700 hover:underline mb-4 block">
                    📎 View proof document
                  </a>
                )}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Note to student (optional)</label>
                  <input
                    value={actionNote[item.id] || ''}
                    onChange={e => setActionNote({ ...actionNote, [item.id]: e.target.value })}
                    placeholder="Add a note..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setPortfolioStatus(item.id, 'rejected')} disabled={processing === item.id}
                    className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm hover:bg-red-50 disabled:opacity-50">
                    ❌ Reject
                  </button>
                  <button onClick={() => setPortfolioStatus(item.id, 'approved')} disabled={processing === item.id}
                    className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 disabled:opacity-50">
                    ✅ Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'cas' && (
          <div className="flex flex-col gap-4">
            {casProofs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-semibold text-gray-800">All caught up!</h3>
                <p className="text-sm text-gray-500 mt-1">No pending CAS proofs.</p>
              </div>
            ) : casProofs.map((proof) => (
              <div key={proof.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{proof.cas_events?.title}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {proof.cas_events?.cas_category && (
                        <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">{proof.cas_events.cas_category}</span>
                      )}
                      <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full">⏳ Pending</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">👥 {proof.participant_count} participants</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {proof.cas_events?.location && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-400">📍 Location</p>
                      <p className="text-xs font-medium text-gray-700">{proof.cas_events.location}</p>
                    </div>
                  )}
                  {proof.cas_events?.event_date && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-400">📅 Date</p>
                      <p className="text-xs font-medium text-gray-700">{proof.cas_events.event_date}</p>
                    </div>
                  )}
                </div>

                {proof.notes && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Notes from organizer</p>
                    <p className="text-xs text-gray-600">{proof.notes}</p>
                  </div>
                )}

                {proof.photo_url && (
                  <div className="mb-4">
                    <a href={proof.photo_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-700 hover:underline mb-2 block">
                      📷 View event photos
                    </a>
                    <img src={proof.photo_url} alt="Event proof" className="w-full max-h-48 object-cover rounded-xl border border-gray-100" />
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setCasProofStatus(proof.id, 'rejected')} disabled={processing === proof.id}
                    className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm hover:bg-red-50 disabled:opacity-50">
                    ❌ Reject
                  </button>
                  <button onClick={() => setCasProofStatus(proof.id, 'approved')} disabled={processing === proof.id}
                    className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 disabled:opacity-50">
                    ✅ Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}


        {tab === 'admission' && (
          <div className="flex flex-col gap-4">
            {admissionItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-4xl mb-3">🏛️</div>
                <h3 className="font-semibold text-gray-800">No admission stories yet</h3>
                <p className="text-sm text-gray-500 mt-1">Stories shared through /contribute will appear here.</p>
              </div>
            ) : admissionItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-3 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{item.full_name || 'Anonymous'}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {item.graduation_year && <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-1 rounded-full">Class of {item.graduation_year}</span>}
                      {item.diploma_type && <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full">{item.diploma_type}</span>}
                      {item.scholarship && <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">💰 {item.scholarship}</span>}
                      {item.consent === false && (
                        <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-full">⚠️ No consent — do not reuse</span>
                      )}
                    </div>
                  </div>
                  {item.enrolled_university && (
                    <div className="text-right shrink-0 max-w-[45%]">
                      <div className="text-xs text-gray-400 mb-0.5">Enrolled at</div>
                      <div className="text-sm font-semibold text-indigo-900">{item.enrolled_university}</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">GPA / IB</p>
                    <p className="text-xs font-medium text-gray-700">{item.gpa_or_ib || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">SAT</p>
                    <p className="text-xs font-medium text-gray-700">{item.sat || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">English test</p>
                    <p className="text-xs font-medium text-gray-700">{item.english_test || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">High school</p>
                    <p className="text-xs font-medium text-gray-700">{item.high_school || '—'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-xs font-medium text-green-800 mb-1">✅ Accepted</p>
                    <p className="text-xs text-green-700">{asList(item.accepted_universities)}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                    <p className="text-xs font-medium text-red-800 mb-1">❌ Rejected</p>
                    <p className="text-xs text-red-700">{asList(item.rejected_universities)}</p>
                  </div>
                </div>

                {item.activities && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Activities</p>
                    <p className="text-xs text-gray-600 whitespace-pre-wrap">{asList(item.activities)}</p>
                  </div>
                )}

                {item.wish_i_knew && (
                  <div className="bg-indigo-50 rounded-xl p-3 mb-3">
                    <p className="text-xs font-medium text-indigo-700 mb-1">💡 Wish I knew</p>
                    <p className="text-xs text-indigo-600 whitespace-pre-wrap">{item.wish_i_knew}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                  <span>{item.email || 'no email'}</span>
                  <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}