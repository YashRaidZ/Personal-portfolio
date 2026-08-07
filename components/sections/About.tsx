"use client";

import { motion } from "framer-motion";
import { Code2, Server, Bot, Sparkles, Puzzle, Shield } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { AboutContentData, AboutHighlight } from "@/types/content";

const ICONS: Record<AboutHighlight["icon"], React.ComponentType<{ className?: string }>> = {
  code: Code2,
  server: Server,
  bot: Bot,
  sparkles: Sparkles,
  puzzle: Puzzle,
  shield: Shield,
};

const HIGHLIGHT_COLORS = [
  "bg-accent-primary/10 text-accent-primary",
  "bg-accent-secondary/10 text-accent-secondary",
  "bg-accent-orange/10 text-accent-orange",
  "bg-accent-gold/10 text-accent-gold",
];

export function About({ data }: { data: AboutContentData }) {
  return (
    <SectionWrapper id="about" ariaLabel="About">
      <div className="grid grid-cols-1 gap-14 md:grid-cols-2">
        <SectionHeading eyebrow="About" title={data.heading} />

        <div className="space-y-4">
          {data.body.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-base leading-relaxed text-text-light"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.highlights.map((highlight, i) => {
          const Icon = ICONS[highlight.icon];
          const color = HIGHLIGHT_COLORS[i % HIGHLIGHT_COLORS.length];
          return (
            <motion.div
              key={highlight.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-panel flex items-center gap-3 px-5 py-4"
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="text-sm font-medium text-text-light">{highlight.label}</span>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
