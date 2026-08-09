"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, Loader2 } from "lucide-react";
import { exportBackupAction, importBackupAction, type BackupPayload } from "@/lib/actions/backup";

export default function AdminBackupPage() {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [confirmPending, setConfirmPending] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setExporting(true);
    setMessage(null);
    const result = await exportBackupAction();
    setExporting(false);

    if (!result.success) {
      setMessage({ type: "error", text: result.error });
      return;
    }

    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setConfirmPending(file);
  }

  async function handleConfirmedImport() {
    if (!confirmPending) return;
    setImporting(true);
    setMessage(null);

    try {
      const text = await confirmPending.text();
      const payload = JSON.parse(text) as BackupPayload;
      const result = await importBackupAction(payload);
      if (result.success) {
        setMessage({ type: "success", text: "Backup restored successfully." });
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch {
      setMessage({ type: "error", text: "That file isn't valid JSON." });
    } finally {
      setImporting(false);
      setConfirmPending(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Backup & Restore</h1>
      <p className="mt-1 text-sm text-text-muted">
        Export every content table as JSON, or restore from a previous export.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="glass-panel p-6">
          <h2 className="text-sm font-semibold text-text-primary">Export</h2>
          <p className="mt-1 text-xs text-text-muted">
            Downloads a JSON snapshot of Hero, About, Services, Projects, Tech Stack, Testimonials, Contact Info,
            Site Settings, and Theme.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-bg-primary disabled:opacity-60"
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {exporting ? "Exporting…" : "Export backup"}
          </button>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-sm font-semibold text-text-primary">Restore</h2>
          <p className="mt-1 text-xs text-text-muted">
            Replaces all content with what's in the backup file. This can't be undone -- export a fresh backup
            first if you want to keep the current content.
          </p>
          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-text-light transition-colors hover:border-accent-primary/40 hover:text-accent-primary">
            <Upload className="h-4 w-4" />
            Choose backup file
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileSelect} />
          </label>
        </div>
      </div>

      {confirmPending && (
        <div className="mt-6 rounded-lg border border-accent-orange/30 bg-accent-orange/10 px-5 py-4">
          <p className="text-sm text-text-primary">
            Restore content from <span className="font-medium">{confirmPending.name}</span>? This overwrites all
            current content and can't be undone.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleConfirmedImport}
              disabled={importing}
              className="rounded-full bg-accent-orange px-4 py-2 text-xs font-semibold text-bg-primary disabled:opacity-60"
            >
              {importing ? "Restoring…" : "Yes, restore"}
            </button>
            <button
              onClick={() => {
                setConfirmPending(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="rounded-full border border-white/10 px-4 py-2 text-xs text-text-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && (
        <p
          role="alert"
          className={`mt-6 rounded-lg border px-4 py-2.5 text-sm ${
            message.type === "success"
              ? "border-accent-primary/30 bg-accent-primary/10 text-accent-primary"
              : "border-red-400/30 bg-red-400/10 text-red-300"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
