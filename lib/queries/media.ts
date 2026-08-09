import { createClient } from "@/lib/supabase/server";

export interface MediaItem {
  id: string;
  fileName: string;
  storagePath: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  createdAt: string;
}

export async function getMediaLibrary(): Promise<MediaItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_library")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    fileName: row.file_name,
    storagePath: row.storage_path,
    url: row.url,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    width: row.width,
    height: row.height,
    altText: row.alt_text,
    createdAt: row.created_at,
  }));
}
