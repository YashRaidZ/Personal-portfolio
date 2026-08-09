import { z } from "zod";

export const serviceSchema = z.object({
  category: z.enum(["minecraft", "discord", "web", "automation"]),
  title: z.string().trim().min(1, "Title is required").max(100),
  description: z.string().trim().min(1, "Description is required").max(500),
  features: z.array(z.string().trim().min(1).max(120)).max(12),
  isPublished: z.boolean(),
});
export type ServiceInput = z.infer<typeof serviceSchema>;
