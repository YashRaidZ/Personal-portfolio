"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, runAction } from "@/lib/actions/_guard";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations/content";

export async function updateSiteSettingsAction(input: SiteSettingsInput) {
  return runAction(async () => {
    const parsed = siteSettingsSchema.parse(input);
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from("site_settings")
      .update({
        site_title: parsed.siteTitle,
        meta_description: parsed.metaDescription,
        footer_text: parsed.footerText,
        copyright_text: parsed.copyrightText,
      })
      .eq("id", 1);

    if (error) throw new Error(error.message);

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
  });
}
