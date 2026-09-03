/**
 * University entry requirements — data, not code.
 *
 * The same principle as the rubric registry: every number in here was read off
 * an official university page, and every record carries the URL it came from
 * and the date it was checked. Nothing is estimated, nothing is remembered,
 * nothing is inferred from a similar university.
 *
 * A field that could not be verified is simply absent. An absent field must
 * render as "not published" or "check the course page" — never as a guess and
 * never as zero.
 *
 * WHAT THIS REPLACES
 * The matcher used to ask a language model to invent an acceptance percentage.
 * Those numbers had no year, no source and no relationship to the student.
 * What a student actually needs is the published requirement and an honest
 * comparison against their own profile, which is what assessFit() produces.
 */

export type Country =
  | 'United Kingdom'
  | 'Netherlands'
  | 'Japan'
  | 'Italy'
  | 'Czechia'
  | 'France'
  | 'Belgium'
  | 'Switzerland'

/** Broad bands, used only to spread a shortlist — never shown as a ranking. */
export type Tier = 'high' | 'mid' | 'accessible'

/**
 * How a country actually decides admission. This matters more than it looks.
 *
 * The UK model — a conditional offer expressed in IB points — is the exception,
 * not the rule. Applying Reach / Match / Safety to a Belgian university, where
 * admission turns on whether your diploma is recognised and nothing else, would
 * invent a precision that does not exist. So the matcher branches on this.
 *
 *  offer        A conditional grade offer. UK.
 *  test-ranked  A test score produces a national or institutional ranking.
 *               Italy (TOL, TIL, CEnT-S, IMAT), Czech faculty entrance exams.
 *  selection    Diploma plus named prior subjects, then a capped selection
 *               round. Netherlands numerus fixus.
 *  recognition  Admission turns on whether the foreign diploma is recognised:
 *               a minimum total plus a strict subject combination. Switzerland.
 *  open         Anyone with a recognised diploma and the right language may
 *               enrol; only a few courses have an entrance exam. Belgium.
 *  dossier      A small English-track intake judged on documents, essays and
 *               sometimes an interview, with no published threshold. Japan.
 */
export type AdmissionModel =
  | 'offer'
  | 'test-ranked'
  | 'selection'
  | 'recognition'
  | 'open'
  | 'dossier'

export type SubjectArea =
  | 'Medicine'
  | 'Engineering'
  | 'Computer Science'
  | 'Economics & Business'
  | 'Law'
  | 'Architecture & Art'
  | 'Psychology'

export const SUBJECT_AREAS: SubjectArea[] = [
  'Medicine',
  'Engineering',
  'Computer Science',
  'Economics & Business',
  'Law',
  'Architecture & Art',
  'Psychology',
]

/**
 * One subject area at one university.
 *
 * `hlRequired` is the most important field in this file. A missing HL subject
 * is not a disadvantage the student can outweigh with a strong essay — the
 * application cannot be made. It is checked before anything else.
 */
export interface AreaRequirement {
  area: SubjectArea
  /** false when the university does not run this subject at undergraduate level. */
  offered: boolean
  /** The specific course the figures below were read from. */
  course?: string
  /** IB Diploma total, including core points where the university says so. */
  ibPoints?: number
  /**
   * Lower bound where the university publishes a RANGE rather than one figure
   * (Edinburgh, Exeter and Bristol do this; contextual offers also live here).
   * A student between ibPointsMin and ibPoints is a genuine reach, not a
   * hopeless one, and is told so.
   */
  ibPointsMin?: number
  /** Higher Level grade string exactly as published, e.g. '7,6,6'. */
  ibHl?: string
  /** HL subjects that must be present. A hard eliminator. */
  hlRequired?: string[]
  /** HL subjects the university names as helpful but not required. */
  hlRecommended?: string[]
  /** UCAT, LNAT, TMUA, ESAT, TARA, IMAT, TOL, TIL, CEnT-S… absent when none. */
  admissionsTest?: string
  /** Minimum or qualifying score on that test, in the test's own units. */
  testThreshold?: string
  /** Where the test can be sat, when that is the deciding practical fact. */
  testLocations?: string
  /** Language of instruction for this programme when it is not English. */
  language?: string
  /** Annual tuition for this programme when it differs from the university figure. */
  tuition?: string
  interview?: boolean
  portfolio?: boolean
  /** Anything a student would be misled without — SL routes, contextual offers, oddities. */
  note?: string
  source?: string
}

export interface University {
  id: string
  name: string
  city: string
  country: Country
  tier: Tier
  /** How admission is decided here. Absent means 'offer' (the UK model). */
  admissionModel?: AdmissionModel
  /** One sentence a student needs before anything else, e.g. an exam sat in Istanbul. */
  headline?: string
  /** Language of undergraduate teaching, where it is not English. */
  teachingLanguage?: string

  /** Range across the courses actually checked, not a marketing claim. */
  ibTypicalLow?: number
  ibTypicalHigh?: number
  ibNote?: string
  aLevelTypical?: string

