export interface SocialLink {
  platform: "github" | "discord" | "email" | "twitter" | "youtube";
  url: string;
}

export interface HeroContentData {
  eyebrow?: string;
  name: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  socialLinks: SocialLink[];
}

export interface AboutHighlight {
  icon: "code" | "server" | "bot" | "sparkles" | "puzzle" | "shield";
  label: string;
}

export interface AboutContentData {
  heading: string;
  body: string[];
  highlights: AboutHighlight[];
}

export type ServiceCategory =
  | "minecraft"
  | "discord"
  | "web"
  | "automation";

export interface ServiceData {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  features: string[];
}

export type ProjectAccess = "opensource" | "paid" | "private";

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  technologies: string[];
  features: string[];
  githubUrl: string | null;
  liveDemoUrl: string | null;
  /** opensource -> show source link; paid -> show a store/purchase link
   *  and a "Paid" badge, no source; private -> no links, "Private" badge. */
  access: ProjectAccess;
  isFeatured: boolean;
}

export interface TechItemData {
  name: string;
  icon?: string;
}

export interface TechCategoryData {
  name: string;
  items: TechItemData[];
}

export interface ProcessStepData {
  title: string;
  description: string;
}

export interface StatItemData {
  label: string;
  value: number | null; // null = unavailable, hidden gracefully rather than faked
  suffix?: string;
}

export interface ContactInfoData {
  email: string;
  discordHandle?: string;
  githubUrl?: string;
  socialLinks: SocialLink[];
}

export interface TestimonialData {
  id: string;
  authorName: string;
  authorRole: string;
  avatarUrl: string | null;
  content: string;
}

export interface SiteSettingsData {
  siteTitle: string;
  metaDescription: string;
  footerText: string;
  copyrightText: string;
}

/**
 * Mirrors the --color-accent-* / --motion-scale CSS custom properties
 * declared under @theme in app/globals.css. Added in Phase 2 so
 * <ThemeProvider> can override :root at runtime from the admin-edited row.
 */
export interface SiteThemeData {
  accentPrimary: string;
  accentSecondary: string;
  accentGold: string;
  accentOrange: string;
  motionScale: number;
  glassIntensity: number;
}
