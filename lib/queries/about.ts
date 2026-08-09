import { createClient } from "@/lib/supabase/server";
import type { AboutContentData, AboutHighlight } from "@/types/content";

const FALLBACK: AboutContentData = { heading: "", body: [], highlights: [] };

export async function getAboutContent(): Promise<AboutContentData> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("about_content").select("*").eq("id", 1).maybeSingle();

  if (error || !data) return FALLBACK;

  return {
    heading: data.heading,
    body: data.body ?? [],
    highlights: (data.highlights as unknown as AboutHighlight[]) ?? [],
  };
}
