import { getTechCategoriesAdmin } from "@/lib/queries/tech-stack";
import { TechStackManager } from "./TechStackManager";

export default async function AdminTechStackPage() {
  const categories = await getTechCategoriesAdmin();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Tech Stack</h1>
      <p className="mt-1 text-sm text-text-muted">
        Categories and the items within them. Deleting a category deletes its items too.
      </p>
      <div className="mt-8">
        <TechStackManager initialCategories={categories} />
      </div>
    </div>
  );
}
