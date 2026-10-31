import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { iaSubjectPages, iaSubjectBySlug, firstSentence } from '../subjects'

/**
 * One public page per IB subject: how its Internal Assessment is marked.
 * Meant to rank for "IB <subject> IA rubric / criteria / marking" searches.
 *
 * Deliberately shows the SHAPE of the rubric — criterion names, marks,
 * a one-line summary of each, word limit — and not the full band-by-band
 * descriptors. Those live inside the checker, which is where a student
 * actually needs them (applied to their own work), and it keeps this page
 * from becoming a copy of the subject guide.
 */

function plural(word: string, n: number): string {
  if (n === 1) return word
  return word.endsWith('y') ? `${word.slice(0, -1)}ies` : `${word}s`
}

export function generateStaticParams() {
  return iaSubjectPages().map((p) => ({ subject: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params
  const p = iaSubjectBySlug(subject)
  if (!p) return {}
  const names = p.rubric.criteria.map((c: any) => c.name).join(', ')
  return {
    title: `IB ${p.subject} IA Rubric & Marking Criteria (out of ${p.rubric.totalMax}) | NetEdu`,
    description: `How the IB ${p.subject} Internal Assessment is marked: ${p.rubric.criteria.length} criteria (${names}), out of ${p.rubric.totalMax}. Check your own IA against the rubric for free.`,
  }
}

export default async function IaSubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
  const p = iaSubjectBySlug(subject)
  if (!p) return notFound()

  const r = p.rubric
  const criteria: any[] = r.criteria || []
  const portfolioCriteria: any[] = r.portfolioCriteria || []
  const isPortfolio = r.shape === 'portfolio'
  const summary = criteria.map((c) => `${c.name} (${c.max})`).join(', ')

  const siblings = iaSubjectPages().filter((x) => x.group === p.group && x.slug !== p.slug)

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

      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-xs text-gray-400 mb-2">
          <Link href="/ib-ia" className="hover:text-indigo-700">IB IA rubrics</Link> / {p.group}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">IB {p.subject} IA: rubric and marking criteria</h1>
        <p className="text-xs text-gray-400 mb-6">IB {p.subject} IA değerlendirme kriterleri ve puanlama</p>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-2">How is the IB {p.subject} IA marked?</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {isPortfolio ? (
              <>
                The IB {p.subject} IA is a portfolio of {r.instanceCount} {plural(r.instanceLabel || 'piece', r.instanceCount)}.
                Each one is marked out of {r.totalMax} across {criteria.length} criteria: {summary}.
                {portfolioCriteria.length > 0 && (
                  <> On top of that, {portfolioCriteria.map((c) => `${c.name} (${c.max})`).join(', ')} is applied once to the whole portfolio.</>
                )}
              </>
            ) : (
              <>
                The IB {p.subject} IA is marked out of {r.totalMax} across {criteria.length} criteria: {summary}.
              </>
            )}
            {r.weight ? <> It counts for {r.weight}% of the final {p.subject} grade.</> : null}
          </p>
          {r.wordCount && (
            <p className="text-sm text-gray-700 mt-2">
              Length: {r.wordCount.hard ? 'up to' : 'around'} {r.wordCount.limit} {r.wordCount.unit}
              {r.wordCount.perInstance ? ` per ${r.instanceLabel || 'piece'}` : ''}
              {r.wordCount.excluded?.length ? ` (not counting ${r.wordCount.excluded.join(', ')})` : ''}.
            </p>
          )}
          {p.note && <p className="text-sm text-gray-500 mt-3">{p.note}</p>}
          {p.confidence === 'low' && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-3">
              This subject is assumed to share the sciences IA framework; we haven't verified its criteria against its own guide yet.
            </p>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">The criteria</h2>
          <div className="flex flex-col gap-3">
            {[...criteria, ...portfolioCriteria].map((c) => (
              <div key={c.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-indigo-900 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {c.id}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400 shrink-0">{c.max} marks</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{firstSentence(c.description)}</p>
                  {c.textReadable === false && (
                    <p className="text-xs text-gray-400 mt-1">Assessed from a recording or artefact, not the written text.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 my-8">
          <p className="font-semibold mb-1">See what your own {p.subject} IA would score — criterion by criterion.</p>
          <p className="text-sm text-indigo-200 mb-4">
            NetEdu's checker marks your draft against this exact rubric, shows the band each criterion lands in, and
            tells you what's holding it back from the next one. Free to try.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50"
          >
            Check my {p.subject} IA →
          </Link>
        </div>

        {siblings.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Other IA rubrics in {p.group}</h2>
            <div className="flex flex-wrap gap-2">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/ib-ia/${s.slug}`}
                  className="text-sm bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-700"
                >
                  {s.subject}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
