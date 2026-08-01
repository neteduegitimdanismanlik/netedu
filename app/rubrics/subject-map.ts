import { rubrics, type Rubric } from './schema'

export type IaResolution =
  | { kind: 'rubric'; rubricId: string; needsLevel: boolean; confidence: 'high' | 'low'; note?: string }
  | { kind: 'redirect'; to: 'oral-exam'; reason: string }
  | { kind: 'unsupported'; reason: string; fallbackRubricId?: string }

/** Rubric loaded and verified against the subject guide. */
const MATHS = [
  'mathematics aa', 'mathematics ai', 'maths aa', 'maths ai',
  'mathematics analysis and approaches', 'mathematics applications and interpretation'
]

const SCIENCES_CONFIRMED = ['biology', 'chemistry', 'physics']

/** Guide states the IA framework is shared, but we have not read these guides directly. */
const SCIENCES_ASSUMED = [
  'sports exercise and health science', 'sehs',
  'environmental systems and societies', 'ess',
  'computer science', 'design technology'
]

/** IA is an individual ORAL — there is no written artefact to mark. */
const ORAL_SUBJECTS = [
  'language b', 'ab initio',
  'english b', 'spanish b', 'french b', 'german b', 'italian b', 'mandarin b', 'arabic b', 'turkish b',
  'spanish ab initio', 'french ab initio', 'german ab initio', 'italian ab initio', 'mandarin ab initio',
  'english a: literature', 'english a: language and literature',
  'turkish a: literature', 'turkish a: language and literature',
  'spanish a: literature', 'spanish a: language and literature',
  'french a: literature', 'french a: language and literature',
  'german a: literature', 'literature and performance'
]

function norm(s: string) {
  return (s || '').toLowerCase().trim()
}

function matches(subject: string, list: string[]) {
  const s = norm(subject)
  return list.some(entry => s === entry || s.includes(entry))
}

/**
 * Resolves which IA rubric applies to a subject.
 * Principle: a wrong number is worse than no number.
 * Subjects without a loaded rubric are never marked against an unrelated one.
 */
export function resolveIaRubric(subject: string): IaResolution {
  if (!subject) {
    return { kind: 'unsupported', reason: 'Pick your subject first.' }
  }

  if (matches(subject, MATHS)) {
    return {
      kind: 'rubric',
      rubricId: 'ib-ia-maths',
      needsLevel: true,
      confidence: 'high',
      note: 'Criterion E differs between SL and HL, so we need your level.'
    }
  }

  if (matches(subject, SCIENCES_CONFIRMED)) {
    return { kind: 'rubric', rubricId: 'ib-ia-sciences', needsLevel: false, confidence: 'high' }
  }

  if (matches(subject, SCIENCES_ASSUMED)) {
    return {
      kind: 'rubric',
      rubricId: 'ib-ia-sciences',
      needsLevel: false,
      confidence: 'low',
      note: 'This subject shares the science IA framework, but we have not verified its exact criteria yet — treat the marks as indicative.'
    }
  }

  if (matches(subject, ORAL_SUBJECTS)) {
    return {
      kind: 'redirect',
      to: 'oral-exam',
      reason: 'The internal assessment for this subject is an individual oral, not a written report. Record it in Oral Exam Prep instead.'
    }
  }

  return {
    kind: 'unsupported',
    reason: 'We have not loaded the official criteria for this subject yet, so we will not guess a mark.',
    fallbackRubricId: 'general-college-essay'
  }
}

export function rubricNeedsLevel(rubricId: string): boolean {
  return rubricId === 'ib-ia-maths'
}

/** Full IB subject list, grouped as in the DP model. */
export const subjectGroups: { group: string; subjects: string[] }[] = [
  {
    group: 'Group 1 — Studies in Language and Literature',
    subjects: [
      'English A: Literature',
      'English A: Language and Literature',
      'Turkish A: Literature',
      'Turkish A: Language and Literature',
      'Spanish A: Literature',
      'French A: Literature',
      'German A: Literature',
      'Literature and Performance',
    ]
  },
  {
    group: 'Group 2 — Language Acquisition',
    subjects: [
      'English B', 'Spanish B', 'French B', 'German B', 'Italian B', 'Mandarin B', 'Arabic B',
      'Spanish ab initio', 'French ab initio', 'German ab initio', 'Italian ab initio', 'Mandarin ab initio',
      'Latin', 'Classical Greek',
    ]
  },
  {
    group: 'Group 3 — Individuals and Societies',
    subjects: [
      'Business Management', 'Economics', 'Geography', 'Global Politics', 'History',
      'Information Technology in a Global Society', 'Philosophy', 'Psychology',
      'Social and Cultural Anthropology', 'World Religions', 'Digital Society',
    ]
  },
  {
    group: 'Group 4 — Sciences',
    subjects: [
      'Biology', 'Chemistry', 'Physics', 'Computer Science', 'Design Technology',
      'Sports Exercise and Health Science', 'Environmental Systems and Societies',
    ]
  },
  {
    group: 'Group 5 — Mathematics',
    subjects: ['Mathematics AA', 'Mathematics AI']
  },
  {
    group: 'Group 6 — The Arts',
    subjects: ['Visual Arts', 'Music', 'Theatre', 'Film', 'Dance']
  },
]

export function getRubricById(id: string): Rubric | undefined {
  return rubrics.find(r => r.id === id)
}