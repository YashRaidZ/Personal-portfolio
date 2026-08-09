import { getAllProjectsAdmin } from "@/lib/queries/projects";
import { ProjectsManager } from "./ProjectsManager";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Projects</h1>
      <p className="mt-1 text-sm text-text-muted">
        Drag to reorder. "Access" controls which links/badges show on the public card.
      </p>
      <div className="mt-8">
        <ProjectsManager initialProjects={projects} />
      </div>
    </div>
  );
}
