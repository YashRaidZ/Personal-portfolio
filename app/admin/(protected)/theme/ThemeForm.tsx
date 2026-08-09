"use client";

import { useState, type CSSProperties } from "react";
import { StatusBanner, SaveButton, FieldLabel } from "@/components/admin/FormFields";
import { useServerAction } from "@/lib/hooks/useServerAction";
import { updateSiteThemeAction } from "@/lib/actions/site-theme";
import { siteThemeSchema } from "@/lib/validations/content";
import type { SiteThemeData } from "@/types/content";

const COLOR_FIELDS: { key: keyof SiteThemeData; label: string }[] = [
  { key: "accentPrimary", label: "Primary accent" },
  { key: "accentSecondary", label: "Secondary accent" },
  { key: "accentGold", label: "Gold accent" },
  { key: "accentOrange", label: "Orange accent" },
];

export function ThemeForm({ initialData }: { initialData: SiteThemeData }) {
  const [form, setForm] = useState(initialData);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { run, isPending, error, success } = useServerAction(updateSiteThemeAction);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = siteThemeSchema.safeParse(form);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setValidationError(null);
    run(parsed.data);
  }

  // Scoping these as CSS custom properties on the preview container means
  // any descendant using var(--color-accent-*) -- including the exact same
  // utility classes the public site uses -- picks up the edited values
  // live, with zero duplication of the color logic.
  const previewStyle: CSSProperties = {
    ["--color-accent-primary" as string]: form.accentPrimary,
    ["--color-accent-secondary" as string]: form.accentSecondary,
    ["--color-accent-gold" as string]: form.accentGold,
    ["--color-accent-orange" as string]: form.accentOrange,
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {COLOR_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <FieldLabel htmlFor={key}>{label}</FieldLabel>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form[key] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                />
                <input
                  id={key}
                  value={form[key] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="flex-1 rounded-lg border border-white/10 bg-bg-elevated/60 px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-primary/50"
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <FieldLabel htmlFor="motionScale">Motion scale ({form.motionScale.toFixed(2)}×)</FieldLabel>
          <input
            id="motionScale"
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={form.motionScale}
            onChange={(e) => setForm({ ...form, motionScale: Number(e.target.value) })}
            className="w-full accent-accent-primary"
          />
        </div>

        <div>
          <FieldLabel htmlFor="glassIntensity">Glass intensity ({form.glassIntensity.toFixed(2)}×)</FieldLabel>
          <input
            id="glassIntensity"
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={form.glassIntensity}
            onChange={(e) => setForm({ ...form, glassIntensity: Number(e.target.value) })}
            className="w-full accent-accent-primary"
          />
        </div>

        <StatusBanner error={validationError ?? error} success={success} />
        <SaveButton pending={isPending} />
      </form>

      <div>
        <FieldLabel>Live preview</FieldLabel>
        <div style={previewStyle} className="glass-panel space-y-3 p-6">
          <p className="text-gradient font-display text-xl font-semibold">Preview heading</p>
          <p className="text-sm text-text-light">
            Body text stays neutral — only accents pick up your changes: a{" "}
            <span className="text-accent-primary">primary</span>,{" "}
            <span className="text-accent-secondary">secondary</span>,{" "}
            <span className="text-accent-gold">gold</span>, and{" "}
            <span className="text-accent-orange">orange</span> highlight.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-accent-primary px-4 py-1.5 text-xs font-semibold text-bg-primary">
              Primary button
            </span>
            <span className="rounded-full border border-accent-secondary/40 px-4 py-1.5 text-xs font-semibold text-accent-secondary">
              Secondary badge
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
