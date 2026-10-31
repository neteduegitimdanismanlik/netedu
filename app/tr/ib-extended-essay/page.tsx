import type { Metadata } from 'next'
import Link from 'next/link'
import { getRubric } from '../../rubrics/schema'
import { seo, breadcrumbLd } from '@/lib/seo'
import JsonLd from '@/app/components/JsonLd'
import { TrNav, TrGuideLinks } from '../shared'

/**
 * Turkish counterpart of /ib-extended-essay. Criteria come from the same
 * 'ib-ee' rubric the checker marks with; the descriptions below are Turkish
 * summaries of the same criteria.
 */

export const metadata: Metadata = seo('/tr/ib-extended-essay', {
  title: 'IB Extended Essay 2027: Yeni Kriterler, Puanlar ve Kelime Sınırı | NetEdu',
  description:
    'Mayıs 2027 ve sonrası için IB Extended Essay nasıl puanlanır: 30 puan üzerinden beş kriter, 4.000 kelime sınırı, 500 kelimelik reflection ve eski 34 puanlık modelden farklar.',
})

const DESC_TR: Record<string, string> = {
  A: 'Araştırma sorusu, seçilen yaklaşım ve yöntem; argümanı destekleyen yapı, düzen ve kaynak gösterimi.',
  B: 'Araştırma sorusu bağlamında konu bilgisi, terminoloji ve kaynak kullanımı.',
  C: 'Kanıtın nasıl analiz edildiği ve araştırma sorusunu yanıtlayan tutarlı bir argümana dönüştürülmesi.',
  D: 'Kanıtı, kaynakları ve yöntemi tartmak; farklı görüşleri ve sınırlılıkları ele almak; essay\'in desteklediği bir sonuca varmak.',
  E: 'Reflection and Progress Form\'daki yansıma metni (en fazla 500 kelime): verdiğin kararlar, zorluklar ve araştırmacı olarak ne öğrendiğin.',
}

const CHANGES: { title: string; text: string }[] = [
  { title: '34 değil, 30 puan', text: 'Yine beş kriter var ama toplam 34\'ten 30 puana düştü.' },
  { title: 'Presentation artık ayrı bir kriter değil', text: 'Yapı, düzen ve kaynak gösterimi artık Criterion A\'nın (Framework for the essay) içinde sayılıyor.' },
  { title: 'Critical thinking ikiye bölündü', text: 'Eski 12 puanlık Criterion C; C, Analysis and line of argument (6) ve D, Discussion and evaluation (8) oldu. En çok puanlı kriter artık D.' },
  { title: 'Üç yerine tek reflection', text: 'Üç RPPF yansıması, sonda yazılan ve en fazla 500 kelimelik tek bir metne (Reflection and Progress Form) dönüştü. Criterion E (4 puan) bunu puanlıyor.' },
  { title: 'World Studies yerine interdisciplinary EE', text: 'İki Diploma dersini, IB\'nin belirlediği beş çerçeveden biri üzerinden birleştirebilirsin.' },
]

