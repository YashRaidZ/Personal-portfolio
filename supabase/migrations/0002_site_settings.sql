-- ============================================================================
-- 0002_site_settings.sql -- singleton
-- ============================================================================

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  site_title text not null default 'Minecraft & Discord Developer',
  meta_description text not null default '',
  footer_text text not null default '',
  copyright_text text not null default '',
  github_username text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

create trigger site_settings_audit
  after update on public.site_settings
  for each row execute function public.log_audit_event();

alter table public.site_settings enable row level security;

-- Public read: needed for generateMetadata() on every page render.
create policy "site_settings_select_public"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "site_settings_update_admin"
  on public.site_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No insert/delete policies for anyone: this is a fixed singleton row
-- seeded above and only ever updated, never created or removed.
