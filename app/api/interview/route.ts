'use client'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'

const universities = [
  'Oxford University', 'Cambridge University', 'Imperial College London',
  'UCL', 'LSE', 'MIT', 'Stanford University', 'Harvard University',
  'Princeton University', 'Yale University', 'TU Delft', 'ETH Zurich'
]

const departments = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Medicine', 'Economics', 'Engineering', 'History', 'Philosophy',
  'Psychology', 'Law', 'Architecture', 'Business'
]

export default function Interview() {
  const [stage, setStage] = useState<'setup' | 'interview' | 'evaluation'>('setup')
  const [university, setUniversity] = useState('Oxford University')
  const [department, setDepartment] = useState('Computer Science')
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [evaluation, setEvaluation] = useState<any>(null)
  const [isEnd, setIsEnd] = useState(false)
  const messagesEndRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function startInterview() {
    setLoading(true)
    setStage('interview')
    const res = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start', university, department })
    })
    const data = await res.json()
    setMessages([{ role: 'interviewer', content: data.message }])
    setLoading(false)
  }

  async function sendAnswer() {
    if (!input.trim() || loading) return
    const newMessages = [...messages, { role: 'student', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'respond', university, department, messages: newMessages, answer: input })
    })
    const data = await res.json()
    setMessages([...newMessages, { role: 'interviewer', content: data.message }])
    if (data.isEnd) setIsEnd(true)
    setLoading(false)
  }

  async function getEvaluation() {
    setLoading(true)
    const res = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'evaluate', university, department, messages })
    })
    const data = await res.json()
    setEvaluation(data)
    setStage('evaluation')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Setup Stage */}
        {stage === 'setup' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Interview Coach 🎤</h1>
              <p className="text-sm text-gray-500">Practice with an AI interviewer that simulates real university admission interviews.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Setup your interview</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target University</label>
                    <select value={university} onChange={e => setUniversity(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                      {universities.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select value={department} onChange={e => setDepartment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                      {departments.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <button onClick={startInterview} disabled={loading}
                    className="w-full bg-indigo-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-indigo-800 disabled:opacity-50">
                    {loading ? 'Starting...' : 'Start Interview →'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                  <h3 className="font-semibold text-indigo-900 mb-3 text-sm">💡 What to expect</h3>
                  <ul className="flex flex-col gap-2">
                    {[
                      '5-6 realistic interview questions',
                      'Instant feedback after each answer',
                      'Full evaluation at the end',
                      'Score across 5 key dimensions',
                      'Specific tips to improve'
                    ].map((tip, i) => (
                      <li key={i} className="text-xs text-indigo-700 flex gap-2">
                        <span className="text-indigo-400">→</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">🎯 Interview styles</h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { uni: 'Oxford/Cambridge', style: 'Academic depth, critical thinking' },
                      { uni: 'US Ivy League', style: 'Personal story, leadership, impact' },
                      { uni: 'Imperial/UCL', style: 'Motivation, technical interest' },
                      { uni: 'ETH/TU Delft', style: 'Problem solving, STEM focus' },
                    ].map((s, i) => (
                      <div key={i} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                        <span className="text-xs font-medium text-gray-700">{s.uni}</span>
                        <span className="text-xs text-gray-400">{s.style}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interview Stage */}
        {stage === 'interview' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Interview in Progress</h1>
                <p className="text-sm text-gray-500">{university} · {department}</p>
              </div>
              <div className="flex gap-2">
                {isEnd && (
                  <button onClick={getEvaluation} disabled={loading}
                    className="bg-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 disabled:opacity-50">
                    {loading ? 'Evaluating...' : 'Get Evaluation →'}
                  </button>
                )}
                <button onClick={() => { setStage('setup'); setMessages([]); setIsEnd(false) }}
                  className="border border-gray-200 text-gray-500 px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                  Restart
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 flex flex-col" style={{ height: '500px' }}>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'interviewer' && (
                      <div className="w-8 h-8 bg-indigo-900 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-1">
                        {university.charAt(0)}
                      </div>
                    )}
                    <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'student'
                        ? 'bg-indigo-900 text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-700 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 bg-indigo-900 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">
                      {university.charAt(0)}
                    </div>
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl text-sm text-gray-400">
                      <span className="animate-pulse">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {!isEnd && (
                <div className="p-4 border-t border-gray-100 flex gap-3">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAnswer() } }}
                    placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none"
                    rows={2}
                  />
                  <button onClick={sendAnswer} disabled={loading || !input.trim()}
                    className="bg-indigo-900 text-white px-5 rounded-xl text-sm font-medium hover:bg-indigo-800 disabled:opacity-50">
                    Send
                  </button>
                </div>
              )}

              {isEnd && (
                <div className="p-4 border-t border-gray-100 bg-green-50 rounded-b-2xl text-center">
                  <p className="text-sm text-green-700 font-medium">Interview complete! Click "Get Evaluation" to see your results.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Evaluation Stage */}
        {stage === 'evaluation' && evaluation && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">Interview Evaluation</h1>
              <button onClick={() => { setStage('setup'); setMessages([]); setEvaluation(null); setIsEnd(false) }}
                className="border border-indigo-900 text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
                Practice again →
              </button>
            </div>

            {/* Overall Score */}
            <div className="bg-white rounded-2xl border border-indigo-100 p-6 mb-4">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="text-center">
                    <div className="text-white text-3xl font-bold">{evaluation.overall_score}</div>
                    <div className="text-indigo-300 text-xs">/ 10</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-gray-900">Grade {evaluation.grade}</span>
                    <span className="text-sm text-gray-500">{university} · {department}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{evaluation.summary}</p>
                </div>
              </div>
            </div>

            {/* Scores */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
              <h3 className="font-semibold text-gray-800 mb-4">📊 Detailed Scores</h3>
              <div className="flex flex-col gap-4">
                {evaluation.scores?.map((s: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{s.category}</span>
                      <span className="text-sm font-bold text-indigo-900">{s.score}/10</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full mb-1">
                      <div className="h-full bg-indigo-900 rounded-full transition-all" style={{ width: `${s.score * 10}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500">{s.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <h3 className="font-semibold text-green-800 mb-3">✅ Strengths</h3>
                <ul className="flex flex-col gap-2">
                  {evaluation.strengths?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-green-700 flex gap-2"><span>•</span>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <h3 className="font-semibold text-red-800 mb-3">⚠️ Improve</h3>
                <ul className="flex flex-col gap-2">
                  {evaluation.improvements?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-red-700 flex gap-2"><span>•</span>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-3">💡 Tips for next time</h3>
              <div className="flex flex-col gap-3">
                {evaluation.tips?.map((tip: string, i: number) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 bg-indigo-900 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i + 1}</div>
                    <p className="text-sm text-gray-600">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}