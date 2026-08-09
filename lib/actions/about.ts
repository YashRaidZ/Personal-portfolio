"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, runAction } from "@/lib/actions/_guard";
import { aboutContentSchema, type AboutContentInput } from "@/lib/validations/content";

export async function updateAboutAction(input: AboutContentInput) {
  return runAction(async () => {
    const parsed = aboutContentSchema.parse(input);
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from("about_content")
      .update({
        heading: parsed.heading,
        body: parsed.body,
        highlights: parsed.highlights,
      })
      .eq("id", 1);

    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/about");
  });
}
