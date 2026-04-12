"use client";

import Link from "next/link";
import { Bars3Icon, ShoppingBagIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import GlowLogo from "./GlowLogo";

export default function Navbar() {
  const { setIsMenuOpen, setIsCartOpen, isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, cart } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-[#1E1E1E]/85 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
      {!isSearchOpen && (
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <Bars3Icon className="w-7 h-7 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      )}

      {!isSearchOpen && (
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <img src="/logo.png" alt="Glow by Connie Logo" className="h-10 w-auto rounded-full" />
          <GlowLogo size="md" className="hidden sm:flex" />
        </Link>
      )}

      <div className={`flex items-center gap-2 transition-all duration-700 ${isSearchOpen ? 'w-full' : 'flex-1 justify-end'}`}>
        {isSearchOpen ? (
          <div className="flex-1 max-w-4xl mx-auto animate-in fade-in slide-in-from-right-12 duration-700">
             <div className="relative group">
                <input 
                  autoFocus
                  type="text"
                  placeholder="What can we help you find?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-full py-4 px-14 text-sm focus:outline-none focus:border-brand-rosegold transition-all font-serif italic shadow-inner"
                  onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
                />
                <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-rosegold" />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:rotate-90 transition-all shadow-sm"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-500" />
                </button>
             </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title="Search"
          >
            <MagnifyingGlassIcon className="w-7 h-7 text-gray-700 dark:text-gray-300" />
          </button>
        )}
        
        {!isSearchOpen && (
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
        )}
      </div>
    </nav>
  );
}
