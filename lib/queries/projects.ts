import { createClient } from "@/lib/supabase/server";
import type { ProjectData } from "@/types/content";
import type { Database } from "@/types/database";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

function mapProject(row: ProjectRow): ProjectData {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    thumbnailUrl: row.thumbnail_url,
    technologies: row.technologies ?? [],
    features: row.features ?? [],
    githubUrl: row.github_url,
    liveDemoUrl: row.live_demo_url,
    access: row.access,
    isFeatured: row.is_featured,
  };
}

/** Public site: published projects only, in display order. */
export async function getProjects(): Promise<ProjectData[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data.map(mapProject);
}

/** Admin panel: every project (published or not), in display order. */
export async function getAllProjectsAdmin(): Promise<
  (ProjectData & { isPublished: boolean; displayOrder: number })[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => ({ ...mapProject(row), isPublished: row.is_published, displayOrder: row.display_order }));
}
