-- ============================================================================
-- 0005_about_content.sql -- singleton
-- body: text[] of paragraphs. highlights: jsonb array of
-- { icon, label } matching AboutHighlight in types/content.ts.
-- ============================================================================

create table public.about_content (
  id int primary key default 1 check (id = 1),
  heading text not null default '',
  body text[] not null default '{}',
  highlights jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.about_content (id) values (1);

create trigger about_content_set_updated_at
  before update on public.about_content
  for each row execute function public.set_updated_at();

create trigger about_content_audit
  after update on public.about_content
  for each row execute function public.log_audit_event();

alter table public.about_content enable row level security;

create policy "about_content_select_public"
  on public.about_content for select
  to anon, authenticated
  using (true);

create policy "about_content_update_admin"
  on public.about_content for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
