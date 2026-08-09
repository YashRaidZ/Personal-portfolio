import { z } from "zod";

export const socialLinkSchema = z.object({
  platform: z.enum(["github", "discord", "email", "twitter", "youtube"]),
  url: z.string().trim().min(1, "URL is required"),
});

export const heroContentSchema = z.object({
  eyebrow: z.string().trim().max(80).optional().or(z.literal("")),
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().min(1, "Description is required").max(600),
  primaryButtonText: z.string().trim().min(1).max(40),
  primaryButtonLink: z.string().trim().min(1).max(200),
  secondaryButtonText: z.string().trim().min(1).max(40),
  secondaryButtonLink: z.string().trim().min(1).max(200),
  socialLinks: z.array(socialLinkSchema).max(10),
});
export type HeroContentInput = z.infer<typeof heroContentSchema>;

export const aboutHighlightSchema = z.object({
  icon: z.enum(["code", "server", "bot", "sparkles", "puzzle", "shield"]),
  label: z.string().trim().min(1).max(80),
});

export const aboutContentSchema = z.object({
  heading: z.string().trim().min(1, "Heading is required").max(150),
  body: z.array(z.string().trim().min(1).max(2000)).min(1, "At least one paragraph is required").max(10),
  highlights: z.array(aboutHighlightSchema).max(12),
});
export type AboutContentInput = z.infer<typeof aboutContentSchema>;

export const contactInfoSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  discordHandle: z.string().trim().max(60).optional().or(z.literal("")),
  githubUrl: z.string().trim().max(200).optional().or(z.literal("")),
  socialLinks: z.array(socialLinkSchema).max(10),
});
export type ContactInfoInput = z.infer<typeof contactInfoSchema>;

export const siteSettingsSchema = z.object({
  siteTitle: z.string().trim().min(1, "Site title is required").max(100),
  metaDescription: z.string().trim().min(1, "Meta description is required").max(300),
  footerText: z.string().trim().max(300),
  copyrightText: z.string().trim().max(200),
});
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

const hexColor = z.string().trim().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Enter a valid hex color, e.g. #00e676");

export const siteThemeSchema = z.object({
  accentPrimary: hexColor,
  accentSecondary: hexColor,
  accentGold: hexColor,
  accentOrange: hexColor,
  motionScale: z.number().min(0).max(2),
  glassIntensity: z.number().min(0).max(2),
});
export type SiteThemeInput = z.infer<typeof siteThemeSchema>;
