"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { Dialog } from "@/components/admin/Dialog";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { SortableList } from "@/components/admin/SortableList";
import { TextField, StatusBanner, SaveButton } from "@/components/admin/FormFields";
import { useServerAction } from "@/lib/hooks/useServerAction";
import {
  createTechCategoryAction,
  updateTechCategoryAction,
  deleteTechCategoryAction,
  reorderTechCategoriesAction,
  createTechItemAction,
  updateTechItemAction,
  deleteTechItemAction,
  reorderTechItemsAction,
} from "@/lib/actions/tech-stack";
import { techCategorySchema, techItemSchema, type TechCategoryInput, type TechItemInput } from "@/lib/validations/tech-testimonials";
import type { AdminTechCategory } from "@/lib/queries/tech-stack";

export function TechStackManager({ initialCategories }: { initialCategories: AdminTechCategory[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  useEffect(() => setCategories(initialCategories), [initialCategories]);

  // Category dialog state
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState<TechCategoryInput>({ name: "" });
  const [catValidationError, setCatValidationError] = useState<string | null>(null);
  const createCat = useServerAction(createTechCategoryAction);
  const updateCat = useServerAction(updateTechCategoryAction);
  const { run: deleteCat } = useServerAction(deleteTechCategoryAction);
  const { run: reorderCats } = useServerAction(reorderTechCategoriesAction);
  const activeCat = editingCatId ? updateCat : createCat;

  // Item dialog state
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string; categoryId: string } | null>(null);
  const [itemForm, setItemForm] = useState<TechItemInput>({ categoryId: "", name: "", icon: "" });
  const [itemValidationError, setItemValidationError] = useState<string | null>(null);
  const createItem = useServerAction(createTechItemAction);
  const updateItem = useServerAction(updateTechItemAction);
  const { run: deleteItem } = useServerAction(deleteTechItemAction);
  const { run: reorderItems } = useServerAction(reorderTechItemsAction);
  const activeItem = editingItem ? updateItem : createItem;

  useEffect(() => {
    if (activeCat.success) {
      setCatDialogOpen(false);
      router.refresh();
    }
  }, [activeCat.success, router]);

  useEffect(() => {
    if (activeItem.success) {
      setItemDialogOpen(false);
      router.refresh();
    }
  }, [activeItem.success, router]);

  function openCreateCategory() {
    setEditingCatId(null);
    setCatForm({ name: "" });
    setCatValidationError(null);
    createCat.reset();
    setCatDialogOpen(true);
  }
  function openEditCategory(cat: AdminTechCategory) {
    setEditingCatId(cat.id);
    setCatForm({ name: cat.name });
    setCatValidationError(null);
    updateCat.reset();
    setCatDialogOpen(true);
  }
  function submitCategory(e: React.FormEvent) {
    e.preventDefault();
    const parsed = techCategorySchema.safeParse(catForm);
    if (!parsed.success) {
      setCatValidationError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setCatValidationError(null);
    if (editingCatId) updateCat.run(editingCatId, parsed.data);
    else createCat.run(parsed.data);
  }

  function openCreateItem(categoryId: string) {
    setEditingItem(null);
    setItemForm({ categoryId, name: "", icon: "" });
    setItemValidationError(null);
    createItem.reset();
    setItemDialogOpen(true);
  }
  function openEditItem(categoryId: string, item: AdminTechCategory["items"][number]) {
    setEditingItem({ id: item.id, categoryId });
    setItemForm({ categoryId, name: item.name, icon: item.icon ?? "" });
    setItemValidationError(null);
    updateItem.reset();
    setItemDialogOpen(true);
  }
  function submitItem(e: React.FormEvent) {
    e.preventDefault();
    const parsed = techItemSchema.safeParse(itemForm);
    if (!parsed.success) {
      setItemValidationError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setItemValidationError(null);
    if (editingItem) updateItem.run(editingItem.id, parsed.data);
    else createItem.run(parsed.data);
  }

  return (
    <div>
      <button
        onClick={openCreateCategory}
        className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-bg-primary"
      >
        <Plus className="h-4 w-4" /> New category
      </button>

      {categories.length === 0 ? (
        <p className="text-sm text-text-muted">No categories yet.</p>
      ) : (
        <SortableList
          items={categories}
          onReorder={(order) => {
            setCategories((prev) => order.map((o) => prev.find((c) => c.id === o.id)!));
            reorderCats(order);
          }}
          renderItem={(cat) => (
            <div className="glass-panel px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-text-primary">{cat.name}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openCreateItem(cat.id)}
                    className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-text-light transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
                  >
                    + Item
                  </button>
                  <button
                    onClick={() => openEditCategory(cat)}
                    className="rounded-md border border-white/10 p-1.5 text-text-muted transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
                    aria-label="Edit category"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <ConfirmDeleteButton
                    label="Delete category"
                    onConfirm={() => {
                      deleteCat(cat.id);
                      router.refresh();
                    }}
                  />
                </div>
              </div>

              {cat.items.length > 0 && (
                <div className="mt-3">
                  <SortableList
                    items={cat.items}
                    onReorder={(order) => reorderItems(order)}
                    renderItem={(item) => (
                      <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                        <span className="text-xs text-text-light">{item.name}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditItem(cat.id, item)}
                            className="rounded-md border border-white/10 p-1 text-text-muted transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
                            aria-label="Edit item"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <ConfirmDeleteButton
                            onConfirm={() => {
                              deleteItem(item.id);
                              router.refresh();
                            }}
                          />
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}
            </div>
          )}
        />
      )}

      <Dialog open={catDialogOpen} onClose={() => setCatDialogOpen(false)} title={editingCatId ? "Edit category" : "New category"}>
        <form onSubmit={submitCategory} className="space-y-5">
          <TextField
            id="catName"
            label="Category name"
            value={catForm.name}
            onChange={(e) => setCatForm({ name: e.target.value })}
            required
          />
          <StatusBanner error={catValidationError ?? activeCat.error} />
          <SaveButton pending={activeCat.isPending} label={editingCatId ? "Save changes" : "Create category"} />
        </form>
      </Dialog>

      <Dialog open={itemDialogOpen} onClose={() => setItemDialogOpen(false)} title={editingItem ? "Edit item" : "New item"}>
        <form onSubmit={submitItem} className="space-y-5">
          <TextField
            id="itemName"
            label="Item name"
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            required
          />
          <TextField
            id="itemIcon"
            label="Icon (optional lucide-react name)"
            value={itemForm.icon}
            onChange={(e) => setItemForm({ ...itemForm, icon: e.target.value })}
          />
          <StatusBanner error={itemValidationError ?? activeItem.error} />
          <SaveButton pending={activeItem.isPending} label={editingItem ? "Save changes" : "Create item"} />
        </form>
      </Dialog>
    </div>
  );
}
