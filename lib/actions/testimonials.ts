"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, runAction } from "@/lib/actions/_guard";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations/tech-testimonials";

const reorderSchema = z.array(z.object({ id: z.string().uuid(), displayOrder: z.number().int().min(0) }));

function touch() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function createTestimonialAction(input: TestimonialInput) {
  return runAction(async () => {
    const parsed = testimonialSchema.parse(input);
    const { supabase } = await requireAdmin();
    const { count } = await supabase.from("testimonials").select("id", { count: "exact", head: true });

    const { error } = await supabase.from("testimonials").insert({
      author_name: parsed.authorName,
      author_role: parsed.authorRole,
      avatar_url: parsed.avatarUrl || null,
      content: parsed.content,
      is_published: parsed.isPublished,
      display_order: count ?? 0,
    });
    if (error) throw new Error(error.message);
    touch();
  });
}

export async function updateTestimonialAction(id: string, input: TestimonialInput) {
  return runAction(async () => {
    const parsed = testimonialSchema.parse(input);
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from("testimonials")
      .update({
        author_name: parsed.authorName,
        author_role: parsed.authorRole,
        avatar_url: parsed.avatarUrl || null,
        content: parsed.content,
        is_published: parsed.isPublished,
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
    touch();
  });
}

export async function deleteTestimonialAction(id: string) {
  return runAction(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw new Error(error.message);
    touch();
  });
}

export async function reorderTestimonialsAction(order: { id: string; displayOrder: number }[]) {
  return runAction(async () => {
    const parsed = reorderSchema.parse(order);
    const { supabase } = await requireAdmin();
    await Promise.all(
      parsed.map((item) =>
        supabase.from("testimonials").update({ display_order: item.displayOrder }).eq("id", item.id)
      )
    );
    touch();
  });
}
