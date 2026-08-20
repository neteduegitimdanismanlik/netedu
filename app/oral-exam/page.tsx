'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '../components/Navbar'
import VoiceRecorder from '../components/VoiceRecorder'
import { getRubric } from '../rubrics/schema'

type Course = {
  id: string
  label: string
  rubricId: string
  stimulusKind: 'visual' | 'extract' | 'two-texts'
  stimulusLabel: string
  stimulusHint: string
  totalSeconds: number
  timingNote: string
}

const COURSES: Course[] = [
  {
    id: 'lang-a-lit',
    label: 'Language A: Literature',
    rubricId: 'ib-oral-language-a',
    stimulusKind: 'two-texts',
    stimulusLabel: 'Your global issue and your two works',
    stimulusHint:
      'State your global issue in one sentence, then name both literary works and describe the extract you chose from each. One work should be read in the original language and one in translation.',
    totalSeconds: 900,
    timingNote: '15 minutes: 10 minutes prepared response, then 5 minutes of teacher questions.',
  },
  {
    id: 'lang-a-langlit',
    label: 'Language A: Language and Literature',
    rubricId: 'ib-oral-language-a',
    stimulusKind: 'two-texts',
    stimulusLabel: 'Your global issue, your literary work and your body of work',
    stimulusHint:
      'State your global issue in one sentence, then name the literary work and the non-literary body of work, and describe the extract you chose from each.',
    totalSeconds: 900,
    timingNote: '15 minutes: 10 minutes prepared response, then 5 minutes of teacher questions.',
  },
  {
    id: 'lang-b-sl',
    label: 'Language B SL',
    rubricId: 'ib-oral-language-b-sl',
    stimulusKind: 'visual',
    stimulusLabel: 'Describe your practice stimulus',
    stimulusHint:
      'Describe the image you are practising with: what is in it, what theme it belongs to. In the real exam the teacher shows you two images and you pick one.',
    totalSeconds: 900,
    timingNote: '12 to 15 minutes: 3 to 4 minutes presenting the image, 4 to 5 discussing it, 5 to 6 on another theme.',
  },
  {
    id: 'lang-b-hl',
    label: 'Language B HL',
    rubricId: 'ib-oral-language-b-hl',
    stimulusKind: 'extract',
    stimulusLabel: 'Paste your practice extract',
    stimulusHint:
      'Paste the literary extract you are working from, up to about 300 words. In the real exam you get two extracts, one from each work studied, and pick one.',
    totalSeconds: 900,
    timingNote: '12 to 15 minutes: 3 to 4 minutes presenting the extract, 4 to 5 discussing it, 5 to 6 on course themes.',
  },
  {
    id: 'ab-initio',
    label: 'Language ab initio',
    rubricId: 'ib-oral-ab-initio',
    stimulusKind: 'visual',
    stimulusLabel: 'Describe your practice stimulus',
    stimulusHint:
      'Describe the image you are practising with: what is in it, what theme it belongs to. In the real exam the teacher shows you two images and you pick one.',
    totalSeconds: 600,
    timingNote: '7 to 10 minutes: 1 to 2 minutes presenting the image, 3 to 4 discussing it, 3 to 4 on another theme.',
  },
]

const LANGUAGES = [
  { label: 'English', code: 'en-US' },
  { label: 'Turkish', code: 'tr-TR' },
  { label: 'Spanish', code: 'es-ES' },
  { label: 'French', code: 'fr-FR' },
  { label: 'German', code: 'de-DE' },
  { label: 'Italian', code: 'it-IT' },
  { label: 'Mandarin', code: 'zh-CN' },
  { label: 'Arabic', code: 'ar-SA' },
]

