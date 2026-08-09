import { createClient } from "@/lib/supabase/server";
import type { SiteThemeData } from "@/types/content";

const FALLBACK: SiteThemeData = {
  accentPrimary: "#00e676",
  accentSecondary: "#4fc3f7",
  accentGold: "#ffc107",
  accentOrange: "#ff7043",
  motionScale: 1,
  glassIntensity: 1,
};

export async function getSiteTheme(): Promise<SiteThemeData> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_theme").select("*").eq("id", 1).maybeSingle();

  if (error || !data) return FALLBACK;

  return {
    accentPrimary: data.accent_primary,
    accentSecondary: data.accent_secondary,
    accentGold: data.accent_gold,
    accentOrange: data.accent_orange,
    motionScale: Number(data.motion_scale),
    glassIntensity: Number(data.glass_intensity),
  };
}
