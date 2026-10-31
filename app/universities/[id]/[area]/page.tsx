import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { UNIVERSITIES, byId } from '../../index'
import { areaSlug, areaFromSlug } from '../../slugs'
import type { AreaRequirement } from '../../schema'
import { seo, breadcrumbLd } from '@/lib/seo'
import JsonLd from '@/app/components/JsonLd'
import { guideLinksFor } from '../../guide-links'

/**
 * The actual long-tail SEO page: one university, one department. This is
 * the page meant to rank for "<university> <subject> IB requirements" and
 * "<university> Türk diploması" searches — every field below comes straight
 * from the same AreaRequirement record the authenticated matcher reads, so
 * what a visitor sees here is never out of sync with what a signed-in
 * student gets from /match.
 *
 * Nothing here requires a login. The whole point is that it doesn't.
 */

function params(u: typeof UNIVERSITIES[number], a: AreaRequirement) {
  return { id: u.id, area: areaSlug(a.area) }
}

export function generateStaticParams() {
  const out: { id: string; area: string }[] = []
  for (const u of UNIVERSITIES) {
    for (const a of u.areas) {
      if (a.offered) out.push(params(u, a))
    }
  }
  return out
}

function find(id: string, areaSlugParam: string) {
  const u = byId(id)
  if (!u) return null
  const area = areaFromSlug(areaSlugParam)
  if (!area) return null
  const a = u.areas.find((x) => x.area === area && x.offered)
  if (!a) return null
  return { u, a }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; area: string }> }): Promise<Metadata> {
  const { id, area: areaParam } = await params
  const found = find(id, areaParam)
  if (!found) return {}
  const { u, a } = found
  const course = a.course || a.area
  const ibBit = a.ibPoints ? `${a.ibPoints} IB points` : 'IB requirements'
  return seo(`/universities/${u.id}/${areaSlug(a.area)}`, {
    title: `${course} at ${u.name} — ${ibBit}${a.mebAccepted ? ' & Turkish Diploma (MEB)' : ''} | NetEdu`,
    description: `${u.name} ${course}: ${a.ibPoints ? `${a.ibPoints} IB points` : 'IB requirement'}${a.ibHl ? `, HL ${a.ibHl}` : ''}${a.mebAccepted ? '. Accepts the Turkish national diploma (MEB)' : ''}. Checked ${u.checkedOn}, sourced from the university's own page.`,
  })
}

