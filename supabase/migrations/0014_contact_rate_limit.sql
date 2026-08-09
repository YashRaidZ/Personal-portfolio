-- ============================================================================
-- 0014_contact_rate_limit.sql
-- anon can only INSERT into contact_messages (0011) and has no SELECT grant,
-- so the app layer can't count recent submissions itself to rate-limit.
-- This BEFORE INSERT trigger runs SECURITY DEFINER, so it can see existing
-- rows regardless of the caller's RLS visibility, and rejects the insert
-- outright if the same ip_hash has submitted too many messages recently.
-- The Server Action still also does its own best-effort in-memory throttle
-- as a first line of defense; this is the layer that can't be bypassed.
-- ============================================================================

create or replace function public.enforce_contact_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  if new.ip_hash is not null then
    select count(*) into recent_count
    from public.contact_messages
    where ip_hash = new.ip_hash
      and created_at > now() - interval '15 minutes';

    if recent_count >= 5 then
      raise exception 'Too many messages sent recently. Please try again later.'
        using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

create trigger contact_messages_rate_limit
  before insert on public.contact_messages
  for each row execute function public.enforce_contact_rate_limit();
