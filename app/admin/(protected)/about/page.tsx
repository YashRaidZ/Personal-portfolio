import { getAboutContent } from "@/lib/queries/about";
import { AboutForm } from "./AboutForm";

export default async function AdminAboutPage() {
  const about = await getAboutContent();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">About</h1>
      <p className="mt-1 text-sm text-text-muted">The About section heading, body paragraphs, and highlights.</p>
      <div className="mt-8">
        <AboutForm initialData={about} />
      </div>
    </div>
  );
}
