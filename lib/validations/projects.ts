import { z } from "zod";

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  title: z.string().trim().min(1, "Title is required").max(100),
  description: z.string().trim().min(1, "Description is required").max(600),
  thumbnailUrl: z.string().trim().url().max(500).nullable().optional(),
  technologies: z.array(z.string().trim().min(1).max(40)).max(20),
  features: z.array(z.string().trim().min(1).max(120)).max(12),
  githubUrl: z.string().trim().url().max(300).nullable().optional().or(z.literal("")),
  liveDemoUrl: z.string().trim().url().max(300).nullable().optional().or(z.literal("")),
  access: z.enum(["opensource", "paid", "private"]),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
