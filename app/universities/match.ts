import type { Country, StudentProfile, SubjectArea, University, FitVerdict } from './schema'
import { assessFit } from './schema'
import { UNIVERSITIES, COVERED_COUNTRIES } from './index'

/**
 * The matcher.
 *
 * This file replaces a language-model call. The old /api/match asked a model
 * to invent six universities and an acceptance percentage for each; there was
 * no year on those numbers, no source, and no relationship to the student.
 *
 * Now the answer is computed from the requirement tables. Three consequences,
 * all of them good:
 *   1. Every figure a student sees is traceable to an official page.
 *   2. A missing HL subject produces "not eligible", not "reach".
 *   3. It costs nothing to run. No tokens, no rate limit, no credit balance.
 *
 * The price is honesty about coverage: we can only answer for the countries in
 * COVERED_COUNTRIES. For anywhere else the right answer is to say so.
 */

export interface MatchRow {
  id: string
  name: string
  city: string
  country: Country
  tier: University['tier']
  verdict: FitVerdict
  /** Why — built from the data, never from a model. */
  reasons: string[]
  /** What the student has not told us that would sharpen the answer. */
  missing: string[]
  course?: string
  admissionsTest?: string
  language?: string
  headline?: string
  tuition?: string
  deadline?: string
  cycle: string
  checkedOn: string
  source?: string
}

const VERDICT_ORDER: Record<FitVerdict, number> = {
  match: 0,
  safety: 1,
  reach: 2,
  unknown: 3,
  'not-eligible': 4,
}

function tuitionLine(u: University): string | undefined {
  if (u.tuitionIntlMin == null) return undefined
  const cur = u.tuitionCurrency ?? ''
  const range =
    u.tuitionIntlMax != null && u.tuitionIntlMax !== u.tuitionIntlMin
      ? `${u.tuitionIntlMin.toLocaleString()}–${u.tuitionIntlMax.toLocaleString()}`
      : u.tuitionIntlMin.toLocaleString()
  return `${range} ${cur}${u.tuitionYear ? ` · ${u.tuitionYear}` : ''}`
}

/**
 * Every university in the tables that runs this subject, assessed against this
 * student. Universities that do not offer the subject are dropped entirely —
 * there is no point telling a student that LSE has no engineering department
 * when they asked for engineering.
 */
export function matchStudent(
  profile: StudentProfile,
  area: SubjectArea,
  country?: Country
): MatchRow[] {
  const rows: MatchRow[] = []

  for (const u of UNIVERSITIES) {
    if (country && u.country !== country) continue
    const req = u.areas.find((a) => a.area === area)
    if (!req || !req.offered) continue

    const fit = assessFit(profile, u, area)

    rows.push({
      id: u.id,
      name: u.name,
      city: u.city,
      country: u.country,
      tier: u.tier,
      verdict: fit.verdict,
      reasons: fit.reasons,
      missing: fit.missing,
      course: req.course,
      admissionsTest: req.admissionsTest,
      language: req.language ?? u.teachingLanguage,
      headline: u.headline,
      tuition: req.tuition ?? tuitionLine(u),
      deadline: u.deadlineNote,
      cycle: u.cycle,
      checkedOn: u.checkedOn,
      source: req.source ?? u.sources[0],
    })
  }

  rows.sort((a, b) => {
    const v = VERDICT_ORDER[a.verdict] - VERDICT_ORDER[b.verdict]
    if (v !== 0) return v
    // Within a band, spread the tiers rather than stacking the famous ones.
    const tierRank = { high: 0, mid: 1, accessible: 2 } as const
    return tierRank[a.tier] - tierRank[b.tier]
  })

  return rows
}

/**
 * A free-tier shortlist: one Reach, one Match, one Safety where they exist,
 * topped up in order if a band is empty. The point is to show the SHAPE of the
 * answer, not three long shots.
 */
export function shortlist(rows: MatchRow[], limit: number): MatchRow[] {
  const picked: MatchRow[] = []
  for (const want of ['match', 'safety', 'reach'] as FitVerdict[]) {
    const found = rows.find((r) => r.verdict === want && !picked.includes(r))
    if (found) picked.push(found)
  }
  for (const r of rows) {
    if (picked.length >= limit) break
    if (!picked.includes(r)) picked.push(r)
  }
  return picked.slice(0, limit)
}

/** True when we hold verified data for this country. */
export function covered(country?: string): boolean {
  if (!country) return true
  return (COVERED_COUNTRIES as string[]).includes(country)
}

export const COVERAGE_NOTE =
  'We hold requirements read from official university pages for the United Kingdom, the Netherlands, Italy, Czechia, France, Belgium, Switzerland and Japan. For any other country we would be guessing, so we do not answer.'

/**
 * Maps the department a student types to one of the seven areas the tables
 * cover. Returns undefined when nothing fits, so the caller can ask rather
 * than silently matching them against the wrong subject.
 */
export function areaForDepartment(input: string): SubjectArea | undefined {
  const d = (input || '').toLowerCase()
  const table: [SubjectArea, string[]][] = [
    ['Medicine', ['medicine', 'medical', 'dentistry', 'dental', 'pharmacy', 'nursing', 'veterinary', 'tıp', 'diş']],
    ['Computer Science', ['computer', 'computing', 'software', 'informatics', 'artificial intelligence', 'data science', 'ai', 'bilgisayar', 'yazılım']],
    ['Engineering', ['engineering', 'mechanical', 'electrical', 'civil', 'aerospace', 'chemical eng', 'biomedical eng', 'mühendis']],
    ['Economics & Business', ['economic', 'business', 'management', 'finance', 'accounting', 'marketing', 'econometrics', 'ekonomi', 'işletme']],
    ['Law', ['law', 'legal', 'jurisprudence', 'hukuk']],
    ['Architecture & Art', ['architecture', 'art', 'design', 'fine art', 'mimar', 'sanat', 'tasarım']],
    ['Psychology', ['psychology', 'psychological', 'cognitive science', 'psikoloji']],
  ]
  for (const [area, keys] of table) {
    if (keys.some((k) => d.includes(k))) return area
  }
  return undefined
}
