import Link from 'next/link'
import Navbar from '../components/Navbar'

const tools = [
  {
    href: '/checker',
    icon: '✍️',
    title: 'Essay & IA Checker',
    desc: 'Get instant feedback on your essays and Internal Assessments based on IB criteria.',
    color: 'bg-blue-100',
  },
  {
    href: '/interview',
    icon: '🎤',
    title: 'University Interview',
    desc: 'Practice with an AI interviewer simulating Oxford, MIT, Imperial and more.',
    color: 'bg-purple-100',
  },
  {
    href: '/ee-prep',
    icon: '📚',
    title: 'EE Preparation',
    desc: 'Prepare for your Extended Essay with guided questions and topic refinement.',
    color: 'bg-yellow-100',
  },
  {
    href: '/oral-exam',
    icon: '🗣️',
    title: 'Oral Exam Prep',
    desc: 'Practice for IB Individual Orals and language speaking exams with AI.',
    color: 'bg-green-100',
  },
]

export default function CoachCorner() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Coach Corner 🎯</h1>
          <p className="text-sm text-gray-500">Your personal prep center for essays, interviews and exams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, i) => (
            <Link key={i} href={tool.href}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-indigo-300 hover:shadow-sm transition-all group">
              <div className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center mb-4 text-2xl`}>
                {tool.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-indigo-900">{tool.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{tool.desc}</p>
              <span className="text-xs text-indigo-700 font-medium">Open →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}