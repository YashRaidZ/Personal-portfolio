"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { useServerAction } from "@/lib/hooks/useServerAction";
import { uploadMediaAction, deleteMediaAction } from "@/lib/actions/media";
import type { MediaItem } from "@/lib/queries/media";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { run: runDelete } = useServerAction(deleteMediaAction);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadMediaAction(formData);
      if (result.success) {
        router.refresh();
      } else {
        setUploadError(result.error);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  return (
    <div>
      <label className="mb-6 flex w-full max-w-sm cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 px-4 py-6 text-sm text-text-muted transition-colors hover:border-accent-primary/40 hover:text-accent-primary">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        {isPending ? "Uploading & compressing…" : "Upload an image"}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isPending}
        />
      </label>
      {uploadError && <p className="mb-4 text-xs text-red-400">{uploadError}</p>}

      {initialMedia.length === 0 ? (
        <p className="text-sm text-text-muted">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {initialMedia.map((item) => (
            <div key={item.id} className="glass-panel overflow-hidden">
              <div className="relative aspect-square">
                <Image src={item.url} alt={item.altText ?? item.fileName} fill sizes="200px" className="object-cover" />
              </div>
              <div className="space-y-1 p-3">
                <p className="truncate text-xs text-text-light" title={item.fileName}>
                  {item.fileName}
                </p>
                <p className="text-[10px] text-text-muted">
                  {formatBytes(item.sizeBytes)}
                  {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
                </p>
                <ConfirmDeleteButton
                  onConfirm={() => {
                    runDelete(item.id);
                    router.refresh();
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
