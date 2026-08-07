# Minecraft & Discord Developer — Portfolio + CMS

A premium, dark-glassmorphism portfolio for a Minecraft plugin / Discord bot /
backend developer, with a full admin CMS to follow in Phase 2.

## Status: Phase 1 complete — Foundation & Public Website

Every public section is built and running on static placeholder content:
Hero (animated Canvas2D day/night biome scene), About, Services, Featured
Projects, Tech Stack, Development Process, Statistics, Testimonials
(auto-hidden — currently empty), Contact form (client-side validated), and
Footer.

## Getting started

Requirements: **Node.js 20+**

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local`. Nothing is required to run Phase 1 —
Supabase variables are only needed starting in Phase 2, once the backend and
admin panel are wired in.

```bash
cp .env.example .env.local
```

## Project structure

```
app/
  (public)/        # Public site: layout, home page
  (admin)/          # Admin panel (Phase 2)
  api/               # Route handlers (Phase 2/3)
  layout.tsx         # Root layout, fonts, global metadata
  globals.css        # Design token system (Tailwind v4 @theme)
  sitemap.ts, robots.ts

components/
  hero/              # Canvas biome scene, illustration, hero content
  sections/          # One component per homepage section
  shared/            # Navbar, Footer, SectionWrapper, SectionHeading
  admin/             # Admin-only components (Phase 2)
  ui/                # Low-level UI primitives

lib/
  queries/           # Content fetchers — static-content.ts today,
                      # swapped for live Supabase queries in Phase 2
                      # with zero changes to consuming components
  validations/        # zod schemas (shared client + server)
  supabase/, actions/ # Added in Phase 2

types/
  content.ts          # Content shapes mirroring the future DB schema

supabase/
  migrations/          # SQL migrations, added in Phase 2
```

## Design tokens

All colors, fonts, and radii live as CSS custom properties in
`app/globals.css` under `@theme`. In Phase 2, the admin's Theme Settings
page overrides a subset of these (accent colors, overlay opacity, animation
intensity, glass intensity) at runtime via a `<ThemeProvider>`, so changes
apply without a rebuild.

## What's next

- **Phase 2** — Supabase schema + RLS, auth, Server Actions, full admin CRUD
  for every section, media library, contact inbox, theme/site settings,
  backup & restore.
- **Phase 3** — Live GitHub stats, visitor analytics, caching, performance
  and security hardening.
- **Phase 4** — Final polish, cross-browser/responsive QA, Lighthouse 95+
  pass, deployment.

## Notes

- No Minecraft GUI elements, dirt-block buttons, or Mojang artwork are used
  anywhere — the Minecraft identity comes through atmosphere (the hero
  biome scene, terminology, iconography) rather than literal UI reuse.
- No fabricated statistics: the Stats section only renders values that are
  actually available and hides the rest gracefully (see
  `lib/queries/static-content.ts`).
