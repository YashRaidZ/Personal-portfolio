"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { cn } from "@/lib/utils";
import type { StatItemData } from "@/types/content";

// Tailwind's JIT compiler needs to see full class strings statically,
// so a template-literal column count can't be used directly.
const GRID_COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

export function Stats({ data }: { data: StatItemData[] }) {
  const available = data.filter((s) => s.value !== null);
  if (available.length === 0) return null;

  return (
    <SectionWrapper id="stats" ariaLabel="Statistics" tone="secondary" className="py-16">
      <div
        className={cn(
          "grid grid-cols-1 gap-8",
          GRID_COLS[Math.min(available.length, 3)]
        )}
      >
        {available.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center"
          >
            <p className="font-display text-4xl font-semibold text-accent-primary">
              {stat.value}
              {stat.suffix}
            </p>
            <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
