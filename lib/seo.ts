import type { Metadata } from 'next'

/**
 * One place that builds the search-engine metadata for every public page.
 *
 * - canonical: the one address Google should index for the page (stops
 *   duplicates such as ?utm= links or a trailing slash being counted twice).
 * - hreflang: when a page has a Turkish version under /tr, each version
 *   names the other, so Google shows Turkish searchers the Turkish page and
 *   everyone else the English one — instead of treating them as duplicates.
 * - openGraph / twitter: the title, text and image shown when a link is
 *   pasted into WhatsApp, Instagram, LinkedIn or X. The image is drawn by
 *   app/opengraph-image.tsx. It's named here explicitly because a page that
 *   sets its own openGraph replaces the parent's — Next.js only attaches the
 *   file-based image automatically on the home page.
 *
 * Never set `alternates` in app/layout.tsx: it would be inherited by every
 * page that doesn't set its own, all claiming the home page as canonical.
 */

export const SITE = 'https://neteduapp.com'

/** English paths that have a Turkish counterpart at /tr + the same path. */
const HAS_TURKISH_EXACT = new Set(['/ib-tok', '/ib-extended-essay', '/ucas-personal-statement', '/ib-roadmap', '/ib-ia'])
const HAS_TURKISH_PREFIX = ['/ib-ia/']

export function hasTurkish(enPath: string): boolean {
  return HAS_TURKISH_EXACT.has(enPath) || HAS_TURKISH_PREFIX.some((p) => enPath.startsWith(p))
}

const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: 'NetEdu — university guidance for IB students' }

export function seo(path: string, m: { title: string; description: string }): Metadata {
  const isTr = path === '/tr' || path.startsWith('/tr/')
  const en = isTr ? path.slice(3) || '/' : path
  const tr = isTr ? path : hasTurkish(path) ? `/tr${path}` : null

  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: path,
      ...(tr ? { languages: { en, tr, 'x-default': en } } : {}),
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: path,
      siteName: 'NetEdu',
      type: 'website',
      locale: isTr ? 'tr_TR' : 'en_GB',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: [OG_IMAGE.url],
    },
  }
}

/** schema.org BreadcrumbList — Google can show this trail in place of the URL. */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  }
}
