import type { MetadataRoute } from 'next'
import { UNIVERSITIES } from './universities/index'
import { areaSlug } from './universities/slugs'
import { iaSubjectPages } from './ib-ia/subjects'
import { SYLLABUS } from './ib-syllabus/data'
import { hasTurkish } from '@/lib/seo'

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
    { url: `${BASE_URL}/ib-extended-essay`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/ib-tok`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/ucas-personal-statement`, changeFrequency: 'monthly', priority: 0.9 },
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

  const syllabusPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ib-syllabus`, changeFrequency: 'monthly' as const, priority: 0.9 },
    ...SYLLABUS.map((s) => ({
      url: `${BASE_URL}/ib-syllabus/${s.slug}`,
      lastModified: s.checkedOn,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]

  // Turkish counterparts (/tr/...). Each English page with a Turkish version,
  // and the Turkish page itself, lists both languages — the sitemap form of
  // the hreflang tags in lib/seo.ts.
  const all = [...staticPages, ...universityPages, ...areaPages, ...iaPages, ...syllabusPages]
  const withLanguages: MetadataRoute.Sitemap = []
  for (const entry of all) {
    const path = entry.url.slice(BASE_URL.length) || '/'
    if (!hasTurkish(path)) {
      withLanguages.push(entry)
      continue
    }
    const languages = { en: `${BASE_URL}${path}`, tr: `${BASE_URL}/tr${path}` }
    withLanguages.push({ ...entry, alternates: { languages } })
    withLanguages.push({ ...entry, url: `${BASE_URL}/tr${path}`, alternates: { languages } })
  }
  return withLanguages
}
