import type { MetadataRoute } from 'next';

/**
 * Dynamic robots.txt — keep the disallow list in one place and let
 * Next's App Router emit it. Block app surfaces (dashboard/admin/auth/api)
 * so they never leak into search, and point crawlers at the sitemap.
 */
const BASE_URL = 'https://topbuildercfo.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/auth/',
          '/login',
          '/signup',
          '/mfa',
          '/forgot-password',
          '/reset-password',
          '/offline',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
