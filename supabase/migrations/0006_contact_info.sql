-- ============================================================================
-- 0006_contact_info.sql -- singleton
-- ============================================================================

create table public.contact_info (
  id int primary key default 1 check (id = 1),
  email text not null default '',
  discord_handle text,
  github_url text,
  social_links jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.contact_info (id) values (1);

create trigger contact_info_set_updated_at
  before update on public.contact_info
  for each row execute function public.set_updated_at();

create trigger contact_info_audit
  after update on public.contact_info
  for each row execute function public.log_audit_event();

alter table public.contact_info enable row level security;

create policy "contact_info_select_public"
  on public.contact_info for select
  to anon, authenticated
  using (true);

create policy "contact_info_update_admin"
  on public.contact_info for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
