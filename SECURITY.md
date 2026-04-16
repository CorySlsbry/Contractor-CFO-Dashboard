# BuilderCFO Security

This document summarizes the security posture of the BuilderCFO app and the
manual steps that need to be taken in external dashboards (Supabase, Vercel,
Stripe) to match what the code expects.

If you find a vulnerability, email **cory@salisburybookkeeping.com**. Please
do not open public GitHub issues for security problems.

---

## What the application already enforces

| Control                          | Where                                          | Notes |
| -------------------------------- | ---------------------------------------------- | ----- |
| HTTPS-only (HSTS 2yr + preload)  | `next.config.mjs`                              | Forces modern browsers to refuse plaintext. |
| Content-Security-Policy          | `next.config.mjs`                              | Locks script/connect/frame origins to Supabase, Stripe, Vercel, Anthropic, Sentry. |
| Clickjacking protection          | `frame-ancestors 'none'` + `X-Frame-Options DENY` | Site cannot be iframed. |
| MIME sniffing protection         | `X-Content-Type-Options: nosniff`              | |
| Referrer policy                  | `strict-origin-when-cross-origin`              | |
| Permissions-Policy               | camera/mic/geo/usb/etc = `()`                  | Blocks APIs we don't use. |
| Powered-by header removal        | `poweredByHeader: false`                       | Fingerprinting hygiene. |
| Password policy (NIST 800-63B)   | `src/lib/security/password.ts`                 | 12+ chars, 3 of 4 classes, blocks common/leaked/email-like passwords, repetition detection. |
| Per-IP rate limiting             | `src/lib/security/rate-limit.ts`               | Sliding window: 5 auth/15m, 3 signup/hr, 10 referral/hr, 60 API writes/min. |
| Audit log                        | `public.security_audit_log` table              | Login success/fail, signup, MFA enrol/remove, password change, account delete. Writes via service role only; RLS blocks client writes. |
| Idle session timeout             | `src/components/security/idle-timeout.tsx`     | 30-minute inactivity → auto sign-out, 60s warning. Cross-tab via localStorage. |
| AAL2 enforcement                 | `src/middleware.ts`                            | If user has a verified MFA factor but session is only AAL1, middleware redirects to `/mfa` before `/dashboard`, `/admin`, `/api/stripe/*`, `/api/integrations/*`, `/api/auth/delete-account`, `/api/auth/password`. |
| RLS on every tenant table        | Supabase                                       | `organizations`, `profiles`, `security_audit_log` etc. Service role used only in server handlers. |

## Two-factor authentication (2FA)

Users manage 2FA at **Settings → Security** (`/dashboard/settings/security`).
Two factor types are supported:

1. **Authenticator app (TOTP).** Google Authenticator, 1Password, Authy, etc.
   Recommended. Works offline; no SMS cost.
2. **SMS / text message.** Requires an SMS provider (Twilio) configured in
   Supabase — see below. SMS is accepted because builders commonly don't have
   authenticator apps installed, but is flagged in the UI as less secure
   (SIM swapping).

After login with password, `signInWithPassword` returns an AAL1 session. The
login page calls `getAuthenticatorAssuranceLevel()`; if the user has any
verified factor, it redirects to `/mfa` for the challenge. The middleware
re-checks on every request so a user who bypasses the client redirect is
still blocked.

---

## Required Supabase dashboard configuration

These need to be set in the Supabase project dashboard — they are NOT in the
code repository.

### 1. Enable the MFA factors

**Dashboard → Authentication → Settings → Multi-factor authentication**

- Turn on **TOTP** factor.
- Turn on **Phone** factor. (It will be unusable until an SMS provider is
  configured; see step 3.)
- Set **Maximum enrolled factors** to 10 (default is fine).

### 2. Configure Auth URL allow-list

**Dashboard → Authentication → URL Configuration**

- **Site URL:** `https://www.buildercfo.com` (or your production domain).
- **Additional redirect URLs:** include the Vercel preview domain + any
  staging URLs you use.

### 3. Configure SMS provider (for SMS 2FA)

**Dashboard → Authentication → Providers → Phone**

You need a Twilio account (recommended) or MessageBird/Textlocal. After
creating a Twilio account:

1. Get **Account SID**, **Auth Token**, and a **Messaging Service SID** (or
   phone number).
