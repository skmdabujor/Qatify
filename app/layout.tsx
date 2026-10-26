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
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export const metadata: Metadata = {
  metadataBase: new URL('https://qatify.qa'),
  title: {
    default: 'Qatify Qatar | Best Online Shopping for Mobiles, Electronics & Gadgets',
    template: '%s | Qatify Qatar',
  },
  description:
    'Shop authentic mobile accessories, GaN fast chargers, ANC earbuds, smartwatches, and smart gadgets in Qatar at the best prices. Enjoy fast express delivery across Doha, Lusail, Al Rayyan, Al Wakrah & Cash on Delivery.',
  keywords: [
    'online shopping qatar',
    'buy electronics doha',
    'al anees qatar',
    'smartphones accessories qatar',
    'anker qatar',
    'baseus qatar',
    'green lion qatar',
    'porodo qatar',
    'best price in qatar',
    'fast charger qatar',
    'earbuds price in qatar',
    'smartwatch qatar',
  ],
  authors: [{ name: 'Qatify Qatar' }],
  openGraph: {
    title: 'Qatify Qatar | Best Online Shopping for Mobiles, Electronics & Gadgets',
    description:
      'Shop authentic mobile accessories, GaN chargers, ANC earbuds & smartwatches in Qatar. Best price guarantee with fast delivery across Doha.',
    url: 'https://qatify.qa',
    siteName: 'Qatify Qatar',
    locale: 'en_QA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qatify Qatar | Online Tech & Electronics Store',
    description:
      'Qatar’s favorite store for genuine gadgets, fast chargers, earbuds & smart accessories. Best prices & fast doorstep delivery.',
  },
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
            <WhatsAppButton phoneNumber="01875707255" />
            <main>{children}</main>
            <Footer />
            <MobileBottomNav />
          </ShopProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

