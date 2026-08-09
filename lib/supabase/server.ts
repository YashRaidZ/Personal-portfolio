import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. " +
        "Copy .env.example to .env.local, fill in your Supabase project's URL and anon key " +
        "(https://supabase.com/dashboard/project/_/settings/api), and restart `npm run dev` " +
        "-- Next.js only reads env files at startup."
    );
  }

  return { url, anonKey };
}

/**
 * Server Component / Server Action / Route Handler Supabase client. Reads
 * and writes the session via Next's cookie store so `supabase.auth.getUser()`
 * reflects the signed-in admin, and every query runs as that user -- RLS
 * (is_admin()) is what actually authorizes writes, this client just carries
 * the session that RLS checks against.
 *
 * Call this fresh in every Server Component / Action -- don't cache the
 * instance across requests.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component render (not an Action/Route
          // Handler) -- cookies() is read-only there. Safe to ignore
          // because middleware refreshes the session on every request.
        }
      },
    },
  });
}
