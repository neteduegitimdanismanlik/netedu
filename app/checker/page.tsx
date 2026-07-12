'use client'
import { useState } from 'react'
import Navbar from '../components/Navbar'

const subjects = [
  'Mathematics HL', 'Mathematics SL', 'Physics HL', 'Physics SL',
  'Chemistry HL', 'Chemistry SL', 'Biology HL', 'Biology SL',
  'Economics HL', 'Economics SL', 'History HL', 'History SL',
  'English A HL', 'English A SL', 'Computer Science HL', 'Computer Science SL',
  'Extended Essay (EE)', 'Theory of Knowledge (TOK)'
]

const checkTypes = ['Internal Assessment (IA)', 'Extended Essay (EE)', 'TOK Essay', 'University Essay']

export default function Checker() {
  const [checkType, setCheckType] = useState('Internal Assessment (IA)')
  const [subject, setSubject] = useState('Mathematics HL')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function analyze() {
    if (!title || !content) return
    setLoading(true)
    setResult(null)

    const res = await fetch('/api/checker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkType, subject, title, content })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Essay & IA Checker</h1>
          <p className="text-sm text-gray-500">Paste your work and get instant AI feedback based on IB criteria.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={checkType} onChange={e => setCheckType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                      {checkTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select value={subject} onChange={e => setSubject(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title / Research Question</label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. How does temperature affect enzyme activity?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paste your work here
                    <span className="text-gray-400 font-normal ml-1">(introduction, section, or full text)</span>
                  </label>
                  <textarea value={content} onChange={e => setContent(e.target.value)}
                    placeholder="Paste your essay, IA section, or full text here..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-64" />
                  <p className="text-xs text-gray-400 mt-1">{content.length} characters · ~{Math.ceil(content.split(' ').length)} words</p>
                </div>
                <button onClick={analyze} disabled={loading || !title || !content}
                  className="w-full bg-indigo-900 text-white py-3 rounded-xl font-medium text-sm disabled:opacity-50 hover:bg-indigo-800">
                  {loading ? '⏳ Analyzing...' : 'Analyze my work →'}
                </button>
              </div>
            </div>
          </div>

          {/* Tips Panel */}
          <div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-4">
              <h3 className="font-semibold text-indigo-900 mb-3 text-sm">💡 Tips for best results</h3>
              <ul className="flex flex-col gap-2">
                {[
                  'Paste at least 200 words for accurate feedback',
                  'Include your research question clearly',
                  'Paste the introduction + one full section',
                  'For IAs, mention your methodology',
                ].map((tip, i) => (
                  <li key={i} className="text-xs text-indigo-700 flex gap-2">
                    <span className="text-indigo-400 flex-shrink-0">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">📊 IB Scoring</h3>
              <div className="flex flex-col gap-2">
                {[
                  { range: '7 (18-20)', label: 'Excellent', color: 'text-green-600' },
                  { range: '6 (14-17)', label: 'Very Good', color: 'text-blue-600' },
                  { range: '5 (11-13)', label: 'Good', color: 'text-indigo-600' },
                  { range: '4 (8-10)', label: 'Satisfactory', color: 'text-yellow-600' },
                  { range: '3 (5-7)', label: 'Mediocre', color: 'text-orange-600' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{s.range}</span>
                    <span className={`text-xs font-medium ${s.color}`}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 flex flex-col gap-4">
            {/* Score */}
            <div className="bg-white rounded-2xl border border-indigo-100 p-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="text-center">
                    <div className="text-white text-2xl font-bold">{result.predicted_grade}</div>
                    <div className="text-indigo-300 text-xs">/ 7</div>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800 mb-1">Predicted IB Grade</h2>
                  <p className="text-sm text-gray-600">{result.summary}</p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
                      Score: {result.raw_score}/20
                    </span>
                    <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full">
                      {subject}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Criteria Breakdown */}
            {result.criteria && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">📋 Criteria Breakdown</h3>
                <div className="flex flex-col gap-3">
                  {result.criteria.map((c: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{c.name}</span>
                        <span className="text-sm font-bold text-indigo-900">{c.score}/{c.max}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full mb-1">
                        <div className="h-full bg-indigo-900 rounded-full" style={{ width: `${(c.score / c.max) * 100}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500">{c.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <h3 className="font-semibold text-green-800 mb-3">✅ Strengths</h3>
                <ul className="flex flex-col gap-2">
                  {result.strengths?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-green-700 flex gap-2">
                      <span className="flex-shrink-0">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <h3 className="font-semibold text-red-800 mb-3">⚠️ Areas to improve</h3>
                <ul className="flex flex-col gap-2">
                  {result.improvements?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-red-700 flex gap-2">
                      <span className="flex-shrink-0">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Specific Suggestions */}
            {result.suggestions && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-800 mb-3">💡 Specific suggestions</h3>
                <ul className="flex flex-col gap-3">
                  {result.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-6 h-6 bg-indigo-900 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-sm text-gray-600">{s}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}