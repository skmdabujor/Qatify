'use client';

// =============================================================================
// Qatify — Dynamic App Layout Shell
// Selectively hides standard e-commerce chrome (Navbar, Footer, Cart) during Maintenance Mode
// =============================================================================

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ToastContainer } from '@/components/ui/Toast';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { SubscribeNotificationBanner } from '@/components/popup/SubscribeNotificationBanner';

export function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMaintenance = pathname === '/maintenance';

  if (isMaintenance) {
    return (
      <>
        <ToastContainer />
        <main>{children}</main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <ToastContainer />
      <ChatWidget />
      <SubscribeNotificationBanner />
      <main>{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

