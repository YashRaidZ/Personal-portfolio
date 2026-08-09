import { createClient } from "@/lib/supabase/server";
import type { SiteSettingsData } from "@/types/content";

const FALLBACK: SiteSettingsData = {
  siteTitle: "Minecraft & Discord Developer",
  metaDescription: "",
  footerText: "",
  copyrightText: "",
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  if (error || !data) return FALLBACK;

  return {
    siteTitle: data.site_title,
    metaDescription: data.meta_description,
    footerText: data.footer_text,
    copyrightText: data.copyright_text,
  };
}
