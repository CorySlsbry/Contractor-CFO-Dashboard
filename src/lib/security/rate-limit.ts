/**
 * Lightweight per-key rate limiter using a sliding window + in-memory store.
 *
 * This is deliberately simple — it runs inside the Next.js server process
 * and survives until the process recycles. That's enough to stop scripted
 * credential-stuffing against a single container but WILL NOT coordinate
 * across Vercel regions or lambda cold starts.
 *
 * For production-grade protection across instances, swap the `hits` Map
 * for an Upstash Redis / KV backend — the public API stays the same.
 *
 * Tune via the window + max arguments passed to {@link rateLimit}.
 */

type Hit = { count: number; resetAt: number };

const hits = new Map<string, Hit>();

/** Convenience bucket presets. */
export const RateLimits = {
  /** Login / password / MFA attempts — 5 per IP per 15 min. */
  AUTH_STRICT: { windowMs: 15 * 60 * 1000, max: 5 },
  /** Signup — 3 per IP per hour. */
  SIGNUP: { windowMs: 60 * 60 * 1000, max: 3 },
  /** Referral invites — 10 per IP per hour. */
  REFERRAL: { windowMs: 60 * 60 * 1000, max: 10 },
  /** General mutating APIs — 60 per IP per minute. */
  API_WRITE: { windowMs: 60 * 1000, max: 60 },
} as const;

export interface RateLimitResult {
  allowed: boolean;
  /** Remaining attempts in the current window. */
  remaining: number;
  /** UNIX ms at which the window resets. */
  resetAt: number;
  /** Seconds until reset (clamped ≥0). */
  retryAfterSeconds: number;
}

/**
 * Check + consume one "hit" for the given key. Idempotent-ish: calling this
 * twice consumes two hits. Callers should only invoke it once per request,
 * at the start of the handler.
 *
 * @param key      Bucket key — typically `${ip}:${route}` or `${userId}:${route}`.
 * @param opts     window + max — see {@link RateLimits} for presets.
 */
export function rateLimit(
  key: string,
  opts: { windowMs: number; max: number }
): RateLimitResult {
  const now = Date.now();
  const existing = hits.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + opts.windowMs;
    hits.set(key, { count: 1, resetAt });
    // Opportunistic eviction: clear out stale keys to keep the Map small.
    if (hits.size > 10_000) evictExpired(now);
    return {
      allowed: true,
      remaining: opts.max - 1,
      resetAt,
      retryAfterSeconds: Math.ceil(opts.windowMs / 1000),
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, opts.max - existing.count);
  const allowed = existing.count <= opts.max;
  return {
    allowed,
    remaining,
    resetAt: existing.resetAt,
    retryAfterSeconds: Math.max(0, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

function evictExpired(now: number): void {
  for (const [k, h] of hits) {
    if (h.resetAt <= now) hits.delete(k);
  }
}

/**
 * Extract the requester IP from a Next.js request.
 * Respects standard proxy headers used by Vercel.
 */
export function getClientIp(req: Request | { headers: Headers }): string {
  const h = (req as Request).headers;
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    h.get('cf-connecting-ip') ||
    'unknown'
  );
}

/** Format a RateLimitResult into standard HTTP 429 headers. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
    'Retry-After': String(result.retryAfterSeconds),
  };
}
