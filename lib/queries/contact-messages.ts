import { createClient } from "@/lib/supabase/server";

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactMessagesFilter {
  search?: string;
  unreadOnly?: boolean;
}

/** Admin inbox. Requires an authenticated admin session -- RLS blocks anyone else. */
export async function getContactMessages(filter: ContactMessagesFilter = {}): Promise<ContactMessageRow[]> {
  const supabase = await createClient();
  let query = supabase.from("contact_messages").select("*").order("created_at", { ascending: false });

  if (filter.unreadOnly) {
    query = query.eq("is_read", false);
  }
  if (filter.search) {
    const term = `%${filter.search}%`;
    query = query.or(`name.ilike.${term},email.ilike.${term},message.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));
}

export async function getUnreadMessageCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);
  return count ?? 0;
}
