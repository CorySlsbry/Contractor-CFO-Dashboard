import type { MetadataRoute } from 'next';

/**
 * Dynamic sitemap — rebuilds on each deploy so new marketing pages show
 * up in search without manually editing an XML file. Only public pages
 * are listed; dashboard/admin/auth are explicitly excluded via robots.ts.
 *
 * Update `lastModified` by touching the commit that touches a page — for
 * now we pin to the build time so each deploy refreshes the signal.
 */
const BASE_URL = 'https://topbuildercfo.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const marketing: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/demo`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/start`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const trades = [
    'custom-home-builders',
    'spec-builders',
    'general-contractors',
    'remodelers',
    'electrical-contractors',
  ].map<MetadataRoute.Sitemap[number]>((slug) => ({
    url: `${BASE_URL}/trades/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const funnel: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const legal: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  return [...marketing, ...trades, ...funnel, ...legal];
}
