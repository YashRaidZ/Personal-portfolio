"use client";

import { useState } from "react";
import { TextField, TextAreaField, StatusBanner, SaveButton } from "@/components/admin/FormFields";
import { useServerAction } from "@/lib/hooks/useServerAction";
import { updateSiteSettingsAction } from "@/lib/actions/site-settings";
import { siteSettingsSchema } from "@/lib/validations/content";
import type { SiteSettingsData } from "@/types/content";

export function SiteSettingsForm({ initialData }: { initialData: SiteSettingsData }) {
  const [form, setForm] = useState(initialData);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { run, isPending, error, success } = useServerAction(updateSiteSettingsAction);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = siteSettingsSchema.safeParse(form);
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
        id="siteTitle"
        label="Site title"
        value={form.siteTitle}
        onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
        required
      />
      <TextAreaField
        id="metaDescription"
        label="Meta description"
        rows={3}
        value={form.metaDescription}
        onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
      />
      <TextField
        id="footerText"
        label="Footer text"
        value={form.footerText}
        onChange={(e) => setForm({ ...form, footerText: e.target.value })}
      />
      <TextField
        id="copyrightText"
        label="Copyright text"
        value={form.copyrightText}
        onChange={(e) => setForm({ ...form, copyrightText: e.target.value })}
      />

      <StatusBanner error={validationError ?? error} success={success} />
      <SaveButton pending={isPending} />
    </form>
  );
}
