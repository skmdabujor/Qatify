import React from 'react';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.scss';

export function AuthSkeleton() {
  return (
    <div className={styles.authContainer} aria-busy="true" aria-label="Loading authentication">
      <div className={styles.authCard}>
        <Skeleton className={styles.authLogo} />
        <Skeleton className={styles.authTitle} />
        <Skeleton className={styles.authSub} />
        <Skeleton className={styles.authInput} />
        <Skeleton className={styles.authInput} />
        <Skeleton className={styles.authBtn} />
        <Skeleton className={styles.authSub} style={{ width: 140 }} />
      </div>
    </div>
  );
}
