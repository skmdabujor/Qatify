'use client';

// =============================================================================
// Qatify — Responsive 1-Line Circular Category Navigation Component
// Single full-width horizontal ribbon tailored for Qatar tech e-commerce
// Strictly electric / electronic gadgets & tech essentials
// =============================================================================

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Sparkles,
  Smartphone,
  Tablet,
  Headphones,
  Watch,
  Volume2,
  BatteryCharging,
  Camera,
  Laptop,
  Gamepad2,
  Home,
  Zap,
} from 'lucide-react';
import { CIRCULAR_CATEGORIES, CircularCategory } from './categoryData';
import styles from './CircularCategoryNav.module.scss';

export type { CircularCategory };
export interface CircularCategoryNavProps {
  categories?: CircularCategory[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
  showNavButtons?: boolean;
  showHeader?: boolean;
  className?: string;
}

// Resilient fallback icon mapper for electric products
const renderElectricFallbackIcon = (iconName?: string) => {
  const iconProps = { size: 30, strokeWidth: 1.8 };
  switch (iconName) {
    case 'Smartphone':
      return <Smartphone {...iconProps} />;
    case 'Laptop':
      return <Laptop {...iconProps} />;
    case 'Watch':
      return <Watch {...iconProps} />;
    case 'Headphones':
      return <Headphones {...iconProps} />;
    case 'Gamepad2':
      return <Gamepad2 {...iconProps} />;
    case 'Volume2':
      return <Volume2 {...iconProps} />;
    case 'Tablet':
      return <Tablet {...iconProps} />;
    case 'BatteryCharging':
      return <BatteryCharging {...iconProps} />;
    case 'Home':
      return <Home {...iconProps} />;
    case 'Camera':
      return <Camera {...iconProps} />;
    case 'Zap':
      return <Zap {...iconProps} />;
    case 'ChevronsRight':
      return <ChevronsRight size={22} strokeWidth={3} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};

export const CircularCategoryNav: React.FC<CircularCategoryNavProps> = ({
  categories = CIRCULAR_CATEGORIES,
  title,
  subtitle,
  viewAllHref = '/shop',
  viewAllText = 'View All Categories',
  showNavButtons = true,
  showHeader,
  className = '',
}) => {
  const shouldShowHeader = showHeader ?? Boolean(title);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const checkScrollability = useCallback(() => {
    const track = scrollTrackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return;

    checkScrollability();
    track.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    return () => {
      track.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability, categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    const track = scrollTrackRef.current;
    if (!track) return;
    const scrollAmount = track.clientWidth * 0.6;
    track.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const getRingClass = (ringVariant?: string) => {
    switch (ringVariant) {
      case 'gold':
        return styles.ringGold;
      case 'green':
        return styles.ringGreen;
      case 'red':
      default:
        return styles.ringRed;
    }
  };

  const getBadgeClass = (badgeVariant?: string) => {
    switch (badgeVariant) {
      case 'yellow':
        return styles.badgeYellow;
      case 'green':
        return styles.badgeGreen;
      case 'gold':
        return styles.badgeGold;
      case 'red':
      default:
        return styles.badgeRed;
    }
  };

  const renderCategoryItem = (item: CircularCategory) => {
    const isImageBroken = failedImages[item.id] || !item.image;

    return (
      <Link
        key={item.id}
        href={item.href}
        className={styles.categoryCard}
        aria-label={item.name}
      >
        <div className={`${styles.circleWrapper} ${getRingClass(item.ringVariant)}`}>
          {item.isMoreButton ? (
            <div className={styles.moreCategoriesCircle}>
              <div className={styles.moreRedIconPill}>
                <ChevronsRight size={18} strokeWidth={3} />
              </div>
            </div>
          ) : !isImageBroken ? (
            <img
              src={item.image}
              alt={item.name}
              className={styles.productImg}
              loading="lazy"
              decoding="async"
              onError={() => handleImageError(item.id)}
            />
          ) : (
            <div className={styles.fallbackIconWrapper}>
              {renderElectricFallbackIcon(item.iconName)}
            </div>
          )}

          {/* Pricing / Discount Pill Badge */}
          {item.badgeText && (
            <span className={`${styles.badgePill} ${getBadgeClass(item.badgeVariant)}`}>
              {item.badgeText}
            </span>
          )}
        </div>

        {/* Category Name Label */}
        <span className={styles.title} title={item.name}>
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <nav className={`${styles.navSection} ${className}`} aria-label="Category Navigation">
      {shouldShowHeader && (
        <div className={styles.header}>
          <div className={title ? styles.titleGroup : undefined}>
            {title && <h2 className={styles.heading}>{title}</h2>}
            {subtitle && <span className={styles.subheading}>{subtitle}</span>}
          </div>

          <div className={styles.headerActions}>
            {viewAllHref && (
              <Link href={viewAllHref} className={styles.viewAllLink}>
                <span>{viewAllText}</span>
                <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
            )}

            {showNavButtons && (canScrollLeft || canScrollRight) && (
              <div className={styles.navButtonsGroup}>
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollLeft}
                  className={styles.headerArrowBtn}
                  aria-label="Scroll categories left"
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollRight}
                  className={styles.headerArrowBtn}
                  aria-label="Scroll categories right"
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.scrollWrapper}>
        {/* Visual Edge Fades for Mobile / Overflow */}
        <div
          className={`${styles.fadeLeft} ${canScrollLeft ? styles.visible : ''}`}
          aria-hidden="true"
        />
        <div
          className={`${styles.fadeRight} ${canScrollRight ? styles.visible : ''}`}
          aria-hidden="true"
        />

        {/* Floating Desktop Side Nav Arrows */}
        {showNavButtons && canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className={`${styles.floatingArrowBtn} ${styles.prev}`}
            aria-label="Previous categories"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        )}

        {showNavButtons && canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className={`${styles.floatingArrowBtn} ${styles.next}`}
            aria-label="Next categories"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        )}

        {/* 1-Line Full Width Ribbon */}
        <div
          ref={scrollTrackRef}
          className={styles.scrollTrack}
          tabIndex={0}
          role="region"
          aria-label="Electric categories ribbon"
        >
          <div className={styles.singleRowRibbon}>
            {categories.map(renderCategoryItem)}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CircularCategoryNav;
