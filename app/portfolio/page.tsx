'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '../components/Navbar'

export default function Portfolio() {
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [score, setScore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('Certificate')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [success, setSuccess] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) window.location.href = '/auth'
      else { setUser(data.user); await load(data.user.id) }
    })
  }, [])

  async function load(userId: string) {
    setLoading(true)
    const res = await fetch(`/api/portfolio?userId=${userId}`)
    const data = await res.json()
    setItems(data.items || [])
    setScore(data.score)
    setLoading(false)
  }

  async function submit() {
    if (!title || !description || !file) return
    setSubmitting(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    await supabase.storage.from('portfolio-files').upload(fileName, file)
    const { data: urlData } = supabase.storage.from('portfolio-files').getPublicUrl(fileName)
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, type, description, userId: user.id, fileUrl: urlData.publicUrl })
    })
    const data = await res.json()
    if (data.success) {
      setSuccess('Submitted! Our team will review it shortly.')
      setTitle(''); setDescription(''); setFile(null); setShowForm(false)
      await load(user.id)
    }
    setSubmitting(false)
  }

  async function deleteItem(itemId: string) {
    if (!confirm('Delete this item?')) return
    setDeleting(itemId)
    await fetch(`/api/portfolio?itemId=${itemId}`, { method: 'DELETE' })
    await load(user.id)
    setDeleting(null)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Portfolio</h1>
            <p className="text-sm text-gray-500">Build your Academic Identity Score.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">+ Add item</button>
        </div>

        {score && (
          <div className="bg-white rounded-2xl border border-indigo-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">🏆 Academic Identity Score</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-indigo-900 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{score.total_score}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Overall score</p>
                <p className="text-xs text-gray-400">{items.length} portfolio items</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Academic', value: score.academic_score, color: 'bg-blue-500' },
                { label: 'Leadership', value: score.leadership_score, color: 'bg-purple-500' },
                { label: 'Projects', value: score.project_score, color: 'bg-yellow-500' },
                { label: 'Social', value: score.social_score, color: 'bg-red-500' },
              ].map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">{s.label}</span>
                    <span className="text-xs font-bold text-gray-700">{s.value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Add new item</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Google Python Certificate..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                  <option>Certificate</option><option>Project</option><option>Research</option><option>Award</option><option>Volunteering</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what you did..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-24" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proof document <span className="text-red-500">*</span></label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center ${file ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}>
                  <input type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {file ? <p className="text-sm text-indigo-700">{file.name}</p> : <p className="text-sm text-gray-500">Click to upload (image or PDF)</p>}
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm">Cancel</button>
                <button onClick={submit} disabled={submitting || !title || !description || !file} className="flex-1 bg-indigo-900 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit for review'}
                </button>
              </div>
            </div>
          </div>
        )}

        {success && <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"><p className="text-sm text-green-700">✅ {success}</p></div>}

        <div className="flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="text-4xl mb-3">📁</div>
              <h3 className="font-semibold text-gray-800 mb-2">No items yet</h3>
              <button onClick={() => setShowForm(true)} className="mt-4 bg-indigo-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium">Add first item</button>
            </div>
          ) : items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs px-2 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">{item.type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${item.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : item.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {item.status === 'pending' ? 'Pending review' : item.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {item.ai_score && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-900">{item.ai_score}</div>
                      <div className="text-xs text-gray-400">AI Score</div>
                    </div>
                  )}
                  {item.status === 'pending' && (
                    <button onClick={() => deleteItem(item.id)} disabled={deleting === item.id}
                      className="text-xs text-red-400 hover:text-red-600 border border-red-200 px-2 py-1 rounded-lg disabled:opacity-50">
                      {deleting === item.id ? '...' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>
              {item.file_url && <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-700 hover:underline">View proof</a>}
              {item.ai_feedback && (
                <div className="bg-indigo-50 rounded-xl p-3 mt-3">
                  <p className="text-xs font-medium text-indigo-700 mb-1">AI Feedback</p>
                  <p className="text-xs text-indigo-600">{item.ai_feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}