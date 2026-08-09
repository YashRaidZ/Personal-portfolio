"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Star } from "lucide-react";
import { Dialog } from "@/components/admin/Dialog";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { SortableList } from "@/components/admin/SortableList";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import {
  TextField,
  TextAreaField,
  SelectField,
  StringListField,
  ToggleField,
  StatusBanner,
  SaveButton,
} from "@/components/admin/FormFields";
import { useServerAction } from "@/lib/hooks/useServerAction";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  reorderProjectsAction,
} from "@/lib/actions/projects";
import { projectSchema, slugify, type ProjectInput } from "@/lib/validations/projects";
import type { ProjectData } from "@/types/content";

type AdminProject = ProjectData & { isPublished: boolean; displayOrder: number };

const ACCESS_OPTIONS: ProjectInput["access"][] = ["opensource", "paid", "private"];
const EMPTY: ProjectInput = {
  slug: "",
  title: "",
  description: "",
  thumbnailUrl: null,
  technologies: [],
  features: [],
  githubUrl: "",
  liveDemoUrl: "",
  access: "opensource",
  isFeatured: false,
  isPublished: true,
};

export function ProjectsManager({ initialProjects }: { initialProjects: AdminProject[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  useEffect(() => setProjects(initialProjects), [initialProjects]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectInput>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const createAction = useServerAction(createProjectAction);
  const updateAction = useServerAction(updateProjectAction);
  const { run: runDelete } = useServerAction(deleteProjectAction);
  const { run: runReorder } = useServerAction(reorderProjectsAction);

  const active = editingId ? updateAction : createAction;

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY);
    setSlugTouched(false);
    setValidationError(null);
    createAction.reset();
    setDialogOpen(true);
  }

  function openEdit(project: AdminProject) {
    setEditingId(project.id);
    setForm({
      slug: project.slug,
      title: project.title,
      description: project.description,
      thumbnailUrl: project.thumbnailUrl,
      technologies: project.technologies,
      features: project.features,
      githubUrl: project.githubUrl ?? "",
      liveDemoUrl: project.liveDemoUrl ?? "",
      access: project.access,
      isFeatured: project.isFeatured,
      isPublished: project.isPublished,
    });
    setSlugTouched(true);
    setValidationError(null);
    updateAction.reset();
    setDialogOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = projectSchema.safeParse(form);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setValidationError(null);
    if (editingId) {
      updateAction.run(editingId, parsed.data);
    } else {
      createAction.run(parsed.data);
    }
  }

  useEffect(() => {
    if (active.success) {
      setDialogOpen(false);
      router.refresh();
    }
  }, [active.success, router]);

  return (
    <div>
      <button
        onClick={openCreate}
        className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-bg-primary"
      >
        <Plus className="h-4 w-4" /> New project
      </button>

      {projects.length === 0 ? (
        <p className="text-sm text-text-muted">No projects yet.</p>
      ) : (
        <SortableList
          items={projects}
          onReorder={(order) => {
            setProjects((prev) =>
              order.map((o) => ({ ...prev.find((p) => p.id === o.id)!, displayOrder: o.displayOrder }))
            );
            runReorder(order);
          }}
          renderItem={(project) => (
            <div className="glass-panel flex items-start justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {project.isFeatured && <Star className="h-3 w-3 fill-accent-gold text-accent-gold" />}
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-muted">
                    {project.access}
                  </span>
                  {!project.isPublished && (
                    <span className="rounded-full bg-accent-orange/10 px-2 py-0.5 text-[10px] text-accent-orange">Draft</span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm font-medium text-text-primary">{project.title}</p>
                <p className="truncate text-xs text-text-muted">/{project.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => openEdit(project)}
                  className="rounded-md border border-white/10 p-1.5 text-text-muted transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
                  aria-label="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <ConfirmDeleteButton
                  onConfirm={() => {
                    runDelete(project.id);
                    router.refresh();
                  }}
                />
              </div>
            </div>
          )}
        />
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editingId ? "Edit project" : "New project"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            id="title"
            label="Title"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
            }}
            required
          />
          <TextField
            id="slug"
            label="Slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm({ ...form, slug: e.target.value });
            }}
            required
          />
          <TextAreaField
            id="description"
            label="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <MediaPickerField
            label="Thumbnail"
            value={form.thumbnailUrl}
            onChange={(url) => setForm({ ...form, thumbnailUrl: url })}
          />
          <StringListField
            label="Technologies"
            values={form.technologies}
            onChange={(technologies) => setForm({ ...form, technologies })}
            placeholder="e.g. Next.js"
          />
          <StringListField
            label="Features"
            values={form.features}
            onChange={(features) => setForm({ ...form, features })}
            placeholder="A feature…"
          />
          <SelectField
            id="access"
            label="Access"
            value={form.access}
            onChange={(e) => setForm({ ...form, access: e.target.value as ProjectInput["access"] })}
          >
            {ACCESS_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </SelectField>
          {form.access === "opensource" && (
            <TextField
              id="githubUrl"
              label="GitHub URL"
              value={form.githubUrl ?? ""}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            />
          )}
          {form.access === "paid" && (
            <TextField
              id="liveDemoUrl"
              label="Store / purchase URL"
              value={form.liveDemoUrl ?? ""}
              onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })}
            />
          )}
          <ToggleField
            label="Featured"
            description="Shown with emphasis in the Projects section"
            checked={form.isFeatured}
            onChange={(isFeatured) => setForm({ ...form, isFeatured })}
          />
          <ToggleField
            label="Published"
            description="Visible on the public site"
            checked={form.isPublished}
            onChange={(isPublished) => setForm({ ...form, isPublished })}
          />

          <StatusBanner error={validationError ?? active.error} />
          <SaveButton pending={active.isPending} label={editingId ? "Save changes" : "Create project"} />
        </form>
      </Dialog>
    </div>
  );
}
