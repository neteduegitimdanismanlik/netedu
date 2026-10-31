import { SYLLABUS } from '../ib-syllabus/data'

/**
 * Which of our syllabus and IA pages a course's HL requirements point to.
 *
 * Requirement text is free-form ("Mathematics: Analysis and Approaches",
 * "one of Physics, Chemistry or Biology"), so this matches on subject
 * keywords. Plain "Mathematics" maps to AA, which is what the demanding
 * courses mean; "Further Mathematics" is not a subject we have a page for.
 * Used to link department pages to the guides — internal links help search
 * engines see the pages as one connected site, and help the reader.
 */

const KEYWORDS: { slug: string; test: (s: string) => boolean }[] = [
  { slug: 'mathematics-ai', test: (s) => /applications and interpretation|\bmaths? ai\b|mathematics ai\b/.test(s) },
  {
    slug: 'mathematics-aa',
    test: (s) =>
      /analysis and approaches|\bmaths? aa\b|mathematics aa\b/.test(s) ||
      (/\bmathematics\b|\bmaths\b/.test(s.replace(/further mathematics/g, '')) && !/applications and interpretation/.test(s)),
  },
  { slug: 'biology', test: (s) => /\bbiology\b/.test(s) },
  { slug: 'chemistry', test: (s) => /\bchemistry\b/.test(s) },
  { slug: 'physics', test: (s) => /\bphysics\b/.test(s) },
  { slug: 'computer-science', test: (s) => /computer science/.test(s) },
  { slug: 'psychology', test: (s) => /\bpsychology\b/.test(s) },
  { slug: 'economics', test: (s) => /\beconomics\b/.test(s) },
  { slug: 'business-management', test: (s) => /business management/.test(s) },
  { slug: 'design-technology', test: (s) => /design technology/.test(s) },
  { slug: 'philosophy', test: (s) => /\bphilosophy\b/.test(s) },
  { slug: 'global-politics', test: (s) => /global politics/.test(s) },
  { slug: 'digital-society', test: (s) => /digital society/.test(s) },
]

export interface GuideLink {
  subject: string
  syllabusHref: string
  iaHref?: string
}

export function guideLinksFor(requirementTexts: string[]): GuideLink[] {
  const text = requirementTexts.join(' | ').toLowerCase()
  const out: GuideLink[] = []
  for (const k of KEYWORDS) {
    if (!k.test(text)) continue
    const s = SYLLABUS.find((x) => x.slug === k.slug)
    if (!s) continue
    const ia = s.iaPages?.[0]
    out.push({
      subject: s.subject,
      syllabusHref: `/ib-syllabus/${s.slug}`,
      iaHref: ia ? `/ib-ia/${ia.slug}` : undefined,
    })
  }
  return out
}
