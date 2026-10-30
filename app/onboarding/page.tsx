'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { authHeaders } from '@/lib/session'
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
  const [clubsProof, setClubsProof] = useState('')
  const [volunteering, setVolunteering] = useState('')
  const [volunteeringProof, setVolunteeringProof] = useState('')
  const [research, setResearch] = useState('')
  const [researchProof, setResearchProof] = useState('')
  const [awards, setAwards] = useState('')
  const [awardsProof, setAwardsProof] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState<boolean[]>([])
  const [step1Error, setStep1Error] = useState('')
  const [analyzeError, setAnalyzeError] = useState('')

  /**
   * GPA, diploma type and the two target fields used to be skippable —
   * nothing stopped a student reaching Step 2 with all four blank, after
   * which the roadmap request had nothing real to work from. These are the
   * ones the roadmap actually depends on, so they're the ones enforced here;
   * school and nationality stay optional.
   */
  function goToStep2() {
    if (!gpa.trim() || !diplomaType || !university || !department) {
      setStep1Error('Please fill in GPA, diploma type, target university and target department before continuing.')
      return
    }
    setStep1Error('')
    setStep(2)
  }

  async function analyze() {
    setLoading(true)
    setAnalyzeError('')
    // A proof/document link folds into the same text field rather than a new
    // database column — "Clubs & extracurriculars" already has a clubs
    // column it writes to, and this avoids needing a schema migration just
    // to capture one optional link per category.
    const withProof = (text: string, proof: string) => (proof.trim() ? `${text}\n\nProof/document: ${proof.trim()}` : text)
    const clubsFinal = withProof(clubs, clubsProof)
    const volunteeringFinal = withProof(volunteering, volunteeringProof)
    const researchFinal = withProof(research, researchProof)
    const awardsFinal = withProof(awards, awardsProof)
    const activities = [clubsFinal, volunteeringFinal, researchFinal, awardsFinal].filter(Boolean).join(', ')
    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        // Without the Authorization header, requireUser() on the server has
        // nothing to check (it reads the bearer token, never cookies), so it
        // silently returns 401 on every call. That used to mean this button
        // looked like it did nothing: no result, no error shown, dropped
        // straight back onto this same screen. The checker page already
        // sends this same header on its API calls.
        headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
        body: JSON.stringify({ grade, gpa, university, department, activities, diplomaType, sat, ielts })
      })
      const data = await res.json()
      if (!data.result) {
        setAnalyzeError(data.error || "Something went wrong building your roadmap. Please try again.")
        setLoading(false)
        return
      }
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
          clubs: clubsFinal, volunteering: volunteeringFinal, research: researchFinal, awards: awardsFinal,
          activities,
          roadmap: JSON.stringify(data.result),
          updated_at: new Date().toISOString()
        })
      }
      setStep(3)
    } catch (e: any) {
      setAnalyzeError(e.message || "Couldn't reach the server. Check your connection and try again.")
    }
    setLoading(false)
  }

  /**
   * A light personalization touch instead of a generic 🎯 on every profile —
   * picks whichever activity category the student actually wrote the most
   * about and gives it a small identity. Purely computed from what's already
   * on screen, no AI call and no new data to store.
   */
  function mascot(): { emoji: string; label: string } {
    const candidates: { emoji: string; label: string; text: string }[] = [
      { emoji: '🦉', label: 'The Researcher', text: research },
      { emoji: '🦁', label: 'The Leader', text: clubs },
      { emoji: '🐬', label: 'The Changemaker', text: volunteering },
      { emoji: '🦅', label: 'The Achiever', text: awards },
    ]
    const best = candidates.reduce((a, b) => (b.text.trim().length > a.text.trim().length ? b : a))
    if (!best.text.trim()) return { emoji: '🦊', label: 'The Explorer' }
    return best
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
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl">{mascot().emoji}</div>
            <div>
              <h2 className="font-semibold text-gray-800">Your Profile · {mascot().label}</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">GPA (out of 100) <span className="text-red-400">*</span></label>
                <input type="number" value={gpa} onChange={e => setGpa(e.target.value)} placeholder="85" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current school <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="text" value={school} onChange={e => setSchool(e.target.value)} placeholder="TED Antalya, Özel Doğa..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="text" value={nationality} onChange={e => setNationality(e.target.value)} placeholder="Turkish, British..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diploma type <span className="text-red-400">*</span></label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Target university <span className="text-red-400">*</span></label>
              <SearchSelect options={universityList} value={university} onChange={setUniversity} placeholder="Search universities..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target department <span className="text-red-400">*</span></label>
              <SearchSelect options={departmentList} value={department} onChange={setDepartment} placeholder="Search departments..." />
            </div>
            {step1Error && (
              <div className="text-sm px-4 py-3 rounded-xl bg-red-50 text-red-600">{step1Error}</div>
            )}
            <button onClick={goToStep2} className="w-full bg-indigo-900 text-white py-3 rounded-xl font-medium text-sm mt-2 hover:bg-indigo-800">
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
              <textarea value={clubs} onChange={e => setClubs(e.target.value)} placeholder="Robotics club, student council, debate team — what did you actually do, not just the name?" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
              <input type="text" value={clubsProof} onChange={e => setClubsProof(e.target.value)} placeholder="Link to proof or document (optional)" className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volunteering & community service <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={volunteering} onChange={e => setVolunteering(e.target.value)} placeholder="Red Crescent volunteer, animal shelter — what was your role, how often, for how long?" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
              <input type="text" value={volunteeringProof} onChange={e => setVolunteeringProof(e.target.value)} placeholder="Link to proof or document (optional)" className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Research & projects <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={research} onChange={e => setResearch(e.target.value)} placeholder="Water quality research project, mobile app — what's it about, what stage is it at?" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
              <input type="text" value={researchProof} onChange={e => setResearchProof(e.target.value)} placeholder="Link to proof or document (optional)" className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Awards & certificates <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={awards} onChange={e => setAwards(e.target.value)} placeholder="Math olympiad 2nd place, Google Python certificate — who issued it, when?" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
              <input type="text" value={awardsProof} onChange={e => setAwardsProof(e.target.value)} placeholder="Link to proof or document (optional)" className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-indigo-500" />
            </div>
            {analyzeError && (
              <div className="text-sm px-4 py-3 rounded-xl bg-red-50 text-red-600">{analyzeError}</div>
            )}
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