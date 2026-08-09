"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { Dialog } from "@/components/admin/Dialog";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { SortableList } from "@/components/admin/SortableList";
import { TextField, TextAreaField, SelectField, StringListField, ToggleField, StatusBanner, SaveButton } from "@/components/admin/FormFields";
import { useServerAction } from "@/lib/hooks/useServerAction";
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
  reorderServicesAction,
} from "@/lib/actions/services";
import { serviceSchema, type ServiceInput } from "@/lib/validations/services";
import type { ServiceData } from "@/types/content";

type AdminService = ServiceData & { isPublished: boolean; displayOrder: number };

const CATEGORIES: ServiceInput["category"][] = ["minecraft", "discord", "web", "automation"];
const EMPTY: ServiceInput = { category: "minecraft", title: "", description: "", features: [], isPublished: true };

export function ServicesManager({ initialServices }: { initialServices: AdminService[] }) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  useEffect(() => setServices(initialServices), [initialServices]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceInput>(EMPTY);
  const [validationError, setValidationError] = useState<string | null>(null);

  const createAction = useServerAction(createServiceAction);
  const updateAction = useServerAction(updateServiceAction);
  const { run: runDelete } = useServerAction(deleteServiceAction);
  const { run: runReorder } = useServerAction(reorderServicesAction);

  const active = editingId ? updateAction : createAction;

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY);
    setValidationError(null);
    createAction.reset();
    setDialogOpen(true);
  }

  function openEdit(service: AdminService) {
    setEditingId(service.id);
    setForm({
      category: service.category,
      title: service.title,
      description: service.description,
      features: service.features,
      isPublished: service.isPublished,
    });
    setValidationError(null);
    updateAction.reset();
    setDialogOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = serviceSchema.safeParse(form);
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
        <Plus className="h-4 w-4" /> New service
      </button>

      {services.length === 0 ? (
        <p className="text-sm text-text-muted">No services yet.</p>
      ) : (
        <SortableList
          items={services}
          onReorder={(order) => {
            setServices((prev) =>
              order.map((o) => ({ ...prev.find((s) => s.id === o.id)!, displayOrder: o.displayOrder }))
            );
            runReorder(order);
          }}
          renderItem={(service) => (
            <div className="glass-panel flex items-start justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-muted">
                    {service.category}
                  </span>
                  {!service.isPublished && (
                    <span className="rounded-full bg-accent-orange/10 px-2 py-0.5 text-[10px] text-accent-orange">Draft</span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm font-medium text-text-primary">{service.title}</p>
                <p className="truncate text-xs text-text-muted">{service.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => openEdit(service)}
                  className="rounded-md border border-white/10 p-1.5 text-text-muted transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
                  aria-label="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <ConfirmDeleteButton
                  onConfirm={() => {
                    runDelete(service.id);
                    router.refresh();
                  }}
                />
              </div>
            </div>
          )}
        />
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editingId ? "Edit service" : "New service"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <SelectField
            id="category"
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as ServiceInput["category"] })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectField>
          <TextField
            id="title"
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <TextAreaField
            id="description"
            label="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <StringListField
            label="Features"
            values={form.features}
            onChange={(features) => setForm({ ...form, features })}
            placeholder="A feature…"
          />
          <ToggleField
            label="Published"
            description="Visible on the public site"
            checked={form.isPublished}
            onChange={(isPublished) => setForm({ ...form, isPublished })}
          />

          <StatusBanner error={validationError ?? active.error} />
          <SaveButton pending={active.isPending} label={editingId ? "Save changes" : "Create service"} />
        </form>
      </Dialog>
    </div>
  );
}
