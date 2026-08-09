-- ============================================================================
-- 0011_contact_messages.sql -- collection
-- anon may only INSERT (the public contact form). Nothing about a submitted
-- message -- including the row it just created -- is ever readable by anon;
-- only an admin can list, read, or delete messages. ip_hash stores a salted
-- hash (never the raw IP) purely to support the app-level rate limit.
-- ============================================================================

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index contact_messages_ip_hash_idx on public.contact_messages (ip_hash, created_at);
create index contact_messages_is_read_idx on public.contact_messages (is_read);

create trigger contact_messages_audit
  after insert or update or delete on public.contact_messages
  for each row execute function public.log_audit_event();

alter table public.contact_messages enable row level security;

-- Public contact form: insert-only, no select granted so a submission can
-- never be echoed back or enumerated by anon.
create policy "contact_messages_insert_public"
  on public.contact_messages for insert
  to anon
  with check (true);

create policy "contact_messages_select_admin"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

create policy "contact_messages_update_admin"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "contact_messages_delete_admin"
  on public.contact_messages for delete
  to authenticated
  using (public.is_admin());
