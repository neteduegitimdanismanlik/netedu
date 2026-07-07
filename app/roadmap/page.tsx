'use client'
import { useState } from 'react'
import Navbar from '../components/Navbar'

const roadmapData: any = {
  'Year 1': {
    color: 'bg-blue-500',
    light: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    months: {
      'Sep-Oct': ['Build your profile on NetEdu', 'Research target universities', 'Start SAT vocabulary (20 words/day)', 'Join 1 extracurricular club'],
      'Nov-Dec': ['Take first SAT practice test', 'Identify your strongest subjects', 'Start a small personal project', 'Get involved in school activities'],
      'Jan-Feb': ['Review Grade 9 performance', 'Set GPA target for next semester', 'Explore online courses (Coursera, edX)', 'Research IB/AP options'],
      'Mar-Apr': ['Complete 1 online certificate', 'Attend a university info session', 'Start building GitHub portfolio (if CS)', 'Volunteer for 1 activity'],
      'May-Jun': ['Review year progress', 'Plan summer activities', 'Apply for summer programs', 'Update NetEdu profile'],
    }
  },
  'Year 2': {
    color: 'bg-green-500',
    light: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600',
    months: {
      'Sep-Oct': ['Take first official SAT/ACT', 'Start IB/AP coursework', 'Join leadership role in a club', 'Begin research project'],
      'Nov-Dec': ['Review SAT score, retake plan', 'Start IELTS preparation', 'Build project portfolio', 'Connect with alumni on NetEdu'],
      'Jan-Feb': ['Retake SAT if needed', 'IELTS practice tests', 'Deepen research project', 'Apply for competitions/olympiads'],
      'Mar-Apr': ['Reach SAT 1400+ target', 'IELTS 7.0+ target', 'Complete research project', 'Start essay brainstorming'],
      'May-Jun': ['Summer internship or program', 'Essay draft version 1', 'University visit research', 'Update all profiles'],
    }
  },
  'Year 3': {
    color: 'bg-purple-500',
    light: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    months: {
      'Sep-Oct': ['Finalize university list', 'Complete Common App / UCAS profile', 'Request recommendation letters', 'Early Decision applications due'],
      'Nov-Dec': ['Submit all applications', 'Financial aid applications', 'Scholarship applications', 'Interview preparation'],
      'Jan-Feb': ['Regular Decision deadline', 'Scholarship deadlines', 'Wait for decisions', 'Keep grades up'],
      'Mar-Apr': ['Receive admission decisions', 'Compare offers and scholarships', 'Visit accepted universities', 'Make final decision'],
      'May-Jun': ['Accept offer', 'Apply for visa', 'Housing applications', 'Celebrate!'],
    }
  }
}

export default function Roadmap() {
  const [activeYear, setActiveYear] = useState('Year 1')
  const [activeMonth, setActiveMonth] = useState<string | null>(null)
  const year = roadmapData[activeYear]

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your 3-Year Roadmap</h1>
          <p className="text-sm text-gray-500">Click on a year, then a month to see your action plan.</p>
        </div>

        <div className="relative mb-10">
          <div className="absolute top-7 left-0 right-0 h-2 bg-gray-200 rounded-full z-0"></div>
          <div className="relative z-10 flex justify-around">
            {Object.keys(roadmapData).map((y, i) => {
              const rd = roadmapData[y]
              const isActive = activeYear === y
              return (
                <button key={y} onClick={() => { setActiveYear(y); setActiveMonth(null) }} className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all ${isActive ? rd.color + ' scale-110' : 'bg-gray-300'}`}>
                    {i + 1}
                  </div>
                  <span className={`text-sm font-semibold ${isActive ? rd.text : 'text-gray-400'}`}>{y}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {Object.keys(year.months).map((month) => (
            <button key={month} onClick={() => setActiveMonth(activeMonth === month ? null : month)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${activeMonth === month ? year.border + ' ' + year.light : 'border-gray-100 bg-white hover:border-gray-200'}`}>
              <div className={`text-xs font-bold mb-1 ${activeMonth === month ? year.text : 'text-gray-400'}`}>{month}</div>
              <div className="text-xs text-gray-500">{year.months[month].length} tasks</div>
              <div className={`mt-2 text-lg ${activeMonth === month ? '' : 'opacity-30'}`}>{activeMonth === month ? '▼' : '▶'}</div>
            </button>
          ))}
        </div>

        {activeMonth && (
          <div className={`${year.light} ${year.border} border-2 rounded-2xl p-6`}>
            <h3 className={`font-semibold ${year.text} mb-4`}>{activeYear} · {activeMonth}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {year.months[activeMonth].map((task: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100">
                  <div className={`w-6 h-6 rounded-full ${year.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{i + 1}</div>
                  <span className="text-sm text-gray-700">{task}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!activeMonth && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <div className="text-4xl mb-3">👆</div>
            <p className="text-sm text-gray-500">Select a month above to see your tasks</p>
          </div>
        )}
      </div>
    </main>
  )
}