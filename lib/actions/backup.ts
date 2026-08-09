"use server";

import { requireAdmin, runAction, AdminActionError } from "@/lib/actions/_guard";
import type { Database } from "@/types/database";

const BACKUP_VERSION = 1;

type Tables = Database["public"]["Tables"];

export interface BackupPayload {
  version: number;
  exportedAt: string;
  siteSettings: Tables["site_settings"]["Row"] | null;
  siteTheme: Tables["site_theme"]["Row"] | null;
  heroContent: Tables["hero_content"]["Row"] | null;
  aboutContent: Tables["about_content"]["Row"] | null;
  contactInfo: Tables["contact_info"]["Row"] | null;
  services: Tables["services"]["Row"][];
  projects: Tables["projects"]["Row"][];
  techCategories: Tables["tech_categories"]["Row"][];
  techItems: Tables["tech_items"]["Row"][];
  testimonials: Tables["testimonials"]["Row"][];
}

/**
 * Exports every content table (not contact_messages, media_library,
 * audit_log, or admin_users -- those are operational data, not content).
 * Returns the JSON directly; the admin UI turns it into a downloadable file
 * client-side.
 */
export async function exportBackupAction() {
  return runAction(async (): Promise<BackupPayload> => {
    const { supabase } = await requireAdmin();

    const [
      siteSettings,
      siteTheme,
      heroContent,
      aboutContent,
      contactInfo,
      services,
      projects,
      techCategories,
      techItems,
      testimonials,
    ] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("site_theme").select("*").eq("id", 1).maybeSingle(),
      supabase.from("hero_content").select("*").eq("id", 1).maybeSingle(),
      supabase.from("about_content").select("*").eq("id", 1).maybeSingle(),
      supabase.from("contact_info").select("*").eq("id", 1).maybeSingle(),
      supabase.from("services").select("*").order("display_order"),
      supabase.from("projects").select("*").order("display_order"),
      supabase.from("tech_categories").select("*").order("display_order"),
      supabase.from("tech_items").select("*").order("display_order"),
      supabase.from("testimonials").select("*").order("display_order"),
    ]);

    return {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      siteSettings: siteSettings.data,
      siteTheme: siteTheme.data,
      heroContent: heroContent.data,
      aboutContent: aboutContent.data,
      contactInfo: contactInfo.data,
      services: services.data ?? [],
      projects: projects.data ?? [],
      techCategories: techCategories.data ?? [],
      techItems: techItems.data ?? [],
      testimonials: testimonials.data ?? [],
    };
  });
}

/**
 * Restores content from a previously exported backup. Singleton tables are
 * updated in place; collection tables are fully replaced (delete then
 * re-insert with their original IDs preserved) so relationships like
 * tech_items.category_id stay valid. This is destructive by design -- the
 * admin UI confirms with the user before calling this.
 */
export async function importBackupAction(payload: BackupPayload) {
  return runAction(async () => {
    if (!payload || typeof payload !== "object" || payload.version !== BACKUP_VERSION) {
      throw new AdminActionError("This file isn't a recognized backup, or is from an incompatible version.");
    }

    const { supabase } = await requireAdmin();

    if (payload.siteSettings) {
      const { id: _id, ...rest } = payload.siteSettings;
      await supabase.from("site_settings").update(rest).eq("id", 1);
    }
    if (payload.siteTheme) {
      const { id: _id, ...rest } = payload.siteTheme;
      await supabase.from("site_theme").update(rest).eq("id", 1);
    }
    if (payload.heroContent) {
      const { id: _id, ...rest } = payload.heroContent;
      await supabase.from("hero_content").update(rest).eq("id", 1);
    }
    if (payload.aboutContent) {
      const { id: _id, ...rest } = payload.aboutContent;
      await supabase.from("about_content").update(rest).eq("id", 1);
    }
    if (payload.contactInfo) {
      const { id: _id, ...rest } = payload.contactInfo;
      await supabase.from("contact_info").update(rest).eq("id", 1);
    }

    // Collections: replace wholesale, preserving IDs from the backup so
    // parent/child references (tech_items -> tech_categories) stay intact.
    await supabase.from("tech_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("tech_categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("services").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    if (payload.services.length) await supabase.from("services").insert(payload.services);
    if (payload.projects.length) await supabase.from("projects").insert(payload.projects);
    if (payload.techCategories.length) await supabase.from("tech_categories").insert(payload.techCategories);
    if (payload.techItems.length) await supabase.from("tech_items").insert(payload.techItems);
    if (payload.testimonials.length) await supabase.from("testimonials").insert(payload.testimonials);
  });
}
