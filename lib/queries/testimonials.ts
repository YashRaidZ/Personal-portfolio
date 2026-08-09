import { createClient } from "@/lib/supabase/server";
import type { TestimonialData } from "@/types/content";
import type { Database } from "@/types/database";

type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];

function mapTestimonial(row: TestimonialRow): TestimonialData {
  return {
    id: row.id,
    authorName: row.author_name,
    authorRole: row.author_role,
    avatarUrl: row.avatar_url,
    content: row.content,
  };
}

/** Public site: published testimonials only. Empty array -> section hides itself. */
export async function getTestimonials(): Promise<TestimonialData[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data.map(mapTestimonial);
}

/** Admin panel: every testimonial (published or not), in display order. */
export async function getAllTestimonialsAdmin(): Promise<
  (TestimonialData & { isPublished: boolean; displayOrder: number })[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => ({
    ...mapTestimonial(row),
    isPublished: row.is_published,
    displayOrder: row.display_order,
  }));
}
