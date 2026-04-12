"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import GlowLogo from "@/components/GlowLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileAdminHeaderProps {
  onMenuClick: () => void;
}

export default function MobileAdminHeader({ onMenuClick }: MobileAdminHeaderProps) {
  const pathname = usePathname();
  
  // Get clear title from pathname
  const getTitle = () => {
    if (pathname === "/Kaakyire") return "Overview";
    if (pathname.includes("/products")) return "Products";
    if (pathname.includes("/orders")) return "Orders";
    if (pathname.includes("/settings")) return "Settings";
    return "Management";
  };

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors text-brand-plum dark:text-brand-rosegold"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100">{getTitle()}</h1>
      </div>

      <Link href="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Glow" className="w-8 h-8 rounded-full" />
      </Link>
    </header>
  );
}
