"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  UserCircle,
  Briefcase,
  FolderGit2,
  Layers,
  MessageSquareQuote,
  Mail,
  Image as ImageIcon,
  Settings,
  Palette,
  DatabaseBackup,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/hero", label: "Hero", icon: Sparkles },
  { href: "/admin/about", label: "About", icon: UserCircle },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/tech-stack", label: "Tech Stack", icon: Layers },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/contact-info", label: "Contact Info", icon: Mail },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/theme", label: "Theme", icon: Palette },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/backup", label: "Backup & Restore", icon: DatabaseBackup },
];

export function AdminShell({
  email,
  unreadCount,
  children,
}: {
  email: string;
  unreadCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-bg-secondary/60 p-4 lg:flex lg:flex-col">
          <div className="mb-6 px-2">
            <p className="font-display text-sm font-semibold text-text-primary">Admin Panel</p>
            <p className="truncate text-xs text-text-muted">{email}</p>
          </div>

          <nav className="flex-1 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-accent-primary/10 text-accent-primary"
                      : "text-text-light hover:bg-white/5 hover:text-text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.href === "/admin/messages" && unreadCount > 0 && (
                    <span className="ml-auto rounded-full bg-accent-orange px-1.5 py-0.5 text-[10px] font-semibold text-bg-primary">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 space-y-1 border-t border-white/5 pt-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-light transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <ExternalLink className="h-4 w-4" />
              View site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-text-light transition-colors hover:bg-white/5 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </form>
          </div>
        </aside>

        <main className="flex-1 overflow-x-hidden p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
