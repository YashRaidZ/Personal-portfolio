-- ============================================================================
-- 0013_storage_buckets.sql
-- `media` bucket backs the Media Library. Public so images referenced from
-- published content (project thumbnails, hero art, testimonial avatars)
-- load directly without a signed URL; writes are admin-only.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760, -- 10 MB, Sharp compresses before upload so this is a hard ceiling not a target
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do nothing;

create policy "media_bucket_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "media_bucket_insert_admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy "media_bucket_update_admin"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "media_bucket_delete_admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());
