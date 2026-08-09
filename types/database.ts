/**
 * Hand-written to match supabase/migrations/*.sql exactly. This sandbox has
 * no network access to your live Supabase project, so this couldn't be
 * generated from the real schema. Once you've applied the migrations, run:
 *
 *   npm run db:types
 *
 * ...to regenerate this file for real and replace this one. Keep the shape
 * (Database.public.Tables.<table>.Row/Insert/Update) if you hand-edit
 * anything in the meantime, since lib/supabase/*.ts and lib/queries/*.ts
 * both depend on it as a generic parameter.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: { user_id?: string; created_at?: string };
      };
      audit_log: {
        Row: {
          id: string;
          actor_id: string | null;
          action: "INSERT" | "UPDATE" | "DELETE";
          table_name: string;
          record_id: string;
          diff: Json | null;
          created_at: string;
        };
        Insert: never; // written only by the DB trigger
        Update: never;
      };
      site_settings: {
        Row: {
          id: number;
          site_title: string;
          meta_description: string;
          footer_text: string;
          copyright_text: string;
          github_username: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
      };
      site_theme: {
        Row: {
          id: number;
          accent_primary: string;
          accent_secondary: string;
          accent_gold: string;
          accent_orange: string;
          motion_scale: number;
          glass_intensity: number;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_theme"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_theme"]["Row"]>;
      };
      hero_content: {
        Row: {
          id: number;
          eyebrow: string | null;
          name: string;
          description: string;
          primary_button_text: string;
          primary_button_link: string;
          secondary_button_text: string;
          secondary_button_link: string;
          social_links: Json;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["hero_content"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["hero_content"]["Row"]>;
      };
      about_content: {
        Row: {
          id: number;
          heading: string;
          body: string[];
          highlights: Json;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["about_content"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["about_content"]["Row"]>;
      };
      contact_info: {
        Row: {
          id: number;
          email: string;
          discord_handle: string | null;
          github_url: string | null;
          social_links: Json;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["contact_info"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["contact_info"]["Row"]>;
      };
      services: {
        Row: {
          id: string;
          category: "minecraft" | "discord" | "web" | "automation";
          title: string;
          description: string;
          features: string[];
          display_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["services"]["Row"]> & {
          category: "minecraft" | "discord" | "web" | "automation";
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          thumbnail_url: string | null;
          technologies: string[];
          features: string[];
          github_url: string | null;
          live_demo_url: string | null;
          access: "opensource" | "paid" | "private";
          is_featured: boolean;
          is_published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["projects"]["Row"]> & {
          slug: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
      };
      tech_categories: {
        Row: {
          id: string;
          name: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["tech_categories"]["Row"]> & { name: string };
        Update: Partial<Database["public"]["Tables"]["tech_categories"]["Row"]>;
      };
      tech_items: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          icon: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["tech_items"]["Row"]> & {
          category_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["tech_items"]["Row"]>;
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_role: string;
          avatar_url: string | null;
          content: string;
          is_published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["testimonials"]["Row"]> & {
          author_name: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          is_read: boolean;
          ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          message: string;
          ip_hash?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Row"]>;
      };
      media_library: {
        Row: {
          id: string;
          file_name: string;
          storage_path: string;
          url: string;
          mime_type: string;
          size_bytes: number;
          width: number | null;
          height: number | null;
          alt_text: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["media_library"]["Row"]> & {
          file_name: string;
          storage_path: string;
          url: string;
          mime_type: string;
          size_bytes: number;
        };
        Update: Partial<Database["public"]["Tables"]["media_library"]["Row"]>;
      };
    };
  };
}
