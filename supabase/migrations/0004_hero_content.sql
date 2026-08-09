-- ============================================================================
-- 0004_hero_content.sql -- singleton
-- social_links stored as jsonb: [{ "platform": "github", "url": "..." }, ...]
-- matches types/content.ts SocialLink[] exactly, validated by zod on write.
-- ============================================================================

create table public.hero_content (
  id int primary key default 1 check (id = 1),
  eyebrow text,
  name text not null default 'Your Name',
  description text not null default '',
  primary_button_text text not null default 'View Projects',
  primary_button_link text not null default '#projects',
  secondary_button_text text not null default 'Contact Me',
  secondary_button_link text not null default '#contact',
  social_links jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.hero_content (id) values (1);

create trigger hero_content_set_updated_at
  before update on public.hero_content
  for each row execute function public.set_updated_at();

create trigger hero_content_audit
  after update on public.hero_content
  for each row execute function public.log_audit_event();

alter table public.hero_content enable row level security;

create policy "hero_content_select_public"
  on public.hero_content for select
  to anon, authenticated
  using (true);

create policy "hero_content_update_admin"
  on public.hero_content for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
