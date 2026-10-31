import type { Metadata } from 'next'
import Link from 'next/link'
import { UNIVERSITIES } from '../../universities/index'
import type { SubjectArea } from '../../universities/schema'
import { seo, breadcrumbLd } from '@/lib/seo'
import JsonLd from '@/app/components/JsonLd'
import { TrNav, TrGuideLinks } from '../shared'

/**
 * Turkish counterpart of /ib-roadmap. The HL statistic is computed from the
 * same university data at build time, exactly as on the English page.
 */

export const metadata: Metadata = seo('/tr/ib-roadmap', {
  title: 'IB Üniversite Yol Haritası: 9, 10, 11 ve 12. Sınıfta Ne Yapmalı? | NetEdu',
  description:
    'Yurt dışında üniversiteye başvuracak IB öğrencileri için yıl yıl plan: HL ders seçimi, IA ve Extended Essay, IELTS ve giriş sınavları (UCAT, LNAT, TMUA), personal statement ve son başvuru tarihleri — ve kendi profilinden oluşturulan kişisel yol haritası.',
})

function hlStat(area: SubjectArea, keyword: string) {
  const offered = UNIVERSITIES.filter((u) => u.country === 'United Kingdom')
    .map((u) => u.areas.find((a) => a.area === area && a.offered))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
  const requiring = offered.filter(
    (a) =>
      (a.hlRequired || []).some((s) => s.toLowerCase().includes(keyword)) ||
      (a.hlRequiredAnyOf || []).some((alt) => alt.subjects.some((s) => s.toLowerCase().includes(keyword)))
  )
  return { total: offered.length, requiring: requiring.length }
}

const STATS: { area: SubjectArea; label: string; subject: string; keyword: string }[] = [
  { area: 'Medicine', label: 'Tıp', subject: 'Chemistry', keyword: 'chem' },
  { area: 'Engineering', label: 'Mühendislik', subject: 'Mathematics', keyword: 'math' },
  { area: 'Computer Science', label: 'Bilgisayar Bilimleri', subject: 'Mathematics', keyword: 'math' },
  { area: 'Economics & Business', label: 'Ekonomi ve İşletme', subject: 'Mathematics', keyword: 'math' },
]

