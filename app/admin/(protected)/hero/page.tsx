import { getHeroContent } from "@/lib/queries/hero";
import { HeroForm } from "./HeroForm";

export default async function AdminHeroPage() {
  const hero = await getHeroContent();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Hero</h1>
      <p className="mt-1 text-sm text-text-muted">
        The first thing visitors see. Changes go live immediately after saving.
      </p>
      <div className="mt-8">
        <HeroForm initialData={hero} />
      </div>
    </div>
  );
}
