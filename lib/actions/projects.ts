"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, runAction, AdminActionError } from "@/lib/actions/_guard";
import { projectSchema, type ProjectInput } from "@/lib/validations/projects";

const reorderSchema = z.array(z.object({ id: z.string().uuid(), displayOrder: z.number().int().min(0) }));

async function assertSlugAvailable(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  slug: string,
  excludeId?: string
) {
  let query = supabase.from("projects").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query.maybeSingle();
  if (data) throw new AdminActionError(`Slug "${slug}" is already in use by another project.`);
}

export async function createProjectAction(input: ProjectInput) {
  return runAction(async () => {
    const parsed = projectSchema.parse(input);
    const { supabase } = await requireAdmin();
    await assertSlugAvailable(supabase, parsed.slug);

    const { count } = await supabase.from("projects").select("id", { count: "exact", head: true });

    const { error } = await supabase.from("projects").insert({
      slug: parsed.slug,
      title: parsed.title,
      description: parsed.description,
      thumbnail_url: parsed.thumbnailUrl || null,
      technologies: parsed.technologies,
      features: parsed.features,
      github_url: parsed.githubUrl || null,
      live_demo_url: parsed.liveDemoUrl || null,
      access: parsed.access,
      is_featured: parsed.isFeatured,
      is_published: parsed.isPublished,
      display_order: count ?? 0,
    });

    if (error) throw new Error(error.message);
    revalidatePath("/");
    revalidatePath("/admin/projects");
  });
}

export async function updateProjectAction(id: string, input: ProjectInput) {
  return runAction(async () => {
    const parsed = projectSchema.parse(input);
    const { supabase } = await requireAdmin();
    await assertSlugAvailable(supabase, parsed.slug, id);

    const { error } = await supabase
      .from("projects")
      .update({
        slug: parsed.slug,
        title: parsed.title,
        description: parsed.description,
        thumbnail_url: parsed.thumbnailUrl || null,
        technologies: parsed.technologies,
        features: parsed.features,
        github_url: parsed.githubUrl || null,
        live_demo_url: parsed.liveDemoUrl || null,
        access: parsed.access,
        is_featured: parsed.isFeatured,
        is_published: parsed.isPublished,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/");
    revalidatePath("/admin/projects");
  });
}

export async function deleteProjectAction(id: string) {
  return runAction(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/");
    revalidatePath("/admin/projects");
  });
}

export async function reorderProjectsAction(order: { id: string; displayOrder: number }[]) {
  return runAction(async () => {
    const parsed = reorderSchema.parse(order);
    const { supabase } = await requireAdmin();

    await Promise.all(
      parsed.map((item) =>
        supabase.from("projects").update({ display_order: item.displayOrder }).eq("id", item.id)
      )
    );

    revalidatePath("/");
    revalidatePath("/admin/projects");
  });
}
