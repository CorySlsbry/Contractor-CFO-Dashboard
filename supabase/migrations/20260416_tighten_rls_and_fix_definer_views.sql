-- ============================================================================
-- Security advisor cleanup — round 2 (2026-04-16)
--
-- Goals:
-- 1) Convert 3 SECURITY DEFINER views to SECURITY INVOKER so RLS on their
--    base tables actually applies to the caller rather than being bypassed
--    by the view owner's permissions.
--      - login_attempts_recent         (admin monitoring aggregation)
--      - organization_members          (profiles JOIN organizations)
--      - organizations_with_latest_snapshot (org + latest dashboard pull;
--          includes qbo_access_token columns — now only readable via user's
--          own-org RLS policy, not bypassed)
-- 2) Grant platform admins SELECT on login_attempts so the recent-failures
--    view is still usable from an admin dashboard under SECURITY INVOKER.
-- 3) Tighten permissive `USING (true)` policies on admin/CRM tables to
--    `is_platform_admin()` — previously ANY authenticated user could
--    read/write these; now only a user with profiles.platform_role in
--    ('admin','superadmin') can.
-- 4) Fix misnamed `Service role full access` policy on contractor_universe
--    that was actually granted to the `public` role with `USING (true)` —
--    i.e. readable by anyone, not just the service role.
-- ============================================================================

-- ---- Part 1: views → SECURITY INVOKER -------------------------------------
alter view public.login_attempts_recent              set (security_invoker = true);
alter view public.organization_members               set (security_invoker = true);
alter view public.organizations_with_latest_snapshot set (security_invoker = true);

-- ---- Part 2: login_attempts admin read -------------------------------------
drop policy if exists "login_attempts: platform admin reads" on public.login_attempts;
create policy "login_attempts: platform admin reads"
  on public.login_attempts
  for select
  to authenticated
  using (public.is_platform_admin());

-- ---- Part 3: tighten admin-only tables -------------------------------------
-- Pattern: drop `USING (true)` admin-all policies, replace with is_platform_admin().

drop policy if exists "content_campaigns_admin_all" on public.content_campaigns;
create policy "content_campaigns: platform admin all"
  on public.content_campaigns for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access conversations" on public.crm_conversations;
create policy "crm_conversations: platform admin all"
  on public.crm_conversations for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access deals" on public.crm_deals;
create policy "crm_deals: platform admin all"
  on public.crm_deals for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access email events" on public.crm_email_events;
create policy "crm_email_events: platform admin all"
  on public.crm_email_events for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access email template folders" on public.crm_email_template_folders;
create policy "crm_email_template_folders: platform admin all"
  on public.crm_email_template_folders for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access email templates" on public.crm_email_templates;
create policy "crm_email_templates: platform admin all"
  on public.crm_email_templates for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access messages" on public.crm_messages;
create policy "crm_messages: platform admin all"
  on public.crm_messages for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access notes" on public.crm_notes;
create policy "crm_notes: platform admin all"
  on public.crm_notes for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access pipeline stages" on public.crm_pipeline_stages;
create policy "crm_pipeline_stages: platform admin all"
  on public.crm_pipeline_stages for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access tasks" on public.crm_tasks;
create policy "crm_tasks: platform admin all"
  on public.crm_tasks for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access enrollments" on public.crm_workflow_enrollments;
create policy "crm_workflow_enrollments: platform admin all"
  on public.crm_workflow_enrollments for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access executions" on public.crm_workflow_executions;
create policy "crm_workflow_executions: platform admin all"
  on public.crm_workflow_executions for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "Authenticated users can manage workflow folders" on public.crm_workflow_folders;
create policy "crm_workflow_folders: platform admin all"
  on public.crm_workflow_folders for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access workflow steps" on public.crm_workflow_steps;
create policy "crm_workflow_steps: platform admin all"
  on public.crm_workflow_steps for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin full access workflows" on public.crm_workflows;
create policy "crm_workflows: platform admin all"
  on public.crm_workflows for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "admin read social posts" on public.social_posts;
create policy "social_posts: platform admin reads"
  on public.social_posts for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "admin read video posts" on public.video_posts;
create policy "video_posts: platform admin reads"
  on public.video_posts for select to authenticated
  using (public.is_platform_admin());

-- ---- Part 4: fix misnamed contractor_universe policy -----------------------
drop policy if exists "Service role full access" on public.contractor_universe;
create policy "contractor_universe: platform admin reads"
  on public.contractor_universe for select to authenticated
  using (public.is_platform_admin());

-- ---- Part 5: drop unused anon CRM policies ---------------------------------
-- crm_conversations + crm_messages are empty tables inherited from a CRM
-- schema import and NOT referenced anywhere in /src. The anon
-- `USING (true)` policies let any anonymous client read/edit any row,
-- which is a real hole — but the feature isn't wired up at all. Drop them;
-- re-add with signed-session-token scoping if the chat widget is built.
drop policy if exists "anon insert conversations"     on public.crm_conversations;
drop policy if exists "anon select own conversations" on public.crm_conversations;
drop policy if exists "anon update own conversations" on public.crm_conversations;
drop policy if exists "anon insert messages"          on public.crm_messages;
drop policy if exists "anon select messages"          on public.crm_messages;
