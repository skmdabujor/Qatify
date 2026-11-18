'use client';

// =============================================================================
// Qatify — Global Route Transition & Skeleton Loading Orchestrator
// Guarantees: Skeleton FIRST, then Page. Exactly ONCE on route changes.
// Zero flickering, zero double-skeleton, zero fake page reloads.
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  HomeSkeleton,
  ShopSkeleton,
  ProductDetailSkeleton,
  CartSkeleton,
  CheckoutSkeleton,
  DashboardSkeleton,
  PolicySkeleton,
  TrackOrderSkeleton,
  AuthSkeleton,
  ContactSkeleton,
  BundleBuilderSkeleton,
} from '@/components/ui/skeleton';
import styles from './RouteTransitionSkeleton.module.scss';

// Map any route pathname to its corresponding high-fidelity skeleton
function getSkeletonForPath(path: string): React.ReactNode {
  const cleanPath = (path.split('?')[0] || '').replace(/\/$/, '') || '/';

  if (cleanPath === '') {
    return <HomeSkeleton />;
  }
  if (cleanPath.startsWith('/products/')) {
    return <ProductDetailSkeleton />;
  }
  if (cleanPath === '/shop' || cleanPath.startsWith('/shop/')) {
    return <ShopSkeleton />;
  }
  if (cleanPath === '/cart') {
    return <CartSkeleton />;
  }
  if (cleanPath === '/checkout' || cleanPath.startsWith('/checkout/')) {
    return <CheckoutSkeleton />;
  }
  if (cleanPath === '/bundle-builder') {
    return <BundleBuilderSkeleton />;
  }
  if (cleanPath === '/bundle-cart') {
    return <CartSkeleton />;
  }
  if (cleanPath === '/dashboard' || cleanPath.startsWith('/dashboard/')) {
    return <DashboardSkeleton />;
  }
  if (
    cleanPath === '/track-order' ||
    cleanPath === '/track' ||
    cleanPath.startsWith('/track/')
  ) {
    return <TrackOrderSkeleton />;
  }
  if (cleanPath === '/contact') {
    return <ContactSkeleton />;
  }
  if (
    cleanPath === '/privacy' ||
    cleanPath === '/terms' ||
    cleanPath === '/refund-policy' ||
    cleanPath === '/shipping-policy'
  ) {
    return <PolicySkeleton />;
  }
  if (
    cleanPath === '/login' ||
    cleanPath === '/register' ||
    cleanPath === '/signup' ||
    cleanPath === '/reset-password'
  ) {
    return <AuthSkeleton />;
  }

  // Default fallback
  return <HomeSkeleton />;
}

export function RouteTransitionSkeleton({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Track the pathname that has finished its transition
  const [displayedPath, setDisplayedPath] = useState(pathname);
  // Whether we are currently showing a skeleton for a new route
  const [isTransitioning, setIsTransitioning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronous route change detection during render:
  // When Next.js commits a new pathname, enter transitioning state in the SAME render pass.
  // This guarantees that the new page's DOM NEVER paints before the skeleton!
  if (pathname !== displayedPath) {
    setDisplayedPath(pathname);
    setIsTransitioning(true);
  }

  // Transition timer: smoothly display skeleton once, then reveal the new page
  useEffect(() => {
    if (isTransitioning) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 200);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [isTransitioning, displayedPath]);

  return (
    <div className={styles.transitionWrapper}>
      {isTransitioning ? (
        <div key={`skeleton-${displayedPath}`} className={styles.skeletonWrapper}>
          {getSkeletonForPath(displayedPath)}
        </div>
      ) : (
        <div key={`page-${displayedPath}`} className={styles.pageFadeIn}>
          {children}
        </div>
      )}
    </div>
  );
}
