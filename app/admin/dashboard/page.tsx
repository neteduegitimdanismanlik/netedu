'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const ADMIN_EMAIL = 'neteduegitimdanismanlik@gmail.com'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [portfolioItems, setPortfolioItems] = useState<any[]>([])
  const [casProofs, setCasProofs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('portfolio')
  const [actionNote, setActionNote] = useState<any>({})
  const [processing, setProcessing] = useState<string | null>(null)

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
    const { data: portfolio } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setPortfolioItems(portfolio || [])

    const { data: proofs } = await supabase
      .from('cas_proofs')
      .select('*, cas_events(title, cas_category, location, event_date)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setCasProofs(proofs || [])
    setLoading(false)
  }

  async function approvePortfolio(id: string) {
    setProcessing(id)
    await supabase.from('portfolio_items').update({ status: 'approved' }).eq('id', id)
    await loadAll()
    setProcessing(null)
  }

  async function rejectPortfolio(id: string) {
    setProcessing(id)
    await supabase.from('portfolio_items').update({ status: 'rejected' }).eq('id', id)
    await loadAll()
    setProcessing(null)
  }

  async function approveCasProof(id: string) {
    setProcessing(id)
    await supabase.from('cas_proofs').update({ status: 'approved' }).eq('id', id)
    await loadAll()
    setProcessing(null)
  }

  async function rejectCasProof(id: string) {
    setProcessing(id)
    await supabase.from('cas_proofs').update({ status: 'rejected' }).eq('id', id)
    await loadAll()
    setProcessing(null)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>

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
          <p className="text-sm text-gray-500">Review and approve pending submissions.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-yellow-200 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{portfolioItems.length}</div>
            <div className="text-sm text-gray-500">Portfolio items pending</div>
          </div>
          <div className="bg-white rounded-2xl border border-yellow-200 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{casProofs.length}</div>
            <div className="text-sm text-gray-500">CAS proofs pending</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('portfolio')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'portfolio' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            Portfolio ({portfolioItems.length})
          </button>
          <button onClick={() => setTab('cas')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'cas' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            CAS Proofs ({casProofs.length})
          </button>
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
                  <button onClick={() => rejectPortfolio(item.id)} disabled={processing === item.id}
                    className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm hover:bg-red-50 disabled:opacity-50">
                    ❌ Reject
                  </button>
                  <button onClick={() => approvePortfolio(item.id)} disabled={processing === item.id}
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
                  <button onClick={() => rejectCasProof(proof.id)} disabled={processing === proof.id}
                    className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm hover:bg-red-50 disabled:opacity-50">
                    ❌ Reject
                  </button>
                  <button onClick={() => approveCasProof(proof.id)} disabled={processing === proof.id}
                    className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 disabled:opacity-50">
                    ✅ Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}