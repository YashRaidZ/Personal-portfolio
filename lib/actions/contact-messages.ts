"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, runAction } from "@/lib/actions/_guard";

const idSchema = z.string().uuid();

export async function markMessageReadAction(id: string, isRead: boolean) {
  return runAction(async () => {
    const parsedId = idSchema.parse(id);
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: isRead })
      .eq("id", parsedId);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/messages");
  });
}

export async function deleteMessageAction(id: string) {
  return runAction(async () => {
    const parsedId = idSchema.parse(id);
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("contact_messages").delete().eq("id", parsedId);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/messages");
  });
}
