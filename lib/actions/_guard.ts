import "server-only";
import { createClient } from "@/lib/supabase/server";

export class AdminActionError extends Error {}

/**
 * Every write Server Action calls this first. RLS (is_admin()) is the real
 * security boundary and would reject an unauthorized write regardless --
 * this just turns that into a clean, friendly error for the admin UI
 * instead of a raw Postgres error, and avoids a wasted round-trip.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new AdminActionError("You must be signed in as an admin to do that.");
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    throw new AdminActionError("This account isn't authorized as an admin.");
  }

  return { supabase, user };
}

/** Wraps an action body so unexpected errors become a plain string for the UI. */
export async function runAction<T>(fn: () => Promise<T>): Promise<
  { success: true; data: T } | { success: false; error: string }
> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (err) {
    if (err instanceof AdminActionError) {
      return { success: false, error: err.message };
    }
    console.error(err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
