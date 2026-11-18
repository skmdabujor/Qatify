import React from 'react';
import { Skeleton } from './Skeleton';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import styles from './Skeleton.module.scss';

export function ShopSkeleton() {
  return (
    <div className={styles.homeContainer} aria-busy="true" aria-label="Loading catalog">
      {/* Catalog Header Banner */}
      <Skeleton style={{ width: '100%', height: '110px', borderRadius: '12px' }} />

      {/* Filter Chips Bar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'hidden' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} style={{ width: '100px', height: '34px', borderRadius: '9999px', flexShrink: 0 }} />
        ))}
      </div>

      {/* Product Grid */}
      <div className={styles.productCardsGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
