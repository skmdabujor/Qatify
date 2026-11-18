import React from 'react';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.scss';

export function DashboardSkeleton() {
  return (
    <div className={styles.dashContainer} aria-busy="true" aria-label="Loading dashboard">
      {/* User Welcome Banner */}
      <div className={styles.dashBanner}>
        <Skeleton className={styles.dashAvatar} />
        <div className={styles.dashUserInfo}>
          <Skeleton className={styles.dashUserName} />
          <Skeleton className={styles.dashUserMeta} />
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.dashTabsBar}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className={styles.dashTab} />
        ))}
      </div>

      {/* Stats Grid */}
      <div className={styles.dashStatsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.dashStatCard}>
            <Skeleton className={styles.dashStatNum} />
            <Skeleton className={styles.dashStatLabel} />
          </div>
        ))}
      </div>

      {/* Orders Section */}
      <div className={styles.dashOrdersCard}>
        <div className={styles.dashOrderHeader}>
          <Skeleton className={styles.dashUserName} />
          <Skeleton className={styles.dashStatLabel} />
        </div>

        {[1, 2].map((i) => (
          <div key={i} className={styles.dashOrderItem}>
            <div className={styles.dashOrderTop}>
              <Skeleton className={styles.dashStatLabel} />
              <Skeleton className={styles.dashStatNum} />
            </div>
            <Skeleton className={styles.dashTimeline} />
          </div>
        ))}
      </div>
    </div>
  );
}