export default async function AreaPage({ params }: { params: Promise<{ id: string; area: string }> }) {
  const { id, area: areaParam } = await params
  const found = find(id, areaParam)
  if (!found) return notFound()
  const { u, a } = found

  const otherAreas = u.areas.filter((x) => x.offered && x.area !== a.area)
  const guides = guideLinksFor([
    ...(a.hlRequired || []),
    ...(a.hlRequiredAnyOf || []).flatMap((alt) => alt.subjects),
    ...(a.hlRecommended || []),
  ])

  return (
    <main className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbLd([{ name: 'NetEdu', path: '/' }, { name: 'Universities', path: '/universities' }, { name: u.name, path: `/universities/${u.id}` }, { name: a.course || a.area, path: `/universities/${u.id}/${areaSlug(a.area)}` }])} />
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-xs text-gray-400 mb-2">
          <Link href="/universities" className="hover:text-indigo-700">All universities</Link> /{' '}
          <Link href={`/universities/${u.id}`} className="hover:text-indigo-700">{u.name}</Link> / {a.area}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{a.course || a.area} at {u.name}</h1>
        <p className="text-gray-500 mb-8">
          {u.city}, {u.country} · {u.cycle} · requirements checked {u.checkedOn}
        </p>

        {/* IB requirement */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">IB Diploma requirement</h2>
          {a.ibPoints ? (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold text-gray-900">{a.ibPoints} points</span> overall
              {a.ibPointsMin ? ` (${a.ibPointsMin}–${a.ibPoints} range published)` : ''}
              {a.ibHl ? <> — Higher Level profile <span className="font-medium">{a.ibHl}</span></> : ''}
            </p>
          ) : (
            <p className="text-sm text-gray-500 mb-2">No overall IB points figure is published for this course — see the note below.</p>
          )}

          {a.hlRequired?.length ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3 text-sm text-amber-800">
              Requires <span className="font-medium">{a.hlRequired.join(' and ')}</span> at Higher Level.
              This is a prerequisite, not a preference — the application cannot be made without it.
            </div>
          ) : null}

          {a.hlRequiredAnyOf?.length ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3 text-sm text-amber-800">
              Requires{' '}
              {a.hlRequiredAnyOf
                .map((alt) => `${alt.count} of ${alt.subjects.join(', ')}`)
                .join(', or ')}{' '}
              at Higher Level.
            </div>
          ) : null}

          {a.hlRecommended?.length ? (
            <p className="text-sm text-gray-500 mt-3">
              Recommended but not required at Higher Level: {a.hlRecommended.join(', ')}.
            </p>
          ) : null}

          {a.ibPointsIfHl ? (
            <p className="text-sm text-gray-500 mt-3">
              A lower total of {a.ibPointsIfHl.points} points applies if you take Higher Level{' '}
              {a.ibPointsIfHl.subjects.join(' or ')}.
            </p>
          ) : null}

          {a.note && <p className="text-sm text-gray-500 mt-3">{a.note}</p>}
        </div>

        {guides.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
            <h2 className="font-semibold text-gray-800 mb-1">Preparing for the HL subjects this course asks for</h2>
            <p className="text-sm text-gray-500 mb-3">What each one covers, and how its Internal Assessment is marked.</p>
            <div className="flex flex-col gap-2">
              {guides.map((g) => (
                <p key={g.subject} className="text-sm text-gray-700">
                  <span className="font-medium">{g.subject}</span>{' — '}
                  <Link href={g.syllabusHref} className="text-indigo-700 hover:underline">syllabus</Link>
                  {g.iaHref && (
                    <>
                      {' · '}
                      <Link href={g.iaHref} className="text-indigo-700 hover:underline">IA rubric</Link>
                    </>
                  )}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* MEB — Turkish diploma. The thing almost nobody else publishes. */}
        {(a.mebAccepted !== undefined || a.mebMinAverage !== undefined) && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
            <h2 className="font-semibold text-gray-800 mb-1">Turkish national diploma (MEB)</h2>
            <p className="text-xs text-gray-400 mb-3">Türk lise diploması (Milli Eğitim) ile bu bölüme kabul şartı</p>
            {a.mebAccepted && a.mebMinAverage != null ? (
              <p className="text-sm text-gray-700">
                Reads a Turkish diploma average of roughly{' '}
                <span className="font-semibold text-gray-900">{a.mebMinAverage}/100</span> as broadly
                equivalent to this course's offer.
              </p>
            ) : a.mebAccepted ? (
              <p className="text-sm text-gray-700">
                Accepts the Turkish national diploma for this course, but has not published a specific
                average — contact admissions with your transcript to check where you stand.
              </p>
            ) : (
              <p className="text-sm text-gray-500">Not yet confirmed whether this course accepts the Turkish national diploma.</p>
            )}
            {a.mebNote && <p className="text-sm text-gray-500 mt-2">{a.mebNote}</p>}
            {a.mebSource && (
              <a href={a.mebSource} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline mt-2 inline-block">
                Source for the Turkish diploma figure ↗
              </a>
            )}
          </div>
        )}

        {/* Other practicals */}
        {(a.ieltsOverall || a.admissionsTest || a.tuition || a.interview || a.portfolio) && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
            <h2 className="font-semibold text-gray-800 mb-3">Other requirements</h2>
            <div className="flex flex-col gap-1.5 text-sm text-gray-700">
              {a.ieltsOverall && <p>IELTS {a.ieltsOverall}{a.ieltsComponent ? ` overall, ${a.ieltsComponent} in each component` : ' overall'}</p>}
              {a.admissionsTest && <p>Admissions test: {a.admissionsTest}{a.testThreshold ? ` (${a.testThreshold})` : ''}</p>}
              {a.tuition && <p>Tuition: {a.tuition}</p>}
              {a.interview && <p>Interview required</p>}
              {a.portfolio && <p>Portfolio required</p>}
            </div>
          </div>
        )}

        {a.source && (
          <a href={a.source} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline mb-8 inline-block">
            Official course page ↗
          </a>
        )}

        {/* The CTA the whole page exists to deliver */}
        <div className="bg-indigo-900 text-white rounded-2xl p-6 my-8">
          <p className="font-semibold mb-1">This is a live export of NetEdu's matching engine — not a static list.</p>
          <p className="text-sm text-indigo-200 mb-4">
            Enter your own IB points, HL subjects, IELTS or Turkish diploma average once, and get your
            personal Reach / Match / Safety verdict for {u.name} and every other university NetEdu covers —
            automatically, for free.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50"
          >
            Check my own fit →
          </Link>
        </div>

        {otherAreas.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Other departments at {u.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherAreas.map((other) => (
                <Link
                  key={other.area}
                  href={`/universities/${u.id}/${areaSlug(other.area)}`}
                  className="text-sm bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-700"
                >
                  {other.course || other.area}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
