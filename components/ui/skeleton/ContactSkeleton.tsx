import React from 'react';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.scss';

export function ContactSkeleton() {
  return (
    <div className={styles.contactContainer} aria-busy="true" aria-label="Loading contact page">
      <div className={styles.trackHeader}>
        <Skeleton className={styles.trackTitle} />
        <Skeleton className={styles.trackSub} />
      </div>

      <div className={styles.contactCardsRow}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.contactCard}>
            <Skeleton className={styles.authLogo} style={{ width: 44, height: 44, borderRadius: '50%' }} />
            <Skeleton className={styles.cardTitleLine1} />
            <Skeleton className={styles.cardTitleLine2} />
          </div>
        ))}
      </div>

      <div className={styles.contactFormCard}>
        <Skeleton className={styles.checkoutBlockTitle} />
        <Skeleton className={styles.checkoutLine} />
        <Skeleton className={styles.checkoutLine} />
        <Skeleton className={styles.checkoutLine} style={{ height: 100 }} />
        <Skeleton className={styles.cartSummaryBtn} />
      </div>
    </div>
  );
}
