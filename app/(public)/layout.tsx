import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import { CursorGlow } from "@/components/shared/CursorGlow";
import { getHeroContent } from "@/lib/queries/hero";
import { getContactInfo } from "@/lib/queries/contact-info";
import { getSiteSettings } from "@/lib/queries/site-settings";

export const revalidate = 60;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [heroContent, contactInfo, siteSettings] = await Promise.all([
    getHeroContent(),
    getContactInfo(),
    getSiteSettings(),
  ]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-bg-primary"
      >
        Skip to main content
      </a>
      <AmbientBackground />
      <CursorGlow />
      <Navbar developerName={heroContent.name} />
      <main id="main-content">{children}</main>
      <Footer contact={contactInfo} settings={siteSettings} />
    </>
  );
}