2. In Supabase: enable the **Phone** provider.
3. Paste the SID, token, and Messaging Service SID.
4. Set a tight rate-limit on the Twilio side — SMS is metered and
   credential-stuffing attackers will burn your balance if you don't.

Until this is done, attempts to enroll a phone factor will return a 500
with "Unable to send SMS" — the UI surfaces that error.

### 4. Email templates + sender

**Dashboard → Authentication → Email Templates**

- Set the **Confirm signup**, **Magic link**, **Change email**, and
  **Reset password** templates to use the BuilderCFO branding.
- **Sender email:** configure a verified custom SMTP (Postmark or Resend)
  under **Authentication → SMTP Settings**. Don't ship with the default
  `noreply@supabase.io` sender — it looks phishy.

### 5. Password policy (defense-in-depth)

**Dashboard → Authentication → Settings → Password**

- Set **Minimum password length** to 12.
- Enable "**Prevent use of leaked passwords**" if available on your plan —
  that hits HIBP on every signup/password-change.

The app does client- AND server-side enforcement as well, but Supabase's
check is a third layer that catches direct API calls.

### 6. Session duration

**Dashboard → Authentication → Settings → Sessions**

- **JWT expiry:** 3600s (1 hour). The refresh token extends this.
- **Refresh token reuse detection:** ON.
- **Inactivity timeout:** 30 minutes (matches the in-app idle timeout).

### 7. Apply the audit-log migration

Run the migration file:

```bash
supabase db push
# or paste supabase/migrations/20260416_security_audit.sql into the SQL editor
```

Verify the `public.security_audit_log` table exists with RLS enabled and
two policies (`audit: user reads own`, `audit: admin reads all`).

---

## Required Vercel configuration

### Environment variables

In **Project Settings → Environment Variables**, confirm the following are
set for Production (and Preview if you want preview deploys to work):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` ← server-only, never expose
- `STRIPE_SECRET_KEY` ← server-only
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_STARTER`, `_PROFESSIONAL`, `_ENTERPRISE`, `_WHITEGLOVE_SETUP`
- `ANTHROPIC_API_KEY` (server-only; Claude API)

Never put a service role key in anything prefixed `NEXT_PUBLIC_`. That
prefix makes Next.js inline the value into the client bundle.

### Domain + HSTS preload

After the site has been serving HSTS with `preload` for a few days:

1. Submit the apex domain at <https://hstspreload.org/>.
2. Check back after a few weeks to confirm it's in the Chrome preload list.

Preloaded HSTS stops the first-connection downgrade attack.

---

## Operational guidance

- **Check the audit log weekly.** The admin-dashboard SQL below shows
  suspicious patterns.
- **Rotate the service role key** every 90 days.
- **Review admin accounts** — only `profiles.role = 'admin'` should have
  access to `/admin/*`. Audit with `select * from profiles where role = 'admin'`.
- **Never put customer PII** (SSN, full bank numbers) in markdown docs or
  metadata JSON. The `security_audit_log.metadata` column is intended for
  non-sensitive context (which route, which event, etc.).

### Sample audit-log queries

Recent failed logins per IP (last 24h):

```sql
select ip, count(*) as attempts
from security_audit_log
where event = 'login_failed' and created_at > now() - interval '24 hours'
group by ip
order by attempts desc
limit 20;
```

Users with 2FA disabled:

```sql
select p.email, p.id
from profiles p
where not exists (
  select 1 from auth.mfa_factors f
  where f.user_id = p.id and f.status = 'verified'
);
```

Password-change events this month:

```sql
select user_id, ip, created_at
from security_audit_log
where event = 'password_changed'
  and created_at > date_trunc('month', now())
order by created_at desc;
```

---

## If you are hacked

1. **Rotate** the Supabase service role key and all Stripe keys.
2. **Revoke all sessions** in Supabase: Dashboard → Authentication → Users
   → click the account → "Sign out user" (or SQL: `update auth.users set updated_at = now()`
   and invalidate refresh tokens).
3. **Enable Supabase's "require re-auth"** setting so everyone must log in
   again.
4. **Check the audit log** for the attacker's IP and correlate.
5. **Email affected users** within 72h per standard breach-notification
   practice (some US states require this by law).

---

Last reviewed: 2026-04-16.
