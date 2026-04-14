"use client";

import { usePathname } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import NavDrawer from '@/components/NavDrawer';
import CartDrawer from '@/components/CartDrawer';
import SearchDropdown from '@/components/SearchDropdown';
import Footer from '@/components/Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/Kaakyire');

  return (
    <CartProvider>
      {!isAdminPage && (
        <>
          <Navbar />
          <NavDrawer />
          <CartDrawer />
          <SearchDropdown />
        </>
      )}
      
      <main className={`flex-1 w-full ${isAdminPage || pathname === '/' ? 'max-w-none' : 'max-w-7xl mx-auto px-6 py-8'}`}>
        {children}
      </main>
      
      {!isAdminPage && <Footer />}
    </CartProvider>
  );
}