  ieltsOverall?: number
  ieltsComponent?: number
  ieltsNote?: string

  /** 'accepted' means it is one valid route, not that it is expected. */
  satPolicy?: 'required' | 'accepted' | 'not-used' | 'unknown'
  satNote?: string

  tuitionCurrency?: 'GBP' | 'EUR' | 'CHF' | 'JPY' | 'CZK'
  tuitionIntlMin?: number
  tuitionIntlMax?: number
  /** The academic year the tuition figures belong to. Never omit when a fee is given. */
  tuitionYear?: string

  applicationSystem?: string
  deadlineNote?: string

  /**
   * Published acceptance rate. Deliberately almost always absent: an acceptance
   * rate is an institutional statistic, not a personal probability, and an
   * unsourced one is worse than none. Only fill this from an official
   * publication, and always with acceptanceSource.
   */
  acceptanceRatePct?: number
  acceptanceSource?: string

  /** Recognised by YÖK for students planning to return to Turkey. Absent = not yet checked. */
  yokRecognised?: boolean

  /** Which admissions cycle the figures describe, e.g. '2027 entry'. */
  cycle: string
  /** ISO date the pages were read. Requirements change yearly — this is the expiry clock. */
  checkedOn: string
  sources: string[]

  /** Anything the official pages did not publish, so the UI can say so plainly. */
  gaps?: string[]

  areas: AreaRequirement[]
}

/* ------------------------------------------------------------------ */
/* Matching                                                            */
/* ------------------------------------------------------------------ */

/**
 * What the student told us. Every field is optional — a student may be on the
 * Turkish national curriculum, on A-levels, on APs, or may simply not have sat
 * anything yet. Missing information produces a caveat, never a rejection.
 */
export interface StudentProfile {
  /** Predicted or achieved IB Diploma total, out of 45. */
  ibPredicted?: number
  /** HL subjects as the student names them, e.g. ['Mathematics AA', 'Physics', 'Economics']. */
  hlSubjects?: string[]
  /** Turkish national diploma average out of 100. */
  mebAverage?: number
  aLevels?: string
  apSubjects?: string[]
  sat?: number
  act?: number
  ielts?: number
  toefl?: number
  needsYok?: boolean
  budgetPerYear?: number
  budgetCurrency?: string
}

export type FitVerdict =
  /** A required HL subject is missing. The application cannot be made. */
  | 'not-eligible'
  | 'reach'
  | 'match'
  | 'safety'
  /** Nothing comparable was supplied — we say what is missing instead of guessing. */
  | 'unknown'

export interface FitResult {
  verdict: FitVerdict
  /** One or two sentences a student can act on. Built from the data, never from a model. */
  reasons: string[]
  /** Things the student has not told us that would change the answer. */
  missing: string[]
  /** True when the figures came from a checked official page rather than a general rule. */
  verified: boolean
}

/** Loose subject matching — 'Mathematics AA' should satisfy a 'Mathematics' requirement. */
function hasHl(studentHl: string[], required: string): boolean {
  const want = required.toLowerCase()
  return studentHl.some((s) => {
    const have = s.toLowerCase()
    if (have.includes(want) || want.includes(have)) return true
    // 'Mathematics Analysis and Approaches' vs 'Mathematics AA'
    if (want.includes('analysis') && have.includes('math') && /\baa\b|analysis/.test(have)) return true
    if (want.includes('applications') && have.includes('math') && /\bai\b|applications/.test(have)) return true
    if (want.startsWith('mathematics') && have.includes('math')) return true
    return false
  })
}

/**
 * Compares one student against one subject area at one university.
 *
 * The order matters. Hard prerequisites are checked first, because a student
 * without HL Mathematics is not "a long shot" for Imperial Engineering — they
 * are ineligible, and telling them otherwise wastes a UCAS choice.
 */
