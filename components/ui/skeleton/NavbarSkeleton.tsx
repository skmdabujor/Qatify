import React from 'react';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.scss';

export function NavbarSkeleton() {
  return (
    <header className={styles.navSkeletonHeader} aria-busy="true" aria-label="Loading navigation">
      {/* 1. TOP UTILITY BAR (Dark Slate Charcoal #262930) */}
      <div className={styles.navTopUtilityBar}>
        <div className={styles.navContainer}>
          <div className={styles.navTopUtilityInner}>
            {/* Left: Language, Currency, Track Order */}
            <div className={styles.navTopUtilityLeft}>
              <Skeleton className={styles.navDarkPillSm} />
              <Skeleton className={styles.navDarkPillMd} />
              <span className={styles.navDarkDivider}>|</span>
              <Skeleton className={styles.navDarkPillLg} />
            </div>

            {/* Right: Admin Badge & User Auth Greeting */}
            <div className={styles.navTopUtilityRight}>
              <Skeleton className={styles.navDarkAdminBadge} />
              <span className={styles.navDarkDivider}>|</span>
              <Skeleton className={styles.navDarkAuthPill} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR (White #ffffff) */}
      <div className={styles.navMainBar}>
        <div className={styles.navContainer}>
          <div className={styles.navMainInner}>
            {/* Mobile Hamburger Toggle Placeholder */}
            <div className={styles.navMobileToggle}>
              <Skeleton width={24} height={18} borderRadius={3} />
            </div>

            {/* Brand Logo Placeholder */}
            <div className={styles.navLogoWrap}>
              <Skeleton className={styles.navLogo} />
            </div>

            {/* Wide Search Bar Placeholder (Desktop) */}
            <div className={styles.navSearchBox}>
              <div className={styles.navSearchInputWrapper}>
                <Skeleton className={styles.navSearchInput} />
                <Skeleton className={styles.navSearchBtn} />
              </div>
            </div>

            {/* Shopping Cart Widget Placeholder */}
            <div className={styles.navCartWidget}>
              <Skeleton className={styles.navCartIcon} />
              <div className={styles.navCartTextCol}>
                <Skeleton className={styles.navCartLabel} />
                <Skeleton className={styles.navCartPrice} />
              </div>
            </div>
          </div>

          {/* Dedicated Mobile & Tablet Quick Search Bar (< 768px) */}
          <div className={styles.navMobileSearchRow}>
            <Skeleton className={styles.navMobileSearchInput} />
          </div>
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION STRIP */}
      <nav className={styles.navCategoryStrip}>
        <div className={styles.navContainer}>
          <div className={styles.navCategoryInner}>
            {/* "All Categories" Button Placeholder */}
            <div className={styles.navAllCatBtn}>
              <Skeleton className={styles.navAllCatPill} />
            </div>

            {/* Category Quick Links Strip (10 Items) */}
            <div className={styles.navLinksRow}>
              {[
                { w: 110 },
                { w: 85 },
                { w: 90 },
                { w: 70 },
                { w: 85 },
                { w: 80 },
                { w: 75 },
                { w: 75 },
                { w: 80 },
                { w: 75 },
              ].map((item, idx) => (
                <Skeleton
                  key={idx}
                  style={{ width: `${item.w}px` }}
                  className={styles.navCatLink}
                />
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
