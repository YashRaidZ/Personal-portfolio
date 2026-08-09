-- ============================================================================
-- 0007_services.sql -- collection
-- ============================================================================

create table public.services (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('minecraft', 'discord', 'web', 'automation')),
  title text not null,
  description text not null default '',
  features text[] not null default '{}',
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index services_display_order_idx on public.services (display_order);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create trigger services_audit
  after insert or update or delete on public.services
  for each row execute function public.log_audit_event();

alter table public.services enable row level security;

create policy "services_select_public_published"
  on public.services for select
  to anon
  using (is_published = true);

create policy "services_select_admin_all"
  on public.services for select
  to authenticated
  using (public.is_admin());

create policy "services_insert_admin"
  on public.services for insert
  to authenticated
  with check (public.is_admin());

create policy "services_update_admin"
  on public.services for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "services_delete_admin"
  on public.services for delete
  to authenticated
  using (public.is_admin());
