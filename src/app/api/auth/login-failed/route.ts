/**
 * Audit hook for failed logins.
 *
 * The browser fires this after `signInWithPassword` returns an error so we
 * can record the attempt into `security_audit_log` with the source IP.
 * Rate limited per IP to stop someone scripting floods of fake failures
 * from polluting the log or masking real attacks.
 *
 * NOTE: we deliberately don't correlate the posted email to a user_id
 * here — that would let attackers confirm whether an email is registered
 * via differential timing. We just record the attempted email in
 * metadata for ops review.
 */

import { NextResponse } from 'next/server';
import { logSecurityEvent, requestContext } from '@/lib/security/audit-log';
import { rateLimit, RateLimits, getClientIp } from '@/lib/security/rate-limit';

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit(`login-failed:${ip}`, RateLimits.AUTH_STRICT);
  // Always record — but if we're rate limited, upgrade severity.
  const severity = limit.allowed ? 'warning' : 'critical';

  let body: { email?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }

  const { userAgent } = requestContext(req);
  await logSecurityEvent({
    event: limit.allowed ? 'login_failed' : 'login_rate_limited',
    severity,
    ip,
    userAgent,
    metadata: {
      email_attempted: typeof body.email === 'string' ? body.email.slice(0, 120) : undefined,
      remaining: limit.remaining,
    },
  });

  return NextResponse.json({ ok: true });
}