export default function OralExam() {
  const [user, setUser] = useState<any>(null)
  const [stage, setStage] = useState<'setup' | 'brief' | 'record' | 'feedback'>('setup')
  const [courseId, setCourseId] = useState(COURSES[0].id)
  const [language, setLanguage] = useState('en-US')
  const [material, setMaterial] = useState('')
  const [brief, setBrief] = useState<any>(null)
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) setUser(data.user) })
  }, [])

  const course = COURSES.find(c => c.id === courseId)!
  const rubric = getRubric(course.rubricId)

  async function buildBrief() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/oral-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'brief', rubricId: course.rubricId, courseId, material })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setBrief(data)
      setStage('brief')
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  async function reviewTranscript(text: string) {
    setTranscript(text)
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/oral-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'review', rubricId: course.rubricId, courseId, material, transcript: text })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setFeedback(data)
      setStage('feedback')
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  function reset() {
    setStage('setup'); setBrief(null); setFeedback(null); setTranscript(''); setError('')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/coach" backLabel="Coach Corner" />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {stage === 'setup' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Oral Exam Prep 🗣️</h1>
              <p className="text-sm text-gray-500">
                Get briefed before you speak, then rehearse. This tool does not give you a mark — see why below.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">1. Your course</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {COURSES.map(c => (
                    <button key={c.id} onClick={() => setCourseId(c.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${courseId === c.id ? 'border-indigo-900 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <p className={`text-xs font-semibold ${courseId === c.id ? 'text-indigo-900' : 'text-gray-700'}`}>{c.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{c.timingNote.split(':')[0]}</p>
                    </button>
                  ))}
                </div>
                {rubric && (
                  <p className="text-xs text-gray-400 mt-2">
                    {rubric.criteria.map((c: any) => c.name).join(' · ')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">2. Language you speak in</label>
                <select value={language} onChange={e => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">This sets the speech recognition, not your subject.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">3. {course.stimulusLabel}</label>
                <textarea value={material} onChange={e => setMaterial(e.target.value)}
                  placeholder={course.stimulusHint}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-32" />
              </div>

              <button onClick={buildBrief} disabled={loading || material.trim().length < 30}
                className="w-full bg-indigo-900 text-white py-3.5 rounded-xl font-medium text-sm disabled:opacity-50 hover:bg-indigo-800">
                {loading ? 'Building your brief...' : 'Brief me →'}
              </button>
              {material.trim().length < 30 && (
                <p className="text-xs text-gray-400 -mt-2">Write a little more so the brief has something to work with.</p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-semibold text-amber-900 mb-2 text-sm">Why there is no score here</h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Your speech is turned into text, and a transcript cannot carry pronunciation, intonation, fluency or
                pauses — which several criteria in your course are partly about. Speech recognition also makes more
                mistakes with accented speech, so a misheard word can look exactly like a language error.
                Rather than give you a number built on that, this tool briefs you before you speak and comments on
                content afterwards.
              </p>
            </div>
          </>
        )}

        {stage === 'brief' && brief && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Your brief</h1>
                <p className="text-sm text-gray-500">{course.label} · {course.timingNote}</p>
              </div>
              <button onClick={reset} className="text-xs border border-gray-200 px-3 py-2 rounded-xl text-gray-500 hover:bg-white">
                ← Setup
              </button>
            </div>

            {brief.readiness && (
              <div className="bg-white rounded-2xl border border-indigo-100 p-5 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Before you record</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{brief.readiness}</p>
              </div>
            )}

            {brief.risks?.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
                <h3 className="font-semibold text-amber-900 mb-3 text-sm">⚠ Watch out for</h3>
                <ul className="flex flex-col gap-2">
                  {brief.risks.map((r: string, i: number) => (
                    <li key={i} className="text-sm text-amber-800 flex gap-2"><span>•</span>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {brief.questions?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">Questions you could be asked</h3>
                <p className="text-xs text-gray-400 mb-4">Have someone ask you three of these after your rehearsal.</p>
                <div className="flex flex-col gap-3">
                  {brief.questions.map((q: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-900 text-xs font-bold flex-shrink-0">{i + 1}</div>
                      <p className="text-sm text-gray-600">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {brief.checklist?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Check before you start</h3>
                <ul className="flex flex-col gap-2">
                  {brief.checklist.map((c: string, i: number) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-indigo-900">☐</span>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={() => setStage('record')}
              className="w-full bg-indigo-900 text-white py-3.5 rounded-xl font-medium text-sm hover:bg-indigo-800">
              I am ready to rehearse →
            </button>
          </>
        )}

        {stage === 'record' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Rehearse</h1>
                <p className="text-sm text-gray-500">{course.label} · {course.timingNote}</p>
              </div>
              <button onClick={() => setStage('brief')}
                className="text-xs border border-gray-200 px-3 py-2 rounded-xl text-gray-500 hover:bg-white">← Brief</button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-3xl mb-3">📝</div>
                <p className="text-sm text-gray-500">Reading what you said...</p>
              </div>
            ) : (
              <VoiceRecorder onTranscript={reviewTranscript} language={language} maxSeconds={course.totalSeconds}
                label={`Speak as if this were the real thing — up to ${Math.round(course.totalSeconds / 60)} minutes`} />
            )}
          </>
        )}

        {stage === 'feedback' && feedback && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">What your rehearsal shows</h1>
              <button onClick={reset}
                className="border border-indigo-900 text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
                Start again →
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
              <p className="text-xs text-amber-800 leading-relaxed">
                This is feedback on content only. Pronunciation, intonation, fluency and pauses are not in a transcript,
                and the recognition may have misheard words — treat anything odd below as a possible transcription
                slip rather than a mistake you made.
              </p>
            </div>

            {feedback.observations?.map((o: any, i: number) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 mb-3">
                <h3 className="font-semibold text-gray-800 text-sm mb-2">{o.heading}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{o.detail}</p>
              </div>
            ))}

            {feedback.nextTime?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Next rehearsal, change this</h3>
                <div className="flex flex-col gap-3">
                  {feedback.nextTime.map((s: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-6 h-6 bg-indigo-900 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i + 1}</div>
                      <p className="text-sm text-gray-600">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {feedback.notAssessed?.length > 0 && (
              <div className="bg-gray-100 rounded-2xl p-5 mb-4">
                <h3 className="font-semibold text-gray-600 mb-2 text-sm">Not visible in a transcript</h3>
                <ul className="flex flex-col gap-1.5">
                  {feedback.notAssessed.map((s: string, i: number) => (
                    <li key={i} className="text-xs text-gray-500 flex gap-2"><span>—</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}

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