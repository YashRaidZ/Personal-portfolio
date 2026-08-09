"use client";

import { useState } from "react";
import { TextField, StringListField, StatusBanner, SaveButton, FieldLabel } from "@/components/admin/FormFields";
import { useServerAction } from "@/lib/hooks/useServerAction";
import { updateAboutAction } from "@/lib/actions/about";
import { aboutContentSchema } from "@/lib/validations/content";
import type { AboutContentData, AboutHighlight } from "@/types/content";

const ICONS: AboutHighlight["icon"][] = ["code", "server", "bot", "sparkles", "puzzle", "shield"];

export function AboutForm({ initialData }: { initialData: AboutContentData }) {
  const [form, setForm] = useState({
    heading: initialData.heading,
    body: initialData.body,
    highlights: initialData.highlights,
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const { run, isPending, error, success } = useServerAction(updateAboutAction);

  function updateHighlight(index: number, patch: Partial<AboutHighlight>) {
    const next = [...form.highlights];
    next[index] = { ...next[index], ...patch } as AboutHighlight;
    setForm({ ...form, highlights: next });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = aboutContentSchema.safeParse(form);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setValidationError(null);
    run(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <TextField
        id="heading"
        label="Heading"
        value={form.heading}
        onChange={(e) => setForm({ ...form, heading: e.target.value })}
        required
      />

      <StringListField
        label="Body paragraphs"
        values={form.body}
        onChange={(body) => setForm({ ...form, body })}
        placeholder="Write a paragraph…"
        multiline
      />

      <div>
        <FieldLabel>Highlights</FieldLabel>
        <div className="space-y-2">
          {form.highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <select
                value={h.icon}
                onChange={(e) => updateHighlight(i, { icon: e.target.value as AboutHighlight["icon"] })}
                className="w-28 shrink-0 rounded-lg border border-white/10 bg-bg-elevated/60 px-3 py-2.5 text-sm text-text-primary outline-none"
              >
                {ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <input
                value={h.label}
                onChange={(e) => updateHighlight(i, { label: e.target.value })}
                placeholder="Label"
                className="flex-1 rounded-lg border border-white/10 bg-bg-elevated/60 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-primary/50"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, highlights: form.highlights.filter((_, idx) => idx !== i) })}
                className="shrink-0 rounded-lg border border-white/10 px-3 text-xs text-text-muted hover:border-red-400/40 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setForm({ ...form, highlights: [...form.highlights, { icon: "code", label: "" }] })
            }
            className="rounded-lg border border-dashed border-white/15 px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
          >
            + Add highlight
          </button>
        </div>
      </div>

      <StatusBanner error={validationError ?? error} success={success} />
      <SaveButton pending={isPending} />
    </form>
  );
}
