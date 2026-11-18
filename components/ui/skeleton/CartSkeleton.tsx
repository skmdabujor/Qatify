import React from 'react';
import { Skeleton } from './Skeleton';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import styles from './Skeleton.module.scss';

export function CartSkeleton() {
  return (
    <div className={styles.cartContainer} aria-busy="true" aria-label="Loading shopping cart">
      {/* Page Title */}
      <Skeleton className={styles.cartHeader} />

      <div className={styles.cartLayout}>
        {/* Left Column: Cart items */}
        <div className={styles.cartLeftCol}>
          <div className={styles.cartProductsCard}>
            <Skeleton className={styles.cartCardHeader} />

            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.cartItemRow}>
                <Skeleton className={styles.cartItemThumb} />
                <div className={styles.cartItemInfo}>
                  <Skeleton className={styles.cartItemTitle} />
                  <Skeleton className={styles.cartItemBrand} />
                </div>
                <Skeleton className={styles.cartItemStepper} />
                <Skeleton className={styles.cartItemPrice} />
              </div>
            ))}
          </div>

          {/* You May Also Like Shelf */}
          <div>
            <div className={styles.sectionHeaderRow}>
              <Skeleton className={styles.sectionTitle} />
            </div>
            <div className={styles.productCardsGrid}>
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className={styles.cartSummaryCard}>
          <Skeleton className={styles.cartSummaryTitle} />
          <Skeleton className={styles.cartSummaryInput} />

          <div className={styles.cartSummaryRow}>
            <Skeleton className={styles.cartSummaryLabel} />
            <Skeleton className={styles.cartSummaryVal} />
          </div>
          <div className={styles.cartSummaryRow}>
            <Skeleton className={styles.cartSummaryLabel} />
            <Skeleton className={styles.cartSummaryVal} />
          </div>
          <div className={styles.cartSummaryRow}>
            <Skeleton className={styles.cartSummaryLabel} />
            <Skeleton className={styles.cartSummaryVal} />
          </div>

          <Skeleton className={styles.cartSummaryBtn} />
          <Skeleton className={styles.cartSummaryTrust} />
        </div>
      </div>
    </div>
  );
}
