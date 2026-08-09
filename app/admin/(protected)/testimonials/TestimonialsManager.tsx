"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { Dialog } from "@/components/admin/Dialog";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { SortableList } from "@/components/admin/SortableList";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { TextField, TextAreaField, ToggleField, StatusBanner, SaveButton } from "@/components/admin/FormFields";
import { useServerAction } from "@/lib/hooks/useServerAction";
import {
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  reorderTestimonialsAction,
} from "@/lib/actions/testimonials";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations/tech-testimonials";
import type { TestimonialData } from "@/types/content";

type AdminTestimonial = TestimonialData & { isPublished: boolean; displayOrder: number };

const EMPTY: TestimonialInput = { authorName: "", authorRole: "", avatarUrl: "", content: "", isPublished: true };

export function TestimonialsManager({ initialTestimonials }: { initialTestimonials: AdminTestimonial[] }) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  useEffect(() => setTestimonials(initialTestimonials), [initialTestimonials]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialInput>(EMPTY);
  const [validationError, setValidationError] = useState<string | null>(null);

  const createAction = useServerAction(createTestimonialAction);
  const updateAction = useServerAction(updateTestimonialAction);
  const { run: runDelete } = useServerAction(deleteTestimonialAction);
  const { run: runReorder } = useServerAction(reorderTestimonialsAction);
  const active = editingId ? updateAction : createAction;

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY);
    setValidationError(null);
    createAction.reset();
    setDialogOpen(true);
  }
  function openEdit(t: AdminTestimonial) {
    setEditingId(t.id);
    setForm({
      authorName: t.authorName,
      authorRole: t.authorRole,
      avatarUrl: t.avatarUrl ?? "",
      content: t.content,
      isPublished: t.isPublished,
    });
    setValidationError(null);
    updateAction.reset();
    setDialogOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = testimonialSchema.safeParse(form);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setValidationError(null);
    if (editingId) updateAction.run(editingId, parsed.data);
    else createAction.run(parsed.data);
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
        <Plus className="h-4 w-4" /> New testimonial
      </button>

      {testimonials.length === 0 ? (
        <p className="text-sm text-text-muted">No testimonials yet.</p>
      ) : (
        <SortableList
          items={testimonials}
          onReorder={(order) => {
            setTestimonials((prev) => order.map((o) => prev.find((t) => t.id === o.id)!));
            runReorder(order);
          }}
          renderItem={(t) => (
            <div className="glass-panel flex items-start justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">{t.authorName}</p>
                  {!t.isPublished && (
                    <span className="rounded-full bg-accent-orange/10 px-2 py-0.5 text-[10px] text-accent-orange">Draft</span>
                  )}
                </div>
                <p className="text-xs text-text-muted">{t.authorRole}</p>
                <p className="mt-1 truncate text-xs text-text-muted">{t.content}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => openEdit(t)}
                  className="rounded-md border border-white/10 p-1.5 text-text-muted transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
                  aria-label="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <ConfirmDeleteButton
                  onConfirm={() => {
                    runDelete(t.id);
                    router.refresh();
                  }}
                />
              </div>
            </div>
          )}
        />
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editingId ? "Edit testimonial" : "New testimonial"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            id="authorName"
            label="Author name"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
            required
          />
          <TextField
            id="authorRole"
            label="Author role"
            value={form.authorRole}
            onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
          />
          <MediaPickerField
            label="Avatar"
            value={form.avatarUrl}
            onChange={(url) => setForm({ ...form, avatarUrl: url ?? "" })}
          />
          <TextAreaField
            id="content"
            label="Testimonial content"
            rows={4}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <ToggleField
            label="Published"
            description="Visible on the public site"
            checked={form.isPublished}
            onChange={(isPublished) => setForm({ ...form, isPublished })}
          />

          <StatusBanner error={validationError ?? active.error} />
          <SaveButton pending={active.isPending} label={editingId ? "Save changes" : "Create testimonial"} />
        </form>
      </Dialog>
    </div>
  );
}
