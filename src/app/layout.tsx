import type { Metadata } from 'next';
import './globals.css';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata: Metadata = {
  title: "Glow By Connie — Pure Radiance",
  description: "Luxury beauty, perfumes, and accessories delivered in Ghana.",
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const cormorant = Cormorant_Garamond({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'], 
  variable: '--font-cormorant' 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-[#FAF9F6] dark:bg-[#121212] dark:text-gray-100 min-h-screen flex flex-col">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
