"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, runAction } from "@/lib/actions/_guard";
import { heroContentSchema, type HeroContentInput } from "@/lib/validations/content";

export async function updateHeroAction(input: HeroContentInput) {
  return runAction(async () => {
    const parsed = heroContentSchema.parse(input);
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from("hero_content")
      .update({
        eyebrow: parsed.eyebrow || null,
        name: parsed.name,
        description: parsed.description,
        primary_button_text: parsed.primaryButtonText,
        primary_button_link: parsed.primaryButtonLink,
        secondary_button_text: parsed.secondaryButtonText,
        secondary_button_link: parsed.secondaryButtonLink,
        social_links: parsed.socialLinks,
      })
      .eq("id", 1);

    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/hero");
  });
}
