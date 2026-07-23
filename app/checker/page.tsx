'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '../components/Navbar'
import { rubrics } from '../rubrics/schema'

const subjects = [
  'Mathematics AA', 'Mathematics AI', 'Physics', 'Chemistry', 'Biology',
  'Economics', 'Business Management', 'History', 'Geography', 'Psychology',
  'English A', 'English B', 'Computer Science', 'Visual Arts', 'General'
]

export default function Checker() {
  const [user, setUser] = useState<any>(null)
  const [rubricId, setRubricId] = useState(rubrics[0].id)
  const [subject, setSubject] = useState('Mathematics AA')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const rubric = rubrics.find(r => r.id === rubricId)!

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user)
        const res = await fetch(`/api/checker?userId=${data.user.id}`)
        const d = await res.json()
        setHistory(d.reports || [])
      }
    })
  }, [])

  async function extractPdfText(f: File): Promise<string> {
    const pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`
    const buffer = await f.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: buffer }).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const tc = await page.getTextContent()
      text += tc.items.map((it: any) => it.str).join(' ') + '\n'
    }
    return text
  }

  async function analyze() {
    setLoading(true)
    setResult(null)
    let finalContent = content
    let fileUrl = null

    try {
      if (inputMode === 'upload' && file) {
        setStatus('Reading PDF...')
        finalContent = await extractPdfText(file)
        if (user) {
          const ext = file.name.split('.').pop()
          const fileName = `${user.id}/${Date.now()}.${ext}`
          await supabase.storage.from('checker-files').upload(fileName, file)
          const { data } = supabase.storage.from('checker-files').getPublicUrl(fileName)
          fileUrl = data.publicUrl
        }
      }

      setStatus('Marking against rubric (3 passes for accuracy)...')
      const res = await fetch('/api/checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rubricId, subject, title, content: finalContent, userId: user?.id, fileUrl })
      })
      const data = await res.json()
      setResult(data)
      if (user) {
        const h = await fetch(`/api/checker?userId=${user.id}`)
        const hd = await h.json()
        setHistory(hd.reports || [])
      }
    } catch (e: any) {
      setResult({ error: e.message })
    }
    setStatus('')
    setLoading(false)
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const canSubmit = title && (inputMode === 'paste' ? wordCount >= 75 : !!file)

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/coach" backLabel="Coach Corner" />
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Coursework Checker</h1>
            <p className="text-sm text-gray-500">Rubric-based marking with examiner-style feedback.</p>
          </div>
          {history.length > 0 && (
            <button onClick={() => setShowHistory(!showHistory)}
              className="text-xs border border-gray-200 px-3 py-2 rounded-xl text-gray-600 hover:bg-white">
              📄 My reports ({history.length})
            </button>
          )}
        </div>

        {showHistory && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Previous reports</h3>
            <div className="flex flex-col gap-2">
              {history.map((r, i) => (
                <button key={i} onClick={() => { setResult({ ...r, criteria_scores: r.criteria_scores, rubricLabel: r.framework + ' — ' + r.document_type }); setShowHistory(false); window.scrollTo(0, 400) }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-left border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.title}</p>
                    <p className="text-xs text-gray-400">{r.subject} · {new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-indigo-900">{r.grade}</span>
                    <p className="text-xs text-gray-400">{r.total_score}/{r.total_max}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1. Choose framework & document type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {rubrics.map(r => (
                  <button key={r.id} onClick={() => setRubricId(r.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${rubricId === r.id ? 'border-indigo-900 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <p className={`text-xs font-semibold ${rubricId === r.id ? 'text-indigo-900' : 'text-gray-700'}`}>{r.framework}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.documentType}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Marked on {rubric.criteria.length} criteria · {rubric.totalMax} marks total
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">2. Subject</label>
                <select value={subject} onChange={e => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                  {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">3. Title / Research question</label>
                <input value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="How does temperature affect..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">4. Your work</label>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setInputMode('paste')}
                  className={`px-4 py-2 rounded-xl text-xs font-medium ${inputMode === 'paste' ? 'bg-indigo-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  📝 Paste text
                </button>
                <button onClick={() => setInputMode('upload')}
                  className={`px-4 py-2 rounded-xl text-xs font-medium ${inputMode === 'upload' ? 'bg-indigo-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  📎 Upload PDF
                </button>
              </div>

              {inputMode === 'paste' ? (
                <>
                  <textarea value={content} onChange={e => setContent(e.target.value)}
                    placeholder="Paste your full coursework here..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-56" />
                  <p className={`text-xs mt-1 ${wordCount < 75 ? 'text-gray-400' : 'text-green-600'}`}>
                    {wordCount} words {wordCount < 75 && '(minimum 75)'}
                  </p>
                </>
              ) : (
                <div className={`border-2 border-dashed rounded-xl p-8 text-center ${file ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}>
                  <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id="pdf-upload" />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    {file ? (
                      <>
                        <div className="text-2xl mb-1">📄</div>
                        <p className="text-sm text-indigo-700 font-medium">{file.name}</p>
                        <p className="text-xs text-gray-400 mt-1">Click to change</p>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl mb-1">📤</div>
                        <p className="text-sm text-gray-500">Click to upload your PDF</p>
                        <p className="text-xs text-gray-400 mt-1">Text is extracted automatically</p>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            <button onClick={analyze} disabled={loading || !canSubmit}
              className="w-full bg-indigo-900 text-white py-3.5 rounded-xl font-medium text-sm disabled:opacity-50 hover:bg-indigo-800">
              {loading ? (status || 'Marking...') : 'Mark my work →'}
            </button>
          </div>
        </div>

        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="text-sm text-red-700">Error: {result.error}</p>
          </div>
        )}

        {result && !result.error && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-indigo-100 p-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-indigo-900 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-white text-3xl font-bold">{result.grade}</span>
                  <span className="text-indigo-300 text-xs">{result.total_score}/{result.total_max}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">{result.rubricLabel || result.framework}</p>
                  <h2 className="font-semibold text-gray-800 mb-2">{result.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.summary}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Criterion breakdown</h3>
              <div className="flex flex-col gap-5">
                {result.criteria_scores?.map((c: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-sm font-medium text-gray-700">
                        <span className="text-indigo-900 font-bold mr-1">{c.id}.</span>{c.name}
                      </span>
                      <span className="text-sm font-bold text-indigo-900">{c.score}/{c.max}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full mb-2">
                      <div className="h-full bg-indigo-900 rounded-full transition-all" style={{ width: `${(c.score / c.max) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.comment}</p>
                    {c.spread > 1 && (
                      <p className="text-xs text-amber-600 mt-1">⚠ Borderline — markers varied by {c.spread} marks here</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <h3 className="font-semibold text-green-800 mb-3 text-sm">✅ Strengths</h3>
                <ul className="flex flex-col gap-2">
                  {result.strengths?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-green-700 flex gap-2"><span>•</span>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <h3 className="font-semibold text-red-800 mb-3 text-sm">⚠️ Weaknesses</h3>
                <ul className="flex flex-col gap-2">
                  {result.weaknesses?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-red-700 flex gap-2"><span>•</span>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-3">How to improve</h3>
              <div className="flex flex-col gap-3">
                {result.improvements?.map((s: string, i: number) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 bg-indigo-900 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i + 1}</div>
                    <p className="text-sm text-gray-600">{s}</p>
                  </div>
                ))}
              </div>
              {user && (
                <p className="text-xs text-gray-400 mt-5 pt-4 border-t border-gray-100">
                  ✓ Report saved — find it under "My reports" anytime.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}