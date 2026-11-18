import React from 'react';
import { Skeleton } from './Skeleton';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import styles from './Skeleton.module.scss';

export function BundleBuilderSkeleton() {
  return (
    <div className={styles.bundleContainer} aria-busy="true" aria-label="Loading bundle builder">
      {/* Tier Banner */}
      <Skeleton className={styles.bundleTierBanner} />

      {/* Categories Row */}
      <div className={styles.bundleCategoriesRow}>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className={styles.bundleCatPill} />
        ))}
      </div>

      {/* Grid */}
      <div className={styles.productCardsGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
