import type { MetadataRoute } from 'next'

/**
 * Points crawlers at the sitemap and keeps them out of anything behind
 * login (dashboard, onboarding, checker, etc.) or purely functional
 * (/api). Everything under /universities is deliberately public — that's
 * the whole SEO strategy — so nothing there is disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard',
        '/onboarding',
        '/checker',
        '/match',
        '/admin',
        '/parent',
        '/parent-consent',
        '/consent',
        '/cas',
        '/portfolio',
        '/interview',
        '/oral-exam',
        '/topics',
        '/coach',
        '/alumni',
        '/contribute',
      ],
    },
    sitemap: 'https://neteduapp.com/sitemap.xml',
  }
}
