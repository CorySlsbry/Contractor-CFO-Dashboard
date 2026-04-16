-- Security audit log + rate-limit infra + helper policies.
-- Creates the `security_audit_log` table used by src/lib/security/audit-log.ts
-- for recording authentication + account-mutating events.

create table if not exists public.security_audit_log (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  event          text not null,          -- e.g. 'login_success','login_failed','mfa_enrolled','mfa_removed','password_changed','account_deleted'
  severity       text not null default 'info' check (severity in ('info','warning','critical')),
  ip             inet,
  user_agent     text,
  metadata       jsonb default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

create index if not exists security_audit_log_user_idx    on public.security_audit_log (user_id, created_at desc);
create index if not exists security_audit_log_event_idx   on public.security_audit_log (event, created_at desc);
create index if not exists security_audit_log_sev_idx     on public.security_audit_log (severity, created_at desc) where severity <> 'info';

-- RLS: only the authenticated user sees their own rows; admins (role=admin in profiles)
-- can see everything via a separate policy. No inserts/updates from clients — all
-- writes happen via service-role in server-side handlers.
alter table public.security_audit_log enable row level security;

drop policy if exists "audit: user reads own" on public.security_audit_log;
create policy "audit: user reads own"
  on public.security_audit_log
  for select
  using (auth.uid() = user_id);

drop policy if exists "audit: admin reads all" on public.security_audit_log;
create policy "audit: admin reads all"
  on public.security_audit_log
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- No client-side insert/update/delete policies. Service role bypasses RLS
-- which is what our server handlers use.

comment on table public.security_audit_log is
  'Security audit trail for auth events, MFA changes, and account mutations. Writes happen server-side only.';
