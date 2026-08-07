"use client";

import { motion } from "framer-motion";
import { Blocks, Bot, Globe, Workflow, Check } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { ServiceCategory, ServiceData } from "@/types/content";

const CATEGORY_ICON: Record<ServiceCategory, React.ComponentType<{ className?: string }>> = {
  minecraft: Blocks,
  discord: Bot,
  web: Globe,
  automation: Workflow,
};

export function Services({ data }: { data: ServiceData[] }) {
  return (
    <SectionWrapper id="services" ariaLabel="Services" tone="secondary">
      <SectionHeading
        eyebrow="Services"
        title="What I build"
        description="Focused specialties, not a generic freelancer menu."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.map((service, i) => {
          const Icon = CATEGORY_ICON[service.category];
          return (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 2) * 0.08 }}
              className="glass-panel group relative overflow-hidden px-7 py-8 transition-colors hover:border-accent-primary/30"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-primary/10 text-accent-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{service.description}</p>

              <ul className="mt-5 space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-text-light">
                    <Check className="h-3.5 w-3.5 shrink-0 text-accent-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
