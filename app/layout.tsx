// =============================================================================
// Qatify — Global Root Layout (App Router)
// =============================================================================

import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider';
import { ShopProvider } from '@/context/ShopContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ToastContainer } from '@/components/ui/Toast';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Qatify — Qatar’s Direct Air Dropship Electronics & Trending Gadgets',
  description:
    'High-conversion dropshipping store tailored for Qatar. 6–10 Days Tracked Direct Air Express delivery to Doha, Lusail, Al Rayyan, Al Wakrah, and all Qatar municipalities.',
  keywords: [
    'Qatar electronics',
    'Doha dropshipping',
    'MagSafe Qatar',
    'GaN charger Doha',
    'QAR electronics',
    'smartwatch Qatar',
  ],
  authors: [{ name: 'Qatify Qatar' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConvexClientProvider>
          <ShopProvider>
            <Navbar />
            <CartDrawer />
            <ToastContainer />
            <ChatWidget />
            <main>{children}</main>
            <Footer />
            <MobileBottomNav />
          </ShopProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

