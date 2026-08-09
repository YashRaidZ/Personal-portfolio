"use client";

import { useState } from "react";
import { TextField, StatusBanner, SaveButton, FieldLabel } from "@/components/admin/FormFields";
import { useServerAction } from "@/lib/hooks/useServerAction";
import { updateHeroAction } from "@/lib/actions/hero";
import { heroContentSchema } from "@/lib/validations/content";
import type { HeroContentData, SocialLink } from "@/types/content";

const PLATFORMS: SocialLink["platform"][] = ["github", "discord", "email", "twitter", "youtube"];

export function HeroForm({ initialData }: { initialData: HeroContentData }) {
  const [form, setForm] = useState({
    eyebrow: initialData.eyebrow ?? "",
    name: initialData.name,
    description: initialData.description,
    primaryButtonText: initialData.primaryButtonText,
    primaryButtonLink: initialData.primaryButtonLink,
    secondaryButtonText: initialData.secondaryButtonText,
    secondaryButtonLink: initialData.secondaryButtonLink,
    socialLinks: initialData.socialLinks,
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const { run, isPending, error, success } = useServerAction(updateHeroAction);

  function updateSocial(index: number, patch: Partial<SocialLink>) {
    const next = [...form.socialLinks];
    next[index] = { ...next[index], ...patch } as SocialLink;
    setForm({ ...form, socialLinks: next });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = heroContentSchema.safeParse(form);
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
        id="eyebrow"
        label="Eyebrow (small label above the name)"
        value={form.eyebrow}
        onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
      />
      <TextField
        id="name"
        label="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <div>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full resize-none rounded-lg border border-white/10 bg-bg-elevated/60 px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="primaryButtonText"
          label="Primary button text"
          value={form.primaryButtonText}
          onChange={(e) => setForm({ ...form, primaryButtonText: e.target.value })}
        />
        <TextField
          id="primaryButtonLink"
          label="Primary button link"
          value={form.primaryButtonLink}
          onChange={(e) => setForm({ ...form, primaryButtonLink: e.target.value })}
        />
        <TextField
          id="secondaryButtonText"
          label="Secondary button text"
          value={form.secondaryButtonText}
          onChange={(e) => setForm({ ...form, secondaryButtonText: e.target.value })}
        />
        <TextField
          id="secondaryButtonLink"
          label="Secondary button link"
          value={form.secondaryButtonLink}
          onChange={(e) => setForm({ ...form, secondaryButtonLink: e.target.value })}
        />
      </div>

      <div>
        <FieldLabel>Social links</FieldLabel>
        <div className="space-y-2">
          {form.socialLinks.map((link, i) => (
            <div key={i} className="flex gap-2">
              <select
                value={link.platform}
                onChange={(e) => updateSocial(i, { platform: e.target.value as SocialLink["platform"] })}
                className="w-32 shrink-0 rounded-lg border border-white/10 bg-bg-elevated/60 px-3 py-2.5 text-sm text-text-primary outline-none"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                value={link.url}
                onChange={(e) => updateSocial(i, { url: e.target.value })}
                placeholder="https://…"
                className="flex-1 rounded-lg border border-white/10 bg-bg-elevated/60 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-primary/50"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, socialLinks: form.socialLinks.filter((_, idx) => idx !== i) })}
                className="shrink-0 rounded-lg border border-white/10 px-3 text-xs text-text-muted hover:border-red-400/40 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm({ ...form, socialLinks: [...form.socialLinks, { platform: "github", url: "" }] })}
            className="rounded-lg border border-dashed border-white/15 px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
          >
            + Add social link
          </button>
        </div>
      </div>

      <StatusBanner error={validationError ?? error} success={success} />
      <SaveButton pending={isPending} />
    </form>
  );
}
