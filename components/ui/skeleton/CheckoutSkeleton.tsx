import React from 'react';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.scss';

export function CheckoutSkeleton() {
  return (
    <div className={styles.checkoutContainer} aria-busy="true" aria-label="Loading checkout">
      <Skeleton className={styles.checkoutHeader} />

      <div className={styles.checkoutLayout}>
        {/* Left Column: Forms */}
        <div className={styles.checkoutLeftCol}>
          {/* Shipping Address */}
          <div className={styles.checkoutBlock}>
            <Skeleton className={styles.checkoutBlockTitle} />
            <Skeleton className={styles.checkoutLine} />
            <Skeleton className={styles.checkoutLine} />
          </div>

          {/* Shipping Method */}
          <div className={styles.checkoutBlock}>
            <Skeleton className={styles.checkoutBlockTitle} />
            <Skeleton className={styles.checkoutLine} />
          </div>

          {/* Payment Method */}
          <div className={styles.checkoutBlock}>
            <Skeleton className={styles.checkoutBlockTitle} />
            <Skeleton className={styles.checkoutLine} />
            <Skeleton className={styles.checkoutLine} />
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className={styles.checkoutSummaryCard}>
          <Skeleton className={styles.checkoutBlockTitle} />
          <Skeleton className={styles.checkoutLine} />
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
