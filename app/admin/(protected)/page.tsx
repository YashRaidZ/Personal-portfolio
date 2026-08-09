import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUnreadMessageCount } from "@/lib/queries/contact-messages";

async function getCounts() {
  const supabase = await createClient();
  const [projects, services, testimonials, media] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("testimonials").select("id", { count: "exact", head: true }),
    supabase.from("media_library").select("id", { count: "exact", head: true }),
  ]);

  return {
    projects: projects.count ?? 0,
    services: services.count ?? 0,
    testimonials: testimonials.count ?? 0,
    media: media.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const [counts, unread] = await Promise.all([getCounts(), getUnreadMessageCount()]);

  const cards = [
    { label: "Projects", value: counts.projects, href: "/admin/projects" },
    { label: "Services", value: counts.services, href: "/admin/services" },
    { label: "Testimonials", value: counts.testimonials, href: "/admin/testimonials" },
    { label: "Media files", value: counts.media, href: "/admin/media" },
    { label: "Unread messages", value: unread, href: "/admin/messages", accent: unread > 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Dashboard</h1>
      <p className="mt-1 text-sm text-text-muted">Quick overview of your site's content.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="glass-panel px-5 py-6 transition-colors hover:border-accent-primary/30"
          >
            <p
              className={
                "font-display text-3xl font-semibold " +
                (card.accent ? "text-accent-orange" : "text-accent-primary")
              }
            >
              {card.value}
            </p>
            <p className="mt-1 text-sm text-text-light">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 glass-panel px-6 py-6">
        <h2 className="font-display text-base font-semibold text-text-primary">Quick links</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {[
            ["Hero", "/admin/hero"],
            ["About", "/admin/about"],
            ["Tech Stack", "/admin/tech-stack"],
            ["Contact Info", "/admin/contact-info"],
            ["Theme", "/admin/theme"],
            ["Site Settings", "/admin/settings"],
            ["Backup & Restore", "/admin/backup"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-white/10 px-3.5 py-1.5 text-text-light transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
