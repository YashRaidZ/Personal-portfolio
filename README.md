# Minecraft & Discord Developer — Portfolio + CMS

A premium, dark-glassmorphism portfolio for a Minecraft plugin / Discord bot /
backend developer, with a full admin CMS.

## Status: Phase 2 complete — Backend & Admin Panel

Every section of the public site is now backed by Supabase, editable end to
end through `/admin`: Hero, About, Services, Projects (with `access` badges,
drag-reorder, featured/publish toggles), Tech Stack (categories + items),
Testimonials (auto-hides when empty), Contact Info, Site Settings, Theme
(live CSS-variable preview), Media Library (Sharp-compressed uploads via
Supabase Storage), a Contact Messages inbox, and Backup & Restore (JSON
export/import). The public Contact form now writes to `contact_messages` for
real, with a honeypot and a DB-level rate limit.

`process_steps` and `stats` are intentionally still static/code-defined —
see "What's next" below.

## Getting started

Requirements: **Node.js 20+**, a Supabase project.

```bash
npm install
```

### 1. Apply the database migrations

This project's SQL migrations live in `supabase/migrations/` as plain
sequential `.sql` files — nothing here was applied via an MCP tool or any
automated agent. Apply them yourself, in order, via the Supabase CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

...or paste each file's contents into the Supabase SQL Editor in order
(`0001_...` through `0014_...`) if you'd rather not use the CLI.

### 2. Seed initial content (optional but recommended)

`supabase/seed.sql` mirrors the previous static placeholder content, so the
site isn't blank the moment migrations are applied. Run it once, after all
migrations:

```bash
psql "$(supabase db show-connection-string --project-ref <your-project-ref>)" -f supabase/seed.sql
```

...or paste its contents into the SQL Editor. Edit it first if you'd rather
seed your own real content.

### 3. Create your admin account

1. In the Supabase dashboard: **Authentication → Users → Add user** (or use
   `supabase auth`). Note the user's UID.
2. In **Authentication → Settings**, disable public sign-ups — this project
   is single-admin.
3. In the SQL Editor:
   ```sql
   insert into public.admin_users (user_id) values ('<the-uid-from-step-1>');
   ```

### 4. Environment variables

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
your Supabase project settings. `SUPABASE_SERVICE_ROLE_KEY` and
`SUPABASE_PROJECT_ID` are only used by the local `npm run db:types` script,
never by the running app — the app authenticates purely via the anon key +
RLS, on purpose (see "Security model" below).

### 5. Regenerate database types (recommended)

`types/database.ts` in this delivery was hand-written to match the
migrations, since this sandbox has no network access to your live project.
Once your project is set up, regenerate it for real:

```bash
npm run db:types
```

### 6. Run it

```bash
npm run dev
```

Public site: [http://localhost:3000](http://localhost:3000)
Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Security model

- **RLS is the real boundary**, not app-level checks. Every table has Row
  Level Security enabled; `anon` gets read-only access to published content,
  and all writes require `is_admin()` to return true.
- **`is_admin()`** checks membership in `admin_users` — a tiny table holding
  your one auth UID — rather than trusting "any authenticated user." This
  means an accidental extra Supabase Auth sign-up (if you ever re-enable
  them) can't gain write access.
- **No service role key in the running app.** Server Actions and Server
  Components use the anon key + the signed-in admin's session; RLS does the
  authorizing. The service role key exists only for local CLI use
  (`db:types`).
- **Audit logging happens at the database layer** — `AFTER INSERT/UPDATE/
  DELETE` triggers write to `audit_log` automatically, so it can't be
  skipped by a Server Action and can't be tampered with from the app (the
  table has no app-facing insert/update/delete policy at all).
- **Contact form rate limiting is also DB-level**: `anon` has `INSERT`-only
  access to `contact_messages` (no `SELECT`), so a `BEFORE INSERT` trigger
  (running `SECURITY DEFINER`) checks recent-submission counts server-side,
  where it can't be bypassed by calling the Server Action directly.

## Project structure

```
app/
  (public)/            # Public site: layout, home page (live Supabase queries)
  admin/
    login/              # Admin sign-in
    (protected)/        # Everything behind auth: dashboard + one folder per
                          # content domain, each with a page.tsx (Server
                          # Component data fetch) + a *Manager/*Form client
                          # component (Server Action calls)
  layout.tsx             # Root layout, fonts, live metadata, <ThemeProvider>
  globals.css            # Design token system (Tailwind v4 @theme)

components/
  sections/               # One component per homepage section (unchanged
                            # from Phase 1 — still take typed props only)
  shared/                 # Navbar, Footer, SectionWrapper, SectionHeading
  admin/                   # Admin-only building blocks: AdminShell, Dialog,
                            # ConfirmDeleteButton, SortableList (dnd-kit),
                            # MediaPickerField, FormFields
  theme/ThemeProvider.tsx  # Applies site_theme as CSS vars on :root

lib/
  supabase/               # client.ts (browser), server.ts (RSC/Actions),
                            # middleware.ts (session refresh + route guard)
  queries/                 # Live Supabase reads, mapped to the same
                            # camelCase shapes components already expected
  actions/                  # Server Actions: one module per content domain,
                              # plus _guard.ts (admin auth helper), auth.ts,
                              # contact-form.ts, media.ts, backup.ts
  validations/               # zod schemas, shared by client forms + actions
  hooks/useServerAction.ts    # Client hook: pending/error/success around a
                                # Server Action call

types/
  content.ts               # Content shapes (unchanged contract Phase 1 set)
  database.ts               # Hand-written Database type — regenerate with
                              # `npm run db:types` once your project is live

supabase/
  migrations/                # 0001–0014, sequential, apply via CLI/dashboard
  seed.sql                    # Mirrors the old static content for a
                                # non-empty first run
```

## What's next

- **Phase 3** — Live GitHub stats (wiring `stats` to the GitHub API),
  visitor analytics, caching, performance passes.
- **Phase 4** — Final polish & production readiness.
