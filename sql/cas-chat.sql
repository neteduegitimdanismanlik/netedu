-- ---------------------------------------------------------------------------
-- NetEdu — CAS project collaboration
--
-- Adds: plan column, project membership, in-platform messaging, reporting.
-- Safe to run more than once.
-- ---------------------------------------------------------------------------

-- 1. Plan --------------------------------------------------------------------
alter table public.profiles
  add column if not exists plan text not null default 'free';

alter table public.profiles
  drop constraint if exists profiles_plan_check;
alter table public.profiles
  add constraint profiles_plan_check check (plan in ('free', 'pro'));


-- 2. Applications: make sure the columns the code relies on exist -------------
alter table public.cas_applications
  add column if not exists created_at timestamptz not null default now();

alter table public.cas_applications
  add column if not exists decided_at timestamptz;

-- status: pending | accepted | declined | removed
alter table public.cas_applications
  drop constraint if exists cas_applications_status_check;
alter table public.cas_applications
  add constraint cas_applications_status_check
  check (status in ('pending', 'accepted', 'declined', 'removed'));

-- One application per student per project.
create unique index if not exists cas_applications_unique_member
  on public.cas_applications (event_id, user_id);

create index if not exists cas_applications_user_day
  on public.cas_applications (user_id, created_at desc);


-- 3. Messages ----------------------------------------------------------------
create table if not exists public.cas_project_messages (
  id               uuid primary key default gen_random_uuid(),
  event_id         uuid not null references public.cas_events(id) on delete cascade,
  sender_id        uuid not null references auth.users(id) on delete cascade,
  body             text not null check (char_length(body) between 1 and 1000),
  flagged_contact  boolean not null default false,
  removed          boolean not null default false,
  created_at       timestamptz not null default now()
);

create index if not exists cas_messages_thread
  on public.cas_project_messages (event_id, created_at);

create index if not exists cas_messages_sender_day
  on public.cas_project_messages (sender_id, created_at desc);


-- 4. Reports -----------------------------------------------------------------
create table if not exists public.cas_message_reports (
  id           uuid primary key default gen_random_uuid(),
  message_id   uuid not null references public.cas_project_messages(id) on delete cascade,
  reported_by  uuid not null references auth.users(id) on delete cascade,
  reason       text,
  status       text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at   timestamptz not null default now()
);

create unique index if not exists cas_reports_one_per_person
  on public.cas_message_reports (message_id, reported_by);


-- 5. Membership helper -------------------------------------------------------
-- SECURITY DEFINER so the policies below can look across tables without
-- needing the caller to have read access to those tables directly.
create or replace function public.is_cas_member(p_event uuid, p_user uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
           select 1 from public.cas_events e
           where e.id = p_event and e.created_by = p_user
         )
      or exists (
           select 1 from public.cas_applications a
           where a.event_id = p_event
             and a.user_id = p_user
             and a.status = 'accepted'
         );
$$;


-- 6. RLS ---------------------------------------------------------------------
-- The API routes use the service_role key and bypass all of this. These
-- policies exist so that the same tables are still safe if anyone reaches
-- them with the public anon key.

alter table public.cas_project_messages enable row level security;
alter table public.cas_message_reports  enable row level security;

drop policy if exists "members read thread"        on public.cas_project_messages;
drop policy if exists "members write own message"  on public.cas_project_messages;
drop policy if exists "service role messages"      on public.cas_project_messages;

create policy "members read thread"
  on public.cas_project_messages for select
  using (removed = false and public.is_cas_member(event_id, auth.uid()));

create policy "members write own message"
  on public.cas_project_messages for insert
  with check (sender_id = auth.uid() and public.is_cas_member(event_id, auth.uid()));

create policy "service role messages"
  on public.cas_project_messages for all
  to service_role using (true) with check (true);

drop policy if exists "own reports"          on public.cas_message_reports;
drop policy if exists "admin reads reports"  on public.cas_message_reports;
drop policy if exists "service role reports" on public.cas_message_reports;

create policy "own reports"
  on public.cas_message_reports for insert
  with check (reported_by = auth.uid());

create policy "admin reads reports"
  on public.cas_message_reports for select
  using (reported_by = auth.uid() or public.is_admin());

create policy "service role reports"
  on public.cas_message_reports for all
  to service_role using (true) with check (true);
