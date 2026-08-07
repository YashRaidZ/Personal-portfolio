"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import type { HeroContentData } from "@/types/content";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function HeroContent({ data }: { data: HeroContentData }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="glass-panel max-w-xl px-7 py-8 sm:px-9 sm:py-10"
    >
      <motion.p
        variants={item}
        className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-primary"
      >
        {data.eyebrow ?? "Minecraft & Discord Developer"}
      </motion.p>

      <motion.h1
        variants={item}
        className="text-4xl font-semibold leading-[1.05] text-text-primary sm:text-5xl"
      >
        {data.name}
      </motion.h1>

      <motion.p variants={item} className="mt-4 max-w-md text-base leading-relaxed text-text-light">
        {data.description}
      </motion.p>

      <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
        <a
          href={data.primaryButtonLink}
          className="group inline-flex items-center gap-2 rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-bg-primary transition-transform hover:-translate-y-0.5"
        >
          {data.primaryButtonText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <a
          href={data.secondaryButtonLink}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-white/30 hover:bg-white/5"
        >
          <Mail className="h-4 w-4" />
          {data.secondaryButtonText}
        </a>
      </motion.div>
    </motion.div>
  );
}
