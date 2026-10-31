import type { Metadata } from 'next'
import Link from 'next/link'

/**
 * Public guide to Theory of Knowledge assessment and the EE/TOK bonus points
 * matrix — aimed at "TOK essay word count / TOK exhibition / IB bonus points"
 * searches.
 *
 * NetEdu can't mark TOK, so this page doesn't pretend to: its call to action
 * is the university matcher, because the reason students look up the bonus
 * matrix is to work out their points total — and what that total gets them.
 *
 * Facts (TOK guide, first assessment 2022, still current for May 2027):
 * essay 1,600 words on one of six prescribed titles, marked out of 10,
 * two-thirds of the grade; exhibition of three objects, one of the 35 IA
 * prompts, up to 950 words, marked out of 10, one-third. The matrix is
 * unchanged for the 2027 Extended Essay.
 */

export const metadata: Metadata = {
  title: 'IB TOK Essay, Exhibition and Bonus Points Matrix | NetEdu',
  description:
    'How Theory of Knowledge is assessed: the 1,600-word TOK essay and the 950-word exhibition, each marked out of 10 — plus the full EE/TOK matrix showing how many bonus points (0–3) every grade combination earns.',
}

const GRADES = ['A', 'B', 'C', 'D', 'E'] as const

// MATRIX[tok][ee] — points added to the Diploma total. 'F' = no Diploma.
const MATRIX: Record<string, Record<string, number | 'F'>> = {
  A: { A: 3, B: 3, C: 2, D: 2, E: 'F' },
  B: { A: 3, B: 2, C: 2, D: 1, E: 'F' },
  C: { A: 2, B: 2, C: 1, D: 0, E: 'F' },
  D: { A: 2, B: 1, C: 0, D: 0, E: 'F' },
  E: { A: 'F', B: 'F', C: 'F', D: 'F', E: 'F' },
}

function cellClass(v: number | 'F') {
  if (v === 'F') return 'bg-red-50 text-red-700'
  if (v === 3) return 'bg-indigo-900 text-white'
  if (v === 2) return 'bg-indigo-200 text-indigo-900'
  if (v === 1) return 'bg-indigo-50 text-indigo-900'
  return 'bg-gray-50 text-gray-500'
}

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
        <Link href="/ib-extended-essay" className="text-xs text-gray-500 hover:text-indigo-700">Extended Essay</Link>
        <Link href="/ib-ia" className="text-xs text-gray-500 hover:text-indigo-700">IA rubrics</Link>
        <Link href="/universities" className="text-xs text-gray-500 hover:text-indigo-700">Universities</Link>
      </div>
    </nav>
  )
}

export default function TokPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">TOK assessment and the IB bonus points matrix</h1>
        <p className="text-xs text-gray-400 mb-4">IB TOK essay, exhibition ve EE/TOK bonus puan tablosu</p>
        <p className="text-gray-600 mb-5">
          Theory of Knowledge is assessed in two parts — an essay and an exhibition — and graded A to E. With your
          Extended Essay grade, it decides up to 3 of the 45 Diploma points.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <Link href="/auth" className="inline-block text-center bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">
            See what my points total gets me →
          </Link>
          <p className="text-xs text-gray-500">Free: your predicted total matched against real university requirements.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <p className="text-xs font-semibold text-indigo-700 mb-1">Two-thirds of the TOK grade</p>
            <h2 className="font-semibold text-gray-800 mb-3">The TOK essay</h2>
            <div className="flex flex-col gap-1.5 text-sm text-gray-700">
              <p>· Up to <strong>1,600 words</strong></p>
              <p>· On one of <strong>six prescribed titles</strong>, released by the IB for each exam session</p>
              <p>· Marked out of <strong>10</strong>, externally, by IB examiners</p>
              <p>· Marked holistically — one judgement of the whole essay, not separate criteria</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <p className="text-xs font-semibold text-indigo-700 mb-1">One-third of the TOK grade</p>
            <h2 className="font-semibold text-gray-800 mb-3">The TOK exhibition</h2>
            <div className="flex flex-col gap-1.5 text-sm text-gray-700">
              <p>· <strong>Three objects</strong> that show how TOK shows up in the world around you</p>
              <p>· All linked to <strong>one of the 35 IA prompts</strong></p>
              <p>· A commentary of up to <strong>950 words</strong></p>
              <p>· Marked out of <strong>10</strong> by your teacher, then moderated by the IB</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-1">The EE/TOK bonus points matrix</h2>
          <p className="text-sm text-gray-500 mb-4">
            Find your TOK grade on the left and your Extended Essay grade along the top. The number is what&apos;s added to
            your six subject grades (up to 42) for a maximum of 45.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-separate" style={{ borderSpacing: 4 }}>
              <thead>
                <tr>
                  <th className="text-xs text-gray-400 font-medium p-2 text-left">TOK ↓ / EE →</th>
                  {GRADES.map((g) => (
                    <th key={g} className="text-xs font-semibold text-gray-600 p-2">{g}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRADES.map((tok) => (
                  <tr key={tok}>
                    <th className="text-xs font-semibold text-gray-600 p-2 text-left">{tok}</th>
                    {GRADES.map((ee) => {
                      const v = MATRIX[tok][ee]
                      return (
                        <td key={ee} className={`rounded-lg p-2.5 font-semibold ${cellClass(v)}`}>
                          {v === 'F' ? 'Fail' : `+${v}`}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-1.5 text-sm text-gray-700 mt-4">
            <p>· <strong>3 points</strong>: A and A, or an A with a B (either way round)</p>
            <p>· <strong>An E in TOK or in the Extended Essay</strong> means no Diploma, whatever your other grades</p>
            <p>· The matrix is the same for the new 2027 Extended Essay</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-2">Why the bonus points matter for offers</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Many university offers are a points total — and most count these bonus points in it. Two extra points
            from your EE and TOK can be the difference between meeting an offer and missing it. Some universities
            count only your six subjects instead; some lower their offer for a strong Extended Essay. It varies by
            university and course, which is why it&apos;s worth checking each one.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            <Link href="/universities" className="text-indigo-700 underline">Look up the IB requirements for any university and department</Link>.
          </p>
        </div>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 my-8">
          <p className="font-semibold mb-1">Know your total. Now see where it gets you.</p>
          <p className="text-sm text-indigo-200 mb-4">
            NetEdu&apos;s matching engine checks your predicted points and HL subjects against the real requirements of
            every university it tracks, and sorts them into reach, match and safety — department by department.
          </p>
          <Link href="/auth" className="inline-block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
            Match me with universities →
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-2">
          {[
            { href: '/ib-extended-essay', label: 'Extended Essay 2027 criteria' },
            { href: '/ib-ia', label: 'IB IA rubrics' },
            { href: '/universities', label: 'University requirements' },
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
