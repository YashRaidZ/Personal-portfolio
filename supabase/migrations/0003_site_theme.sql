-- ============================================================================
-- 0003_site_theme.sql -- singleton
-- Mirrors the CSS custom properties declared under @theme in app/globals.css.
-- <ThemeProvider> reads this row and overrides :root at runtime, so a theme
-- edit in the admin panel takes effect without a rebuild/redeploy.
-- ============================================================================

create table public.site_theme (
  id int primary key default 1 check (id = 1),
  accent_primary text not null default '#00e676',
  accent_secondary text not null default '#4fc3f7',
  accent_gold text not null default '#ffc107',
  accent_orange text not null default '#ff7043',
  motion_scale numeric(3, 2) not null default 1.0 check (motion_scale between 0 and 2),
  glass_intensity numeric(3, 2) not null default 1.0 check (glass_intensity between 0 and 2),
  updated_at timestamptz not null default now()
);

insert into public.site_theme (id) values (1);

create trigger site_theme_set_updated_at
  before update on public.site_theme
  for each row execute function public.set_updated_at();

create trigger site_theme_audit
  after update on public.site_theme
  for each row execute function public.log_audit_event();

alter table public.site_theme enable row level security;

create policy "site_theme_select_public"
  on public.site_theme for select
  to anon, authenticated
  using (true);

create policy "site_theme_update_admin"
  on public.site_theme for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
