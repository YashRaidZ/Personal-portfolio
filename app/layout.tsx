import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/queries/site-settings";
import { getSiteTheme } from "@/lib/queries/site-theme";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Static fallback used if site_settings can't be reached (e.g. mid-outage);
// generateMetadata below overrides these with live values on every render.
const fallbackTitle = "Minecraft & Discord Developer | Custom Plugins, Bots & Web Apps";
const fallbackDescription =
  "I build high-performance Minecraft plugins, Discord bots, community automation systems, and modern web applications.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.siteTitle || fallbackTitle;
  const description = settings.metaDescription || fallbackDescription;

  return {
    title: { default: title, template: `%s | ${title}` },
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getSiteTheme();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ThemeProvider theme={theme} />
        {children}
      </body>
    </html>
  );
}
