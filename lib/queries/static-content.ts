import type {
  HeroContentData,
  AboutContentData,
  ServiceData,
  ProjectData,
  TechCategoryData,
  ProcessStepData,
  StatItemData,
  ContactInfoData,
  TestimonialData,
  SiteSettingsData,
} from "@/types/content";

/**
 * Placeholder content for local development in Phase 1.
 * In Phase 2 this file is replaced by lib/queries/hero.ts etc.,
 * which read the same shape from Supabase. Every component that
 * consumes this already takes the shape as a typed prop, so the
 * swap requires no component changes.
 */
export const heroContent: HeroContentData = {
  eyebrow: "Minecraft & Discord Developer",
  name: "Your Name",
  description:
    "I build high-performance Minecraft plugins, Discord bots, community automation systems, and modern web applications.",
  primaryButtonText: "View Projects",
  primaryButtonLink: "#projects",
  secondaryButtonText: "Contact Me",
  secondaryButtonLink: "#contact",
  socialLinks: [
    { platform: "github", url: "https://github.com" },
    { platform: "discord", url: "https://discord.com" },
    { platform: "email", url: "mailto:hello@example.com" },
  ],
};

export const aboutContent: AboutContentData = {
  heading: "Building the systems behind great communities",
  body: [
    "I design and build backend systems, Minecraft plugins, and Discord bots for server owners and community founders who need software that holds up under real traffic — not just a demo.",
    "My work spans custom game mechanics, moderation and automation tooling, and the web dashboards that tie a community's tools together. I lean on AI-assisted workflows to move faster without cutting corners on architecture.",
    "Every project starts with the same question: what does this need to do reliably at 2am with no one watching? That's the standard I build to.",
  ],
  highlights: [
    { icon: "server", label: "Backend & database architecture" },
    { icon: "bot", label: "Discord bot & automation development" },
    { icon: "puzzle", label: "Custom Minecraft plugin mechanics" },
    { icon: "sparkles", label: "AI-assisted development workflows" },
    { icon: "shield", label: "Secure, production-grade systems" },
    { icon: "code", label: "Modern web application development" },
  ],
};

export const services: ServiceData[] = [
  {
    id: "svc-minecraft",
    category: "minecraft",
    title: "Minecraft Plugin Development",
    description:
      "Custom server-side plugins built for performance and long-term maintainability.",
    features: [
      "Paper, Bukkit, Spigot & Velocity",
      "Custom game mechanics",
      "Database integration",
      "Performance optimization",
    ],
  },
  {
    id: "svc-discord",
    category: "discord",
    title: "Discord Bot Development",
    description:
      "Bots that handle moderation, onboarding, and engagement without babysitting.",
    features: [
      "Discord.js & slash commands",
      "Moderation & tickets",
      "Verification & reaction roles",
      "Dashboard integration & analytics",
    ],
  },
  {
    id: "svc-web",
    category: "web",
    title: "Web Development",
    description:
      "Landing pages, dashboards, and community sites backed by real APIs.",
    features: [
      "Landing pages & dashboards",
      "Community websites",
      "REST APIs & authentication",
      "Database integration",
    ],
  },
  {
    id: "svc-automation",
    category: "automation",
    title: "Automation & AI Workflows",
    description:
      "Connecting the tools your community already uses so nothing needs manual upkeep.",
    features: [
      "AI-assisted workflows",
      "Community automation",
      "Backend systems",
      "Third-party integrations",
    ],
  },
];

export const projects: ProjectData[] = [
  {
    id: "proj-induschat",
    slug: "induschat",
    title: "IndusChat",
    description:
      "A real-time community chat platform with role-based moderation and presence tracking.",
    thumbnailUrl: null,
    technologies: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS"],
    features: ["Real-time messaging", "Role-based permissions", "Moderation tooling"],
    githubUrl: null,
    liveDemoUrl: null,
    access: "paid",
    isFeatured: true,
  },
  {
    id: "proj-indusbot",
    slug: "indusbot",
    title: "IndusBot",
    description:
      "A modular Discord bot for community moderation, verification, and ticketing.",
    thumbnailUrl: null,
    technologies: ["Discord.js", "Node.js", "PostgreSQL"],
    features: ["Verification flow", "Ticket system", "Slash commands"],
    githubUrl: null,
    liveDemoUrl: null,
    access: "private",
    isFeatured: true,
  },
  {
    id: "proj-indusstore",
    slug: "indusstore",
    title: "IndusStore",
    description: "A storefront and licensing system for selling Minecraft plugins directly to server owners.",
    thumbnailUrl: null,
    technologies: ["Next.js", "Stripe", "Supabase"],
    features: ["License key delivery", "Plugin versioning", "Customer dashboard"],
    githubUrl: null,
    liveDemoUrl: null,
    access: "paid",
    isFeatured: false,
  },
];

export const techCategories: TechCategoryData[] = [
  {
    name: "Languages",
    items: [{ name: "Java" }, { name: "TypeScript" }, { name: "JavaScript" }, { name: "SQL" }],
  },
  {
    name: "Minecraft",
    items: [{ name: "Paper API" }, { name: "Bukkit" }, { name: "Spigot" }, { name: "Velocity" }],
  },
  {
    name: "Backend",
    items: [{ name: "Node.js" }, { name: "Express" }, { name: "Supabase" }, { name: "PostgreSQL" }],
  },
  {
    name: "Frontend",
    items: [{ name: "React" }, { name: "Next.js" }, { name: "Tailwind CSS" }, { name: "Framer Motion" }],
  },
  {
    name: "Tools",
    items: [{ name: "Git" }, { name: "GitHub" }, { name: "Docker" }, { name: "Cloudflare" }, { name: "Vercel" }],
  },
];

export const processSteps: ProcessStepData[] = [
  { title: "Gather Resources", description: "Understand the community, the constraints, and what the software actually needs to do." },
  { title: "Plan Architecture", description: "Design the data model, security boundaries, and system structure before writing code." },
  { title: "Craft Systems", description: "Build the core backend, database, and integration layers." },
  { title: "Build Features", description: "Implement the user-facing functionality on top of a stable foundation." },
  { title: "Enchant & Optimize", description: "Profile, refine, and harden — performance and edge cases get real attention here." },
  { title: "Deploy", description: "Ship to production with monitoring and a clear rollback path." },
];

// Values are null (not fabricated) until Phase 3 wires the live GitHub API
// and a real pageview table. The Stats section hides any null entry.
export const stats: StatItemData[] = [
  { label: "Public Repositories", value: null },
  { label: "GitHub Contributions", value: null },
  { label: "Projects Shipped", value: projects.length },
];

export const contactInfo: ContactInfoData = {
  email: "hello@example.com",
  discordHandle: "yourname",
  githubUrl: "https://github.com",
  socialLinks: [
    { platform: "github", url: "https://github.com" },
    { platform: "discord", url: "https://discord.com" },
  ],
};

// Empty on purpose — the section hides itself until testimonials exist.
export const testimonials: TestimonialData[] = [];

export const siteSettings: SiteSettingsData = {
  siteTitle: "Minecraft & Discord Developer",
  metaDescription:
    "I build high-performance Minecraft plugins, Discord bots, community automation systems, and modern web applications.",
  footerText: "Built with Next.js, Supabase, and a lot of late-night compiling.",
  copyrightText: `© ${new Date().getFullYear()} Your Name. All rights reserved.`,
};
