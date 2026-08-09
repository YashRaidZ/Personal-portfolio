import { createClient } from "@/lib/supabase/server";
import type { ContactInfoData, SocialLink } from "@/types/content";

const FALLBACK: ContactInfoData = { email: "", socialLinks: [] };

export async function getContactInfo(): Promise<ContactInfoData> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("contact_info").select("*").eq("id", 1).maybeSingle();

  if (error || !data) return FALLBACK;

  return {
    email: data.email,
    discordHandle: data.discord_handle ?? undefined,
    githubUrl: data.github_url ?? undefined,
    socialLinks: (data.social_links as unknown as SocialLink[]) ?? [],
  };
}
