-- ============================================================================
-- seed.sql
-- Mirrors lib/queries/static-content.ts (the Phase 1 placeholder content) so
-- the live site shows real-shaped content immediately after you apply
-- migrations, instead of empty sections. Edit freely here, or just edit it
-- all through the admin panel afterwards -- this file only runs once
-- against a fresh database (`supabase db reset` / initial `db push` + this
-- file), it is not re-applied automatically on every deploy.
--
-- Run after all migrations in supabase/migrations/ have been applied.
-- ============================================================================

update public.hero_content set
  eyebrow = 'Minecraft & Discord Developer',
  name = 'Your Name',
  description = 'I build high-performance Minecraft plugins, Discord bots, community automation systems, and modern web applications.',
  primary_button_text = 'View Projects',
  primary_button_link = '#projects',
  secondary_button_text = 'Contact Me',
  secondary_button_link = '#contact',
  social_links = '[
    {"platform": "github", "url": "https://github.com"},
    {"platform": "discord", "url": "https://discord.com"},
    {"platform": "email", "url": "mailto:hello@example.com"}
  ]'::jsonb
where id = 1;

update public.about_content set
  heading = 'Building the systems behind great communities',
  body = array[
    'I design and build backend systems, Minecraft plugins, and Discord bots for server owners and community founders who need software that holds up under real traffic — not just a demo.',
    'My work spans custom game mechanics, moderation and automation tooling, and the web dashboards that tie a community''s tools together. I lean on AI-assisted workflows to move faster without cutting corners on architecture.',
    'Every project starts with the same question: what does this need to do reliably at 2am with no one watching? That''s the standard I build to.'
  ],
  highlights = '[
    {"icon": "server", "label": "Backend & database architecture"},
    {"icon": "bot", "label": "Discord bot & automation development"},
    {"icon": "puzzle", "label": "Custom Minecraft plugin mechanics"},
    {"icon": "sparkles", "label": "AI-assisted development workflows"},
    {"icon": "shield", "label": "Secure, production-grade systems"},
    {"icon": "code", "label": "Modern web application development"}
  ]'::jsonb
where id = 1;

update public.contact_info set
  email = 'hello@example.com',
  discord_handle = 'yourname',
  github_url = 'https://github.com',
  social_links = '[
    {"platform": "github", "url": "https://github.com"},
    {"platform": "discord", "url": "https://discord.com"}
  ]'::jsonb
where id = 1;

update public.site_settings set
  site_title = 'Minecraft & Discord Developer',
  meta_description = 'I build high-performance Minecraft plugins, Discord bots, community automation systems, and modern web applications.',
  footer_text = 'Built with Next.js, Supabase, and a lot of late-night compiling.',
  copyright_text = '© ' || extract(year from now())::text || ' Your Name. All rights reserved.'
where id = 1;

insert into public.services (category, title, description, features, display_order) values
  ('minecraft', 'Minecraft Plugin Development', 'Custom server-side plugins built for performance and long-term maintainability.',
    array['Paper, Bukkit, Spigot & Velocity', 'Custom game mechanics', 'Database integration', 'Performance optimization'], 0),
  ('discord', 'Discord Bot Development', 'Bots that handle moderation, onboarding, and engagement without babysitting.',
    array['Discord.js & slash commands', 'Moderation & tickets', 'Verification & reaction roles', 'Dashboard integration & analytics'], 1),
  ('web', 'Web Development', 'Landing pages, dashboards, and community sites backed by real APIs.',
    array['Landing pages & dashboards', 'Community websites', 'REST APIs & authentication', 'Database integration'], 2),
  ('automation', 'Automation & AI Workflows', 'Connecting the tools your community already uses so nothing needs manual upkeep.',
    array['AI-assisted workflows', 'Community automation', 'Backend systems', 'Third-party integrations'], 3);

insert into public.projects (slug, title, description, technologies, features, access, is_featured, display_order) values
  ('induschat', 'IndusChat', 'A real-time community chat platform with role-based moderation and presence tracking.',
    array['Next.js', 'Supabase', 'TypeScript', 'Tailwind CSS'],
    array['Real-time messaging', 'Role-based permissions', 'Moderation tooling'],
    'paid', true, 0),
  ('indusbot', 'IndusBot', 'A modular Discord bot for community moderation, verification, and ticketing.',
    array['Discord.js', 'Node.js', 'PostgreSQL'],
    array['Verification flow', 'Ticket system', 'Slash commands'],
    'private', true, 1),
  ('indusstore', 'IndusStore', 'A storefront and licensing system for selling Minecraft plugins directly to server owners.',
    array['Next.js', 'Stripe', 'Supabase'],
    array['License key delivery', 'Plugin versioning', 'Customer dashboard'],
    'paid', false, 2);

do $$
declare
  cat_languages uuid;
  cat_minecraft uuid;
  cat_backend uuid;
  cat_frontend uuid;
  cat_tools uuid;
begin
  insert into public.tech_categories (name, display_order) values ('Languages', 0) returning id into cat_languages;
  insert into public.tech_categories (name, display_order) values ('Minecraft', 1) returning id into cat_minecraft;
  insert into public.tech_categories (name, display_order) values ('Backend', 2) returning id into cat_backend;
  insert into public.tech_categories (name, display_order) values ('Frontend', 3) returning id into cat_frontend;
  insert into public.tech_categories (name, display_order) values ('Tools', 4) returning id into cat_tools;

  insert into public.tech_items (category_id, name, display_order) values
    (cat_languages, 'Java', 0), (cat_languages, 'TypeScript', 1), (cat_languages, 'JavaScript', 2), (cat_languages, 'SQL', 3),
    (cat_minecraft, 'Paper API', 0), (cat_minecraft, 'Bukkit', 1), (cat_minecraft, 'Spigot', 2), (cat_minecraft, 'Velocity', 3),
    (cat_backend, 'Node.js', 0), (cat_backend, 'Express', 1), (cat_backend, 'Supabase', 2), (cat_backend, 'PostgreSQL', 3),
    (cat_frontend, 'React', 0), (cat_frontend, 'Next.js', 1), (cat_frontend, 'Tailwind CSS', 2), (cat_frontend, 'Framer Motion', 3),
    (cat_tools, 'Git', 0), (cat_tools, 'GitHub', 1), (cat_tools, 'Docker', 2), (cat_tools, 'Cloudflare', 3), (cat_tools, 'Vercel', 4);
end $$;

-- testimonials intentionally left empty -- the section hides itself until
-- real testimonials are added through the admin panel, same as Phase 1.

-- ----------------------------------------------------------------------------
-- Admin bootstrap (do this part yourself, in order):
--   1. Create your Supabase Auth user (dashboard: Authentication > Users >
--      Add user, or `supabase auth` CLI). Disable public sign-ups in
--      Authentication > Settings so admin_users stays the only path in.
--   2. Copy that user's UID and run:
--        insert into public.admin_users (user_id) values ('<your-auth-uid>');
--   3. Log in at /admin/login with that account.
-- ----------------------------------------------------------------------------
