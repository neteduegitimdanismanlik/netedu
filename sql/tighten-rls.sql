-- Tightens three browser permissions that let a student do more than read.
--
-- The app never updates or deletes these tables from the browser — every write
-- goes through the server (service_role), which RLS doesn't restrict. The only
-- browser write is the parent_links INSERT on the dashboard, which stays.
-- So nothing in the app changes; only the console tricks stop working.
--
-- 1. checker_reports_owner_all (ALL): a student could delete their reports.
--    Read-only now. (IA Checker limits now count feature_usage anyway.)
-- 2. portfolio_items_owner_all (ALL): a student could set their own item's
--    status to approved. Read-only now.
-- 3. parent_links_update: a student could rewrite a link's student_id /
--    parent_user_id and appear as the parent of any student. Dropped.
--
-- Run once in Supabase > SQL Editor. Running it again is harmless.

drop policy if exists checker_reports_owner_all on public.checker_reports;
drop policy if exists checker_reports_owner_read on public.checker_reports;
create policy checker_reports_owner_read on public.checker_reports
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists portfolio_items_owner_all on public.portfolio_items;
drop policy if exists portfolio_items_owner_read on public.portfolio_items;
create policy portfolio_items_owner_read on public.portfolio_items
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists parent_links_update on public.parent_links;

-- Check: should list only SELECT (r) for the first two, and no UPDATE (w) on parent_links.
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('checker_reports', 'portfolio_items', 'parent_links')
order by tablename, policyname;
