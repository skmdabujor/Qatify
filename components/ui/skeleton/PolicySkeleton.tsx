import React from 'react';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.scss';

export function PolicySkeleton() {
  return (
    <div className={styles.policyContainer} aria-busy="true" aria-label="Loading policy">
      {/* Dark Hero Banner */}
      <div className={styles.policyHero}>
        <Skeleton className={styles.policyHeroTitle} />
        <Skeleton className={styles.policyHeroSub} />
      </div>

      {/* Tabs */}
      <div className={styles.policyTabsRow}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className={styles.policyTabPill} />
        ))}
      </div>

      {/* Body Grid */}
      <div className={styles.policyBody}>
        {/* Left Sidebar */}
        <div className={styles.policySidebar}>
          <div className={styles.policySidebarCard}>
            <Skeleton className={styles.policyH2} />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className={styles.policyLineMid} />
            ))}
          </div>
          <div className={styles.policySidebarCard}>
            <Skeleton className={styles.policyLineLong} />
            <Skeleton className={styles.policyLineMid} />
          </div>
        </div>

        {/* Right Content */}
        <div className={styles.policyArticle}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={styles.policySectionItem}>
              <Skeleton className={styles.policyH2} />
              <Skeleton className={styles.policyLineLong} />
              <Skeleton className={styles.policyLineMid} />
              <Skeleton className={styles.policyLineShort} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
