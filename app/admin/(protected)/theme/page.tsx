import { getSiteTheme } from "@/lib/queries/site-theme";
import { ThemeForm } from "./ThemeForm";

export default async function AdminThemePage() {
  const theme = await getSiteTheme();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Theme</h1>
      <p className="mt-1 text-sm text-text-muted">
        Accent colors and motion intensity, applied site-wide at runtime — no rebuild needed.
      </p>
      <div className="mt-8">
        <ThemeForm initialData={theme} />
      </div>
    </div>
  );
}
