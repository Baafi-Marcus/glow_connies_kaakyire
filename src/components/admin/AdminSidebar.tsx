"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChartBarIcon, 
  Square3Stack3DIcon, 
  ShoppingBagIcon, 
  ArrowLeftOnRectangleIcon,
  HomeIcon
} from "@heroicons/react/24/outline";
import GlowLogo from "@/components/GlowLogo";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/Kaakyire", icon: ChartBarIcon },
    { name: "Products", href: "/Kaakyire/products", icon: Square3Stack3DIcon },
    { name: "Orders", href: "/Kaakyire/orders", icon: ShoppingBagIcon },
    { name: "Settings", href: "/Kaakyire/settings", icon: ChartBarIcon },
  ];

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/Kaakyire';
  };

  return (
    <aside className="w-full md:w-72 bg-white dark:bg-[#1E1E1E] border-r border-gray-100 dark:border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <Link href="/" className="flex flex-col gap-1 group" onClick={() => {}}>
          <GlowLogo size="lg" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-plum/40 dark:text-brand-rosegold/40 pl-1">Management Portal</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-4 mb-4">Management</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-brand-plum text-white shadow-xl shadow-brand-plum/20 translate-x-1' 
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-plum dark:hover:text-brand-rosegold'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-bold tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-50 dark:border-gray-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-tight">System Logout</span>
        </button>
      </div>
    </aside>
  );
}
