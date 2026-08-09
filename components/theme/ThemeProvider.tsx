"use client";

import { useEffect } from "react";
import type { SiteThemeData } from "@/types/content";

/**
 * Overrides the @theme defaults declared in app/globals.css with the
 * admin-edited values from site_theme, applied to :root on mount. Because
 * every accent color utility in the app compiles down to
 * `var(--color-accent-*)`, this needs no changes anywhere else -- it's a
 * pure runtime override, so an admin theme edit takes effect without a
 * rebuild or redeploy.
 */
export function ThemeProvider({ theme }: { theme: SiteThemeData }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-accent-primary", theme.accentPrimary);
    root.style.setProperty("--color-accent-secondary", theme.accentSecondary);
    root.style.setProperty("--color-accent-gold", theme.accentGold);
    root.style.setProperty("--color-accent-orange", theme.accentOrange);
    root.style.setProperty("--motion-scale", String(theme.motionScale));
    root.style.setProperty("--glass-intensity", String(theme.glassIntensity));
  }, [theme]);

  return null;
}
