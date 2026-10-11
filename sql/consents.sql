-- NetEdu: KVKK / gizlilik onay kayıtları + veli onayı
-- Supabase > SQL Editor'de BİR KEZ çalıştır. Tekrar çalıştırmak zararsızdır.

create table if not exists public.consents (
  user_id               uuid primary key references auth.users(id) on delete cascade,
  birth_date            date not null,
  notice_version        text not null,
  notice_accepted_at    timestamptz not null default now(),
  marketing_opt_in      boolean not null default false,
  improvement_opt_in    boolean not null default false,
  parent_email          text,
  parent_token          uuid unique default gen_random_uuid(),
  parent_email_sent_at  timestamptz,
  parent_name           text,
  parent_notice_version text,
  parent_approved_at    timestamptz,
  parent_approved_ip    text,
  created_at            timestamptz not null default now()
);

alter table public.consents enable row level security;

-- Öğrenci yalnızca kendi satırını okuyabilir. Tarayıcıdan yazma yok:
-- satırı kayıt anında trigger, sonrasını sunucu (service_role) yazar.
drop policy if exists consents_select_own on public.consents;
create policy consents_select_own on public.consents
  for select using (auth.uid() = user_id);

-- Kayıt formundaki onay, signUp metadata'sından burada satıra dönüşür.
-- E-posta doğrulaması açıkken (o anda oturum yokken) de çalışsın diye trigger.
create or replace function public.handle_new_user_consent()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  if meta ? 'birth_date' and coalesce(meta->>'notice_accepted', 'false') = 'true' then
    insert into public.consents (
      user_id, birth_date, notice_version,
      marketing_opt_in, improvement_opt_in, parent_email
    ) values (
      new.id,
      (meta->>'birth_date')::date,
      coalesce(meta->>'notice_version', 'unknown'),
      coalesce((meta->>'marketing_opt_in')::boolean, false),
      coalesce((meta->>'improvement_opt_in')::boolean, false),
      nullif(lower(trim(meta->>'parent_email')), '')
    )
    on conflict (user_id) do nothing;
  end if;
  return new;
exception when others then
  -- Bozuk metadata kaydı engellemesin; kullanıcı ilk girişte /consent ekranına düşer.
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_consent on auth.users;
create trigger on_auth_user_created_consent
  after insert on auth.users
  for each row execute function public.handle_new_user_consent();

notify pgrst, 'reload schema';
