import type { MetadataRoute } from 'next'
import { UNIVERSITIES } from './universities/index'
import { areaSlug } from './universities/slugs'
import { iaSubjectPages } from './ib-ia/subjects'

/**
 * Tells search engines about every public university/department page in one
 * place, instead of waiting for them to be discovered by following links.
 * Static marketing pages are included too so nothing public is left out.
 */
const BASE_URL = 'https://neteduapp.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/universities`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/ib-roadmap`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/pricing`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/auth`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const universityPages: MetadataRoute.Sitemap = UNIVERSITIES.map((u) => ({
    url: `${BASE_URL}/universities/${u.id}`,
    lastModified: u.checkedOn,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const areaPages: MetadataRoute.Sitemap = UNIVERSITIES.flatMap((u) =>
    u.areas
      .filter((a) => a.offered)
      .map((a) => ({
        url: `${BASE_URL}/universities/${u.id}/${areaSlug(a.area)}`,
        lastModified: u.checkedOn,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
  )

  const iaPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ib-ia`, changeFrequency: 'monthly' as const, priority: 0.9 },
    ...iaSubjectPages().map((p) => ({
      url: `${BASE_URL}/ib-ia/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]

  return [...staticPages, ...universityPages, ...areaPages, ...iaPages]
}
