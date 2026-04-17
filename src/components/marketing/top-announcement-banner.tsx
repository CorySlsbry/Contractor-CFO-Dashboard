/**
 * Fixed top announcement bar shown above the marketing navigation.
 * Promise strip: 5-star guarantee + direct developer access.
 *
 * Used on the main landing page and every /trades/* landing page.
 * Pair with a nav that uses `top-[32px] sm:top-[36px]` and a hero
 * with `pt-28 sm:pt-36` so the content doesn't hide behind it.
 */

export default function TopAnnouncementBanner() {
  return (
    <div className="fixed top-0 w-full bg-[#0a0a0f] border-b border-[#1e1e2e] z-[60]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 sm:gap-3 text-center">
        <p className="text-[11px] sm:text-xs text-[#d0d0e0] leading-tight">
          <span className="text-[#fbbf24] font-semibold">
            <span aria-hidden="true">★ </span>5-Star Service Guarantee
          </span>
          <span className="text-[#8888a0]"> &mdash; if we haven&rsquo;t earned it yet, we&rsquo;ll keep working until we do.</span>
          <span className="hidden sm:inline">
            <span className="mx-2 text-[#6366f1]">&bull;</span>
            <span className="text-[#e8e8f0] font-medium">Direct access to the developer</span>
            <span className="text-[#8888a0]"> &mdash; if our platform is missing something, we can make it so.</span>
          </span>
        </p>
      </div>
    </div>
  );
}
