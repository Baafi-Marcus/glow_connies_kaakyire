"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import MobileAdminHeader from "@/components/admin/MobileAdminHeader";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50/50 dark:bg-black/20">
      <MobileAdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
      
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 p-6 md:p-12 overflow-x-hidden pt-4 md:pt-12">
        {children}
      </main>
    </div>
  );
}
