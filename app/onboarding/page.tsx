'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Onboarding() {
  const [grade, setGrade] = useState('Grade 9')
  const [gpa, setGpa] = useState('')
  const [university, setUniversity] = useState('')
  const [department, setDepartment] = useState('')
  const [activities, setActivities] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  async function analyze() {
    setLoading(true)
    
    const res = await fetch('/api/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade, gpa, university, department, activities })
    })
    const data = await res.json()
    setResult(data.result)

    // Supabase'e kaydet
    const { data: userData } = await supabase.auth.getUser()
    if (userData.user) {
      await supabase.from('profiles').upsert({
        id: userData.user.id,
        grade,
        gpa: parseFloat(gpa),
        target_university: university,
        target_department: department,
        activities,
        roadmap: data.result,
        updated_at: new Date().toISOString()
      })
    }

    setLoading(false)
    setStep(2)
  }

  if (step === 2) return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-gray-800">Net<span className="text-green-500">Edu</span></span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">🤖</div>
            <div>
              <h2 className="font-semibold text-gray-800">Your AI Roadmap</h2>
              <p className="text-xs text-gray-400">{grade} · GPA {gpa} · {university} · {department}</p>
            </div>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-green-700">✅ Your profile has been saved! You can access your roadmap anytime from your dashboard.</p>
        </div>
        <div className="flex gap-3">
          <a href="/dashboard" className="flex-1 bg-green-500 text-white py-3 rounded-xl text-sm font-medium text-center hover:bg-green-600">Go to Dashboard →</a>
          <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Edit profile</button>
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-gray-800">Net<span className="text-green-500">Edu</span></span>
        </div>
        <div className="mb-6">
          <div className="flex gap-2 mb-2">
            <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
            <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-400">Step 1 of 2 — Basic info</p>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Build your profile</h1>
        <p className="text-sm text-gray-500 mb-6">Enter your details and let AI build your personal roadmap.</p>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500">
              <option>Grade 9</option>
              <option>Grade 10</option>
              <option>Grade 11</option>
              <option>Grade 12</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GPA (out of 100)</label>
            <input type="number" value={gpa} onChange={e => setGpa(e.target.value)} placeholder="85" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target university</label>
            <input type="text" value={university} onChange={e => setUniversity(e.target.value)} placeholder="Imperial College, MIT..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target department</label>
            <input type="text" value={department} onChange={e => setDepartment(e.target.value)} placeholder="Computer Science..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activities <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={activities} onChange={e => setActivities(e.target.value)} placeholder="Robotics club, Python certificate, volunteer work..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 resize-none h-20" />
          </div>
          <button onClick={analyze} disabled={loading} className="w-full bg-green-500 text-white py-3 rounded-xl font-medium text-sm mt-2 disabled:opacity-50">
            {loading ? '⏳ AI is analyzing your profile...' : 'Build my roadmap →'}
          </button>
        </div>
      </div>
    </main>
  )
}