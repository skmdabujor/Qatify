import React from 'react';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.scss';

export function ProductDetailSkeleton() {
  return (
    <div className={styles.detailContainer} aria-busy="true" aria-label="Loading product details">
      {/* Breadcrumb line */}
      <Skeleton className={styles.detailBreadcrumb} />

      <div className={styles.detailGrid}>
        {/* Left: Gallery Column */}
        <div className={styles.detailGalleryColumn}>
          <div className={styles.detailMainImage}>
            <Skeleton style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          </div>
          <div className={styles.detailThumbnailsRow}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className={styles.detailThumbnailItem} />
            ))}
          </div>
        </div>

        {/* Right: Info Column */}
        <div className={styles.detailInfoColumn}>
          <Skeleton className={styles.detailBrandPill} />
          <Skeleton className={styles.detailTitle1} />
          <Skeleton className={styles.detailTitle2} />

          <div className={styles.detailRatingRow}>
            <Skeleton className={styles.detailStars} />
            <Skeleton className={styles.detailReviews} />
          </div>

          <Skeleton className={styles.detailPriceBox} />
          <Skeleton className={styles.detailAirExpressPill} />

          <div className={styles.detailActionsRow}>
            <Skeleton className={styles.detailButton} />
            <Skeleton className={styles.detailButton} />
          </div>

          <div className={styles.detailTrustGrid}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className={styles.detailTrustItem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
