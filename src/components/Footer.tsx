"use client";

import Link from "next/link";
import GlowLogo from "./GlowLogo";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1E1E1E] pt-24 pb-12 px-6 border-t border-gray-100 dark:border-gray-800 w-full mt-auto">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6 text-center md:text-left">
            <Link href="/" className="inline-block">
              <GlowLogo size="lg" />
            </Link>
            <p className="text-gray-500 font-light text-sm max-w-xs mx-auto md:mx-0 leading-relaxed text-center md:text-left">
              Handpicked global beauty brands delivered with elegance to your doorstep anywhere in Ghana.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
               <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-rosegold transition-colors cursor-pointer group">
                  <img src="https://img.icons8.com/ios-filled/50/instagram-new.png" className="w-5 opacity-40 group-hover:opacity-100 transition-opacity" alt="Instagram" />
               </div>
               <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-rosegold transition-colors cursor-pointer group">
                  <img src="https://img.icons8.com/ios-filled/50/tiktok.png" className="w-5 opacity-40 group-hover:opacity-100 transition-opacity" alt="TikTok" />
               </div>
            </div>
          </div>

          {/* Links Column */}
          <div className="space-y-6 text-center md:text-left">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Shop Collection</h4>
             <ul className="space-y-4 text-sm font-bold text-gray-600 dark:text-gray-400">
                <li><Link href="/products?category=Perfumes" className="hover:text-brand-rosegold transition-colors">Perfumes</Link></li>
                <li><Link href="/products?category=Accessories" className="hover:text-brand-rosegold transition-colors">Accessories</Link></li>
                <li><Link href="/products?category=Beauty" className="hover:text-brand-rosegold transition-colors">Cosmetics</Link></li>
                <li><Link href="/products" className="hover:text-brand-rosegold transition-colors">Full Catalog</Link></li>
             </ul>
          </div>

          {/* Delivery Column */}
          <div className="space-y-6 text-center md:text-left">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Delivery Areas</h4>
             <ul className="space-y-4 text-sm font-light text-gray-500 dark:text-gray-400">
                <li>Accra & Greater Accra</li>
                <li>Kumasi & Ashanti</li>
                <li>Takoradi & Western</li>
                <li>Cape Coast & Central</li>
                <li>Koforidua & Eastern</li>
             </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 text-center md:text-left">Direct Support</h4>
             <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl space-y-4 text-center md:text-left">
                <p className="text-xs text-gray-500 font-light">Have a question? Chat with our experts instantly.</p>
                <button 
                  onClick={() => window.open(`https://wa.me/233246702043`, '_blank')} 
                  className="w-full flex items-center justify-center md:justify-start gap-2 text-whatsapp font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  <CheckBadgeIcon className="w-5 h-5 flex-shrink-0" /> Start Chatting
                </button>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-50 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic text-center md:text-left">
             © {new Date().getFullYear()} GLOW BY CONNIE — PURE RADIANCE
           </p>
           <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <Link href="/privacy" className="hover:text-brand-plum transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-brand-plum transition-colors">Terms</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
