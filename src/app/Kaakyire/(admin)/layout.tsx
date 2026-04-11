import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  // Only check auth for pages inside Kaakyire, not necessarily for the login itself if we were on a different route.
  // But here Kaakyire/page.tsx handles its own login state currently. 
  // We want to migrate to this layout-level check.

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50/50 dark:bg-black/20">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
