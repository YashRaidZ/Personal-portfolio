import { z } from "zod";

export const techCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(60),
});
export type TechCategoryInput = z.infer<typeof techCategorySchema>;

export const techItemSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().trim().min(1, "Item name is required").max(60),
  icon: z.string().trim().max(60).optional().or(z.literal("")),
});
export type TechItemInput = z.infer<typeof techItemSchema>;

export const testimonialSchema = z.object({
  authorName: z.string().trim().min(1, "Author name is required").max(100),
  authorRole: z.string().trim().max(100),
  avatarUrl: z.string().trim().url().max(500).nullable().optional().or(z.literal("")),
  content: z.string().trim().min(1, "Testimonial content is required").max(1000),
  isPublished: z.boolean(),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;
