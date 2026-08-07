import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
  // Honeypot field: real users never fill this in. Hidden via CSS.
  company: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
