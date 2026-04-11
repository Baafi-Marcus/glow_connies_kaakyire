import Link from "next/link";
import AppImage from "@/components/AppImage";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-black">
      <div className="relative w-64 h-64 mb-12">
        <AppImage 
          src="https://images.unsplash.com/photo-1594434296621-51350a696ce1?auto=format&fit=crop&q=80" 
          alt="Vintage perfume bottle"
          fill
          className="object-contain opacity-20 dark:opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
           <span className="text-[12rem] font-serif text-brand-plum/10 dark:text-brand-rosegold/10">404</span>
        </div>
      </div>
      
      <div className="space-y-6 max-w-md">
        <h1 className="text-5xl font-serif text-brand-plum dark:text-brand-rosegold italic">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light">
          It seems the beauty you&apos;re looking for has moved or does not exist. 
          Let&apos;s get you back to the collection.
        </p>
        
        <div className="pt-8">
          <Link 
            href="/" 
            className="px-10 py-5 bg-brand-plum dark:bg-brand-rosegold text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl hover:scale-105 transition-transform inline-block"
          >
            Return to Store
          </Link>
        </div>
      </div>
      
      <div className="mt-24 text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
        Glow By Connie — Pure Radiance
      </div>
    </div>
  );
}