const TAGS: Record<string, { label: string; cls: string }> = {
  Academic: { label: 'Akademik', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  'Test Prep': { label: 'Sınavlar', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  Portfolio: { label: 'Portfolyo', cls: 'bg-green-50 text-green-700 border-green-200' },
  Research: { label: 'Araştırma', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  Activities: { label: 'Aktiviteler', cls: 'bg-red-50 text-red-700 border-red-200' },
  Applications: { label: 'Başvurular', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
}

const YEARS: { grade: string; title: string; items: { tag: string; text: React.ReactNode }[] }[] = [
  {
    grade: '9. sınıf',
    title: 'Keşfet',
    items: [
      { tag: 'Academic', text: 'Notların bundan sonra transkriptine girebilir — örneğin MEB diploma notu lisenin dört yılını da sayar.' },
      { tag: 'Activities', text: 'Yıllarca sürdürebileceğin bir iki aktivite seç. Uzun bir listeden çok derinlik, ileride çok daha iyi okunur.' },
      { tag: 'Research', text: 'Okumak isteyebileceğin alanlarda müfredatın ötesine geç. Gerçekten neyi sevdiğini fark etmeye başla.' },
    ],
  },
  {
    grade: '10. sınıf',
    title: 'HL derslerini sonu düşünerek seç',
    items: [
      { tag: 'Academic', text: <>Diploma derslerini seçmeden önce hedef bölümlerinin hangi dersleri Higher Level&apos;da istediğine bak — eksik bir HL dersi, başvurunun geri kalanı ne kadar güçlü olursa olsun bir bölümü tamamen kapatabilir. <Link href="/universities" className="underline">Herhangi bir bölüme buradan bak</Link>.</> },
      { tag: 'Test Prep', text: 'Hedef ülkelerinin hangi İngilizce sınavlarını kabul ettiğini ve hangi puanı istediğini öğren.' },
      { tag: 'Activities', text: 'Katılmaktan katkı vermeye geç: bir görev, yürüttüğün bir proje, anlatabileceğin bir sonucu olan bir şey.' },
    ],
  },
  {
    grade: '11. sınıf (DP1)',
    title: 'Kanıtları oluştur',
    items: [
      { tag: 'Academic', text: <>Çoğu okulda Internal Assessment&apos;lar bu yıl başlar. Veri ya da kaynak bulabileceğin konular seç ve her birinin nasıl puanlandığını bil — <Link href="/tr/ib-ia" className="underline">ders ders IA kriterleri</Link>.</> },
      { tag: 'Research', text: <>Çoğu okul Extended Essay&apos;e DP1&apos;de başlar. Okumak istediğin bölümle bağlantılı bir konu, aynı zamanda ilginin kanıtı olur — <Link href="/tr/ib-extended-essay" className="underline">yeni 2027 kriterleri</Link>.</> },
      { tag: 'Test Prep', text: 'Başvurular açılmadan önce IELTS ya da TOEFL puanını al ve bölümlerinin bir giriş sınavı isteyip istemediğine bak — İngiltere\'de Tıp için çoğunlukla UCAT, Hukuk için çoğu zaman LNAT, bazı Matematik, Ekonomi, Bilgisayar ve Mühendislik bölümleri için TMUA ya da ESAT.' },
      { tag: 'Applications', text: <>DP1&apos;i reach, match ve safety olarak ayrılmış bir listeyle bitir — <Link href="/universities" className="underline">üniversite ve bölüm bazında</Link>.</> },
      { tag: 'Portfolio', text: <>Yazı iyi kullan: bölümünle bağlantılı bir proje, yaz okulu ya da iş deneyimi, ve personal statement&apos;ının ilk taslağı — <Link href="/tr/ucas-personal-statement" className="underline">UCAS&apos;in yeni üç soru formatı</Link>.</> },
    ],
  },
  {
    grade: '12. sınıf (DP2)',
    title: 'Başvur',
    items: [
      { tag: 'Applications', text: 'İngiltere\'de Oxford, Cambridge ve çoğu Tıp bölümü için başvurular 15 Ekim\'de kapanır; diğer bölümlerin çoğu Ocak\'ta. Diğer ülkelerin kendi takvimleri var — her üniversite sayfasında elimizdeki bilgi yazıyor.' },
      { tag: 'Academic', text: 'İngiltere\'de teklifler predicted grade\'lere göre verilir; bu yüzden DP1 notların ve öğretmen tahminleri final sınavları kadar önemli.' },
      { tag: 'Test Prep', text: 'Giriş sınavlarına zamanında gir — bazılarının kayıt tarihi sınavın kendisinden çok önce kapanır.' },
      { tag: 'Applications', text: 'Oxford, Cambridge ve çoğu Tıp bölümü için kısa listeye kalan adaylarla genellikle sonbahar sonu ya da kışın mülakat yapılır.' },
      { tag: 'Academic', text: 'IA\'ları ve Extended Essay\'i erken bitir, sonra Mayıs\'ta final sınavları. Sonuçlar Temmuz\'da açıklanır ve koşullu teklifler o zaman kesinleşir.' },
    ],
  },
]

export default function TrRoadmapPage() {
  const stats = STATS.map((s) => ({ ...s, ...hlStat(s.area, s.keyword) })).filter((s) => s.total > 0)

  return (
    <main lang="tr" className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbLd([{ name: 'NetEdu', path: '/' }, { name: 'IB yol haritası', path: '/tr/ib-roadmap' }])} />
      <TrNav enHref="/ib-roadmap" />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Yıl yıl IB üniversite yol haritası</h1>
        <p className="text-gray-600 mb-5">
          Yurt dışında üniversiteye başvuracak bir IB öğrencisiysen 9. sınıftan mezuniyete kadar her yıl ne
          yapmalısın — ve geç verildiğinde sessizce kapı kapatan kararlar.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-10">
          <Link href="/auth" className="inline-block text-center bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">
            Yol haritamı oluştur →
          </Link>
          <p className="text-xs text-gray-500">Ücretsiz: kendi hedefin, notların ve aktivitelerinden oluşturulan bir plan.</p>
        </div>

        {stats.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
            <h2 className="font-semibold text-gray-800 mb-1">10. sınıf neden göründüğünden daha önemli?</h2>
            <p className="text-sm text-gray-500 mb-4">
              Higher Level derslerini başvurudan iki yıl önce seçiyorsun — ve pek çok bölüm için bu bir tercih değil,
              şart. NetEdu&apos;nun takip ettiği İngiltere bölümlerinden:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.area} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-indigo-900">{s.requiring} / {s.total}</p>
                  <p className="text-sm text-gray-600">{s.label} bölümünde HL {s.subject} şart</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 mb-8">
          {YEARS.map((y, i) => (
            <div key={y.grade} className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-indigo-900 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold text-indigo-900">{y.grade}</p>
                  <h2 className="font-semibold text-gray-800">{y.title}</h2>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {y.items.map((it, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${TAGS[it.tag]?.cls || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {TAGS[it.tag]?.label || it.tag}
                    </span>
                    <p className="text-sm text-gray-700">{it.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-gray-800 mb-3">Bu herkesin yol haritası. Seninki farklı olmalı.</h2>
          <p className="text-sm text-gray-700 mb-3">
            Yukarıdaki takvim her IB adayının ortak iskeleti. NetEdu sana özel olanı; sınıfın, not ortalaman,
            diploma türün, İngilizce puanın, hedef üniversite ve bölümün ve hâlihazırda yaptığın aktivitelerden
            oluşturur:
          </p>
          <div className="flex flex-col gap-1.5 text-sm text-gray-700">
            <p>· Hedeflediğin bölüm için güçlü ve zayıf yanların</p>
            <p>· Bu haftanın görevleri ve önümüzdeki üç ayın hedefleri</p>
            <p>· Mezuniyete kadar, iki aylık dönemlere bölünmüş, her birinde dört somut görev olan ve ilerledikçe işaretlediğin bir plan</p>
            <p>· Bir şeyin hemen yapılması gerektiğinde uyarılar</p>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Ücretsiz plan bu yılın ilk iki dönemini gösterir; Pro mezuniyete kadarki planın tamamını açar.
          </p>
        </div>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 mb-8">
          <p className="font-semibold mb-1">Bu takvimi kendi planına dönüştür.</p>
          <p className="text-sm text-indigo-200 mb-4">
            NetEdu&apos;ya nerede olduğunu ve nereye gitmek istediğini söyle — aradaki yol haritasını görev görev
            oluştursun.
          </p>
          <Link href="/auth" className="inline-block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
            Yol haritamı oluştur →
          </Link>
        </div>

        <TrGuideLinks current="/tr/ib-roadmap" />
      </div>
    </main>
  )
}
