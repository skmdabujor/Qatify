'use client';

// =============================================================================
// Qatify — Mobile & Tablet Bottom App Bar
// Native E-Commerce Navigation Bar for Handheld Devices (< 768px)
// =============================================================================

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Search, ShoppingBag, User } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import styles from './MobileBottomNav.module.scss';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, openCart } = useShop();

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Scroll to top and focus mobile search input if available
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mobileSearchInput = document.getElementById('mobile-catalog-search-input');
    if (mobileSearchInput) {
      setTimeout(() => mobileSearchInput.focus(), 250);
    } else {
      window.location.href = '/shop';
    }
  };

  return (
    <nav className={styles.bottomBar} aria-label="Mobile Navigation">
      <div className={styles.bottomInner}>
        {/* 1. Home */}
        <Link
          href="/"
          className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}
          aria-label="Home"
        >
          <Home size={20} className={styles.navIcon} />
          <span className={styles.navLabel}>Home</span>
        </Link>

        {/* 2. Shop / Catalog */}
        <Link
          href="/shop"
          className={`${styles.navItem} ${pathname.startsWith('/shop') ? styles.active : ''}`}
          aria-label="Shop Catalog"
        >
          <LayoutGrid size={20} className={styles.navIcon} />
          <span className={styles.navLabel}>Catalog</span>
        </Link>

        {/* 3. Search Quick Action */}
        <button
          type="button"
          onClick={handleSearchClick}
          className={styles.navItem}
          aria-label="Search Catalog"
        >
          <div className={styles.searchIconWrap}>
            <Search size={19} className={styles.navIcon} />
          </div>
          <span className={styles.navLabel}>Search</span>
        </button>

        {/* 4. Cart Drawer Trigger with Live Badge */}
        <button
          type="button"
          onClick={openCart}
          className={`${styles.navItem} ${pathname === '/cart' ? styles.active : ''}`}
          aria-label={`Open Cart with ${cartCount} items`}
        >
          <div className={styles.cartIconWrapper}>
            <ShoppingBag size={20} className={styles.navIcon} />
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </div>
          <span className={styles.navLabel}>Cart</span>
        </button>

        {/* 5. Account & Order Tracking */}
        <Link
          href="/dashboard"
          className={`${styles.navItem} ${pathname.startsWith('/dashboard') ? styles.active : ''}`}
          aria-label="Customer Account & Orders"
        >
          <User size={20} className={styles.navIcon} />
          <span className={styles.navLabel}>Account</span>
        </Link>
      </div>
    </nav>
  );
};

