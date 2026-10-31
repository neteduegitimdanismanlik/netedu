import { subjectGroups, resolveIaRubric } from '../rubrics/subject-map'
import { getRubric } from '../rubrics/schema'

/**
 * Which subjects get a public /ib-ia/[subject] page.
 *
 * Driven entirely by resolveIaRubric — the same function the checker uses —
 * so a subject gets a page exactly when the checker can actually mark it.
 * Oral subjects (redirected to Oral Exam Prep) and subjects with no loaded
 * rubric get no page: we never publish a "how it's marked" page for
 * something we can't then check.
 *
 * Biology, Chemistry, Physics and SEHS share one rubric but each get their
 * own page on purpose — students search "IB Biology IA rubric", not "IB
 * sciences IA rubric".
 */

export interface IaSubjectPage {
  subject: string
  slug: string
  group: string
  rubric: any
  note?: string
  confidence: 'high' | 'low'
}

export function subjectSlug(subject: string): string {
  return subject
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function iaSubjectPages(): IaSubjectPage[] {
  const out: IaSubjectPage[] = []
  for (const g of subjectGroups) {
    for (const subject of g.subjects) {
      const r = resolveIaRubric(subject)
      if (r.kind !== 'rubric') continue
      const rubric = getRubric(r.rubricId)
      if (!rubric) continue
      out.push({
        subject,
        slug: subjectSlug(subject),
        group: g.group,
        rubric,
        note: r.note,
        confidence: r.confidence,
      })
    }
  }
  return out
}

export function iaSubjectBySlug(slug: string): IaSubjectPage | undefined {
  return iaSubjectPages().find((p) => p.slug === slug)
}

/** First sentence only — the full criterion text stays inside the checker. */
export function firstSentence(text: string): string {
  if (!text) return ''
  const i = text.indexOf('. ')
  return i > 0 ? text.slice(0, i + 1) : text
}
