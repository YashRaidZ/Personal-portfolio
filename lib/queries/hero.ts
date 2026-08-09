import { createClient } from "@/lib/supabase/server";
import type { HeroContentData, SocialLink } from "@/types/content";

const FALLBACK: HeroContentData = {
  eyebrow: "Minecraft & Discord Developer",
  name: "Your Name",
  description: "",
  primaryButtonText: "View Projects",
  primaryButtonLink: "#projects",
  secondaryButtonText: "Contact Me",
  secondaryButtonLink: "#contact",
  socialLinks: [],
};

export async function getHeroContent(): Promise<HeroContentData> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("hero_content").select("*").eq("id", 1).maybeSingle();

  if (error || !data) return FALLBACK;

  return {
    eyebrow: data.eyebrow ?? undefined,
    name: data.name,
    description: data.description,
    primaryButtonText: data.primary_button_text,
    primaryButtonLink: data.primary_button_link,
    secondaryButtonText: data.secondary_button_text,
    secondaryButtonLink: data.secondary_button_link,
    socialLinks: (data.social_links as unknown as SocialLink[]) ?? [],
  };
}
