import { MetadataRoute } from 'next'

const baseUrl = 'https://bbgeorgiatech.com'
const locales = ['en', 'fr', 'ka'] as const

// Real last-modified dates per route — update the date here when a route's
// content actually changes. A build-time `new Date()` tells crawlers every
// page changed on every deploy, which trains them to ignore the signal.
const routes: { path: string; lastModified: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', lastModified: '2026-09-10', changeFrequency: 'monthly' },
  { path: '/cookie-policy', lastModified: '2026-09-10', changeFrequency: 'yearly' },
  { path: '/privacy-policy', lastModified: '2026-09-10', changeFrequency: 'yearly' },
  { path: '/terms-and-conditions', lastModified: '2026-09-10', changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const route of routes) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: route.lastModified,
        changeFrequency: route.changeFrequency,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${route.path}`])
          ),
        },
      })
    }
  }

  return entries
}
