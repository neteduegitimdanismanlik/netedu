'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '../components/Navbar'
import VoiceRecorder from '../components/VoiceRecorder'
import { rubrics } from '../rubrics/schema'

const oralRubrics = rubrics.filter(r => r.documentType === 'Individual Oral' || r.documentType === 'Speaking Assessment')

const languages = [
  { label: 'English', code: 'en-US' },
  { label: 'Turkish', code: 'tr-TR' },
  { label: 'Spanish', code: 'es-ES' },
  { label: 'French', code: 'fr-FR' },
  { label: 'German', code: 'de-DE' },
]

const durations = [
  { label: '5 minutes', value: 300 },
  { label: '10 minutes', value: 600 },
  { label: '15 minutes', value: 900 },
]

export default function OralExam() {
  const [user, setUser] = useState<any>(null)
  const [stage, setStage] = useState<'setup' | 'record' | 'report'>('setup')
  const [rubricId, setRubricId] = useState(oralRubrics[0]?.id || '')
  const [language, setLanguage] = useState('en-US')
  const [maxSeconds, setMaxSeconds] = useState(300)
  const [topic, setTopic] = useState('')
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) setUser(data.user) })
  }, [])

  async function analyse(text: string) {
    setTranscript(text)
    setLoading(true)
    const res = await fetch('/api/checker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rubricId,
        subject: languages.find(l => l.code === language)?.label || 'English',
        title: topic || 'Oral exam practice',
        content: text,
        userId: user?.id
      })
    })
    const data = await res.json()
    setResult(data)
    setStage('report')
    setLoading(false)
  }

  const rubric = rubrics.find(r => r.id === rubricId)

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/coach" backLabel="Coach Corner" />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {stage === 'setup' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Oral Exam Prep 🗣️</h1>
              <p className="text-sm text-gray-500">Record your oral, get it marked against the rubric.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">1. Exam type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {oralRubrics.map(r => (
                    <button key={r.id} onClick={() => setRubricId(r.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${rubricId === r.id ? 'border-indigo-900 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <p className={`text-xs font-semibold ${rubricId === r.id ? 'text-indigo-900' : 'text-gray-700'}`}>{r.framework}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.documentType}</p>
                    </button>
                  ))}
                </div>
                {rubric && <p className="text-xs text-gray-400 mt-2">{rubric.criteria.length} criteria · {rubric.totalMax} marks</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">2. Language</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                    {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">3. Time limit</label>
                  <select value={maxSeconds} onChange={e => setMaxSeconds(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                    {durations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">4. Topic / extract <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={topic} onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Global issue: identity in the digital age, based on chapter 3 of..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
              </div>

              <button onClick={() => setStage('record')}
                className="w-full bg-indigo-900 text-white py-3.5 rounded-xl font-medium text-sm hover:bg-indigo-800">
                Continue to recording →
              </button>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
              <h3 className="font-semibold text-indigo-900 mb-3 text-sm">How it works</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: '🎙', label: 'Record', desc: 'Speak under exam conditions' },
                  { icon: '📝', label: 'Transcribe', desc: 'Your speech becomes text' },
                  { icon: '📊', label: 'Marked', desc: 'Scored against the rubric' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <p className="text-xs font-semibold text-indigo-900">{s.label}</p>
                    <p className="text-xs text-indigo-600 mt-0.5">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {stage === 'record' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{rubric?.label}</h1>
                <p className="text-sm text-gray-500">{languages.find(l => l.code === language)?.label} · max {maxSeconds / 60} min</p>
              </div>
              <button onClick={() => setStage('setup')}
                className="text-xs border border-gray-200 px-3 py-2 rounded-xl text-gray-500 hover:bg-white">← Setup</button>
            </div>

            {topic && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
                <p className="text-xs font-medium text-gray-400 mb-1">Your topic</p>
                <p className="text-sm text-gray-700">{topic}</p>
              </div>
            )}

            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-3xl mb-3">📊</div>
                <p className="text-sm text-gray-500">Marking your oral against the rubric...</p>
              </div>
            ) : (
              <VoiceRecorder onTranscript={analyse} language={language} maxSeconds={maxSeconds}
                label={`Press start when you're ready — up to ${maxSeconds / 60} minutes`} />
            )}
          </>
        )}

        {stage === 'report' && result && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">Your oral, marked</h1>
              <button onClick={() => { setStage('setup'); setResult(null); setTranscript('') }}
                className="border border-indigo-900 text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
                Practice again →
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-indigo-100 p-6 mb-4">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-indigo-900 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-white text-3xl font-bold">{result.grade}</span>
                  <span className="text-indigo-300 text-xs">{result.total_score}/{result.total_max}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">{result.rubricLabel}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.summary}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
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
                      <div className="h-full bg-indigo-900 rounded-full" style={{ width: `${(c.score / c.max) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">How to improve</h3>
              <div className="flex flex-col gap-3">
                {result.improvements?.map((s: string, i: number) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 bg-indigo-900 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i + 1}</div>
                    <p className="text-sm text-gray-600">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {transcript && (
              <details className="bg-white rounded-2xl border border-gray-100 p-5">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">📝 View transcript</summary>
                <p className="text-sm text-gray-600 leading-relaxed mt-3 pt-3 border-t border-gray-100">{transcript}</p>
              </details>
            )}
          </>
        )}
      </div>
    </main>
  )
}