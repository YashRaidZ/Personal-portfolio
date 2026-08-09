-- ============================================================================
-- 0010_testimonials.sql -- collection
-- Public query already filters to is_published and the Testimonials
-- component auto-hides its whole section when the array is empty, so
-- "no published testimonials yet" degrades gracefully with zero code change.
-- ============================================================================

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text not null default '',
  avatar_url text,
  content text not null,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index testimonials_display_order_idx on public.testimonials (display_order);

create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

create trigger testimonials_audit
  after insert or update or delete on public.testimonials
  for each row execute function public.log_audit_event();

alter table public.testimonials enable row level security;

create policy "testimonials_select_public_published"
  on public.testimonials for select
  to anon
  using (is_published = true);

create policy "testimonials_select_admin_all"
  on public.testimonials for select
  to authenticated
  using (public.is_admin());

create policy "testimonials_insert_admin"
  on public.testimonials for insert
  to authenticated
  with check (public.is_admin());

create policy "testimonials_update_admin"
  on public.testimonials for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "testimonials_delete_admin"
  on public.testimonials for delete
  to authenticated
  using (public.is_admin());
