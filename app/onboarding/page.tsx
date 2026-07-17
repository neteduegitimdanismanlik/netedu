'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '../components/Navbar'
import SearchSelect from '../components/SearchSelect'
import { universityList, departmentList } from '../components/data'

const categoryColors: any = {
  'Academic': 'bg-blue-50 text-blue-700 border-blue-200',
  'Test Prep': 'bg-purple-50 text-purple-700 border-purple-200',
  'Portfolio': 'bg-green-50 text-green-700 border-green-200',
  'Research': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Activities': 'bg-red-50 text-red-700 border-red-200',
}

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [grade, setGrade] = useState('Grade 9')
  const [gpa, setGpa] = useState('')
  const [school, setSchool] = useState('')
  const [nationality, setNationality] = useState('')
  const [diplomaType, setDiplomaType] = useState('')
  const [sat, setSat] = useState('')
  const [ielts, setIelts] = useState('')
  const [university, setUniversity] = useState('')
  const [department, setDepartment] = useState('')
  const [clubs, setClubs] = useState('')
  const [volunteering, setVolunteering] = useState('')
  const [research, setResearch] = useState('')
  const [awards, setAwards] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState<boolean[]>([])

  async function analyze() {
    setLoading(true)
    const activities = [clubs, volunteering, research, awards].filter(Boolean).join(', ')
    const res = await fetch('/api/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade, gpa, university, department, activities, diplomaType, sat, ielts })
    })
    const data = await res.json()
    setResult(data.result)
    setChecked(new Array(data.result?.this_week?.length || 0).fill(false))
    const { data: userData } = await supabase.auth.getUser()
    if (userData.user) {
      await supabase.from('profiles').upsert({
        id: userData.user.id,
        grade, gpa: parseFloat(gpa), school, nationality,
        diploma_type: diplomaType,
        sat: sat ? parseInt(sat) : null,
        ielts: ielts ? parseFloat(ielts) : null,
        target_university: university,
        target_department: department,
        clubs, volunteering, research, awards,
        activities,
        roadmap: JSON.stringify(data.result),
        updated_at: new Date().toISOString()
      })
    }
    setLoading(false)
    setStep(3)
  }

  function toggleCheck(i: number) {
    const newChecked = [...checked]
    newChecked[i] = !newChecked[i]
    setChecked(newChecked)
  }

  if (step === 3 && result) return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl">🎯</div>
            <div>
              <h2 className="font-semibold text-gray-800">Profile Analysis</h2>
              <p className="text-xs text-gray-400">{grade} · GPA {gpa} · {university}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{result.profile_summary}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <div className="text-xs font-semibold text-green-600 mb-1">✅ Strength</div>
              <p className="text-xs text-green-700">{result.strength}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <div className="text-xs font-semibold text-red-600 mb-1">⚠️ Weakness</div>
              <p className="text-xs text-red-700">{result.weakness}</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
              <div className="text-xs font-semibold text-indigo-600 mb-1">🎓 Acceptance Chance</div>
              <p className="text-indigo-700 font-bold text-lg">{result.acceptance_chance}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">📋 This Week's Tasks</h2>
          <div className="flex flex-col gap-3">
            {result.this_week?.map((task: any, i: number) => (
              <div key={i} onClick={() => toggleCheck(i)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${checked[i] ? 'bg-gray-50 opacity-60' : 'bg-white hover:bg-gray-50'} border-gray-100`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${checked[i] ? 'bg-indigo-900 border-indigo-900' : 'border-gray-300'}`}>
                  {checked[i] && <span className="text-white text-xs">✓</span>}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${checked[i] ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.task}</p>
                  <p className="text-xs text-gray-400 mt-0.5">⏱ {task.duration}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[task.category] || 'bg-gray-50 text-gray-500'}`}>
                  {task.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">📅 3-Month Goals</h2>
          <div className="flex flex-col gap-3">
            {result.monthly_goals?.map((goal: any, i: number) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-indigo-900 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i + 1}</div>
                <div>
                  <div className="text-xs font-semibold text-indigo-900 mb-1">{goal.month}</div>
                  <p className="text-sm text-gray-700 mb-1">{goal.goal}</p>
                  <p className="text-xs text-gray-400">🎯 {goal.milestone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {result.urgent_warnings?.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-4">
            <h2 className="font-semibold text-red-700 mb-3">🚨 Urgent Actions</h2>
            <div className="flex flex-col gap-2">
              {result.urgent_warnings.map((warning: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-red-500 text-sm mt-0.5">!</span>
                  <p className="text-sm text-red-700">{warning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-green-700">✅ Your profile has been saved!</p>
        </div>
        <div className="flex gap-3">
          <a href="/dashboard" className="flex-1 bg-indigo-900 text-white py-3 rounded-xl text-sm font-medium text-center hover:bg-indigo-800">Go to Dashboard →</a>
          <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Edit profile</button>
        </div>
      </div>
    </main>
  )

  if (step === 1) return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="mb-6">
            <div className="flex gap-1 mb-2">
              <div className="h-1 flex-1 bg-indigo-900 rounded-full"></div>
              <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-400">Step 1 of 2 — Basic info</p>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Build your profile</h1>
          <p className="text-sm text-gray-500 mb-6">Tell us about yourself and your goals.</p>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                  <option>Grade 11</option>
                  <option>Grade 12</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPA (out of 100)</label>
                <input type="number" value={gpa} onChange={e => setGpa(e.target.value)} placeholder="85" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current school</label>
              <input type="text" value={school} onChange={e => setSchool(e.target.value)} placeholder="TED Antalya, Özel Doğa..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input type="text" value={nationality} onChange={e => setNationality(e.target.value)} placeholder="Turkish, British..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diploma type</label>
              <select value={diplomaType} onChange={e => setDiplomaType(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                <option value="">Select diploma</option>
                <option>IB Diploma</option>
                <option>A-Level</option>
                <option>SAT / ACT</option>
                <option>Turkish National (YKS)</option>
                <option>Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SAT score <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="number" value={sat} onChange={e => setSat(e.target.value)} placeholder="1400" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IELTS score <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="number" value={ielts} onChange={e => setIelts(e.target.value)} placeholder="7.0" step="0.5" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target university</label>
              <SearchSelect options={universityList} value={university} onChange={setUniversity} placeholder="Search universities..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target department</label>
              <SearchSelect options={departmentList} value={department} onChange={setDepartment} placeholder="Search departments..." />
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-indigo-900 text-white py-3 rounded-xl font-medium text-sm mt-2 hover:bg-indigo-800">
              Next: Activities →
            </button>
          </div>
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="mb-6">
            <div className="flex gap-1 mb-2">
              <div className="h-1 flex-1 bg-indigo-900 rounded-full"></div>
              <div className="h-1 flex-1 bg-indigo-900 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-400">Step 2 of 2 — Activities & achievements</p>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your activities</h1>
          <p className="text-sm text-gray-500 mb-6">These help us build a stronger, more personalized roadmap.</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clubs & extracurriculars <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={clubs} onChange={e => setClubs(e.target.value)} placeholder="Robotics club, student council, debate team..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volunteering & community service <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={volunteering} onChange={e => setVolunteering(e.target.value)} placeholder="Red Crescent volunteer, animal shelter..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Research & projects <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={research} onChange={e => setResearch(e.target.value)} placeholder="Water quality research project, mobile app..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Awards & certificates <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={awards} onChange={e => setAwards(e.target.value)} placeholder="Math olympiad 2nd place, Google Python certificate..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">← Back</button>
              <button onClick={analyze} disabled={loading} className="flex-1 bg-indigo-900 text-white py-3 rounded-xl font-medium text-sm disabled:opacity-50 hover:bg-indigo-800">
                {loading ? '⏳ Analyzing...' : 'Build my roadmap →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}