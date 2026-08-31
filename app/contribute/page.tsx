'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { storagePath } from '@/lib/storage'

const subjects = ['Mathematics AA', 'Mathematics AI', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Management', 'History', 'Geography', 'Psychology', 'English A', 'English B', 'Turkish A', 'Computer Science', 'Visual Arts', 'Other']
const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026']

export default function Contribute() {
  const [tab, setTab] = useState<'ia' | 'admission'>('ia')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  // IA form
  const [iaName, setIaName] = useState('')
  const [iaEmail, setIaEmail] = useState('')
  const [iaYear, setIaYear] = useState('')
  const [workType, setWorkType] = useState('Internal Assessment (IA)')
  const [subject, setSubject] = useState('Mathematics AA')
  const [level, setLevel] = useState('HL')
  const [score, setScore] = useState('')
  const [criterionScores, setCriterionScores] = useState('')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [feedback, setFeedback] = useState('')
  const [advice, setAdvice] = useState('')
  const [iaConsent, setIaConsent] = useState(false)

  // Admission form
  const [adName, setAdName] = useState('')
  const [adEmail, setAdEmail] = useState('')
  const [adYear, setAdYear] = useState('')
  const [highSchool, setHighSchool] = useState('')
  const [diplomaType, setDiplomaType] = useState('IB Diploma')
  const [gpaOrIb, setGpaOrIb] = useState('')
  const [sat, setSat] = useState('')
  const [englishTest, setEnglishTest] = useState('')
  const [accepted, setAccepted] = useState('')
  const [rejected, setRejected] = useState('')
  const [enrolled, setEnrolled] = useState('')
  const [scholarship, setScholarship] = useState('')
  const [activities, setActivities] = useState('')
  const [wishIKnew, setWishIKnew] = useState('')
  const [alumniPref, setAlumniPref] = useState('Evet, anonim olarak')
  const [adConsent, setAdConsent] = useState(false)

  async function submitIA() {
    if (!iaName || !iaEmail || !iaYear || !score || !title || !file || !iaConsent) return
    setSubmitting(true)

    // Store the object path, not a public URL: the bucket is private and files
    // are served through short-lived signed URLs generated at read time.
    const objectPath = storagePath('ia', file.name)
    const { error: uploadError } = await supabase.storage.from('alumni-files').upload(objectPath, file)
    if (uploadError) {
      setSubmitting(false)
      alert('Dosya yüklenemedi: ' + uploadError.message)
      return
    }

    const { error: insertError } = await supabase.from('alumni_submissions').insert({
      full_name: iaName, email: iaEmail, graduation_year: iaYear,
      work_type: workType, subject, level, score,
      criterion_scores: criterionScores, title,
      file_url: objectPath,
      examiner_feedback: feedback, advice, consent: iaConsent
    })
    if (insertError) {
      setSubmitting(false)
      alert('Gönderim kaydedilemedi: ' + insertError.message)
      return
    }

    setSuccess('Thank you! Your work has been submitted. 💙')
    setSubmitting(false)
    window.scrollTo(0, 0)
  }

  async function submitAdmission() {
    if (!adName || !adEmail || !adYear || !highSchool || !gpaOrIb || !accepted || !enrolled || !activities || !adConsent) return
    setSubmitting(true)

    const { error: insertError } = await supabase.from('admission_data').insert({
      full_name: adName, email: adEmail, graduation_year: adYear,
      high_school: highSchool, diploma_type: diplomaType,
      gpa_or_ib: gpaOrIb, sat, english_test: englishTest,
      accepted_universities: accepted, rejected_universities: rejected,
      enrolled_university: enrolled, scholarship, activities,
      wish_i_knew: wishIKnew, alumni_corner_preference: alumniPref,
      consent: adConsent
    })
    if (insertError) {
      setSubmitting(false)
      alert('Gönderim kaydedilemedi: ' + insertError.message)
      return
    }

    setSuccess('Thank you! Your admission story has been submitted. 💙')
    setSubmitting(false)
    window.scrollTo(0, 0)
  }

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
  const labelCls = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Share your experience 🎓</h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Help future students by sharing your IB work and admission journey. Your name stays private — your experience becomes their guide.
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-sm text-green-700 font-medium">{success}</p>
            <button onClick={() => setSuccess('')} className="mt-3 text-xs text-green-600 underline">Submit another</button>
          </div>
        )}

        {!success && (
          <>
            <div className="flex gap-2 mb-6 justify-center">
              <button onClick={() => setTab('ia')}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${tab === 'ia' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
                📝 Share IA / EE
              </button>
              <button onClick={() => setTab('admission')}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${tab === 'admission' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
                🎓 Admission Story
              </button>
            </div>

            {tab === 'ia' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full name *</label>
                    <input value={iaName} onChange={e => setIaName(e.target.value)} placeholder="Kept private" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input type="email" value={iaEmail} onChange={e => setIaEmail(e.target.value)} placeholder="your@email.com" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Graduation year *</label>
                    <select value={iaYear} onChange={e => setIaYear(e.target.value)} className={inputCls}>
                      <option value="">Select year</option>
                      {years.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Work type *</label>
                    <select value={workType} onChange={e => setWorkType(e.target.value)} className={inputCls}>
                      <option>Internal Assessment (IA)</option>
                      <option>Extended Essay (EE)</option>
                      <option>TOK Essay</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className={labelCls}>Subject *</label>
                    <select value={subject} onChange={e => setSubject(e.target.value)} className={inputCls}>
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Level *</label>
                    <select value={level} onChange={e => setLevel(e.target.value)} className={inputCls}>
                      <option>HL</option>
                      <option>SL</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Your score (out of 7) *</label>
                    <select value={score} onChange={e => setScore(e.target.value)} className={inputCls}>
                      <option value="">Select score</option>
                      {['7','6','5','4','3','2','1'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Criterion scores <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input value={criterionScores} onChange={e => setCriterionScores(e.target.value)} placeholder="A:4/6, B:5/6..." className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Title / Research question *</label>
                  <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder="Your research question or title..." className={`${inputCls} resize-none h-16`} />
                </div>
                <div>
                  <label className={labelCls}>Upload your work (PDF) *</label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center ${file ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id="ia-upload" />
                    <label htmlFor="ia-upload" className="cursor-pointer">
                      {file ? <p className="text-sm text-indigo-700">{file.name}</p> : <p className="text-sm text-gray-500">Click to upload PDF</p>}
                    </label>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Examiner/teacher feedback <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Any feedback you received..." className={`${inputCls} resize-none h-16`} />
                </div>
                <div>
                  <label className={labelCls}>Your advice for future students <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea value={advice} onChange={e => setAdvice(e.target.value)} placeholder="What was hardest? What would you do differently?" className={`${inputCls} resize-none h-16`} />
                </div>
                <label className="flex gap-3 items-start cursor-pointer bg-gray-50 rounded-xl p-4">
                  <input type="checkbox" checked={iaConsent} onChange={e => setIaConsent(e.target.checked)} className="mt-1" />
                  <span className="text-xs text-gray-600">I consent to my work being used anonymously as a reference in NetEdu's educational AI evaluation system. My name will never be shown.</span>
                </label>
                <button onClick={submitIA} disabled={submitting || !iaName || !iaEmail || !iaYear || !score || !title || !file || !iaConsent}
                  className="w-full bg-indigo-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-800 disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit my work 💙'}
                </button>
              </div>
            )}

            {tab === 'admission' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full name *</label>
                    <input value={adName} onChange={e => setAdName(e.target.value)} placeholder="Kept private" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input type="email" value={adEmail} onChange={e => setAdEmail(e.target.value)} placeholder="your@email.com" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Graduation year *</label>
                    <select value={adYear} onChange={e => setAdYear(e.target.value)} className={inputCls}>
                      <option value="">Select year</option>
                      {years.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>High school *</label>
                    <input value={highSchool} onChange={e => setHighSchool(e.target.value)} placeholder="Your school" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Diploma type *</label>
                    <select value={diplomaType} onChange={e => setDiplomaType(e.target.value)} className={inputCls}>
                      <option>IB Diploma</option>
                      <option>A-Level</option>
                      <option>National (YKS)</option>
                      <option>AP</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>IB score or GPA *</label>
                    <input value={gpaOrIb} onChange={e => setGpaOrIb(e.target.value)} placeholder="e.g. 42 or 95" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>SAT score <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input value={sat} onChange={e => setSat(e.target.value)} placeholder="1450" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>IELTS/TOEFL <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input value={englishTest} onChange={e => setEnglishTest(e.target.value)} placeholder="IELTS 7.5" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Universities you were ACCEPTED to (one per line: University - Department) *</label>
                  <textarea value={accepted} onChange={e => setAccepted(e.target.value)} placeholder={"Imperial College - Computer Science\nUCL - Economics"} className={`${inputCls} resize-none h-24`} />
                </div>
                <div>
                  <label className={labelCls}>Universities that REJECTED you <span className="text-gray-400 font-normal">(super valuable data! nothing to be ashamed of 😊)</span></label>
                  <textarea value={rejected} onChange={e => setRejected(e.target.value)} placeholder={"Oxford - PPE\nMIT - Computer Science"} className={`${inputCls} resize-none h-20`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>University you enrolled in *</label>
                    <input value={enrolled} onChange={e => setEnrolled(e.target.value)} placeholder="Imperial - CS" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Scholarship? <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input value={scholarship} onChange={e => setScholarship(e.target.value)} placeholder="50% merit" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Your standout activities (clubs, competitions, volunteering, projects) *</label>
                  <textarea value={activities} onChange={e => setActivities(e.target.value)} placeholder="Robotics club president, Math olympiad regional 2nd place..." className={`${inputCls} resize-none h-20`} />
                </div>
                <div>
                  <label className={labelCls}>One thing you wish you knew during applications <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea value={wishIKnew} onChange={e => setWishIKnew(e.target.value)} placeholder="Start essays earlier, apply to more safeties..." className={`${inputCls} resize-none h-16`} />
                </div>
                <div>
                  <label className={labelCls}>Would you like to appear in Alumni Corner? *</label>
                  <select value={alumniPref} onChange={e => setAlumniPref(e.target.value)} className={inputCls}>
                    <option>Evet, ismimle</option>
                    <option>Evet, anonim olarak</option>
                    <option>Hayır</option>
                  </select>
                </div>
                <label className="flex gap-3 items-start cursor-pointer bg-gray-50 rounded-xl p-4">
                  <input type="checkbox" checked={adConsent} onChange={e => setAdConsent(e.target.checked)} className="mt-1" />
                  <span className="text-xs text-gray-600">I consent to my data being used anonymously to improve NetEdu's university matching system.</span>
                </label>
                <button onClick={submitAdmission} disabled={submitting || !adName || !adEmail || !adYear || !highSchool || !gpaOrIb || !accepted || !enrolled || !activities || !adConsent}
                  className="w-full bg-indigo-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-800 disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit my story 💙'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}