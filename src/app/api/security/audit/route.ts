/**
 * Client-initiated audit log endpoint.
 *
 * Browser code can POST `{ event, metadata? }` and the server will record
 * it against the authenticated user with IP + UA pulled from the request.
 *
 * Only accepts a whitelisted set of events so browser code can't spam the
 * table with arbitrary strings. Rate limited per user.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logSecurityEvent, requestContext, type SecurityEvent } from '@/lib/security/audit-log';
import { rateLimit, RateLimits, rateLimitHeaders, getClientIp } from '@/lib/security/rate-limit';

const ALLOWED_EVENTS = new Set<SecurityEvent>([
  'password_changed',
  'mfa_enrolled',
  'mfa_removed',
  'logout',
]);

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const limit = rateLimit(`audit:${user.id}`, RateLimits.API_WRITE);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  let body: { event?: string; metadata?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const event = body.event as SecurityEvent;
  if (!event || !ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ error: 'Event not allowed' }, { status: 400 });
  }

  const { ip, userAgent } = requestContext(req);

  // Fetch organization_id from profiles (best effort).
  let organizationId: string | null = null;
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();
    organizationId = profile?.organization_id ?? null;
  } catch {
    /* ignore */
  }

  await logSecurityEvent({
    event,
    userId: user.id,
    organizationId,
    ip: ip || getClientIp(req),
    userAgent,
    metadata: body.metadata ?? {},
  });

  return NextResponse.json({ ok: true }, { headers: rateLimitHeaders(limit) });
}
