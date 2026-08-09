import { createClient } from "@/lib/supabase/server";
import type { ServiceData } from "@/types/content";
import type { Database } from "@/types/database";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

function mapService(row: ServiceRow): ServiceData {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description,
    features: row.features ?? [],
  };
}

/** Public site: published services only, in display order. */
export async function getServices(): Promise<ServiceData[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data.map(mapService);
}

/** Admin panel: every service (published or not), in display order. */
export async function getAllServicesAdmin(): Promise<(ServiceData & { isPublished: boolean; displayOrder: number })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => ({ ...mapService(row), isPublished: row.is_published, displayOrder: row.display_order }));
}
