import type { Metadata } from 'next'
import Link from 'next/link'
import { iaSubjectPages } from '../../ib-ia/subjects'
import { seo, breadcrumbLd } from '@/lib/seo'
import JsonLd from '@/app/components/JsonLd'
import { TrNav, TrGuideLinks, groupTr } from '../shared'

/** Turkish counterpart of /ib-ia — same subject list, same data. */

export const metadata: Metadata = seo('/tr/ib-ia', {
  title: 'IB IA Değerlendirme Kriterleri: Ders Ders Rubrik ve Puanlama | NetEdu',
  description:
    'IB Internal Assessment (IA) nasıl puanlanır? Biology, Chemistry, Physics, Economics, Psychology, Business Management, Computer Science, Matematik ve diğer dersler için kriterler, puanlar ve kelime sınırları.',
})

export default function TrIaIndex() {
  const pages = iaSubjectPages()
  const byGroup = new Map<string, typeof pages>()
  for (const p of pages) {
    if (!byGroup.has(p.group)) byGroup.set(p.group, [])
    byGroup.get(p.group)!.push(p)
  }

  return (
    <main lang="tr" className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbLd([{ name: 'NetEdu', path: '/' }, { name: 'IB IA kriterleri', path: '/tr/ib-ia' }])} />
      <TrNav enHref="/ib-ia" />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">IB IA değerlendirme kriterleri</h1>
        <p className="text-gray-600 mb-6 max-w-2xl">
          Her dersin Internal Assessment&apos;ı nasıl puanlanıyor: kriterler, her kriterin kaç puan olduğu ve
          kelime sınırı — {pages.length} ders için.
        </p>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold mb-1">Rubriği bilmek işin yarısı. Kendi puanını görmek diğer yarısı.</p>
            <p className="text-sm text-indigo-200">
              IA&apos;nı yükle; NetEdu&apos;nun checker&apos;ı onu tam bu kriterlere göre puanlasın — her kriter için
              bir puan ve bir üst banda çıkmanı engelleyen şey.
            </p>
          </div>
          <Link
            href="/auth"
            className="shrink-0 bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 text-center"
          >
            IA&apos;mı kontrol et →
          </Link>
        </div>

        <div className="flex flex-col gap-8 mb-10">
          {[...byGroup.entries()].map(([group, list]) => (
            <div key={group}>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">{groupTr(group)}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/tr/ib-ia/${p.slug}`}
                    className="bg-white border border-gray-100 rounded-xl p-4 hover:border-indigo-300 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{p.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {p.rubric.criteria.length} kriter · {p.rubric.totalMax} puan üzerinden
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <TrGuideLinks current="/tr/ib-ia" />
      </div>
    </main>
  )
}
