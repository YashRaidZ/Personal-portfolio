import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { heroContent, contactInfo, siteSettings } from "@/lib/queries/static-content";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-bg-primary"
      >
        Skip to main content
      </a>
      <Navbar developerName={heroContent.name} />
      <main id="main-content">{children}</main>
      <Footer contact={contactInfo} settings={siteSettings} />
    </>
  );
}
