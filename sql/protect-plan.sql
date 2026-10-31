-- Protects profiles.plan from being changed by the browser.
--
-- WHY: the policy profiles_owner_all (ALL, USING/CHECK auth.uid() = id) lets
-- a signed-in student write ANY column of their own profile row — onboarding
-- needs that for grade, GPA, activities. But it also meant one line in the
-- browser console, supabase.from('profiles').update({ plan: 'unlimited' }),
-- made a student Pro with no limits, for free. Every server-side lock reads
-- plan from this column (lib/plan.ts), so all of them were bypassable.
--
-- WHAT THIS DOES: for requests made with a browser session (JWT role 'anon'
-- or 'authenticated'), a new row always starts as 'free' and an update can
-- never change plan — the old value is silently kept, everything else in the
-- update goes through, so onboarding is unaffected. The server
-- (service_role: payment webhooks, cancellations) and the SQL Editor (no JWT)
-- can still set plan exactly as before.
--
-- Run once in Supabase > SQL Editor. Running it again is harmless.

create or replace function public.protect_profile_plan()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  caller text := coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', '');
begin
  if caller in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      new.plan := 'free';
    elsif new.plan is distinct from old.plan then
      new.plan := old.plan;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_plan on public.profiles;
create trigger protect_profile_plan
  before insert or update on public.profiles
  for each row execute function public.protect_profile_plan();
