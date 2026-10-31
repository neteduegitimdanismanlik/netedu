import type { Metadata } from 'next'
import Link from 'next/link'
import { iaSubjectPages } from './subjects'

/**
 * Public index of every IB subject whose Internal Assessment NetEdu can mark.
 * The root of the second SEO funnel (the first is /universities): no login,
 * links into one page per subject, each of which pushes to the checker.
 */

export const metadata: Metadata = {
  title: 'IB Internal Assessment (IA) Rubrics & Marking Criteria by Subject | NetEdu',
  description:
    'How every IB Internal Assessment is marked: criteria, marks and word limits for Biology, Chemistry, Physics, Economics, Psychology, Business Management, Computer Science, Mathematics and more — plus a free AI check against the rubric.',
}

export default function IaIndex() {
  const pages = iaSubjectPages()
  const byGroup = new Map<string, typeof pages>()
  for (const p of pages) {
    if (!byGroup.has(p.group)) byGroup.set(p.group, [])
    byGroup.get(p.group)!.push(p)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
        </Link>
        <Link href="/universities" className="text-xs text-gray-500 hover:text-indigo-700">University requirements →</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">IB Internal Assessment rubrics</h1>
        <p className="text-gray-600 mb-1 max-w-2xl">
          How each IB IA is marked — the criteria, the marks behind each one, and the word limit — for{' '}
          {pages.length} subjects.
        </p>
        <p className="text-xs text-gray-400 mb-6">IB IA değerlendirme kriterleri, ders ders</p>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold mb-1">Knowing the rubric is half of it. Seeing your score is the other half.</p>
            <p className="text-sm text-indigo-200">
              Upload your IA and NetEdu's checker marks it against these exact criteria — a mark per criterion,
              and what's holding each one back.
            </p>
          </div>
          <Link
            href="/auth"
            className="shrink-0 bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 text-center"
          >
            Check my IA free →
          </Link>
        </div>

        {[...byGroup.entries()].map(([group, items]) => (
          <div key={group} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">{group}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((p) => (
                <Link
                  key={p.slug}
                  href={`/ib-ia/${p.slug}`}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <p className="font-medium text-gray-900 text-sm">IB {p.subject} IA</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {p.rubric.criteria.length} criteria · out of {p.rubric.totalMax}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
