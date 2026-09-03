import { NextResponse } from 'next/server'
import { requireUser, planOf, FREE_UNIVERSITY_MATCHES } from '@/lib/plan'
import { matchStudent, shortlist, covered, areaForDepartment, COVERAGE_NOTE } from '@/app/universities/match'
import { SUBJECT_AREAS, COVERED_COUNTRIES } from '@/app/universities'
import type { Country, StudentProfile, SubjectArea } from '@/app/universities'

/**
 * University matching — now computed, not generated.
 *
 * This route used to call Anthropic and ask a model to name six universities
 * with an acceptance percentage each. It no longer calls a model at all. The
 * answer comes from app/universities, where every figure was read off an
 * official page and carries the URL it came from.
 *
 * That change does three things at once: the numbers become true, a missing
 * HL subject becomes "not eligible" instead of "reach", and the endpoint costs
 * nothing to run — no tokens, no credit balance, no rate limit.
 *
 * What it will not do is answer for a country we have not researched. Saying
 * "we do not hold data for Germany yet" is the correct answer; inventing one
 * is what we removed.
 */
export async function POST(req: Request) {
  try {
    const gate = await requireUser(req)
    if (gate instanceof NextResponse) return gate

    const plan = await planOf(gate.userId)
    const body = await req.json().catch(() => ({}))

    // Which subject. Accept an explicit area, or map a free-text department.
    const area: SubjectArea | undefined = SUBJECT_AREAS.includes(body.area)
      ? body.area
      : areaForDepartment(body.department || body.area || '')

    if (!area) {
      return NextResponse.json(
        {
          error: 'Tell us which subject area you are applying to.',
          areas: SUBJECT_AREAS,
        },
        { status: 400 }
      )
    }

    const country: Country | undefined = body.country || undefined
    if (!covered(country)) {
      return NextResponse.json({
        universities: [],
        area,
        notCovered: country,
        coverageNote: COVERAGE_NOTE,
        coveredCountries: COVERED_COUNTRIES,
        plan,
      })
    }

    const profile: StudentProfile = {
      ibPredicted: numberOrUndefined(body.ibPredicted),
      hlSubjects: Array.isArray(body.hlSubjects)
        ? body.hlSubjects.filter((s: unknown) => typeof s === 'string' && s.trim())
        : undefined,
      mebAverage: numberOrUndefined(body.mebAverage ?? body.gpa),
      aLevels: typeof body.aLevels === 'string' ? body.aLevels : undefined,
      sat: numberOrUndefined(body.sat),
      act: numberOrUndefined(body.act),
      ielts: numberOrUndefined(body.ielts),
      toefl: numberOrUndefined(body.toefl),
      needsYok: Boolean(body.needsYok),
      budgetPerYear: numberOrUndefined(body.budgetPerYear),
      budgetCurrency: typeof body.budgetCurrency === 'string' ? body.budgetCurrency : undefined,
    }

    const all = matchStudent(profile, area, country)
    const eligible = all.filter((r) => r.verdict !== 'not-eligible')
    const blocked = all.filter((r) => r.verdict === 'not-eligible')

    // Free sees a shortlist. The withheld rows are dropped server-side, not
    // hidden with CSS, so the names never reach the browser.
    const shown = plan === 'pro' ? eligible : shortlist(eligible, FREE_UNIVERSITY_MATCHES)

    return NextResponse.json({
      area,
      country: country || null,
      plan,
      universities: shown,
      locked: plan === 'pro' ? 0 : Math.max(0, eligible.length - shown.length),
      /**
       * Courses the student is ineligible for, always returned in full even on
       * Free. Knowing that Imperial Computing is closed to you without HL
       * Mathematics is exactly the information worth having early, and it is
       * not a premium feature.
       */
      notEligible: blocked.map((r) => ({
        name: r.name,
        course: r.course,
        reason: r.reasons[0],
      })),
      checkedRange: coverageDates(all),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

function numberOrUndefined(v: unknown): number | undefined {
  const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN
  return Number.isFinite(n) ? n : undefined
}

/** Oldest and newest check dates in the answer, so the UI can show its age. */
function coverageDates(rows: { checkedOn: string }[]): { oldest: string; newest: string } | null {
  if (rows.length === 0) return null
  const dates = rows.map((r) => r.checkedOn).sort()
  return { oldest: dates[0], newest: dates[dates.length - 1] }
}
