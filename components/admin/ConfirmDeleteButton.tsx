"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export function ConfirmDeleteButton({
  onConfirm,
  pending,
  label = "Delete",
  confirmLabel = "Confirm delete?",
}: {
  onConfirm: () => void;
  pending?: boolean;
  label?: string;
  confirmLabel?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">{confirmLabel}</span>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            onConfirm();
            setConfirming(false);
          }}
          className="rounded-md bg-red-500/90 px-2.5 py-1 text-xs font-semibold text-white transition-opacity disabled:opacity-60"
        >
          Yes, delete
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-text-muted"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs text-text-muted transition-colors hover:border-red-400/40 hover:text-red-400"
    >
      <Trash2 className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
