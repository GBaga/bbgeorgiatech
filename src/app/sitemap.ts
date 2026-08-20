import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bbgeorgiatech.com'

  const locales = ['en', 'fr', 'ka']
  const routes = ['', '/cookie-policy', '/privacy-policy', '/terms-and-conditions']
  
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'monthly' : 'yearly',
        priority: route === '' ? 1 : 0.5,
      })
    }
  }

  return entries
}
