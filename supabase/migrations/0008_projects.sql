-- ============================================================================
-- 0008_projects.sql -- collection
-- `access` preserved exactly as designed in Phase 1:
--   opensource -> show source link
--   paid       -> show a store/purchase link + "Paid" badge, no source link
--   private    -> no links, "Private" badge
-- ============================================================================

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  thumbnail_url text,
  technologies text[] not null default '{}',
  features text[] not null default '{}',
  github_url text,
  live_demo_url text,
  access text not null default 'opensource' check (access in ('opensource', 'paid', 'private')),
  is_featured boolean not null default false,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_display_order_idx on public.projects (display_order);
create index projects_slug_idx on public.projects (slug);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger projects_audit
  after insert or update or delete on public.projects
  for each row execute function public.log_audit_event();

alter table public.projects enable row level security;

create policy "projects_select_public_published"
  on public.projects for select
  to anon
  using (is_published = true);

create policy "projects_select_admin_all"
  on public.projects for select
  to authenticated
  using (public.is_admin());

create policy "projects_insert_admin"
  on public.projects for insert
  to authenticated
  with check (public.is_admin());

create policy "projects_update_admin"
  on public.projects for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "projects_delete_admin"
  on public.projects for delete
  to authenticated
  using (public.is_admin());
