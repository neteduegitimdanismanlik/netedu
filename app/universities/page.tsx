import type { Metadata } from 'next'
import { seo, breadcrumbLd } from '@/lib/seo'
import JsonLd from '@/app/components/JsonLd'
import Link from 'next/link'
import { UNIVERSITIES } from './index'
import { areaSlug } from './slugs'

/**
 * Public, unauthenticated index of every university we hold verified
 * requirements for — the root of the SEO funnel. No login, no app chrome:
 * this exists so Google (and a student who followed a search result here)
 * can see the full breadth of what NetEdu covers and click into a specific
 * university, and so every /universities/[id] page has something linking
 * to it besides the sitemap.
 */

export const metadata: Metadata = seo('/universities', {
  title: 'University IB & Turkish Diploma Requirements — NetEdu',
  description:
    'Verified IB Diploma and Turkish national diploma (MEB) entry requirements for universities across the UK, Netherlands, Italy, Czechia, Belgium, Switzerland, France and Japan — by university and by department.',
})

export default function UniversitiesIndex() {
  const byCountry = new Map<string, typeof UNIVERSITIES>()
  for (const u of UNIVERSITIES) {
    if (!byCountry.has(u.country)) byCountry.set(u.country, [])
    byCountry.get(u.country)!.push(u)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbLd([{ name: 'NetEdu', path: '/' }, { name: 'Universities', path: '/universities' }])} />
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">University entry requirements</h1>
        <p className="text-gray-600 mb-6 max-w-2xl">
          Verified IB Diploma and Turkish national diploma (MEB) requirements, read directly off each
          university's own pages — {UNIVERSITIES.length} universities across {byCountry.size} countries.
          Pick one below, or build your own personalized shortlist across all of them at once.
        </p>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold mb-1">This list is a live export of NetEdu's matching engine.</p>
            <p className="text-sm text-indigo-200">
              Enter your own IB points, Turkish diploma average or HL subjects once, and see your personal
              Reach / Match / Safety verdict across every university here — not just one page at a time.
            </p>
          </div>
          <Link
            href="/auth"
            className="shrink-0 bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 text-center"
          >
            Try it free →
          </Link>
        </div>

        {[...byCountry.entries()].map(([country, unis]) => (
          <div key={country} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">{country}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {unis.map((u) => (
                <Link
                  key={u.id}
                  href={`/universities/${u.id}`}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <p className="font-medium text-gray-900 text-sm">{u.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{u.city}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {u.areas.filter((a) => a.offered).length} department
                    {u.areas.filter((a) => a.offered).length === 1 ? '' : 's'} covered
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
