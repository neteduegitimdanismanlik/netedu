'use client'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics',
  'Business Management', 'History', 'Geography', 'Psychology',
  'English A', 'Computer Science', 'Visual Arts', 'World Studies'
]

export default function EEPrep() {
  const [stage, setStage] = useState<'setup' | 'session'>('setup')
  const [subject, setSubject] = useState('Mathematics')
  const [topic, setTopic] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function startSession() {
    setLoading(true)
    setStage('session')
    const res = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'start',
        university: 'IB Extended Essay supervision session',
        department: `${subject} EE. Student's topic idea: "${topic || 'not decided yet'}". You are an experienced EE supervisor. Help the student refine their research question, discuss methodology, sources, and structure. Ask probing questions to strengthen their EE. Start by asking about their topic or helping them find one.`
      })
    })
    const data = await res.json()
    setMessages([{ role: 'interviewer', content: data.message }])
    setLoading(false)
  }

  async function send() {
    if (!input.trim() || loading) return
    const newMessages = [...messages, { role: 'student', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    const res = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'respond',
        university: 'IB Extended Essay supervision',
        department: `${subject} EE preparation. Keep helping the student develop their EE. Never end the session - keep asking helpful questions and giving specific EE advice.`,
        messages: newMessages,
        answer: input
      })
    })
    const data = await res.json()
    setMessages([...newMessages, { role: 'interviewer', content: data.message }])
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/coach" backLabel="Coach Corner" />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {stage === 'setup' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">EE Preparation 📚</h1>
              <p className="text-sm text-gray-500">Work with an AI supervisor to develop your Extended Essay.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Start your EE session</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EE Subject</label>
                    <select value={subject} onChange={e => setSubject(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic idea <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea value={topic} onChange={e => setTopic(e.target.value)}
                      placeholder="e.g. Something about game theory in economics... or leave empty if you need help finding a topic"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
                  </div>
                  <button onClick={startSession} disabled={loading}
                    className="w-full bg-indigo-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-indigo-800 disabled:opacity-50">
                    {loading ? 'Starting...' : 'Start session →'}
                  </button>
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                <h3 className="font-semibold text-indigo-900 mb-3 text-sm">💡 What your supervisor helps with</h3>
                <ul className="flex flex-col gap-2">
                  {[
                    'Finding and refining your research question',
                    'Narrowing down a broad topic',
                    'Choosing the right methodology',
                    'Finding credible sources',
                    'Structuring your 4000 words',
                    'Avoiding common EE mistakes'
                  ].map((tip, i) => (
                    <li key={i} className="text-xs text-indigo-700 flex gap-2">
                      <span className="text-indigo-400">→</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {stage === 'session' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">EE Session</h1>
                <p className="text-sm text-gray-500">{subject} Extended Essay</p>
              </div>
              <button onClick={() => { setStage('setup'); setMessages([]) }}
                className="border border-gray-200 text-gray-500 px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                New session
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 flex flex-col" style={{ height: '500px' }}>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'interviewer' && (
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-1">📚</div>
                    )}
                    <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'student' ? 'bg-indigo-900 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs mr-3">📚</div>
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl text-sm text-gray-400">Thinking...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                  placeholder="Type your message... (Enter to send)"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none" rows={2} />
                <button onClick={send} disabled={loading || !input.trim()}
                  className="bg-indigo-900 text-white px-5 rounded-xl text-sm font-medium hover:bg-indigo-800 disabled:opacity-50">Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}