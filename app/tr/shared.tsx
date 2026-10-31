import Link from 'next/link'
import type { SyllabusSubject } from '../ib-syllabus/data'

/**
 * Shared pieces of the Turkish (/tr) guide pages.
 *
 * Every /tr page is the Turkish counterpart of an English page at the same
 * path without /tr. lib/seo.ts links each pair with hreflang, so Google
 * shows Turkish searchers this version. Facts and figures come from the same
 * data as the English pages; only the wording is Turkish. Official IB names
 * (criterion names, "Higher Level", "Extended Essay") stay in English, the
 * way Turkish IB students and teachers actually use them.
 */

export function TrNav({ enHref }: { enHref: string }) {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 w-fit">
        <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">N</span>
        </div>
        <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/universities" className="text-xs text-gray-500 hover:text-indigo-700">Üniversite şartları</Link>
        <Link href={enHref} hrefLang="en" className="text-xs text-gray-500 hover:text-indigo-700">English</Link>
      </div>
    </nav>
  )
}

export const TR_GUIDES: { href: string; label: string }[] = [
  { href: '/tr/ib-ia', label: 'IB IA kriterleri' },
  { href: '/tr/ib-extended-essay', label: 'Extended Essay 2027' },
  { href: '/tr/ib-tok', label: 'TOK ve bonus puanlar' },
  { href: '/tr/ucas-personal-statement', label: 'UCAS personal statement' },
  { href: '/tr/ib-roadmap', label: 'IB yol haritası' },
]

export function TrGuideLinks({ current }: { current: string }) {
  return (
    <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-2">
      {TR_GUIDES.filter((g) => g.href !== current).map((g) => (
        <Link
          key={g.href}
          href={g.href}
          className="text-sm bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-700"
        >
          {g.label}
        </Link>
      ))}
      <Link
        href="/universities"
        className="text-sm bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-700"
      >
        Üniversite ve bölüm şartları
      </Link>
    </div>
  )
}

/**
 * Turkish version of iaWeightSentence (app/ib-syllabus/data.ts). Phrased as
 * "ağırlığı %X" on purpose: Turkish suffixes after a percentage change with
 * the number ("%30'u", "%20'si"), and this wording needs none.
 */
export function iaWeightSentenceTr(s: SyllabusSubject, level?: 'SL' | 'HL'): string | null {
  const { weightSL, weightHL } = s.ia
  if (level === 'SL') return typeof weightSL === 'number' ? `SL final notundaki ağırlığı %${weightSL}.` : null
  if (level === 'HL') {
    if (typeof weightHL !== 'number') return null
    return weightSL === null
      ? `Sadece HL'de var; HL final notundaki ağırlığı %${weightHL}. SL öğrencileri bu derste IA yapmaz.`
      : `HL final notundaki ağırlığı %${weightHL}.`
  }
  if (typeof weightSL === 'number' && typeof weightHL === 'number') {
    return weightSL === weightHL
      ? `Final notundaki ağırlığı hem SL'de hem HL'de %${weightSL}.`
      : `Final notundaki ağırlığı SL'de %${weightSL}, HL'de %${weightHL}.`
  }
  if (typeof weightHL === 'number') return `HL final notundaki ağırlığı %${weightHL}.`
  return null
}

const GROUP_TR: Record<string, string> = {
  'Group 1 — Studies in Language and Literature': 'Grup 1 — Dil ve Edebiyat',
  'Group 2 — Language Acquisition': 'Grup 2 — Yabancı Dil',
  'Group 3 — Individuals and Societies': 'Grup 3 — Bireyler ve Toplumlar',
  'Group 4 — Sciences': 'Grup 4 — Fen Bilimleri',
  'Group 5 — Mathematics': 'Grup 5 — Matematik',
  'Group 6 — The Arts': 'Grup 6 — Sanat',
}

export function groupTr(group: string): string {
  return GROUP_TR[group] || group
}
