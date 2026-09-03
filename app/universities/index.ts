import type { Country, University, SubjectArea } from './schema'
import { UK_UNIVERSITIES } from './uk'
import { NL_UNIVERSITIES } from './netherlands'
import { CZ_UNIVERSITIES } from './czechia'
import { IT_UNIVERSITIES } from './italy'
import { BE_UNIVERSITIES } from './belgium'
import { CH_UNIVERSITIES } from './switzerland'
import { JP_UNIVERSITIES } from './japan'
import { FR_UNIVERSITIES } from './france'

/**
 * The registry. One entry per country file, exactly like the rubric registry —
 * adding a country means writing its data file and registering it here, with
 * no change to the matcher.
 *
 * COVERAGE, honestly stated. The UI must be able to say "we hold verified data
 * for these countries and nothing for the rest", because a matcher that
 * silently invents an answer for France is worse than one that says it does
 * not know.
 */
export const UNIVERSITIES: University[] = [
  ...UK_UNIVERSITIES,
  ...NL_UNIVERSITIES,
  ...CZ_UNIVERSITIES,
  ...IT_UNIVERSITIES,
  ...BE_UNIVERSITIES,
  ...CH_UNIVERSITIES,
  ...JP_UNIVERSITIES,
  ...FR_UNIVERSITIES,
]

export const COVERED_COUNTRIES: Country[] = [
  ...new Set(UNIVERSITIES.map((u) => u.country)),
]

/**
 * Countries the student may ask about that we cannot yet answer for.
 * All eight target countries are now covered to some depth; this list is kept
 * so the UI can still say "we do not hold data for X" the moment a student
 * asks about a ninth.
 */
export const NOT_YET_COVERED: string[] = []

export function byId(id: string): University | undefined {
  return UNIVERSITIES.find((u) => u.id === id)
}

/** Universities that actually run this subject, optionally within one country. */
export function offering(area: SubjectArea, country?: Country): University[] {
  return UNIVERSITIES.filter(
    (u) =>
      (!country || u.country === country) &&
      u.areas.some((a) => a.area === area && a.offered)
  )
}

/**
 * True when we hold verified requirements for this country. The matcher uses
 * this to decide whether to answer from data or to say plainly that it cannot.
 */
export function isCovered(country: string): boolean {
  return COVERED_COUNTRIES.includes(country as Country)
}

/** How many universities we hold per country, for an honest coverage note. */
export function coverageByCountry(): Record<string, number> {
  const out: Record<string, number> = {}
  for (const u of UNIVERSITIES) out[u.country] = (out[u.country] || 0) + 1
  return out
}

export * from './schema'
