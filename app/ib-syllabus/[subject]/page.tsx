import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SYLLABUS, syllabusBySlug, type AssessmentComponent, type SyllabusSubject } from '../data'

/**
 * One public page per IB subject: the syllabus and how the subject is
 * examined. Meant to rank for "IB <subject> syllabus / topics / paper 1
 * weighting" searches. Every figure comes from app/ib-syllabus/data.ts,
 * which records the official IBO source and the date it was checked.
 */

export function generateStaticParams() {
  return SYLLABUS.map((s) => ({ subject: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params
  const s = syllabusBySlug(subject)
  if (!s) return {}
  const topics = s.topics.filter((t) => !t.name.toLowerCase().includes('internal assessment')).slice(0, 4).map((t) => t.name).join(', ')
  return {
    title: `IB ${s.subject} Syllabus & Exam Structure (first assessment ${s.firstAssessment}) | NetEdu`,
    description: `IB ${s.subject} SL and HL: every topic (${topics}…), what's HL only, and how each paper and the IA are weighted. From the official IB documentation.`,
  }
}

function hours(h?: number): string {
  if (h == null) return '—'
  const whole = Math.floor(h)
  const mins = Math.round((h - whole) * 60)
  if (!whole) return `${mins} min`
  return mins ? `${whole}h ${mins}m` : `${whole}h`
}

function AssessmentTable({ level, rows }: { level: 'SL' | 'HL'; rows: AssessmentComponent[] }) {
  return (
    <div>
      <p className="text-xs font-semibold text-indigo-900 mb-2">{level}</p>
      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.component} className={`p-3 rounded-xl ${r.internal ? 'bg-indigo-50' : 'bg-gray-50'}`}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-gray-900">{r.component}</p>
              <p className="text-sm font-semibold text-gray-900 shrink-0">{r.weight != null ? `${r.weight}%` : ''}</p>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {r.format}
              {r.hours != null ? ` · ${hours(r.hours)}` : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function iaLink(s: SyllabusSubject) {
  return s.iaPages[0] ? `/ib-ia/${s.iaPages[0].slug}` : null
}

export default async function SyllabusPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
  const s = syllabusBySlug(subject)
  if (!s) return notFound()

  const siblings = SYLLABUS.filter((x) => x.group === s.group && x.slug !== s.slug)
  const rubricHref = iaLink(s)

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

      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-xs text-gray-400 mb-2">
          <Link href="/ib-syllabus" className="hover:text-indigo-700">IB syllabus</Link> / {s.group}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">IB {s.subject} syllabus and exam structure</h1>
        <p className="text-xs text-gray-400 mb-4">IB {s.subject} müfredatı, konular ve sınav yapısı</p>
        <p className="text-gray-600 mb-5">
          First assessment {s.firstAssessment}
          {s.lastAssessment ? `, last assessment ${s.lastAssessment}` : ''}
          {s.hoursSL || s.hoursHL ? ' · ' : ''}
          {s.hoursSL ? `${s.hoursSL} teaching hours at SL` : ''}
          {s.hoursSL && s.hoursHL ? ', ' : ''}
          {s.hoursHL ? `${s.hoursHL} at HL` : ''}.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <Link href="/auth" className="inline-block text-center bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">
            Check my {s.subject} IA →
          </Link>
          {rubricHref && (
            <Link href={rubricHref} className="text-sm text-indigo-700 hover:underline">
              How the {s.subject} IA is marked →
            </Link>
          )}
        </div>

        {/* Syllabus */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-1">What's in the {s.subject} syllabus</h2>
          {s.topicNote && <p className="text-sm text-gray-500 mb-4">{s.topicNote}</p>}
          <div className="flex flex-col gap-4">
            {s.topics.map((t) => (
              <div key={t.name}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {t.name}
                    {t.hlOnly && <span className="ml-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">HL only</span>}
                  </p>
                  {(t.hoursSL != null || t.hoursHL != null) && (
                    <p className="text-xs text-gray-400 shrink-0">
                      {t.hoursSL != null ? `SL ${t.hoursSL}h` : ''}
                      {t.hoursSL != null && t.hoursHL != null ? ' · ' : ''}
                      {t.hoursHL != null ? `HL ${t.hoursHL}h` : ''}
                    </p>
                  )}
                </div>
                {t.subtopics?.length ? (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {t.subtopics.map((st) => (
                      <span
                        key={st.name}
                        className={`text-xs rounded-full px-2.5 py-1 border ${
                          st.level === 'hl'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : st.level === 'extra-hl'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {st.name}
                        {st.level === 'hl' ? ' · HL only' : st.level === 'extra-hl' ? ' · + HL' : ''}
                      </span>
                    ))}
                  </div>
                ) : null}
                {t.note && <p className="text-xs text-gray-500 mt-1.5">{t.note}</p>}
              </div>
            ))}
          </div>
          {s.topics.some((t) => t.subtopics?.some((st) => st.level === 'extra-hl')) && (
            <p className="text-xs text-gray-400 mt-4">“+ HL” = taught to everyone, with additional content at HL.</p>
          )}
        </div>

        {/* Assessment */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">How IB {s.subject} is assessed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AssessmentTable level="SL" rows={s.assessment.SL} />
            <AssessmentTable level="HL" rows={s.assessment.HL} />
          </div>
          {s.assessmentNote && <p className="text-sm text-gray-500 mt-4">{s.assessmentNote}</p>}
        </div>

        {/* IA */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-2">The internal assessment: {s.ia.name}</h2>
          <p className="text-sm text-gray-700">{s.ia.description}</p>
          {rubricHref && (
            <Link href={rubricHref} className="text-sm text-indigo-700 hover:underline mt-3 inline-block">
              See the criteria it's marked against →
            </Link>
          )}
        </div>

        {s.notes.length > 0 && (
          <div className="text-sm text-gray-600 mb-4 flex flex-col gap-1">
            {s.notes.map((n) => <p key={n}>· {n}</p>)}
          </div>
        )}

        <p className="text-xs text-gray-400 mb-8">
          From the {s.sourceLabel || `official IB subject brief (first assessment ${s.firstAssessment})`}, checked {s.checkedOn}.
          {s.source && (
            <>
              {' '}
              <a href={s.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-700">Source ↗</a>
            </>
          )}
        </p>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 mb-8">
          <p className="font-semibold mb-1">The syllabus tells you what's assessed. NetEdu tells you how you're doing.</p>
          <p className="text-sm text-indigo-200 mb-4">
            Upload your {s.subject} IA and get a mark per criterion against the official rubric — or build a roadmap that
            fits {s.subject} into everything else you're doing.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth" className="inline-block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
              Check my {s.subject} IA →
            </Link>
            <Link href="/ib-roadmap" className="inline-block border border-indigo-300 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">
              See the IB roadmap
            </Link>
          </div>
        </div>

        {siblings.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Other syllabuses in {s.group}</h2>
            <div className="flex flex-wrap gap-2">
              {siblings.map((x) => (
                <Link
                  key={x.slug}
                  href={`/ib-syllabus/${x.slug}`}
                  className="text-sm bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-700"
                >
                  {x.subject}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
