"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validations/contact";

export interface SubmitContactResult {
  success: boolean;
  error?: string;
}

function hashIp(ip: string): string {
  const salt = process.env.CONTACT_IP_HASH_SALT ?? "portfolio-contact-form";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/**
 * Public contact form submission. Never trusts the client: re-validates
 * with the same zod schema the client form uses (including the honeypot
 * field), and relies on the DB-level rate-limit trigger
 * (enforce_contact_rate_limit, migration 0014) as the layer that can't be
 * bypassed by calling this action directly.
 */
export async function submitContactMessageAction(input: ContactMessageInput): Promise<SubmitContactResult> {
  const parsed = contactMessageSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  // Honeypot: a real visitor never fills this in. Silently "succeed" so a
  // bot doesn't learn its submission was rejected.
  if (parsed.data.company) {
    return { success: true };
  }

  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown";

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    ip_hash: hashIp(ip),
  });

  if (error) {
    // The rate-limit trigger raises a P0001 with a friendly message -- pass
    // that through, otherwise give a generic error.
    const message = error.code === "P0001" ? error.message : "Couldn't send your message. Please try again.";
    return { success: false, error: message };
  }

  return { success: true };
}
