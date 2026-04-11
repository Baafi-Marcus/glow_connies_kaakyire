"use client";

import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
});

interface GlowLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function GlowLogo({ className = "", size = 'md' }: GlowLogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  return (
    <div className={`${cormorant.className} ${sizeClasses[size]} flex items-center gap-1.5 tracking-tight ${className}`}>
      <span className="font-bold italic text-[#2D1B44] dark:text-[#E0D7FF]">
        Glow
      </span>
      <span className="text-[#D4A373] dark:text-[#E6B17E] font-medium">
        by Connie
      </span>
    </div>
  );
}
