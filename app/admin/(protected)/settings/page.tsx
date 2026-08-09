import { getSiteSettings } from "@/lib/queries/site-settings";
import { SiteSettingsForm } from "./SiteSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Site Settings</h1>
      <p className="mt-1 text-sm text-text-muted">Page metadata and footer text.</p>
      <div className="mt-8">
        <SiteSettingsForm initialData={settings} />
      </div>
    </div>
  );
}
