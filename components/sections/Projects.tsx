"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, ExternalLink, ShoppingBag, Lock } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { ProjectData } from "@/types/content";

const ACCESS_BADGE: Record<
  ProjectData["access"],
  { label: string; className: string }
> = {
  opensource: { label: "Open Source", className: "bg-accent-secondary/10 text-accent-secondary" },
  paid: { label: "Paid Product", className: "bg-accent-gold/10 text-accent-gold" },
  private: { label: "Private", className: "bg-white/10 text-text-muted" },
};

function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 20,
  });

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const badge = ACCESS_BADGE[project.access];

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="glass-panel grid grid-cols-1 gap-6 overflow-hidden p-2 md:grid-cols-5"
    >
      <div
        className="relative col-span-2 flex min-h-[180px] items-center justify-center overflow-hidden rounded-[calc(var(--radius-glass)-6px)] bg-gradient-to-br from-bg-secondary to-bg-primary"
        aria-hidden={!project.thumbnailUrl}
      >
        {/* Faceted glow motif standing in for a screenshot until real
            thumbnails are uploaded via the Phase 2 media library. */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-primary/20 blur-3xl" />
        </div>
        {project.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnailUrl}
            alt={`${project.title} screenshot`}
            className="relative h-full w-full rounded-[calc(var(--radius-glass)-6px)] object-cover"
            loading="lazy"
          />
        ) : (
          <span className="relative font-mono text-xs uppercase tracking-widest text-text-muted">
            {project.title}
          </span>
        )}
      </div>

      <div className="col-span-3 flex flex-col justify-center px-4 py-4 md:px-2">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {project.isFeatured && (
            <span className="w-fit rounded-full bg-accent-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-accent-gold">
              Featured
            </span>
          )}
          <span
            className={`w-fit rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-text-primary">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-text-light"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          {project.access === "opensource" && project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-light transition-colors hover:text-accent-primary"
            >
              <Github className="h-4 w-4" /> Source
            </a>
          )}
          {project.access === "paid" && project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-light transition-colors hover:text-accent-primary"
            >
              <ShoppingBag className="h-4 w-4" /> View Store
            </a>
          )}
          {project.access === "opensource" && project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-light transition-colors hover:text-accent-primary"
            >
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          )}
          {project.access === "private" && (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-text-muted">
              <Lock className="h-3.5 w-3.5" /> Available on request
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects({ data }: { data: ProjectData[] }) {
  if (data.length === 0) return null;

  return (
    <SectionWrapper id="projects" ariaLabel="Featured Projects">
      <SectionHeading
        eyebrow="Featured Projects"
        title="Selected work"
        description="Systems built for real communities, not tutorials."
      />

      <div className="mt-12 space-y-6">
        {data.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
