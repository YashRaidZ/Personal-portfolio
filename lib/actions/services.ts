"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, runAction } from "@/lib/actions/_guard";
import { serviceSchema, type ServiceInput } from "@/lib/validations/services";

const reorderSchema = z.array(z.object({ id: z.string().uuid(), displayOrder: z.number().int().min(0) }));

export async function createServiceAction(input: ServiceInput) {
  return runAction(async () => {
    const parsed = serviceSchema.parse(input);
    const { supabase } = await requireAdmin();

    const { count } = await supabase.from("services").select("id", { count: "exact", head: true });

    const { error } = await supabase.from("services").insert({
      category: parsed.category,
      title: parsed.title,
      description: parsed.description,
      features: parsed.features,
      is_published: parsed.isPublished,
      display_order: count ?? 0,
    });

    if (error) throw new Error(error.message);
    revalidatePath("/");
    revalidatePath("/admin/services");
  });
}

export async function updateServiceAction(id: string, input: ServiceInput) {
  return runAction(async () => {
    const parsed = serviceSchema.parse(input);
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from("services")
      .update({
        category: parsed.category,
        title: parsed.title,
        description: parsed.description,
        features: parsed.features,
        is_published: parsed.isPublished,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/");
    revalidatePath("/admin/services");
  });
}

export async function deleteServiceAction(id: string) {
  return runAction(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/");
    revalidatePath("/admin/services");
  });
}

export async function reorderServicesAction(order: { id: string; displayOrder: number }[]) {
  return runAction(async () => {
    const parsed = reorderSchema.parse(order);
    const { supabase } = await requireAdmin();

    await Promise.all(
      parsed.map((item) =>
        supabase.from("services").update({ display_order: item.displayOrder }).eq("id", item.id)
      )
    );

    revalidatePath("/");
    revalidatePath("/admin/services");
  });
}
