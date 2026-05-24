-- GetMeFound API access policies
-- Run this after supabase/schema.sql.

grant usage on schema public to anon, authenticated, service_role;

grant insert on public.contact_submissions to anon, authenticated;
grant insert on public.agent_tasks to anon, authenticated;
grant insert on public.email_events to anon, authenticated;

grant select on public.tooling_status to anon, authenticated;

grant all privileges on public.contact_submissions to service_role;
grant all privileges on public.agent_tasks to service_role;
grant all privileges on public.email_events to service_role;
grant all privileges on public.tooling_status to service_role;
grant all privileges on public.client_profiles to service_role;
grant all privileges on public.client_integrations to service_role;
grant all privileges on public.review_automation_events to service_role;
grant all privileges on public.review_automation_suppressions to service_role;

drop policy if exists "allow contact submissions insert" on public.contact_submissions;
create policy "allow contact submissions insert"
on public.contact_submissions
for insert
to anon, authenticated
with check (true);

drop policy if exists "allow agent tasks insert" on public.agent_tasks;
create policy "allow agent tasks insert"
on public.agent_tasks
for insert
to anon, authenticated
with check (true);

drop policy if exists "allow email events insert" on public.email_events;
create policy "allow email events insert"
on public.email_events
for insert
to anon, authenticated
with check (true);

drop policy if exists "allow tooling status read" on public.tooling_status;
create policy "allow tooling status read"
on public.tooling_status
for select
to anon, authenticated
using (true);

drop policy if exists "service role manages client profiles" on public.client_profiles;
create policy "service role manages client profiles"
on public.client_profiles
for all
to service_role
using (true)
with check (true);

drop policy if exists "service role manages client integrations" on public.client_integrations;
create policy "service role manages client integrations"
on public.client_integrations
for all
to service_role
using (true)
with check (true);

drop policy if exists "service role manages review automation events" on public.review_automation_events;
create policy "service role manages review automation events"
on public.review_automation_events
for all
to service_role
using (true)
with check (true);

drop policy if exists "service role manages review automation suppressions" on public.review_automation_suppressions;
create policy "service role manages review automation suppressions"
on public.review_automation_suppressions
for all
to service_role
using (true)
with check (true);
