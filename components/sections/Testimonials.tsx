"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { TestimonialData } from "@/types/content";

export function Testimonials({ data }: { data: TestimonialData[] }) {
  if (data.length === 0) return null;

  return (
    <SectionWrapper id="testimonials" ariaLabel="Testimonials" tone="secondary">
      <SectionHeading eyebrow="Testimonials" title="What clients say" align="center" />
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {data.map((t, i) => (
          <motion.blockquote
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-panel px-6 py-7"
          >
            <Quote className="h-5 w-5 text-accent-primary/60" />
            <p className="mt-3 text-sm leading-relaxed text-text-light">{t.content}</p>
            <footer className="mt-4 text-sm">
              <span className="font-medium text-text-primary">{t.authorName}</span>
              <span className="text-text-muted"> — {t.authorRole}</span>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </SectionWrapper>
  );
}
