-- Pro monthly allowances: package renewals.
--
-- Every Pro allowance (lib/plan-limits.ts, PRO_MONTHLY_*) counts usage from
-- the 1st of the month (UTC) — or from the latest row here for that student,
-- if that is later. Renewing a package = inserting a row: every counter
-- starts again from that moment.
--
-- RLS is ON with NO policies: only the server (service_role) can read or
-- write this table. It is deliberately not a column on profiles, because the
-- browser writes to profiles directly during onboarding — a student could
-- otherwise reset their own counters.
--
-- Run once in the Supabase SQL Editor. Until it exists the app still works;
-- allowances just can't be renewed early.

create table if not exists public.quota_resets (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  reset_at timestamptz not null default now(),
  note text
);

alter table public.quota_resets enable row level security;

create index if not exists quota_resets_user_reset_idx
  on public.quota_resets (user_id, reset_at desc);

-- ------------------------------------------------------------------------
-- Renewing a student's package by hand (after they've paid / emailed in):
--
--   insert into public.quota_resets (user_id, note)
--   select id, 'renewed by email' from auth.users where email = 'student@example.com';
-- ------------------------------------------------------------------------
