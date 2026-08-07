"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { TechCategoryData } from "@/types/content";

const CATEGORY_ACCENT: string[] = [
  "hover:border-accent-primary/40 hover:shadow-[0_0_18px_rgba(0,230,118,0.18)]",
  "hover:border-accent-orange/40 hover:shadow-[0_0_18px_rgba(255,112,67,0.18)]",
  "hover:border-accent-secondary/40 hover:shadow-[0_0_18px_rgba(79,195,247,0.18)]",
  "hover:border-accent-gold/40 hover:shadow-[0_0_18px_rgba(255,193,7,0.18)]",
  "hover:border-accent-primary/40 hover:shadow-[0_0_18px_rgba(0,230,118,0.18)]",
];

export function TechStack({ data }: { data: TechCategoryData[] }) {
  return (
    <SectionWrapper id="tech-stack" ariaLabel="Tech Stack" tone="secondary">
      <SectionHeading
        eyebrow="Tech Stack"
        title="Tools I reach for"
        description="Hover any item for a closer look."
      />

      <div className="mt-12 space-y-10">
        {data.map((category, ci) => {
          const accent = CATEGORY_ACCENT[ci % CATEGORY_ACCENT.length];
          return (
            <div key={category.name}>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.items.map((item, i) => (
                  <motion.span
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: (ci * 0.05 + i * 0.02) }}
                    whileHover={{ y: -3 }}
                    tabIndex={0}
                    title={item.name}
                    className={`cursor-default rounded-lg border border-white/10 bg-bg-elevated/60 px-4 py-2.5 font-mono text-sm text-text-light transition-shadow ${accent}`}
                  >
                    {item.name}
                  </motion.span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
