import type { Metadata } from 'next'
import Link from 'next/link'
import { SYLLABUS } from './data'

/** Public index of the IB syllabus pages. */

export const metadata: Metadata = {
  title: 'IB Syllabus by Subject: Topics, HL Content and Exam Weightings | NetEdu',
  description:
    'The current IB Diploma syllabus for Mathematics AA and AI, Biology, Chemistry, Physics, Computer Science, Design Technology, Economics, Business Management, Psychology, Philosophy, Global Politics and Digital Society — every topic, what is HL only, and how each paper is weighted.',
}

export default function SyllabusIndex() {
  const byGroup = new Map<string, typeof SYLLABUS>()
  for (const s of SYLLABUS) {
    if (!byGroup.has(s.group)) byGroup.set(s.group, [])
    byGroup.get(s.group)!.push(s)
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
        <div className="flex gap-4">
          <Link href="/ib-ia" className="text-xs text-gray-500 hover:text-indigo-700">IA rubrics</Link>
          <Link href="/universities" className="text-xs text-gray-500 hover:text-indigo-700">Universities</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">IB syllabus by subject</h1>
        <p className="text-gray-600 mb-1 max-w-2xl">
          The current IB Diploma syllabus, subject by subject — every topic, what's HL only, and how each paper and the
          internal assessment are weighted. Taken from the official IB subject guides and briefs.
        </p>
        <p className="text-xs text-gray-400 mb-8">IB müfredatı ve sınav yapısı, ders ders</p>

        {[...byGroup.entries()].map(([group, items]) => (
          <div key={group} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">{group}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((s) => (
                <Link
                  key={s.slug}
                  href={`/ib-syllabus/${s.slug}`}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <p className="font-medium text-gray-900 text-sm">IB {s.subject} syllabus</p>
                  <p className="text-xs text-gray-400 mt-1">First assessment {s.firstAssessment}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <p className="text-xs text-gray-400 mt-6">
          More subjects are on the way — we only publish a syllabus once we've checked it against the official IB brief.
        </p>
      </div>
    </main>
  )
}
