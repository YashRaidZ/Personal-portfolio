"use client";

import { useRef, useState } from "react";
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
        <span className="text-gradient">{data.name}</span>
      </motion.h1>

      <motion.p variants={item} className="mt-4 max-w-md text-base leading-relaxed text-text-light">
        {data.description}
      </motion.p>

      <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
        <MagneticButton href={data.primaryButtonLink}>
          {data.primaryButtonText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </MagneticButton>
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

function MagneticButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: relX * 0.25, y: relY * 0.4 });
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.4 }}
      className="group inline-flex items-center gap-2 rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-bg-primary"
    >
      {children}
    </motion.a>
  );
}
