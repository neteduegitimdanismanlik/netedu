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

/** Verified against the subject guide: four criteria, 6 marks each, 24 total. */
const SCIENCES_CONFIRMED = [
  'biology', 'chemistry', 'physics',
  'sports exercise and health science', 'sehs',
]

/** Guide states the IA framework is shared, but we have not read these guides directly. */
const SCIENCES_ASSUMED = [
  // 'ess' is NOT listed as a key: matches() uses substring matching, so it
  // would swallow "busin-ess management" and any other subject containing it.
  'environmental systems and societies',
  // Computer Science removed: its IA is five criteria worth 30 marks, not the
  // four six-mark sciences criteria. It has its own rubric now.
  'design technology'
]
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

  /* Global Politics carries its level in the subject name, so the checker never
     has to ask. Order matters: the two level-bearing entries are tested before
     the bare name, which is deliberately left unsupported. */
  if (matches(subject, ['global politics hl'])) {
    return {
      kind: 'rubric',
      rubricId: 'ib-ia-global-politics-hl',
      needsLevel: false,
      confidence: 'high',
      note: 'HL is marked out of 30. Alongside the report, paste your separate recommendation text (up to 400 words) — criterion F is marked from it.'
    }
  }

  if (matches(subject, ['global politics sl'])) {
    return {
      kind: 'rubric',
      rubricId: 'ib-ia-global-politics-sl',
      needsLevel: false,
      confidence: 'high',
      note: 'SL is marked out of 24 across criteria A to E. Criterion F (Recommendation) is HL only.'
    }
  }

  if (matches(subject, ['global politics'])) {
    return {
      kind: 'unsupported',
      reason: 'Global Politics is marked differently at SL and HL — SL is out of 24, HL is out of 30. Pick "Global Politics SL" or "Global Politics HL" so we mark against the right one.'
    }
  }
if (matches(subject, ['business management', 'business and management'])) {
    return {
      kind: 'rubric',
      rubricId: 'ib-ia-business-management',
      needsLevel: false,
      confidence: 'high',
      note: 'Marked out of 25 across seven criteria. The task, the criteria and the 1,800-word limit are identical at SL and HL.'
    }
  }
  if (matches(subject, ['computer science'])) {
    return {
      kind: 'rubric',
      rubricId: 'ib-ia-computer-science',
      needsLevel: false,
      confidence: 'high',
      note: 'Marked out of 30 across five criteria, identical at SL and HL. Paste your documentation only — the video and the appendices cannot be read here, so criterion D (Development, 12 of the 30 marks) is inferred from what your documentation evidences rather than observed.'
    }
  }
  if (matches(subject, ['digital society'])) {
    return {
      kind: 'rubric',
      rubricId: 'ib-ia-digital-society',
      needsLevel: false,
      confidence: 'high',
      note: 'Paste your inquiry process document. Criteria A and B are marked from it — 9 of the 24 marks. Criteria C, D and E come from your recorded presentation, which cannot be read here, so no total out of 24 is given.'
    }
  }
  if (matches(subject, ['philosophy'])) {
    return {
      kind: 'rubric',
      rubricId: 'ib-ia-philosophy',
      needsLevel: false,
      confidence: 'high',
      note: 'Marked out of 25 across five criteria, identical at SL and HL. If your stimulus is an image, a film scene or audio, paste your written description of it alongside the essay — the stimulus itself cannot be read here, so criterion A is judged on the description.'
    }
  }
  if (matches(subject, ['psychology'])) {
    return { kind: 'rubric', rubricId: 'ib-ia-psychology', needsLevel: false, confidence: 'high' }
  }

  if (matches(subject, ['economics'])) {
    return {
      kind: 'rubric',
      rubricId: 'ib-ia-economics',
      needsLevel: false,
      confidence: 'high',
      note: 'The economics IA is a portfolio of three commentaries. Upload one at a time — it will be marked out of 14.'
    }
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
/* ------------------------------------------------------------------ */
/* Subject picker state                                                */
/* ------------------------------------------------------------------ */

export type SubjectState = 'ready' | 'unverified' | 'oral' | 'soon'

export const SUBJECT_STATE_LABELS: Record<SubjectState, string | null> = {
  ready: null,
  unverified: 'not verified',
  oral: 'oral assessment',
  soon: 'coming soon',
}

/**
 * What the picker should do with a subject. Derived from resolveIaRubric so
 * there is one source of truth: a subject becomes selectable the moment its
 * rubric lands, with no second list to keep in sync.
 */
export function subjectState(subject: string): SubjectState {
  const r = resolveIaRubric(subject)
  if (r.kind === 'redirect') return 'oral'
  if (r.kind === 'unsupported') return 'soon'
  return r.confidence === 'high' ? 'ready' : 'unverified'
}

export function isSubjectSelectable(subject: string): boolean {
  const s = subjectState(subject)
  return s === 'ready' || s === 'unverified'
}

/**
 * A group is open if anything inside it can be picked. Groups where every
 * subject is oral or unloaded stay collapsed and dimmed.
 */
export function groupState(subjects: string[]): SubjectState {
  const states = subjects.map(subjectState)
  if (states.some(s => s === 'ready')) return 'ready'
  if (states.some(s => s === 'unverified')) return 'unverified'
  if (states.every(s => s === 'oral')) return 'oral'
  return 'soon'
}

export function groupIsOpen(subjects: string[]): boolean {
  return subjects.some(isSubjectSelectable)
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
      'Spanish ab initio', 'French ab initio', 'German ab initio', 'Italian ab initio', 'Mandarin ab initio'
    ]
  },
  {
    group: 'Group 3 — Individuals and Societies',
    subjects: [
      'Business Management', 'Economics', 'Geography',
      'Global Politics SL', 'Global Politics HL',
      'History',
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