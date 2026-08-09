"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, runAction } from "@/lib/actions/_guard";
import { contactInfoSchema, type ContactInfoInput } from "@/lib/validations/content";

export async function updateContactInfoAction(input: ContactInfoInput) {
  return runAction(async () => {
    const parsed = contactInfoSchema.parse(input);
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from("contact_info")
      .update({
        email: parsed.email,
        discord_handle: parsed.discordHandle || null,
        github_url: parsed.githubUrl || null,
        social_links: parsed.socialLinks,
      })
      .eq("id", 1);

    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/contact-info");
  });
}
