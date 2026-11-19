import React from 'react';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.scss';

export function DashboardSkeleton() {
  return (
    <div className={styles.dashContainer} aria-busy="true" aria-label="Loading dashboard">
      {/* Breadcrumb Navigation Skeleton (Home / Your Account / My Orders) */}
      <div className={styles.dashBreadcrumbs}>
        <Skeleton width={180} height={14} borderRadius={4} />
      </div>

      {/* Top Account Profile & Sub-Nav Card (Clean White Background, Mirroring retailAccountCard 1:1) */}
      <div className={styles.dashAccountCard}>
        {/* Profile Top Row: Avatar + Name/Location on Left, Email + Sign Out on Right */}
        <div className={styles.dashProfileTopRow}>
          <div className={styles.dashUserGroup}>
            <Skeleton className={styles.dashAvatar} />
            <div className={styles.dashUserInfo}>
              <Skeleton className={styles.dashUserName} />
              <Skeleton className={styles.dashUserMeta} />
            </div>
          </div>

          <div className={styles.dashUserActions}>
            <Skeleton className={styles.dashUserEmail} />
            <Skeleton className={styles.dashSignOutBtn} />
          </div>
        </div>

        {/* Sub-Nav Bar (Tabs: My Orders, Track Latest Package, Help & Support) */}
        <div className={styles.dashSubNavBar}>
          <Skeleton className={styles.dashSubNavActive} />
          <Skeleton className={styles.dashSubNavTab} />
          <Skeleton className={styles.dashSubNavTab} />
        </div>
      </div>

      {/* Search Orders Bar */}
      <div className={styles.dashSearchRow}>
        <Skeleton className={styles.dashSearchInput} />
      </div>

      {/* Orders List Skeleton Section */}
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
