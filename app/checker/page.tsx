'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '../components/Navbar'
import AnnotatedText from '../components/AnnotatedText'
import Link from 'next/link'
import { getRubric } from '../rubrics/schema'
import { resolveIaRubric, subjectGroups } from '../rubrics/subject-map'

type DocType = 'IA' | 'EE' | 'Essay'

export default function Checker() {
  const [user, setUser] = useState<any>(null)
  const [subject, setSubject] = useState('')
  const [docType, setDocType] = useState<DocType>('IA')
  const [level, setLevel] = useState<'SL' | 'HL'>('HL')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [viewMode, setViewMode] = useState<'report' | 'annotated'>('report')
  const [analysedContent, setAnalysedContent] = useState('')

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

  // Which rubric applies, given subject + document type
  const resolution =
    docType === 'IA' ? resolveIaRubric(subject)
    : docType === 'EE' ? { kind: 'rubric' as const, rubricId: 'ib-ee', needsLevel: false, confidence: 'high' as const }
    : { kind: 'rubric' as const, rubricId: 'general-college-essay', needsLevel: false, confidence: 'high' as const }

  const activeRubric = resolution.kind === 'rubric' ? getRubric(resolution.rubricId) : undefined
  const needsLevel = resolution.kind === 'rubric' && resolution.needsLevel

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
    if (resolution.kind !== 'rubric') return
    setLoading(true)
    setResult(null)
    setViewMode('report')
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

      setStatus('Marking against the official criteria (3 passes)...')
      const res = await fetch('/api/checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rubricId: resolution.rubricId,
          subject,
          title,
          content: finalContent,
          userId: user?.id,
          fileUrl,
          level: needsLevel ? level : undefined
        })
      })
      const data = await res.json()
      setAnalysedContent(finalContent)
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
  const canSubmit =
    resolution.kind === 'rubric' &&
    !!subject && !!title &&
    (inputMode === 'paste' ? wordCount >= 75 : !!file)

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/coach" backLabel="Coach Corner" />
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Coursework Checker</h1>
            <p className="text-sm text-gray-500">Marked against the criteria for your actual subject.</p>
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
                <button key={i} onClick={() => {
                  setResult({ ...r, rubricLabel: r.framework + ' — ' + r.document_type })
                  setAnalysedContent(r.full_content || '')
                  setShowHistory(false)
                  setViewMode('report')
                  window.scrollTo(0, 400)
                }}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">1. Your subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                <option value="">Select your subject...</option>
                {subjectGroups.map(g => (
                  <optgroup key={g.group} label={g.group}>
                    {g.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">2. What are you submitting?</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'IA', label: 'Internal Assessment', sub: 'Coursework for this subject' },
                  { key: 'EE', label: 'Extended Essay', sub: '4,000-word research essay' },
                  { key: 'Essay', label: 'University Essay', sub: 'Personal statement / application' },
                ] as { key: DocType; label: string; sub: string }[]).map(d => (
                  <button key={d.key} onClick={() => setDocType(d.key)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${docType === d.key ? 'border-indigo-900 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <p className={`text-xs font-semibold ${docType === d.key ? 'text-indigo-900' : 'text-gray-700'}`}>{d.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{d.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* What the subject + doc type resolved to */}
            {subject && resolution.kind === 'rubric' && activeRubric && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-700">
                  Marking against: <span className="text-indigo-900">{activeRubric.label}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activeRubric.criteria.map(c => `${c.id} ${c.name} (${c.max})`).join(' · ')} — {activeRubric.totalMax} marks total
                </p>
                {resolution.confidence === 'low' && resolution.note && (
                  <p className="text-xs text-amber-700 mt-2">⚠ {resolution.note}</p>
                )}
                {resolution.confidence === 'high' && resolution.note && (
                  <p className="text-xs text-gray-500 mt-2">{resolution.note}</p>
                )}
              </div>
            )}

            {subject && resolution.kind === 'redirect' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800 font-medium mb-1">This IA is spoken, not written</p>
                <p className="text-xs text-amber-700 mb-3">{resolution.reason}</p>
                <Link href="/oral-exam" className="inline-block bg-indigo-900 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-indigo-800">
                  Go to Oral Exam Prep →
                </Link>
              </div>
            )}

            {subject && resolution.kind === 'unsupported' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800 font-medium mb-1">No official criteria loaded yet</p>
                <p className="text-xs text-amber-700">
                  {resolution.reason} Marking it against another subject's criteria would give you a number that looks
                  official but means nothing — so we don't.
                </p>
                <p className="text-xs text-amber-700 mt-2">
                  If you're writing a personal statement or application essay, switch the type above to
                  <strong> University Essay</strong> — that one we can mark.
                </p>
              </div>
            )}

            {needsLevel && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">3. Your level</label>
                <div className="flex gap-2">
                  {(['SL', 'HL'] as const).map(l => (
                    <button key={l} onClick={() => setLevel(l)}
                      className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${level === l ? 'bg-indigo-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {resolution.kind === 'rubric' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {needsLevel ? '4' : '3'}. Title / Research question
                  </label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="How does temperature affect..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {needsLevel ? '5' : '4'}. Your work
                  </label>
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
              </>
            )}
          </div>
        </div>

        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="text-sm text-red-700">Error: {result.error}</p>
          </div>
        )}

        {result && !result.error && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button onClick={() => setViewMode('report')}
                className={`px-4 py-2 rounded-xl text-xs font-medium ${viewMode === 'report' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
                📊 Report
              </button>
              <button onClick={() => setViewMode('annotated')}
                className={`px-4 py-2 rounded-xl text-xs font-medium ${viewMode === 'annotated' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
                🖍 Annotated text
              </button>
            </div>

            {viewMode === 'annotated' && (
              <AnnotatedText
                content={analysedContent || result.full_content || result.content_preview || ''}
                annotations={result.criteria_scores || []}
              />
            )}

            {typeof result.runsCompleted === 'number' && result.runsCompleted < 3 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700">
                  ⚠ Only {result.runsCompleted} of 3 marking passes completed — treat these marks as less settled than usual.
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-indigo-100 p-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-indigo-900 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-white text-3xl font-bold">{result.grade}</span>
                  <span className="text-indigo-300 text-xs">{result.total_score}/{result.total_max}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">
                    {result.rubricLabel || result.framework}
                    {result.subject ? ` · ${result.subject}` : ''}
                  </p>
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
                      <span className="text-sm font-bold text-indigo-900">
                        {c.missing ? '—' : `${c.score}/${c.max}`}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full mb-2">
                      <div className="h-full bg-indigo-900 rounded-full transition-all"
                        style={{ width: c.missing ? '0%' : `${(c.score / c.max) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {c.missing ? 'This criterion could not be marked reliably — run it again.' : c.comment}
                    </p>
                    {!c.missing && c.spread > 1 && (
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