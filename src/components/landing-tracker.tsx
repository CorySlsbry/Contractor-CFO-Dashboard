'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Client-side analytics beacon for public marketing pages.
 *
 * Mounts once in the root layout and decides per-page whether to fire.
 * Tracks:
 *   - `page_view`         on initial load (and on route change)
 *   - `scroll_25/50/75/100` as the user scrolls the landing page
 *
 * Also mirrors page_view to GA4 (gtag) when available so the internal
 * dashboard and GA report the same universe of hits.
 *
 * Private app surfaces (auth, dashboard, admin, APIs) are skipped so we
 * don't pollute the funnel with signed-in activity.
 */
const PRIVATE_PREFIXES = [
  '/dashboard',
  '/admin',
  '/api',
  '/login',
  '/signup',
  '/mfa',
  '/auth',
  '/offline',
  '/reset-password',
  '/forgot-password',
];

function isPublicPath(path: string): boolean {
  if (!path) return false;
  return !PRIVATE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

export function LandingTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !isPublicPath(pathname)) return;

    const track = async (event: string, page: string) => {
      try {
        const url = new URL(window.location.href);
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event,
            page,
            referrer: document.referrer || null,
            utm_source: url.searchParams.get('utm_source') || null,
            utm_medium: url.searchParams.get('utm_medium') || null,
            utm_campaign: url.searchParams.get('utm_campaign') || null,
          }),
          keepalive: true,
        });
      } catch {
        // Silently fail — don't break UX for analytics
      }
    };

    // Track initial page view (internal + GA4 mirror)
    track('page_view', pathname);
    try {
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
      if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    } catch {
      /* noop */
    }

    // Track scroll-depth milestones — reset per pathname
    const scrollMilestones = new Set<number>();
    const handleScroll = () => {
      const doc = document.documentElement;
      const denom = doc.scrollHeight - window.innerHeight;
      if (denom <= 0) return;
      const scrollPct = Math.round((window.scrollY / denom) * 100);
      [25, 50, 75, 100].forEach((milestone) => {
        if (scrollPct >= milestone && !scrollMilestones.has(milestone)) {
          scrollMilestones.add(milestone);
          track(`scroll_${milestone}`, pathname);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return null;
}
