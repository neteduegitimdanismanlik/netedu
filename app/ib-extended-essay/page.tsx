import type { Metadata } from 'next'
import Link from 'next/link'
import { getRubric } from '../rubrics/schema'

/**
 * Public guide to the Extended Essay, aimed at "IB EE rubric / criteria /
 * 2027 changes" searches.
 *
 * The criteria table is read from the same 'ib-ee' rubric the checker marks
 * with, so the page and the checker can't disagree. Only names, marks and our
 * one-line summaries are shown — never band descriptors.
 *
 * Facts on this page (May 2027 model): 30 marks across A–E, 4,000 words,
 * a reflective statement of up to 500 words on the Reflection and Progress
 * Form, the interdisciplinary option replacing World Studies, and the
 * unchanged EE/TOK bonus matrix (see /ib-tok). Sources disagreed on the
 * names of the five interdisciplinary frameworks, so they are deliberately
 * not listed. Check against the IB guide before adding detail.
 */

export const metadata: Metadata = {
  title: 'IB Extended Essay 2027: New Criteria, Marks and Word Count | NetEdu',
  description:
    'How the IB Extended Essay is marked from May 2027: five criteria out of 30 (Framework, Knowledge and understanding, Analysis, Discussion and evaluation, Reflection), the 4,000-word limit, the 500-word reflection, and what changed from the old 34-mark model.',
}

const OLD_MODEL = [
  { id: 'A', name: 'Focus and method', max: 6 },
  { id: 'B', name: 'Knowledge and understanding', max: 6 },
  { id: 'C', name: 'Critical thinking', max: 12 },
  { id: 'D', name: 'Presentation', max: 4 },
  { id: 'E', name: 'Engagement', max: 6 },
]

const CHANGES: { title: string; text: string }[] = [
  { title: 'Out of 30, not 34', text: 'Five criteria still, but the total drops from 34 to 30 marks.' },
  { title: 'Presentation is no longer its own criterion', text: 'Structure, layout and referencing now count inside Criterion A, Framework for the essay.' },
  { title: 'Critical thinking is split in two', text: 'The old 12-mark Criterion C becomes C, Analysis and line of argument (6), and D, Discussion and evaluation (8). D is now the biggest single criterion.' },
  { title: 'One reflection instead of three', text: 'The three RPPF reflections become a single statement of up to 500 words on the Reflection and Progress Form, written at the end. It is what Criterion E (4 marks) marks.' },
  { title: 'Interdisciplinary EEs replace World Studies', text: 'You can combine two Diploma subjects through one of five prescribed frameworks.' },
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
        <Link href="/ib-ia" className="text-xs text-gray-500 hover:text-indigo-700">IA rubrics</Link>
        <Link href="/ib-tok" className="text-xs text-gray-500 hover:text-indigo-700">TOK</Link>
        <Link href="/universities" className="text-xs text-gray-500 hover:text-indigo-700">Universities</Link>
      </div>
    </nav>
  )
}

export default function ExtendedEssayPage() {
  const r = getRubric('ib-ee')
  const criteria: { id: string; name: string; max: number; description: string }[] = r?.criteria || []
  const total = r?.totalMax ?? 30

  return (
    <main className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-xs font-semibold text-indigo-700 mb-2">For EEs submitted from May 2027</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">The IB Extended Essay: how it&apos;s marked now</h1>
        <p className="text-xs text-gray-400 mb-4">IB Extended Essay 2027 değerlendirme kriterleri ve kelime sınırı</p>
        <p className="text-gray-600 mb-5">
          The Extended Essay changed for students finishing the Diploma in May 2027 and later. It&apos;s now marked out
          of {total} across five criteria, with a single reflection at the end. Here&apos;s what each criterion
          rewards and what changed.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <Link href="/auth" className="inline-block text-center bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">
            Check my Extended Essay →
          </Link>
          <p className="text-xs text-gray-500">Pro: a mark per criterion against the 2027 model, and what&apos;s holding each one back.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">The essentials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-indigo-900">4,000</p>
              <p className="text-sm text-gray-600">words maximum</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-indigo-900">{total} marks</p>
              <p className="text-sm text-gray-600">across five criteria, A–E</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-indigo-900">500</p>
              <p className="text-sm text-gray-600">words max for the reflection</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            The word count covers the introduction, body, conclusion and quotations. The bibliography, references,
            contents page, and charts, tables and equations are not counted. Check your school&apos;s copy of the
            guide for the full list.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">The five criteria</h2>
          <div className="flex flex-col gap-3">
            {criteria.map((c) => (
              <div key={c.id} className="flex items-start gap-4 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="w-9 h-9 bg-indigo-900 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {c.id}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-sm font-semibold text-indigo-900 shrink-0">{c.max} marks</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{c.description}.</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Criterion names and marks follow the IB&apos;s guide for first assessment 2027. The one-line summaries are
            NetEdu&apos;s own.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">What changed from the old Extended Essay</h2>
          <div className="flex flex-col gap-3 mb-5">
            {CHANGES.map((c) => (
              <div key={c.title}>
                <p className="text-sm font-medium text-gray-800">{c.title}</p>
                <p className="text-sm text-gray-600">{c.text}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Old model (last assessed November 2026)</p>
          <p className="text-sm text-gray-500">
            {OLD_MODEL.map((c) => `${c.id} ${c.name} (${c.max})`).join(' · ')} — 34 marks
          </p>
          <p className="text-xs text-gray-400 mt-3">
            If a past paper, exemplar or marking guide shows 34 marks or a Presentation criterion, it was marked
            under the old model.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-2">Where the marks are</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Criteria C and D together are 14 of the 30 marks — nearly half the essay. That&apos;s analysis and
            evaluation: not what you found, but what you made of it, how you weighed it, and whether your conclusion
            actually follows. An essay that reports research well but doesn&apos;t argue with it caps itself early.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-2">The EE grade and your Diploma points</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Your EE gets a grade from A to E. Together with your Theory of Knowledge grade, it earns up to 3 bonus
            points towards your Diploma total — and an E in either one means no Diploma.{' '}
            <Link href="/ib-tok" className="text-indigo-700 underline">See the full EE/TOK points matrix</Link>.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            Some universities count those bonus points, and a few lower an offer for a strong EE grade.{' '}
            <Link href="/universities" className="text-indigo-700 underline">Check what your universities ask for</Link>.
          </p>
        </div>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 my-8">
          <p className="font-semibold mb-1">See what your Extended Essay would score — criterion by criterion.</p>
          <p className="text-sm text-indigo-200 mb-4">
            NetEdu&apos;s checker marks your draft against the 2027 criteria, shows the band each one lands in, and
            tells you what to fix to reach the next. Paste your reflection too, and Criterion E gets marked as well.
          </p>
          <Link href="/auth" className="inline-block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
            Check my Extended Essay →
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-2">
          {[
            { href: '/ib-tok', label: 'TOK essay, exhibition and bonus points' },
            { href: '/ib-ia', label: 'IB IA rubrics' },
            { href: '/ib-syllabus', label: 'IB syllabus by subject' },
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
