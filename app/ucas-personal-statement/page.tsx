import type { Metadata } from 'next'
import Link from 'next/link'
import Counter from './Counter'
import { QUESTIONS } from './questions'

/**
 * Public guide to the three-question UCAS personal statement, with a live
 * character counter — aimed at "UCAS personal statement questions /
 * character count / IB personal statement" searches.
 *
 * Facts from UCAS's own pages (checked October 2026): from 2026 entry the
 * free-form statement became three questions; 4,000 characters in total
 * including spaces, questions not counted; at least 350 characters per
 * answer; the split between answers is up to the student; answers are read
 * together as one statement.
 *
 * The IB-specific advice (where the EE, IAs, TOK and CAS go) is NetEdu's own.
 */

export const metadata: Metadata = {
  title: 'UCAS Personal Statement: The 3 Questions, Character Count and IB Tips | NetEdu',
  description:
    'The new UCAS personal statement explained for IB students: the three questions, the 4,000-character limit and 350-character minimum, a free character counter, and where your Extended Essay, IAs, TOK and CAS belong.',
}

const IB_TIPS: { q: number; text: string }[] = [
  { q: 1, text: 'Lead with the interest itself, not the career. What in the subject made you want three or four more years of it — a problem, an idea, a book, a question you kept coming back to?' },
  { q: 2, text: 'This is where the Diploma does the work. Your HL subjects, an IA where you tested something yourself, and especially an Extended Essay connected to the course: say what you investigated and what it taught you about the subject, not just that you did it.' },
  { q: 2, text: 'TOK can earn a line if it changed how you think about knowledge in your subject — how evidence works in History, or what a proof really shows in Mathematics.' },
  { q: 3, text: 'CAS, work experience, competitions, reading, online courses, a project of your own. Choose a few and say why each one prepared you — what you did, what you noticed, what it showed you about the subject.' },
]

function Nav() {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 w-fit">
        <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">N</span>
        </div>
        <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
      </Link>
      <div className="flex gap-4">
        <Link href="/universities" className="text-xs text-gray-500 hover:text-indigo-700">Universities</Link>
        <Link href="/ib-roadmap" className="text-xs text-gray-500 hover:text-indigo-700">Roadmap</Link>
      </div>
    </nav>
  )
}

export default function PersonalStatementPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">The UCAS personal statement: three questions, 4,000 characters</h1>
        <p className="text-xs text-gray-400 mb-4">UCAS personal statement soruları ve karakter sınırı — IB öğrencileri için</p>
        <p className="text-gray-600 mb-5">
          Since 2026 entry, the UCAS personal statement is no longer one free-form essay. You answer three set
          questions instead, within the same 4,000-character limit. Here&apos;s how it works, a counter to check your
          draft, and where an IB Diploma fits in.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <Link href="/auth" className="inline-block text-center bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">
            Get feedback on my statement →
          </Link>
          <p className="text-xs text-gray-500">Pro: a mark for voice, structure, reflection and language, and what to fix first.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">The three questions</h2>
          <div className="flex flex-col gap-3">
            {QUESTIONS.map((q, i) => (
              <div key={q} className="flex items-start gap-4">
                <div className="w-9 h-9 bg-indigo-900 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-800 pt-2">{q}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">The rules</h2>
          <div className="flex flex-col gap-1.5 text-sm text-gray-700">
            <p>· <strong>4,000 characters</strong> in total across all three answers, spaces included</p>
            <p>· The questions themselves <strong>don&apos;t count</strong> towards the limit</p>
            <p>· At least <strong>350 characters</strong> in each answer</p>
            <p>· Beyond that, split the 4,000 however suits your course — answers don&apos;t have to be equal</p>
            <p>· Admissions staff read the three answers together, as one statement, so don&apos;t repeat yourself across them</p>
            <p>· One statement goes to every course you apply to, so keep it about the subject, not one university</p>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            UCAS notes that courses like Medicine and Nursing tend to weigh question 3 more, because of work
            experience. Check each university&apos;s own guidance for your course.
          </p>
        </div>

        <Counter />

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">Where your IB Diploma goes</h2>
          <div className="flex flex-col gap-3">
            {IB_TIPS.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs px-2 py-0.5 rounded-full border shrink-0 mt-0.5 bg-indigo-50 text-indigo-700 border-indigo-200">
                  Q{t.q}
                </span>
                <p className="text-sm text-gray-700">{t.text}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-700 mt-4">
            Before you write, make sure the course is one you can actually get into with your subjects — many UK
            courses require a specific HL subject, and no statement makes up for a missing one.{' '}
            <Link href="/universities" className="text-indigo-700 underline">Check any UK course&apos;s IB requirements</Link>.
          </p>
        </div>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 my-8">
          <p className="font-semibold mb-1">Get your statement read before UCAS does.</p>
          <p className="text-sm text-indigo-200 mb-4">
            Paste your draft into NetEdu&apos;s checker. It marks your personal voice, structure, reflection and
            language, shows where each one stands, and tells you what to change first.
          </p>
          <Link href="/auth" className="inline-block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
            Get feedback on my statement →
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-2">
          {[
            { href: '/universities', label: 'University requirements' },
            { href: '/ib-extended-essay', label: 'Extended Essay 2027 criteria' },
            { href: '/ib-tok', label: 'TOK and bonus points' },
            { href: '/ib-roadmap', label: 'IB roadmap, Grade 9 to 12' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="text-sm bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-700">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
