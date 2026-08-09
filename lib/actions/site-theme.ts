"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, runAction } from "@/lib/actions/_guard";
import { siteThemeSchema, type SiteThemeInput } from "@/lib/validations/content";

export async function updateSiteThemeAction(input: SiteThemeInput) {
  return runAction(async () => {
    const parsed = siteThemeSchema.parse(input);
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from("site_theme")
      .update({
        accent_primary: parsed.accentPrimary,
        accent_secondary: parsed.accentSecondary,
        accent_gold: parsed.accentGold,
        accent_orange: parsed.accentOrange,
        motion_scale: parsed.motionScale,
        glass_intensity: parsed.glassIntensity,
      })
      .eq("id", 1);

    if (error) throw new Error(error.message);

    revalidatePath("/", "layout");
    revalidatePath("/admin/theme");
  });
}
