import React from 'react';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.scss';

export function TrackOrderSkeleton() {
  return (
    <div className={styles.trackContainer} aria-busy="true" aria-label="Loading order tracking">
      <div className={styles.trackHeader}>
        <Skeleton className={styles.trackTitle} />
        <Skeleton className={styles.trackSub} />
      </div>

      <div className={styles.trackInputCard}>
        <Skeleton className={styles.trackInputBox} />
        <Skeleton className={styles.trackActionBtn} />
      </div>

      <div className={styles.trackStatusCard}>
        <div className={styles.trackStatusTop}>
          <Skeleton className={styles.trackSub} />
          <Skeleton className={styles.trackActionBtn} style={{ height: 28 }} />
        </div>
        <Skeleton className={styles.trackStepper} />
      </div>
    </div>
  );
}
