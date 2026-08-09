"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Dialog } from "@/components/admin/Dialog";
import { FieldLabel } from "@/components/admin/FormFields";
import { createClient } from "@/lib/supabase/client";
import { uploadMediaAction } from "@/lib/actions/media";

interface LibraryItem {
  id: string;
  url: string;
  file_name: string;
}

export function MediaPickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("media_library")
      .select("id, url, file_name")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, [open]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadMediaAction(formData);
      if (result.success) {
        onChange(result.data.url);
        setOpen(false);
      } else {
        setUploadError(result.error);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10">
            <Image src={value} alt="" fill sizes="64px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/15 text-text-muted">
            <ImagePlus className="h-5 w-5" />
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-white/10 px-3.5 py-2 text-xs font-medium text-text-light transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
        >
          {value ? "Change image" : "Choose image"}
        </button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Media Library">
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 px-4 py-4 text-sm text-text-muted transition-colors hover:border-accent-primary/40 hover:text-accent-primary">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {isPending ? "Uploading & compressing…" : "Upload a new image"}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isPending}
            />
          </label>
          {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

          {loading ? (
            <p className="text-sm text-text-muted">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-text-muted">No media uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.url);
                    setOpen(false);
                  }}
                  className="relative aspect-square overflow-hidden rounded-lg border border-white/10 transition-colors hover:border-accent-primary/50"
                >
                  <Image src={item.url} alt={item.file_name} fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
