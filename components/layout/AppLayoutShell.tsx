'use client';

// =============================================================================
// Qatify — Dynamic App Layout Shell
// Selectively hides standard e-commerce chrome (Navbar, Footer, Cart)
// during Maintenance Mode AND on the dedicated Admin Ops Console (`/dashboard?role=admin`)
// =============================================================================

import React, { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ToastContainer } from '@/components/ui/Toast';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { SubscribeNotificationBanner } from '@/components/popup/SubscribeNotificationBanner';
import { RouteTransitionSkeleton } from '@/components/layout/RouteTransitionSkeleton';

function LayoutShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMaintenance = pathname === '/maintenance';
  const role = searchParams?.get('role');
  const isAdminDashboard = pathname === '/dashboard' && role === 'admin';

  if (isMaintenance || isAdminDashboard) {
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
      <main>
        <RouteTransitionSkeleton>{children}</RouteTransitionSkeleton>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export function AppLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <>
          <ToastContainer />
          <main>
            <RouteTransitionSkeleton>{children}</RouteTransitionSkeleton>
          </main>
        </>
      }
    >
      <LayoutShellInner>{children}</LayoutShellInner>
    </Suspense>
  );
}
