"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { ProjectData } from "@/types/content";

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
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            className="glass-panel grid grid-cols-1 gap-6 overflow-hidden p-2 md:grid-cols-5"
          >
            <div
              className="relative col-span-2 flex min-h-[180px] items-center justify-center rounded-[calc(var(--radius-glass)-6px)] bg-gradient-to-br from-bg-secondary to-bg-primary"
              aria-hidden={!project.thumbnailUrl}
            >
              {project.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.thumbnailUrl}
                  alt={`${project.title} screenshot`}
                  className="h-full w-full rounded-[calc(var(--radius-glass)-6px)] object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                  {project.title}
                </span>
              )}
            </div>

            <div className="col-span-3 flex flex-col justify-center px-4 py-4 md:px-2">
              {project.isFeatured && (
                <span className="mb-2 w-fit rounded-full bg-accent-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-accent-gold">
                  Featured
                </span>
              )}
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

              <div className="mt-5 flex flex-wrap gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-text-light transition-colors hover:text-accent-primary"
                  >
                    <Github className="h-4 w-4" /> Source
                  </a>
                )}
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-text-light transition-colors hover:text-accent-primary"
                  >
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
