import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { iaSubjectPages, iaSubjectBySlug } from '../../../ib-ia/subjects'
import { syllabusForIaPage } from '../../../ib-syllabus/data'
import { seo, breadcrumbLd } from '@/lib/seo'
import JsonLd from '@/app/components/JsonLd'
import { TrNav, TrGuideLinks, iaWeightSentenceTr, groupTr } from '../../shared'

/**
 * Turkish counterpart of /ib-ia/[subject]. Same rubric data. Criterion names
 * stay in English — they're the official IB names, and the English one-line
 * summaries aren't repeated here, so the page reads as Turkish throughout.
 */

export function generateStaticParams() {
  return iaSubjectPages().map((p) => ({ subject: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params
  const p = iaSubjectBySlug(subject)
  if (!p) return {}
  const names = p.rubric.criteria.map((c: any) => c.name).join(', ')
  return seo(`/tr/ib-ia/${p.slug}`, {
    title: `IB ${p.subject} IA Kriterleri ve Puanlama (${p.rubric.totalMax} puan) | NetEdu`,
    description: `IB ${p.subject} IA nasıl puanlanır: ${p.rubric.criteria.length} kriter (${names}), toplam ${p.rubric.totalMax} puan. Kendi IA'nı bu kriterlere göre NetEdu ile kontrol et.`,
  })
}

const UNIT_TR: Record<string, string> = { words: 'kelime', pages: 'sayfa', minutes: 'dakika' }

export default async function TrIaSubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
  const p = iaSubjectBySlug(subject)
  if (!p) return notFound()

  const r = p.rubric
  const criteria: any[] = r.criteria || []
  const portfolioCriteria: any[] = r.portfolioCriteria || []
  const isPortfolio = r.shape === 'portfolio'
  const siblings = iaSubjectPages().filter((x) => x.group === p.group && x.slug !== p.slug)
  const syl = syllabusForIaPage(p.slug)
  const weightLine = syl ? iaWeightSentenceTr(syl.s, syl.level) : null

  return (
    <main lang="tr" className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbLd([{ name: 'NetEdu', path: '/' }, { name: 'IB IA kriterleri', path: '/tr/ib-ia' }, { name: `IB ${p.subject} IA`, path: `/tr/ib-ia/${p.slug}` }])} />
      <TrNav enHref={`/ib-ia/${p.slug}`} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-xs text-gray-400 mb-2">
          <Link href="/tr/ib-ia" className="hover:text-indigo-700">IB IA kriterleri</Link> / {groupTr(p.group)}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-5">IB {p.subject} IA: değerlendirme kriterleri ve puanlama</h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <Link href="/auth" className="inline-block text-center bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">
            {`${p.subject} IA'mı kontrol et →`}
          </Link>
          <p className="text-xs text-gray-500">Pro: bu rubriğe göre her kriter için puan ve seni geride tutan şey.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-2">IB {p.subject} IA nasıl puanlanır?</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {isPortfolio ? (
              <>
                IB {p.subject} IA&apos;sı {r.instanceCount} parçalık bir portfolyo. Her parça {criteria.length} kriter
                üzerinden {r.totalMax} puanla değerlendirilir.
                {portfolioCriteria.length > 0 && (
                  <> Bunun üstüne {portfolioCriteria.map((c) => `${c.name} (${c.max})`).join(', ')} tüm portfolyoya bir kez uygulanır.</>
                )}
              </>
            ) : (
              <>IB {p.subject} IA&apos;sı {criteria.length} kriter üzerinden, toplam {r.totalMax} puanla değerlendirilir.</>
            )}
            {weightLine ? <> {weightLine}</> : null}
          </p>
          {r.wordCount && (
            <p className="text-sm text-gray-700 mt-2">
              Uzunluk: {r.wordCount.perInstance ? 'her parça için ' : ''}
              {r.wordCount.hard ? 'en fazla' : 'yaklaşık'} {r.wordCount.limit} {UNIT_TR[r.wordCount.unit] || r.wordCount.unit}.
            </p>
          )}
          {syl && (
            <Link href={`/ib-syllabus/${syl.s.slug}`} className="text-sm text-indigo-700 hover:underline mt-3 inline-block">
              IB {syl.s.subject} müfredatı ve sınav yapısı (İngilizce) →
            </Link>
          )}
          {p.confidence === 'low' && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-3">
              Bu dersin fen bilimleri IA çerçevesini kullandığını varsayıyoruz; kriterleri henüz dersin kendi
              rehberiyle doğrulamadık.
            </p>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">Kriterler</h2>
          <div className="flex flex-col gap-2">
            {[...criteria, ...portfolioCriteria].map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-indigo-900 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {c.id}
                </div>
                <p className="flex-1 text-sm font-medium text-gray-900">{c.name}</p>
                <p className="text-sm text-gray-500 shrink-0">{c.max} puan</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Kriter adları IB&apos;nin resmi İngilizce adlarıdır. Her kriterin kısa açıklaması{' '}
            <Link href={`/ib-ia/${p.slug}`} hrefLang="en" className="underline">İngilizce sayfada</Link>.
          </p>
        </div>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 my-8">
          <p className="font-semibold mb-1">Kendi {p.subject} IA&apos;n kaç alır — kriter kriter gör.</p>
          <p className="text-sm text-indigo-200 mb-4">
            NetEdu&apos;nun checker&apos;ı taslağını tam bu rubriğe göre puanlar, her kriterin hangi bantta olduğunu
            gösterir ve bir üst banda çıkman için neyi düzeltmen gerektiğini söyler.
          </p>
          <Link href="/auth" className="inline-block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
            {`${p.subject} IA'mı kontrol et →`}
          </Link>
        </div>

        {siblings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">{groupTr(p.group)} — diğer IA&apos;lar</h2>
            <div className="flex flex-wrap gap-2">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/tr/ib-ia/${s.slug}`}
                  className="text-sm bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-700"
                >
                  {s.subject}
                </Link>
              ))}
            </div>
          </div>
        )}

        <TrGuideLinks current="/tr/ib-ia" />
      </div>
    </main>
  )
}