export default function TrExtendedEssayPage() {
  const r = getRubric('ib-ee')
  const criteria: { id: string; name: string; max: number }[] = r?.criteria || []
  const total = r?.totalMax ?? 30

  return (
    <main lang="tr" className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbLd([{ name: 'NetEdu', path: '/' }, { name: 'Extended Essay 2027', path: '/tr/ib-extended-essay' }])} />
      <TrNav enHref="/ib-extended-essay" />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-xs font-semibold text-indigo-700 mb-2">Mayıs 2027 ve sonrasında teslim edilen EE&apos;ler için</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">IB Extended Essay: artık nasıl puanlanıyor?</h1>
        <p className="text-gray-600 mb-5">
          Extended Essay, Diploma&apos;yı Mayıs 2027 ve sonrasında bitirecek öğrenciler için değişti. Artık beş kriter
          üzerinden {total} puanla değerlendiriliyor ve sonda tek bir reflection var. Her kriterin neyi ödüllendirdiği
          ve nelerin değiştiği burada.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <Link href="/auth" className="inline-block text-center bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">
            Extended Essay&apos;imi kontrol et →
          </Link>
          <p className="text-xs text-gray-500">Pro: 2027 modeline göre her kriter için puan ve seni geride tutan şey.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">Temel bilgiler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-indigo-900">4.000</p>
              <p className="text-sm text-gray-600">kelime sınırı</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-indigo-900">{total} puan</p>
              <p className="text-sm text-gray-600">beş kriter, A–E</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-indigo-900">500</p>
              <p className="text-sm text-gray-600">kelime sınırı (reflection)</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Kelime sayısına giriş, gelişme, sonuç ve alıntılar dahildir. Kaynakça, referanslar, içindekiler ile
            grafik, tablo ve denklemler sayılmaz. Tam liste için okulunun rehber kopyasına bak.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">Beş kriter</h2>
          <div className="flex flex-col gap-3">
            {criteria.map((c) => (
              <div key={c.id} className="flex items-start gap-4 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="w-9 h-9 bg-indigo-900 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {c.id}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-sm font-semibold text-indigo-900 shrink-0">{c.max} puan</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{DESC_TR[c.id]}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Kriter adları ve puanları IB&apos;nin 2027 rehberine göredir. Kısa açıklamalar NetEdu&apos;ya aittir.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">Eski Extended Essay&apos;den farkları</h2>
          <div className="flex flex-col gap-3 mb-5">
            {CHANGES.map((c) => (
              <div key={c.title}>
                <p className="text-sm font-medium text-gray-800">{c.title}</p>
                <p className="text-sm text-gray-600">{c.text}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Eski model (son kez Kasım 2026&apos;da)</p>
          <p className="text-sm text-gray-500">
            A Focus and method (6) · B Knowledge and understanding (6) · C Critical thinking (12) · D Presentation (4) · E Engagement (6) — 34 puan
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Bir örnek essay ya da puanlama rehberinde 34 puan veya Presentation kriteri görüyorsan, o eski modele
            göre puanlanmış demektir.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-2">Puanlar nerede?</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            C ve D kriterleri birlikte 30 puanın 14&apos;ü — essay&apos;in neredeyse yarısı. Bu analiz ve
            değerlendirme demek: ne bulduğun değil, bulduğundan ne çıkardığın, onu nasıl tarttığın ve vardığın sonucun
            gerçekten bundan çıkıp çıkmadığı. Araştırmayı iyi anlatan ama onunla tartışmayan bir essay, puanını erkenden
            sınırlar.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-2">EE notu ve Diploma puanın</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            EE&apos;in A ile E arasında bir not alır. TOK notunla birlikte Diploma toplamına en fazla 3 bonus puan
            ekler — ve ikisinden birinde E almak Diploma alamamak demek.{' '}
            <Link href="/tr/ib-tok" className="text-indigo-700 underline">EE/TOK bonus puan tablosunun tamamı</Link>.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            Bazı üniversiteler bu bonus puanları sayar, birkaçı güçlü bir EE notu için şartını düşürür.{' '}
            <Link href="/universities" className="text-indigo-700 underline">Başvuracağın üniversitelerin şartlarına bak</Link>.
          </p>
        </div>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 my-8">
          <p className="font-semibold mb-1">Extended Essay&apos;inin kaç alacağını gör — kriter kriter.</p>
          <p className="text-sm text-indigo-200 mb-4">
            NetEdu&apos;nun checker&apos;ı taslağını 2027 kriterlerine göre puanlar, her kriterin hangi bantta olduğunu
            gösterir ve bir üst banda çıkman için neyi düzeltmen gerektiğini söyler. Reflection metnini de eklersen
            Criterion E de puanlanır.
          </p>
          <Link href="/auth" className="inline-block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
            Extended Essay&apos;imi kontrol et →
          </Link>
        </div>

        <TrGuideLinks current="/tr/ib-extended-essay" />
      </div>
    </main>
  )
}
