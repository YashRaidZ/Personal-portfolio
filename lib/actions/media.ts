"use server";

import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { requireAdmin, runAction, AdminActionError } from "@/lib/actions/_guard";

const MAX_DIMENSION = 2000;
const WEBP_QUALITY = 82;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB, matches the bucket's file_size_limit

function slugifyFileName(name: string): string {
  const withoutExt = name.replace(/\.[^/.]+$/, "");
  return (
    withoutExt
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "upload"
  );
}

/**
 * Compresses/resizes the upload with Sharp before it ever reaches Storage.
 * SVGs pass through untouched (Sharp rasterizes them, which would destroy
 * the point of an SVG); everything else is normalized to WebP.
 */
export async function uploadMediaAction(formData: FormData) {
  return runAction(async () => {
    const { supabase } = await requireAdmin();

    const file = formData.get("file");
    const altText = (formData.get("altText") as string | null)?.trim() || null;

    if (!(file instanceof File)) {
      throw new AdminActionError("No file was provided.");
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new AdminActionError("File is too large (10 MB limit).");
    }
    if (!file.type.startsWith("image/")) {
      throw new AdminActionError("Only image files are supported.");
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const baseName = slugifyFileName(file.name);
    const isSvg = file.type === "image/svg+xml";

    let outputBuffer: Buffer;
    let contentType: string;
    let extension: string;
    let width: number | null = null;
    let height: number | null = null;

    if (isSvg) {
      outputBuffer = inputBuffer;
      contentType = "image/svg+xml";
      extension = "svg";
    } else {
      const pipeline = sharp(inputBuffer).rotate(); // auto-orient from EXIF
      const metadata = await pipeline.metadata();

      const needsResize = (metadata.width ?? 0) > MAX_DIMENSION || (metadata.height ?? 0) > MAX_DIMENSION;
      const resized = needsResize
        ? pipeline.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
        : pipeline;

      outputBuffer = await resized.webp({ quality: WEBP_QUALITY }).toBuffer();
      const outMeta = await sharp(outputBuffer).metadata();
      width = outMeta.width ?? null;
      height = outMeta.height ?? null;
      contentType = "image/webp";
      extension = "webp";
    }

    const storagePath = `${randomUUID()}-${baseName}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(storagePath, outputBuffer, { contentType, upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(storagePath);

    const { error: insertError } = await supabase.from("media_library").insert({
      file_name: file.name,
      storage_path: storagePath,
      url: publicUrl,
      mime_type: contentType,
      size_bytes: outputBuffer.byteLength,
      width,
      height,
      alt_text: altText,
    });

    if (insertError) {
      // Best-effort cleanup so a failed DB insert doesn't leave an orphaned
      // file sitting in Storage with nothing pointing to it.
      await supabase.storage.from("media").remove([storagePath]);
      throw new Error(insertError.message);
    }

    revalidatePath("/admin/media");
    return { url: publicUrl, storagePath };
  });
}

export async function deleteMediaAction(id: string) {
  return runAction(async () => {
    const { supabase } = await requireAdmin();

    const { data: row, error: fetchError } = await supabase
      .from("media_library")
      .select("storage_path")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) throw new Error(fetchError.message);
    if (!row) throw new AdminActionError("Media item not found.");

    const { error: storageError } = await supabase.storage.from("media").remove([row.storage_path]);
    if (storageError) throw new Error(storageError.message);

    const { error: deleteError } = await supabase.from("media_library").delete().eq("id", id);
    if (deleteError) throw new Error(deleteError.message);

    revalidatePath("/admin/media");
  });
}
