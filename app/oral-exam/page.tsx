'use client'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'

const examTypes = [
  'IB English A Individual Oral',
  'IB English B Individual Oral',
  'IB Spanish B Oral',
  'IB French B Oral',
  'IB German B Oral',
  'IB Turkish A Oral',
  'IELTS Speaking',
  'TOEFL Speaking',
  'General Speaking Practice'
]

export default function OralExam() {
  const [stage, setStage] = useState<'setup' | 'session'>('setup')
  const [examType, setExamType] = useState('IB English A Individual Oral')
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
        university: `${examType} examiner`,
        department: `Oral exam practice. ${topic ? 'Topic/text: ' + topic : ''} You are an experienced oral examiner. Conduct a realistic ${examType} practice session. Ask questions the way a real examiner would. Give brief feedback and follow-up questions.`
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
        university: `${examType} examiner`,
        department: `Oral exam practice. Continue the exam naturally with follow-up questions and brief feedback on language, structure and content.`,
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Oral Exam Prep 🗣️</h1>
              <p className="text-sm text-gray-500">Practice for your oral exams with a realistic AI examiner.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Setup your exam</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam type</label>
                    <select value={examType} onChange={e => setExamType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                      {examTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic or text <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea value={topic} onChange={e => setTopic(e.target.value)}
                      placeholder="e.g. Analyzing 'The Great Gatsby' chapter 3, or global issue: identity in the digital age..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
                  </div>
                  <button onClick={startSession} disabled={loading}
                    className="w-full bg-indigo-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-indigo-800 disabled:opacity-50">
                    {loading ? 'Starting...' : 'Start practice →'}
                  </button>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <h3 className="font-semibold text-green-800 mb-3 text-sm">💡 Practice makes perfect</h3>
                <ul className="flex flex-col gap-2">
                  {[
                    'Realistic examiner questions',
                    'Follow-up questions like real exams',
                    'Feedback on structure and content',
                    'Practice as many times as you want',
                    'Works for IB IOs, IELTS, TOEFL'
                  ].map((tip, i) => (
                    <li key={i} className="text-xs text-green-700 flex gap-2">
                      <span className="text-green-400">→</span>{tip}
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
                <h1 className="text-xl font-bold text-gray-900">Practice in Progress</h1>
                <p className="text-sm text-gray-500">{examType}</p>
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
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-1">🗣️</div>
                    )}
                    <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'student' ? 'bg-indigo-900 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mr-3">🗣️</div>
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl text-sm text-gray-400">Thinking...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                  placeholder="Type your answer... (Enter to send)"
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