export function assessFit(
  profile: StudentProfile,
  university: University,
  area: SubjectArea
): FitResult {
  const req = university.areas.find((a) => a.area === area)
  const reasons: string[] = []
  const missing: string[] = []

  if (!req || !req.offered) {
    return {
      verdict: 'not-eligible',
      reasons: [`${university.name} does not offer ${area} at undergraduate level.`],
      missing: [],
      verified: true,
    }
  }

  // 1. Hard prerequisites.
  if (req.hlRequired?.length) {
    if (!profile.hlSubjects?.length) {
      missing.push(
        `This course requires ${req.hlRequired.join(' and ')} at Higher Level. Add your HL subjects to check.`
      )
    } else {
      const absent = req.hlRequired.filter((r) => !hasHl(profile.hlSubjects!, r))
      if (absent.length) {
        return {
          verdict: 'not-eligible',
          reasons: [
            `${req.course || area} requires ${absent.join(' and ')} at Higher Level, which you are not taking. This is a prerequisite, not a preference — the application cannot be made without it.`,
          ],
          missing: [],
          verified: true,
        }
      }
      reasons.push(`You have the required Higher Level subjects (${req.hlRequired.join(', ')}).`)
    }
  }

  // 2. Points — but only where the country actually makes grade offers.
  let verdict: FitVerdict = 'unknown'
  const model = university.admissionModel ?? 'offer'

  if (model !== 'offer' && req.ibPoints == null) {
    // No grade offer exists here, so Reach / Match / Safety is meaningless.
    // Say what actually decides the place instead.
    const how: Record<string, string> = {
      'test-ranked': `Admission is decided by ${req.admissionsTest || 'an entrance test'} and a ranking, not by your grades.`,
      selection: 'Admission needs the right prior subjects, then a capped selection round — your total alone does not decide it.',
      recognition: 'Admission turns on whether your diploma is recognised: a minimum total AND a specific subject combination.',
      open: 'Admission is open to anyone with a recognised diploma and the required language level.',
      dossier: 'A small intake judged on documents and essays, with no published grade threshold.',
    }
    reasons.unshift(how[model] || '')
    if (req.testThreshold) reasons.push(`Qualifying score: ${req.testThreshold}.`)
    if (req.testLocations) reasons.push(`Where you can sit it: ${req.testLocations}.`)
    if (req.language) reasons.push(`Taught in ${req.language}.`)
    return { verdict: 'unknown', reasons: reasons.filter(Boolean), missing, verified: true }
  }

  if (req.ibPoints != null) {
    if (profile.ibPredicted != null) {
      const gap = profile.ibPredicted - req.ibPoints
      const withinPublishedRange =
        req.ibPointsMin != null && profile.ibPredicted >= req.ibPointsMin && gap < 0

      if (gap < 0) verdict = 'reach'
      else if (gap <= 2) verdict = 'match'
      else verdict = 'safety'

      const shortfall = Math.abs(gap)
      const stated = `Requires ${req.ibPoints} points${req.ibHl ? ` with ${req.ibHl} at HL` : ''}`

      if (gap < 0 && withinPublishedRange) {
        reasons.push(
          `${stated}, but this university publishes a range down to ${req.ibPointsMin}. Your predicted ${profile.ibPredicted} sits inside that range, so an offer is possible at the department's discretion.`
        )
      } else if (gap < 0) {
        reasons.push(
          `${stated}. Your predicted ${profile.ibPredicted} is ${shortfall} point${shortfall === 1 ? '' : 's'} short.`
        )
      } else if (gap === 0) {
        reasons.push(`${stated}. Your predicted ${profile.ibPredicted} meets it exactly, with no margin.`)
      } else {
        reasons.push(`${stated}. Your predicted ${profile.ibPredicted} clears it by ${gap}.`)
      }
    } else {
      missing.push(
        `Requires ${req.ibPoints} IB points${req.ibHl ? ` with ${req.ibHl} at HL` : ''}. Add your predicted total to see where you stand.`
      )
      if (profile.mebAverage != null) {
        reasons.push(
          `You gave a Turkish diploma average of ${profile.mebAverage}/100. This university publishes its requirement in IB points, so the two cannot be compared directly — check the university's own equivalence page.`
        )
      }
    }
  }

  // 3. English.
  if (university.ieltsOverall != null) {
    if (profile.ielts != null) {
      if (profile.ielts < university.ieltsOverall) {
        reasons.push(
          `IELTS ${university.ieltsOverall} required${university.ieltsComponent ? ` with ${university.ieltsComponent} in each component` : ''}; you have ${profile.ielts}.`
        )
      }
    } else if (profile.toefl == null) {
      missing.push(`IELTS ${university.ieltsOverall} is required and you have not entered an English score.`)
    }
  }

  // 4. Tests, interviews, portfolios — extra work the student must plan for.
  if (req.admissionsTest) reasons.push(`${req.admissionsTest} is required.`)
  if (req.portfolio) reasons.push('A portfolio is required.')
  if (req.interview) reasons.push('Shortlisted applicants are interviewed.')

  // 5. Money and recognition.
  if (
    profile.budgetPerYear != null &&
    university.tuitionIntlMin != null &&
    profile.budgetCurrency === university.tuitionCurrency &&
    university.tuitionIntlMin > profile.budgetPerYear
  ) {
    reasons.push(
      `International tuition starts at ${university.tuitionIntlMin.toLocaleString()} ${university.tuitionCurrency} for ${university.tuitionYear}, above the budget you entered.`
    )
  }
  if (profile.needsYok && university.yokRecognised === undefined) {
    missing.push('YÖK recognition for this university has not been checked yet.')
  }

  return { verdict, reasons, missing, verified: true }
}

/** Human label for a verdict, for the UI. */
export function verdictLabel(v: FitVerdict): string {
  switch (v) {
    case 'not-eligible': return 'Not eligible'
    case 'reach': return 'Reach'
    case 'match': return 'Match'
    case 'safety': return 'Safety'
    default: return 'Needs more information'
  }
}

/** How old the record is, so the UI can warn when a cycle has turned over. */
export function monthsSinceCheck(u: University, now = new Date()): number {
  const then = new Date(u.checkedOn)
  return Math.max(0, Math.round((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24 * 30.4)))
}
