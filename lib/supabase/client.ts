import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Client Component Supabase client. Uses the public anon key only -- every
 * privileged operation is gated by RLS (is_admin()), never by a secret key
 * shipped to the browser.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. " +
        "Copy .env.example to .env.local, fill in your Supabase project's URL and anon key, " +
        "and restart `npm run dev`."
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
