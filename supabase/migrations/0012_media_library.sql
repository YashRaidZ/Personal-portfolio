-- ============================================================================
-- 0012_media_library.sql
-- Metadata for files stored in the `media` Storage bucket (see
-- 0013_storage_buckets.sql). Admin-only in both directions: public pages
-- store a plain thumbnail_url/avatar_url string on their own row (copied
-- from here at upload time), they never query this table directly.
-- ============================================================================

create table public.media_library (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null unique,
  url text not null,
  mime_type text not null,
  size_bytes int not null,
  width int,
  height int,
  alt_text text,
  created_at timestamptz not null default now()
);

create index media_library_created_at_idx on public.media_library (created_at desc);

create trigger media_library_audit
  after insert or update or delete on public.media_library
  for each row execute function public.log_audit_event();

alter table public.media_library enable row level security;

create policy "media_library_select_admin"
  on public.media_library for select
  to authenticated
  using (public.is_admin());

create policy "media_library_insert_admin"
  on public.media_library for insert
  to authenticated
  with check (public.is_admin());

create policy "media_library_update_admin"
  on public.media_library for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "media_library_delete_admin"
  on public.media_library for delete
  to authenticated
  using (public.is_admin());
