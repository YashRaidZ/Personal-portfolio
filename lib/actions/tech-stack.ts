"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, runAction } from "@/lib/actions/_guard";
import { techCategorySchema, techItemSchema, type TechCategoryInput, type TechItemInput } from "@/lib/validations/tech-testimonials";

const reorderSchema = z.array(z.object({ id: z.string().uuid(), displayOrder: z.number().int().min(0) }));

function touch() {
  revalidatePath("/");
  revalidatePath("/admin/tech-stack");
}

export async function createTechCategoryAction(input: TechCategoryInput) {
  return runAction(async () => {
    const parsed = techCategorySchema.parse(input);
    const { supabase } = await requireAdmin();
    const { count } = await supabase.from("tech_categories").select("id", { count: "exact", head: true });

    const { error } = await supabase.from("tech_categories").insert({ name: parsed.name, display_order: count ?? 0 });
    if (error) throw new Error(error.message);
    touch();
  });
}

export async function updateTechCategoryAction(id: string, input: TechCategoryInput) {
  return runAction(async () => {
    const parsed = techCategorySchema.parse(input);
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("tech_categories").update({ name: parsed.name }).eq("id", id);
    if (error) throw new Error(error.message);
    touch();
  });
}

/** Cascades to delete every item in the category (enforced at the DB level). */
export async function deleteTechCategoryAction(id: string) {
  return runAction(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("tech_categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    touch();
  });
}

export async function reorderTechCategoriesAction(order: { id: string; displayOrder: number }[]) {
  return runAction(async () => {
    const parsed = reorderSchema.parse(order);
    const { supabase } = await requireAdmin();
    await Promise.all(
      parsed.map((item) =>
        supabase.from("tech_categories").update({ display_order: item.displayOrder }).eq("id", item.id)
      )
    );
    touch();
  });
}

export async function createTechItemAction(input: TechItemInput) {
  return runAction(async () => {
    const parsed = techItemSchema.parse(input);
    const { supabase } = await requireAdmin();
    const { count } = await supabase
      .from("tech_items")
      .select("id", { count: "exact", head: true })
      .eq("category_id", parsed.categoryId);

    const { error } = await supabase.from("tech_items").insert({
      category_id: parsed.categoryId,
      name: parsed.name,
      icon: parsed.icon || null,
      display_order: count ?? 0,
    });
    if (error) throw new Error(error.message);
    touch();
  });
}

export async function updateTechItemAction(id: string, input: TechItemInput) {
  return runAction(async () => {
    const parsed = techItemSchema.parse(input);
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("tech_items")
      .update({ category_id: parsed.categoryId, name: parsed.name, icon: parsed.icon || null })
      .eq("id", id);
    if (error) throw new Error(error.message);
    touch();
  });
}

export async function deleteTechItemAction(id: string) {
  return runAction(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("tech_items").delete().eq("id", id);
    if (error) throw new Error(error.message);
    touch();
  });
}

export async function reorderTechItemsAction(order: { id: string; displayOrder: number }[]) {
  return runAction(async () => {
    const parsed = reorderSchema.parse(order);
    const { supabase } = await requireAdmin();
    await Promise.all(
      parsed.map((item) =>
        supabase.from("tech_items").update({ display_order: item.displayOrder }).eq("id", item.id)
      )
    );
    touch();
  });
}
