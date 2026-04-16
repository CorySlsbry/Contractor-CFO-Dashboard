/**
 * Security audit logger.
 *
 * Writes rows into public.security_audit_log via the service-role client.
 * RLS on the table blocks all client-side writes — callers MUST run inside
 * a server-only context (Route Handlers, Server Actions, middleware).
 *
 * Never throws: audit logging is a best-effort side channel. If it fails we
 * log to stderr and let the request continue — a missed audit event is less
 * bad than a failed login.
 */

import { createAdminClient } from '@/lib/supabase/admin';

export type SecurityEvent =
  | 'login_success'
  | 'login_failed'
  | 'login_rate_limited'
  | 'logout'
  | 'signup_success'
  | 'signup_failed'
  | 'signup_rate_limited'
  | 'password_reset_requested'
  | 'password_changed'
  | 'mfa_enroll_started'
  | 'mfa_enrolled'
  | 'mfa_enroll_failed'
  | 'mfa_challenge_success'
  | 'mfa_challenge_failed'
  | 'mfa_removed'
  | 'account_deleted'
  | 'subscription_cancelled'
  | 'suspicious_activity';

export type Severity = 'info' | 'warning' | 'critical';

export interface AuditLogEntry {
  event: SecurityEvent;
  userId?: string | null;
  organizationId?: string | null;
  severity?: Severity;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Record a security event. Fire-and-forget: do not await this inside a hot
 * path unless you specifically want to block on it. Returns a promise so
 * callers who DO want the await point can get it.
 */
export async function logSecurityEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const admin = createAdminClient();
    // The `security_audit_log` table is added by migration 20260416_security_audit.sql
    // but may not yet appear in the generated Database types until `supabase gen types`
    // is re-run. Cast through any to keep this helper insulated from the type lag.
    await (admin as any).from('security_audit_log').insert({
      event: entry.event,
      user_id: entry.userId ?? null,
      organization_id: entry.organizationId ?? null,
      severity: entry.severity ?? defaultSeverity(entry.event),
      ip: entry.ip ?? null,
      user_agent: entry.userAgent ?? null,
      metadata: entry.metadata ?? {},
    });
  } catch (err) {
    // Don't rethrow — auditing is best-effort.
    console.error('[security-audit] failed to write event', entry.event, err);
  }
}

/**
 * Pull IP + UA out of a Request for one-liner logging.
 */
export function requestContext(req: Request): { ip: string; userAgent: string } {
  const h = req.headers;
  const ip =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    h.get('cf-connecting-ip') ||
    'unknown';
  return {
    ip,
    userAgent: h.get('user-agent') || 'unknown',
  };
}

function defaultSeverity(event: SecurityEvent): Severity {
  switch (event) {
    case 'login_failed':
    case 'signup_failed':
    case 'mfa_challenge_failed':
    case 'mfa_enroll_failed':
    case 'login_rate_limited':
    case 'signup_rate_limited':
      return 'warning';
    case 'account_deleted':
    case 'mfa_removed':
    case 'suspicious_activity':
      return 'critical';
    default:
      return 'info';
  }
}
