import type { Metadata } from 'next'
import Link from 'next/link'
import { seo, breadcrumbLd } from '@/lib/seo'
import JsonLd from '@/app/components/JsonLd'
import { TrNav, TrGuideLinks } from '../shared'

/** Turkish counterpart of /ib-tok. Same facts and the same matrix. */

export const metadata: Metadata = seo('/tr/ib-tok', {
  title: 'IB TOK Essay, Exhibition ve Bonus Puan Tablosu (EE/TOK Matrisi) | NetEdu',
  description:
    'Theory of Knowledge nasıl değerlendirilir: 1.600 kelimelik TOK essay ve 950 kelimelik exhibition, her biri 10 puan üzerinden. EE ve TOK notlarına göre 0–3 bonus puan tablosu.',
})

const GRADES = ['A', 'B', 'C', 'D', 'E'] as const

// MATRIX[tok][ee] — Diploma toplamına eklenen puan. 'F' = diploma yok.
const MATRIX: Record<string, Record<string, number | 'F'>> = {
  A: { A: 3, B: 3, C: 2, D: 2, E: 'F' },
  B: { A: 3, B: 2, C: 2, D: 1, E: 'F' },
  C: { A: 2, B: 2, C: 1, D: 0, E: 'F' },
  D: { A: 2, B: 1, C: 0, D: 0, E: 'F' },
  E: { A: 'F', B: 'F', C: 'F', D: 'F', E: 'F' },
}

function cellClass(v: number | 'F') {
  if (v === 'F') return 'bg-red-50 text-red-700'
  if (v === 3) return 'bg-indigo-900 text-white'
  if (v === 2) return 'bg-indigo-200 text-indigo-900'
  if (v === 1) return 'bg-indigo-50 text-indigo-900'
  return 'bg-gray-50 text-gray-500'
}

export default function TrTokPage() {
  return (
    <main lang="tr" className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbLd([{ name: 'NetEdu', path: '/' }, { name: 'TOK ve bonus puanlar', path: '/tr/ib-tok' }])} />
      <TrNav enHref="/ib-tok" />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">TOK değerlendirmesi ve IB bonus puan tablosu</h1>
        <p className="text-gray-600 mb-5">
          Theory of Knowledge iki parçada değerlendirilir — bir essay ve bir exhibition — ve A ile E arasında not
          alır. Extended Essay notunla birlikte, Diploma&apos;nın 45 puanından 3&apos;ünü belirler.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <Link href="/auth" className="inline-block text-center bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">
            Puanım beni nereye götürür? →
          </Link>
          <p className="text-xs text-gray-500">Ücretsiz: tahmini puanın, gerçek üniversite şartlarıyla karşılaştırılır.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <p className="text-xs font-semibold text-indigo-700 mb-1">TOK notunun üçte ikisi</p>
            <h2 className="font-semibold text-gray-800 mb-3">TOK essay</h2>
            <div className="flex flex-col gap-1.5 text-sm text-gray-700">
              <p>· En fazla <strong>1.600 kelime</strong></p>
              <p>· IB&apos;nin her sınav dönemi için yayımladığı <strong>altı başlıktan</strong> (prescribed title) biri üzerine</p>
              <p>· <strong>10 puan</strong> üzerinden, IB examiner&apos;ları tarafından dışarıda puanlanır</p>
              <p>· Bütüncül puanlanır — ayrı kriterler yok, essay&apos;in tamamı için tek bir değerlendirme</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <p className="text-xs font-semibold text-indigo-700 mb-1">TOK notunun üçte biri</p>
            <h2 className="font-semibold text-gray-800 mb-3">TOK exhibition</h2>
            <div className="flex flex-col gap-1.5 text-sm text-gray-700">
              <p>· TOK&apos;un etrafındaki dünyada nasıl karşına çıktığını gösteren <strong>üç obje</strong></p>
              <p>· Hepsi <strong>35 IA prompt&apos;undan biriyle</strong> bağlantılı</p>
              <p>· En fazla <strong>950 kelimelik</strong> bir yorum (commentary)</p>
              <p>· Öğretmenin <strong>10 puan</strong> üzerinden puanlar, IB moderasyonla kontrol eder</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-1">EE/TOK bonus puan tablosu</h2>
          <p className="text-sm text-gray-500 mb-4">
            TOK notunu solda, Extended Essay notunu üstte bul. Kesiştikleri sayı, altı dersinin puanına (en fazla 42)
            eklenir — toplam en fazla 45.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-separate" style={{ borderSpacing: 4 }}>
              <thead>
                <tr>
                  <th className="text-xs text-gray-400 font-medium p-2 text-left">TOK ↓ / EE →</th>
                  {GRADES.map((g) => (
                    <th key={g} className="text-xs font-semibold text-gray-600 p-2">{g}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRADES.map((tok) => (
                  <tr key={tok}>
                    <th className="text-xs font-semibold text-gray-600 p-2 text-left">{tok}</th>
                    {GRADES.map((ee) => {
                      const v = MATRIX[tok][ee]
                      return (
                        <td key={ee} className={`rounded-lg p-2.5 font-semibold ${cellClass(v)}`}>
                          {v === 'F' ? 'Kalır' : `+${v}`}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-1.5 text-sm text-gray-700 mt-4">
            <p>· <strong>3 puan</strong>: ikisi de A, ya da biri A diğeri B</p>
            <p>· <strong>TOK&apos;ta ya da Extended Essay&apos;de E</strong> almak, diğer notların ne olursa olsun Diploma alamamak demek</p>
            <p>· Tablo, 2027&apos;deki yeni Extended Essay için de aynı</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-2">Bonus puanlar kabul şartı için neden önemli?</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Pek çok üniversite teklifi (offer) bir toplam puan şartıdır ve çoğu bu bonus puanları da sayar. EE ve
            TOK&apos;tan gelen iki puan, şartı tutturmakla kaçırmak arasındaki fark olabilir. Bazı üniversiteler ise
            sadece altı dersini sayar; bazıları güçlü bir Extended Essay notu için şartı düşürür. Üniversiteye ve
            bölüme göre değişir — o yüzden her birine ayrı bakmak gerekir.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            <Link href="/universities" className="text-indigo-700 underline">Herhangi bir üniversite ve bölümün IB şartlarına bak</Link>.
          </p>
        </div>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 my-8">
          <p className="font-semibold mb-1">Toplamını biliyorsun. Şimdi seni nereye götürdüğünü gör.</p>
          <p className="text-sm text-indigo-200 mb-4">
            NetEdu&apos;nun eşleştirme motoru tahmini puanını ve HL derslerini takip ettiği her üniversitenin gerçek
            şartlarıyla karşılaştırır ve bölüm bölüm reach, match ve safety olarak sıralar.
          </p>
          <Link href="/auth" className="inline-block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
            Beni üniversitelerle eşleştir →
          </Link>
        </div>

        <TrGuideLinks current="/tr/ib-tok" />
      </div>
    </main>
  )
}
