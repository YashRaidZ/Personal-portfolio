import { Github, MessageCircle, Mail } from "lucide-react";
import type { ContactInfoData, SiteSettingsData, SocialLink } from "@/types/content";

const SOCIAL_ICON: Record<SocialLink["platform"], React.ComponentType<{ className?: string }>> = {
  github: Github,
  discord: MessageCircle,
  email: Mail,
  twitter: MessageCircle,
  youtube: MessageCircle,
};

interface FooterProps {
  contact: ContactInfoData;
  settings: SiteSettingsData;
}

export function Footer({ contact, settings }: FooterProps) {
  return (
    <footer className="border-t border-white/[0.06] bg-bg-primary">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-text-muted">{settings.copyrightText}</p>

        <div className="flex items-center gap-4">
          {contact.socialLinks.map((link) => {
            const Icon = SOCIAL_ICON[link.platform];
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                className="text-text-muted transition-colors hover:text-accent-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>

        <p className="text-xs text-text-muted">{settings.footerText}</p>
      </div>
    </footer>
  );
}
