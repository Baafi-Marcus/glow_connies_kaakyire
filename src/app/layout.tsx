import type { Metadata } from 'next';
import './globals.css';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata: Metadata = {
  title: "Glow By Connie — Pure Radiance",
  description: "Luxury beauty, perfumes, and accessories delivered in Ghana.",
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
