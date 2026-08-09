"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Github, Mail, MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validations/contact";
import { submitContactMessageAction } from "@/lib/actions/contact-form";
import type { ContactInfoData } from "@/types/content";

export function Contact({ data }: { data: ContactInfoData }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

  async function onSubmit(values: ContactMessageInput) {
    setStatus("submitting");
    setSubmitError(null);
    const result = await submitContactMessageAction(values);
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
      setSubmitError(result.error ?? "Couldn't send your message. Please try again.");
    }
  }

  return (
    <SectionWrapper id="contact" ariaLabel="Contact">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something"
        description="Tell me about your server, community, or project."
      />

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-5">
        <div className="glass-panel md:col-span-2 flex flex-col justify-between px-7 py-8">
          <div className="space-y-5">
            <a
              href={`mailto:${data.email}`}
              className="flex items-center gap-3 text-sm text-text-light transition-colors hover:text-accent-primary"
            >
              <Mail className="h-4 w-4 text-accent-primary" /> {data.email}
            </a>
            {data.discordHandle && (
              <p className="flex items-center gap-3 text-sm text-text-light">
                <MessageCircle className="h-4 w-4 text-accent-secondary" /> {data.discordHandle}
              </p>
            )}
            {data.githubUrl && (
              <a
                href={data.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-text-light transition-colors hover:text-accent-primary"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            )}
          </div>
          <p className="mt-8 text-xs leading-relaxed text-text-muted">
            I typically reply within a couple of days. For Discord-specific questions, a message
            there is usually fastest.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="glass-panel md:col-span-3 space-y-4 px-7 py-8"
        >
          {/* Honeypot -- hidden from sighted users and screen readers, bots fill it in */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
          </div>

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-light">
              Name
            </label>
            <input
              id="name"
              {...register("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="w-full rounded-lg border border-white/10 bg-bg-elevated/60 px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary/50"
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-xs text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-light">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full rounded-lg border border-white/10 bg-bg-elevated/60 px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary/50"
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text-light">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              {...register("message")}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className="w-full resize-none rounded-lg border border-white/10 bg-bg-elevated/60 px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary/50"
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-xs text-red-400">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-bg-primary transition-opacity disabled:opacity-60 sm:w-auto"
          >
            {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "success" && <CheckCircle2 className="h-4 w-4" />}
            {status === "success" ? "Message sent" : "Send message"}
          </button>
          {status === "error" && submitError && (
            <p role="alert" className="text-xs text-red-400">
              {submitError}
            </p>
          )}
        </motion.form>
      </div>
    </SectionWrapper>
  );
}
