-- ============================================================================
-- 0009_tech_stack.sql -- collection (parent/child)
-- tech_items.category_id cascades on delete so removing a category cleans
-- up its items automatically -- the admin UI still confirms before deleting
-- a category that has items.
-- ============================================================================

create table public.tech_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tech_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.tech_categories (id) on delete cascade,
  name text not null,
  icon text,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tech_categories_display_order_idx on public.tech_categories (display_order);
create index tech_items_category_id_idx on public.tech_items (category_id);
create index tech_items_display_order_idx on public.tech_items (display_order);

create trigger tech_categories_set_updated_at
  before update on public.tech_categories
  for each row execute function public.set_updated_at();

create trigger tech_items_set_updated_at
  before update on public.tech_items
  for each row execute function public.set_updated_at();

create trigger tech_categories_audit
  after insert or update or delete on public.tech_categories
  for each row execute function public.log_audit_event();

create trigger tech_items_audit
  after insert or update or delete on public.tech_items
  for each row execute function public.log_audit_event();

alter table public.tech_categories enable row level security;
alter table public.tech_items enable row level security;

create policy "tech_categories_select_public"
  on public.tech_categories for select
  to anon, authenticated
  using (true);

create policy "tech_categories_insert_admin"
  on public.tech_categories for insert
  to authenticated
  with check (public.is_admin());

create policy "tech_categories_update_admin"
  on public.tech_categories for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "tech_categories_delete_admin"
  on public.tech_categories for delete
  to authenticated
  using (public.is_admin());

create policy "tech_items_select_public"
  on public.tech_items for select
  to anon, authenticated
  using (true);

create policy "tech_items_insert_admin"
  on public.tech_items for insert
  to authenticated
  with check (public.is_admin());

create policy "tech_items_update_admin"
  on public.tech_items for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "tech_items_delete_admin"
  on public.tech_items for delete
  to authenticated
  using (public.is_admin());
