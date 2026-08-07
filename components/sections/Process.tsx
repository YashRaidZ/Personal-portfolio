"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { ProcessStepData } from "@/types/content";

export function Process({ data }: { data: ProcessStepData[] }) {
  return (
    <SectionWrapper id="process" ariaLabel="Development Process">
      <SectionHeading
        eyebrow="Process"
        title="How a project comes together"
        description="Six stages, from first conversation to a live, monitored deploy."
      />

      <ol className="relative mt-14 space-y-10 border-l border-white/10 pl-8">
        {data.map((step, i) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="relative"
          >
            <span className="absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full bg-accent-primary shadow-[0_0_10px_var(--color-accent-primary)]" />
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent-primary">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-text-primary">{step.title}</h3>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-text-muted">
              {step.description}
            </p>
          </motion.li>
        ))}
      </ol>
    </SectionWrapper>
  );
}
