"use client";

import Link from "next/link";
import { Bars3Icon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import GlowLogo from "./GlowLogo";

export default function Navbar() {
  const { setIsMenuOpen, setIsCartOpen, cart } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-[#1E1E1E]/85 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <Bars3Icon className="w-7 h-7 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
        <img src="/logo.png" alt="Glow by Connie Logo" className="h-10 w-auto rounded-full" />
        <GlowLogo size="md" className="hidden sm:flex" />
      </Link>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ShoppingBagIcon className="w-7 h-7 text-gray-700 dark:text-gray-300" />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-brand-rosegold text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#1E1E1E]">
              {cart.length}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
