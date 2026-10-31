import type { SubjectArea } from './schema'
import { SUBJECT_AREAS } from './schema'

/**
 * URL slugs for the public, SEO-facing university pages
 * (/universities/[id]/[area]). SubjectArea names contain spaces and an
 * ampersand ('Economics & Business'), neither of which belong in a URL —
 * this is the one place that mapping lives, so the route files and the
 * sitemap never have to agree on it independently.
 */
const AREA_SLUGS: Record<SubjectArea, string> = {
  'Medicine': 'medicine',
  'Engineering': 'engineering',
  'Computer Science': 'computer-science',
  'Economics & Business': 'economics-business',
  'Law': 'law',
  'Architecture & Art': 'architecture-art',
  'Psychology': 'psychology',
}

const SLUG_TO_AREA: Record<string, SubjectArea> = Object.fromEntries(
  SUBJECT_AREAS.map((area) => [AREA_SLUGS[area], area])
) as Record<string, SubjectArea>

export function areaSlug(area: SubjectArea): string {
  return AREA_SLUGS[area]
}

export function areaFromSlug(slug: string): SubjectArea | undefined {
  return SLUG_TO_AREA[slug]
}
