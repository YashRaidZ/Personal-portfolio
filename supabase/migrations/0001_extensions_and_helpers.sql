-- ============================================================================
-- 0001_extensions_and_helpers.sql
-- Extensions, the single-admin identity table, and shared helper functions/
-- triggers reused by every later migration (updated_at bookkeeping + audit
-- logging). Nothing in here is content -- it's plumbing for RLS + audit.
-- ============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- admin_users
-- Holds the auth.users UID(s) allowed to act as admin. This project is a
-- single-admin system: after you create your Supabase Auth user (via the
-- dashboard or `supabase auth`), insert their UID here manually, e.g.:
--
--   insert into public.admin_users (user_id) values ('00000000-0000-0000-...');
--
-- RLS never trusts "authenticated" alone -- every write policy in this
-- project checks is_admin(), which checks membership in this table. This
-- means an accidental extra sign-up can never gain write access.
-- ----------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Only an existing admin can see who else is an admin. No public/anon access
-- at all -- this table is never read by the public site.
create policy "admin_users_select_admin_only"
  on public.admin_users for select
  to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- is_admin()
-- Security-definer function so it can check admin_users regardless of the
-- calling role's own RLS visibility into that table. Used in every write
-- policy across the schema.
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  );
$$;

-- ----------------------------------------------------------------------------
-- set_updated_at()
-- Generic BEFORE UPDATE trigger that stamps updated_at = now() on any table
-- that has that column. Attached per-table in each domain migration.
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- audit_log
-- Append-only. Populated exclusively by the log_audit_event() trigger below
-- (never written to directly by application code), so every admin write --
-- no matter which Server Action or client made it -- is captured at the DB
-- layer and can't be bypassed.
-- ----------------------------------------------------------------------------
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  table_name text not null,
  record_id text not null,
  diff jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

create policy "audit_log_select_admin_only"
  on public.audit_log for select
  to authenticated
  using (public.is_admin());

-- No insert/update/delete policies for any role -- the table is only ever
-- written to by the SECURITY DEFINER trigger function below, which bypasses
-- RLS. This keeps the audit trail tamper-proof from the app layer.

create or replace function public.log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  rec_id text;
  change jsonb;
begin
  if (tg_op = 'DELETE') then
    rec_id := (to_jsonb(old) ->> 'id');
    change := to_jsonb(old);
  elsif (tg_op = 'UPDATE') then
    rec_id := (to_jsonb(new) ->> 'id');
    change := jsonb_build_object('before', to_jsonb(old), 'after', to_jsonb(new));
  else
    rec_id := (to_jsonb(new) ->> 'id');
    change := to_jsonb(new);
  end if;

  insert into public.audit_log (actor_id, action, table_name, record_id, diff)
  values (auth.uid(), tg_op, tg_table_name, coalesce(rec_id, 'unknown'), change);

  if (tg_op = 'DELETE') then
    return old;
  else
    return new;
  end if;
end;
$$;
