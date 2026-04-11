"use client";

import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import GlowLogo from "./GlowLogo";

export default function NavDrawer() {
  const { isMenuOpen, setIsMenuOpen } = useCart();

  const links = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Perfumes", href: "/products?category=Perfumes" },
    { name: "Accessories", href: "/products?category=Accessories" },
    { name: "Beauty", href: "/products?category=Beauty" },
  ];

  if (!isMenuOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={() => setIsMenuOpen(false)}
      />
      <div className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white dark:bg-[#1E1E1E] z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <img src="/logo.png" alt="Glow Logo" className="w-8 h-8 rounded-full" />
            <GlowLogo size="md" />
          </Link>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block py-4 text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-brand-rosegold transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <button 
            className="w-full bg-[#25D366] hover:bg-[#1ebd5c] text-white font-semibold py-4 rounded-xl shadow-md transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            onClick={() => window.open(`https://wa.me/233246702043`, '_blank')}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/></svg>
            Chat on WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}
