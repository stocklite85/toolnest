import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://toolnest-inky.vercel.app'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/password-generator`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/id-generator`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/subnet-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/base64`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/json-formatter`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/url-encoder`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/color-converter`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
