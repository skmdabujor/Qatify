import React from 'react';
import { Skeleton } from './Skeleton';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import styles from './Skeleton.module.scss';

export function HomeSkeleton() {
  return (
    <div className={styles.homeContainer} aria-busy="true" aria-label="Loading homepage">
      {/* Hero Bento Banner Skeleton */}
      <div className={styles.heroBentoGrid}>
        <Skeleton className={styles.heroMain} />
        <div className={styles.heroSideCol}>
          <Skeleton className={styles.heroSideItem} />
          <Skeleton className={styles.heroSideItem} />
        </div>
      </div>

      {/* Circular Category Avatars Row */}
      <div className={styles.categoryCirclesRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className={styles.categoryCircleItem}>
            <Skeleton className={styles.categoryCircle} />
            <Skeleton className={styles.categoryLabel} />
          </div>
        ))}
      </div>

      {/* Featured Products Shelf */}
      <div>
        <div className={styles.sectionHeaderRow}>
          <Skeleton className={styles.sectionTitle} />
          <Skeleton className={styles.sectionAction} />
        </div>
        <div className={styles.productCardsGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
