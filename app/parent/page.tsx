'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '../components/Navbar'

export default function ParentPanel() {
  const [user, setUser] = useState<any>(null)
  const [studentProfile, setStudentProfile] = useState<any>(null)
  const [portfolioItems, setPortfolioItems] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [tab, setTab] = useState('overview')
  const [studentId, setStudentId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = '/auth'; return }
      setUser(data.user)
      
      // Check if parent link exists
      const { data: link } = await supabase
        .from('parent_links')
        .select('*')
        .eq('parent_email', data.user.email)
        .eq('status', 'accepted')
        .single()

      if (link) {
        setStudentId(link.student_id)
        await loadStudentData(link.student_id, data.user.email)
      }
      setLoading(false)
    })
  }, [])

  async function loadStudentData(sid: string, parentEmail: string) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', sid).single()
    setStudentProfile(profile)

    const { data: portfolio } = await supabase.from('portfolio_items').select('*').eq('user_id', sid).order('created_at', { ascending: false })
    setPortfolioItems(portfolio || [])

    const { data: msgs } = await supabase.from('parent_messages').select('*').eq('student_id', sid).eq('parent_email', parentEmail).order('created_at', { ascending: true })
    setMessages(msgs || [])
  }

  async function sendMessage() {
    if (!chatInput.trim() || !studentId) return
    setChatLoading(true)

    await supabase.from('parent_messages').insert({
      student_id: studentId,
      parent_email: user.email,
      role: 'parent',
      content: chatInput
    })

    const context = `You are NetEdu's AI advisor speaking to a parent. 
Student profile: Grade ${studentProfile?.grade}, GPA ${studentProfile?.gpa}/100, Target: ${studentProfile?.target_university} - ${studentProfile?.target_department}.
Portfolio items: ${portfolioItems.length} items, ${portfolioItems.filter(i => i.status === 'approved').length} approved.
Answer the parent's question in a helpful, clear way. Be specific about what the student should do.`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: context,
        messages: [{ role: 'user', content: chatInput }]
      })
    })

    const data = await res.json()
    const aiReply = data.content?.[0]?.text || 'Sorry, I could not process your question.'

    await supabase.from('parent_messages').insert({
      student_id: studentId,
      parent_email: user.email,
      role: 'ai',
      content: aiReply
    })

    setChatInput('')
    await loadStudentData(studentId, user.email)
    setChatLoading(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>

  if (!studentId) return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">👨‍👩‍👧</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Parent Panel</h1>
        <p className="text-sm text-gray-500 mb-6">You are not linked to any student yet. Ask your child to invite you from their dashboard.</p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
          <p className="text-sm text-indigo-700">Your child needs to go to their <strong>Dashboard → Invite Parent</strong> and enter your email address.</p>
        </div>
      </div>
    </main>
  )

  const approved = portfolioItems.filter(i => i.status === 'approved').length
  const pending = portfolioItems.filter(i => i.status === 'pending').length

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Parent Panel 👨‍👩‍👧</h1>
          <p className="text-sm text-gray-500">Track your child's university journey.</p>
        </div>

        {/* Student Summary */}
        {studentProfile && (
          <div className="bg-white rounded-2xl border border-indigo-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Student Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-indigo-900">{studentProfile.gpa || '—'}</div>
                <div className="text-xs text-gray-400">GPA</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-sm font-bold text-indigo-700">{studentProfile.grade || '—'}</div>
                <div className="text-xs text-gray-400">Grade</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-sm font-bold text-gray-700 truncate">{studentProfile.target_university || '—'}</div>
                <div className="text-xs text-gray-400">Target University</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-sm font-bold text-gray-700 truncate">{studentProfile.target_department || '—'}</div>
                <div className="text-xs text-gray-400">Department</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['overview', 'portfolio', 'chat'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${tab === t ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
              {t === 'chat' ? 'Ask AI' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-1">{approved}</div>
              <div className="text-sm text-gray-500">Portfolio items approved</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-1">{pending}</div>
              <div className="text-sm text-gray-500">Portfolio items pending</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <div className="text-3xl font-bold text-indigo-900 mb-1">{portfolioItems.length}</div>
              <div className="text-sm text-gray-500">Total activities</div>
            </div>
            {studentProfile?.roadmap && (
              <div className="md:col-span-3 bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-3">Latest AI Roadmap Summary</h3>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  {(() => { try { const r = JSON.parse(studentProfile.roadmap); return r.profile_summary || 'No summary available.' } catch { return studentProfile.roadmap?.slice(0, 300) + '...' } })()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Portfolio Tab */}
        {tab === 'portfolio' && (
          <div className="flex flex-col gap-4">
            {portfolioItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-4xl mb-3">📁</div>
                <p className="text-sm text-gray-500">No portfolio items yet.</p>
              </div>
            ) : portfolioItems.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full border ${item.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : item.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                    {item.status === 'approved' ? '✅ Approved' : item.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full">{item.type}</span>
                  {item.ai_score && <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-full">Score: {item.ai_score}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat Tab */}
        {tab === 'chat' && (
          <div className="bg-white rounded-2xl border border-gray-100 flex flex-col" style={{ height: '500px' }}>
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Ask AI about your child's progress</h2>
              <p className="text-xs text-gray-400 mt-0.5">Get personalized advice about your child's university journey</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">💬</div>
                  <p className="text-sm text-gray-400">Ask anything about your child's progress</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {['What should my child focus on this week?', 'How is the roadmap going?', 'Which universities are realistic?'].map(q => (
                      <button key={q} onClick={() => setChatInput(q)} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-full hover:bg-indigo-100">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'parent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'parent' ? 'bg-indigo-900 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl text-sm text-gray-400">Thinking...</div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !chatLoading && sendMessage()}
                placeholder="Ask about your child's progress..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              <button onClick={sendMessage} disabled={chatLoading || !chatInput.trim()}
                className="bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800 disabled:opacity-50">
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}