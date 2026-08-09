import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { getUnreadMessageCount } from "@/lib/queries/contact-messages";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already redirects unauthenticated
  // requests away from /admin/*, this is the Server Component's own check.
  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const unreadCount = await getUnreadMessageCount();

  return (
    <AdminShell email={user.email ?? ""} unreadCount={unreadCount}>
      {children}
    </AdminShell>
  );
}
