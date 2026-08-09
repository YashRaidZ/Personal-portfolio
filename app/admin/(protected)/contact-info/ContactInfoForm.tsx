"use client";

import { useState } from "react";
import { TextField, FieldLabel, StatusBanner, SaveButton } from "@/components/admin/FormFields";
import { useServerAction } from "@/lib/hooks/useServerAction";
import { updateContactInfoAction } from "@/lib/actions/contact-info";
import { contactInfoSchema } from "@/lib/validations/content";
import type { ContactInfoData, SocialLink } from "@/types/content";

const PLATFORMS: SocialLink["platform"][] = ["github", "discord", "email", "twitter", "youtube"];

export function ContactInfoForm({ initialData }: { initialData: ContactInfoData }) {
  const [form, setForm] = useState({
    email: initialData.email,
    discordHandle: initialData.discordHandle ?? "",
    githubUrl: initialData.githubUrl ?? "",
    socialLinks: initialData.socialLinks,
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const { run, isPending, error, success } = useServerAction(updateContactInfoAction);

  function updateSocial(index: number, patch: Partial<SocialLink>) {
    const next = [...form.socialLinks];
    next[index] = { ...next[index], ...patch } as SocialLink;
    setForm({ ...form, socialLinks: next });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactInfoSchema.safeParse(form);
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
        id="email"
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <TextField
        id="discordHandle"
        label="Discord handle"
        value={form.discordHandle}
        onChange={(e) => setForm({ ...form, discordHandle: e.target.value })}
      />
      <TextField
        id="githubUrl"
        label="GitHub URL"
        value={form.githubUrl}
        onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
      />

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
