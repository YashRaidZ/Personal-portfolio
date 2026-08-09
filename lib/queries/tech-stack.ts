import { createClient } from "@/lib/supabase/server";
import type { TechCategoryData } from "@/types/content";

/** Public site: all categories with their items, in display order. */
export async function getTechCategories(): Promise<TechCategoryData[]> {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("tech_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !categories) return [];

  const { data: items } = await supabase
    .from("tech_items")
    .select("*")
    .order("display_order", { ascending: true });

  return categories.map((cat) => ({
    name: cat.name,
    items: (items ?? [])
      .filter((item) => item.category_id === cat.id)
      .map((item) => ({ name: item.name, icon: item.icon ?? undefined })),
  }));
}

/** Admin panel shape: categories with their raw item rows (ids needed for edit/delete). */
export interface AdminTechCategory {
  id: string;
  name: string;
  displayOrder: number;
  items: { id: string; name: string; icon: string | null; displayOrder: number }[];
}

export async function getTechCategoriesAdmin(): Promise<AdminTechCategory[]> {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("tech_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !categories) return [];

  const { data: items } = await supabase
    .from("tech_items")
    .select("*")
    .order("display_order", { ascending: true });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    displayOrder: cat.display_order,
    items: (items ?? [])
      .filter((item) => item.category_id === cat.id)
      .map((item) => ({ id: item.id, name: item.name, icon: item.icon, displayOrder: item.display_order })),
  }));
}
