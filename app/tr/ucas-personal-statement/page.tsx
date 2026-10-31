import type { Metadata } from 'next'
import Link from 'next/link'
import Counter from '../../ucas-personal-statement/Counter'
import { QUESTIONS } from '../../ucas-personal-statement/questions'
import { seo, breadcrumbLd } from '@/lib/seo'
import JsonLd from '@/app/components/JsonLd'
import { TrNav, TrGuideLinks } from '../shared'

/**
 * Turkish counterpart of /ucas-personal-statement. The questions are shown in
 * UCAS's own English wording (that's what the student answers) with a
 * Turkish translation underneath.
 */

export const metadata: Metadata = seo('/tr/ucas-personal-statement', {
  title: 'UCAS Personal Statement Nasıl Yazılır: 3 Soru, Karakter Sınırı ve IB İpuçları | NetEdu',
  description:
    'Yeni UCAS personal statement formatı IB öğrencileri için: üç soru, 4.000 karakter sınırı ve soru başına en az 350 karakter, ücretsiz karakter sayacı ve Extended Essay, IA, TOK ve CAS\'i nereye yazacağın.',
})

const QUESTIONS_TR = [
  'Bu bölümü ya da alanı neden okumak istiyorsun?',
  'Aldığın eğitim ve dersler seni bu bölüme nasıl hazırladı?',
  'Okul dışında hazırlık için başka neler yaptın ve bu deneyimler neden faydalı?',
]

const IB_TIPS: { q: number; text: string }[] = [
  { q: 1, text: 'Kariyerle değil, konunun kendisiyle başla. Bu alanda seni üç dört yıl daha okumaya isteklendiren ne — bir problem, bir fikir, bir kitap, dönüp dönüp düşündüğün bir soru?' },
  { q: 2, text: 'Diploma\'nın işe yaradığı yer burası. HL derslerin, bir şeyi kendin test ettiğin bir IA ve özellikle bölümle bağlantılı bir Extended Essay: yaptığını söylemek yetmez, neyi araştırdığını ve bunun sana konu hakkında ne öğrettiğini anlat.' },
  { q: 2, text: 'TOK, alanındaki bilgiye bakışını değiştirdiyse bir cümleyi hak eder — Tarih\'te kanıtın nasıl işlediği ya da Matematik\'te bir ispatın gerçekte neyi gösterdiği gibi.' },
  { q: 3, text: 'CAS, iş deneyimi, yarışmalar, okumalar, online kurslar, kendi projen. Birkaçını seç ve her birinin seni neden hazırladığını anlat — ne yaptın, neyi fark ettin, sana konu hakkında ne gösterdi.' },
]

export default function TrPersonalStatementPage() {
  return (
    <main lang="tr" className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbLd([{ name: 'NetEdu', path: '/' }, { name: 'UCAS personal statement', path: '/tr/ucas-personal-statement' }])} />
      <TrNav enHref="/ucas-personal-statement" />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">UCAS personal statement: üç soru, 4.000 karakter</h1>
        <p className="text-gray-600 mb-5">
          2026 girişinden itibaren UCAS personal statement artık tek parça serbest bir essay değil. Aynı 4.000
          karakter sınırı içinde, belirlenmiş üç soruyu cevaplıyorsun. Nasıl çalıştığı, taslağını kontrol edeceğin
          bir sayaç ve IB Diploma&apos;nın nereye oturduğu burada.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <Link href="/auth" className="inline-block text-center bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">
            Statement&apos;ım için geri bildirim al →
          </Link>
          <p className="text-xs text-gray-500">Pro: ses, yapı, yansıtma ve dil için puan, önce neyi düzeltmen gerektiği.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">Üç soru</h2>
          <div className="flex flex-col gap-3">
            {QUESTIONS.map((q, i) => (
              <div key={q} className="flex items-start gap-4">
                <div className="w-9 h-9 bg-indigo-900 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="pt-1">
                  <p className="text-sm text-gray-800">{q}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{QUESTIONS_TR[i]}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">Sorular UCAS&apos;in kendi İngilizce ifadesiyle; altındakiler çeviri. Cevapları İngilizce yazacaksın.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">Kurallar</h2>
          <div className="flex flex-col gap-1.5 text-sm text-gray-700">
            <p>· Üç cevabın toplamı <strong>4.000 karakter</strong>, boşluklar dahil</p>
            <p>· Soruların kendisi sınıra <strong>dahil değil</strong></p>
            <p>· Her cevapta en az <strong>350 karakter</strong></p>
            <p>· Bunun dışında 4.000&apos;i bölümüne nasıl uyuyorsa öyle bölebilirsin — cevapların eşit olması gerekmiyor</p>
            <p>· Kabul görevlileri üç cevabı tek bir metin gibi birlikte okur; aynı şeyi iki kez yazma</p>
            <p>· Tek bir statement başvurduğun bütün bölümlere gider; o yüzden tek bir üniversiteyi değil, alanı anlat</p>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            UCAS, Tıp ve Hemşirelik gibi bölümlerin iş deneyimi nedeniyle 3. soruya daha çok ağırlık verdiğini
            belirtiyor. Bölümün için her üniversitenin kendi rehberine de bak.
          </p>
        </div>

        <Counter lang="tr" translations={QUESTIONS_TR} />

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">IB Diploma&apos;n nereye yazılır?</h2>
          <div className="flex flex-col gap-3">
            {IB_TIPS.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs px-2 py-0.5 rounded-full border shrink-0 mt-0.5 bg-indigo-50 text-indigo-700 border-indigo-200">
                  {t.q}. soru
                </span>
                <p className="text-sm text-gray-700">{t.text}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-700 mt-4">
            Yazmaya başlamadan önce, derslerinle o bölüme gerçekten girebildiğinden emin ol — İngiltere&apos;de pek
            çok bölüm belirli bir HL dersi şart koşar ve hiçbir statement eksik bir dersi telafi etmez.{' '}
            <Link href="/universities" className="text-indigo-700 underline">İngiltere&apos;deki herhangi bir bölümün IB şartlarına bak</Link>.
          </p>
        </div>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 my-8">
          <p className="font-semibold mb-1">Statement&apos;ını UCAS&apos;ten önce biri okusun.</p>
          <p className="text-sm text-indigo-200 mb-4">
            Taslağını NetEdu&apos;nun checker&apos;ına yapıştır. Kişisel sesini, yapını, yansıtmanı ve dilini puanlar,
            her birinin nerede olduğunu gösterir ve önce neyi değiştirmen gerektiğini söyler.
          </p>
          <Link href="/auth" className="inline-block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
            Statement&apos;ım için geri bildirim al →
          </Link>
        </div>

        <TrGuideLinks current="/tr/ucas-personal-statement" />
      </div>
    </main>
  )
}
