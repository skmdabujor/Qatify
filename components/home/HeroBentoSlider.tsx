'use client';

// =============================================================================
// Qatify — Homepage 3-Panel Bento Hero Section with Interactive Left Slider
// Left: Multi-slide interactive carousel (arrows, dots, auto-slide, touch swipe)
// Right Top: Weekly Offers Promo Card
// Right Bottom: Price Slash Zone Promo Card
// =============================================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Truck } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import styles from './HeroBentoSlider.module.scss';

interface HeroSlide {
  id: string;
  href: string;
  badgeText: string;
  leftBig: string;
  leftUnit?: string;
  leftLabel: string;
  rightBig: string;
  rightLabel: string;
  pillOne: string;
  pillTwo: string;
  footnote: string;
  themeClass: string;
  images: { src: string; alt: string }[];
  showcaseTag: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'weekly-qatar-deals',
    href: '/shop?sale=true',
    badgeText: 'WEEKLY QATAR DEALS',
    leftBig: '45',
    leftUnit: '%',
    leftLabel: 'DISCOUNT',
    rightBig: 'QAR 0',
    rightLabel: 'Express Delivery (min. spend QAR 150)',
    pillOne: 'Online',
    pillTwo: 'All Qatar',
    footnote: 'For Doha, Lusail, Al Rayyan & Al Wakrah orders. Authentic factory-sealed gear.',
    themeClass: 'themeTeal',
    images: [
      {
        src: PRODUCTS[0]?.images[0] || '/placeholder.svg',
        alt: PRODUCTS[0]?.title || 'Wireless ANC Earbuds',
      },
      {
        src: PRODUCTS[1]?.images[0] || '/placeholder.svg',
        alt: PRODUCTS[1]?.title || 'Anker 100W GaN Charger',
      },
      {
        src: PRODUCTS[2]?.images[0] || '/placeholder.svg',
        alt: PRODUCTS[2]?.title || 'MagSafe Cooling Car Mount',
      },
    ],
    showcaseTag: 'QATIFY EXPRESS',
  },
  {
    id: 'bundle-save-deals',
    href: '/shop?sort=trending',
    badgeText: 'MEGA TECH BUNDLES',
    leftBig: '20',
    leftUnit: '%',
    leftLabel: 'EXTRA OFF',
    rightBig: '24H',
    rightLabel: 'Fast Dispatch from Regional Hub',
    pillOne: 'Anker',
    pillTwo: 'Soundcore',
    footnote: 'Mix & match GaN chargers, ANC earbuds & workspace tech with multi-buy savings.',
    themeClass: 'themeCrimson',
    images: [
      {
        src: PRODUCTS[1]?.images[0] || '/placeholder.svg',
        alt: PRODUCTS[1]?.title || 'Anker 100W GaN Charger',
      },
      {
        src: PRODUCTS[3]?.images[0] || '/placeholder.svg',
        alt: PRODUCTS[3]?.title || 'Baseus Screen Light Bar',
      },
      {
        src: PRODUCTS[0]?.images[0] || '/placeholder.svg',
        alt: PRODUCTS[0]?.title || 'Soundcore Earbuds',
      },
    ],
    showcaseTag: 'TOP RATED',
  },
  {
    id: 'flash-under-99',
    href: '/shop?filter=under-99',
    badgeText: 'DOHA FLASH TECH DROP',
    leftBig: '50',
    leftUnit: '%',
    leftLabel: 'SAVINGS',
    rightBig: 'QAR 49',
    rightLabel: 'Starting Price on Smart Accessories',
    pillOne: 'Hot Deals',
    pillTwo: 'Limited Batch',
    footnote: 'Quality tested before air dispatch • Pay with Apple Pay, Google Pay or Cards.',
    themeClass: 'themeRoyal',
    images: [
      {
        src: PRODUCTS[2]?.images[0] || '/placeholder.svg',
        alt: PRODUCTS[2]?.title || 'MagSafe Car Mount',
      },
      {
        src: PRODUCTS[0]?.images[0] || '/placeholder.svg',
        alt: PRODUCTS[0]?.title || 'Soundcore Earbuds',
      },
      {
        src: PRODUCTS[3]?.images[0] || '/placeholder.svg',
        alt: PRODUCTS[3]?.title || 'Baseus Screen Bar',
      },
    ],
    showcaseTag: 'UNDER QAR 99',
  },
  {
    id: 'genuine-flagships',
    href: '/shop?sort=rating',
    badgeText: '100% GENUINE GUARANTEED',
    leftBig: '100',
    leftUnit: '%',
    leftLabel: 'AUTHENTIC',
    rightBig: '24/7',
    rightLabel: 'Live WhatsApp & Customer Support',
    pillOne: 'QAR Pay',
    pillTwo: '0% Fee',
    footnote: 'Pay securely in Qatari Riyal (QAR) with zero currency conversion fees.',
    themeClass: 'themeObsidian',
    images: [
      {
        src: PRODUCTS[3]?.images[0] || '/placeholder.svg',
        alt: PRODUCTS[3]?.title || 'Baseus Screen Bar',
      },
      {
        src: PRODUCTS[1]?.images[0] || '/placeholder.svg',
        alt: PRODUCTS[1]?.title || 'Anker 100W GaN Charger',
      },
      {
        src: PRODUCTS[2]?.images[0] || '/placeholder.svg',
        alt: PRODUCTS[2]?.title || 'MagSafe Car Mount',
      },
    ],
    showcaseTag: 'WARRANTY BACKED',
  },
];

const handleImgFallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.currentTarget;
  if (!target.src.endsWith('/placeholder.svg')) {
    target.src = '/placeholder.svg';
  }
};

export const HeroBentoSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = HERO_SLIDES.length;

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex(((index % totalSlides) + totalSlides) % totalSlides);
    },
    [totalSlides]
  );

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      goToSlide(activeIndex - 1);
    },
    [activeIndex, goToSlide]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      goToSlide(activeIndex + 1);
    },
    [activeIndex, goToSlide]
  );

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        goToSlide(activeIndex + 1);
      } else {
        goToSlide(activeIndex - 1);
      }
    }
  };

  return (
    <section className={styles.heroBentoSection} aria-label="Featured promotions">
      <div className={styles.heroBentoGrid}>
        {/* ================================================================
            PANEL 1 (LEFT ~70%): INTERACTIVE SLIDER BANNER
        ================================================================= */}
        <div
          className={styles.sliderCard}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={styles.slidesTrack}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {HERO_SLIDES.map((slide) => (
              <Link
                key={slide.id}
                href={slide.href}
                className={`${styles.slide} ${styles[slide.themeClass]}`}
              >
                <div className={styles.slideGlow} aria-hidden="true" />

                {/* Left / Center Deal Typography */}
                <div className={styles.slideTextCol}>
                  <span className={styles.slideTopPill}>{slide.badgeText}</span>

                  <div className={styles.slideOfferRow}>
                    <div className={styles.offerLeftBlock}>
                      <div className={styles.offerBigNumberWrap}>
                        <span className={styles.offerBigNumber}>{slide.leftBig}</span>
                        {slide.leftUnit && (
                          <span className={styles.offerBigUnit}>{slide.leftUnit}</span>
                        )}
                      </div>
                      <span className={styles.offerLeftLabel}>{slide.leftLabel}</span>
                    </div>

                    <span className={styles.offerPlusSign}>+</span>

                    <div className={styles.offerRightBlock}>
                      <span className={styles.offerRightValue}>{slide.rightBig}</span>
                      <span className={styles.offerRightLabel}>{slide.rightLabel}</span>
                    </div>
                  </div>

                  <div className={styles.slideTagsRow}>
                    <span className={styles.tagRed}>{slide.pillOne}</span>
                    <span className={styles.tagWhite}>{slide.pillTwo}</span>
                  </div>

                  <p className={styles.slideFootnote}>{slide.footnote}</p>
                </div>

                {/* Right Product Showcase Visual */}
                <div className={styles.slideVisualCol} aria-hidden="true">
                  <div className={styles.showcaseBox}>
                    <div className={styles.showcaseItemsRow}>
                      {slide.images.map((img, i) => (
                        <div
                          key={`${slide.id}-img-${i}`}
                          className={`${styles.showcaseItem} ${
                            i === 1 ? styles.showcaseItemCenter : ''
                          }`}
                        >
                          <img
                            src={img.src}
                            alt={img.alt}
                            className={styles.showcaseImg}
                            onError={handleImgFallback}
                          />
                        </div>
                      ))}
                    </div>
                    <div className={styles.showcaseCrateBase}>
                      <span className={styles.showcaseBrandTag}>{slide.showcaseTag}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Slider Left / Right Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className={`${styles.navArrow} ${styles.prevArrow}`}
            aria-label="Previous promotion slide"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className={`${styles.navArrow} ${styles.nextArrow}`}
            aria-label="Next promotion slide"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          {/* Bottom-Right Pagination Dots */}
          <div className={styles.dotsBar} role="tablist" aria-label="Slide pagination">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Go to slide ${idx + 1}: ${slide.badgeText}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToSlide(idx);
                }}
                className={`${styles.dotBtn} ${idx === activeIndex ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        </div>

        {/* ================================================================
            RIGHT COLUMN (~30%): 2 STACKED PROMO CARDS
        ================================================================= */}
        <div className={styles.rightColumnStack}>
          {/* PANEL 2 (TOP RIGHT): WEEKLY OFFERS CARD */}
          <Link href="/shop?sale=true" className={styles.topPromoCard}>
            <div className={styles.topPromoContent}>
              <span className={styles.topPromoEyebrow}>WEEKLY OFFERS FROM</span>
              <div className={styles.topPromoDiscount}>
                <span className={styles.topPromoNumber}>40</span>
                <div className={styles.topPromoPercentCol}>
                  <span className={styles.topPromoPercent}>%</span>
                  <span className={styles.topPromoOff}>OFF</span>
                </div>
              </div>
              <p className={styles.topPromoSub}>
                Limited stock across Qatar top tech, while supplies last.
              </p>
            </div>

            <div className={styles.topPromoVisual}>
              <div className={styles.pedestalGlow} />
              <div className={styles.miniProductCluster}>
                <img
                  src={PRODUCTS[0]?.images[0] || '/placeholder.svg'}
                  alt={PRODUCTS[0]?.title || 'Wireless Earbuds'}
                  className={styles.miniClusterImgBack}
                  onError={handleImgFallback}
                />
                <img
                  src={PRODUCTS[1]?.images[0] || '/placeholder.svg'}
                  alt={PRODUCTS[1]?.title || 'Fast Charger'}
                  className={styles.miniClusterImgFront}
                  onError={handleImgFallback}
                />
              </div>
              <span className={styles.topPromoCtaPill}>Shop now</span>
            </div>
          </Link>

          {/* PANEL 3 (BOTTOM RIGHT): PRICE SLASH ZONE CARD */}
          <Link href="/shop?filter=under-99" className={styles.bottomPromoCard}>
            <div className={styles.bottomPromoGlow} aria-hidden="true" />
            <div className={styles.bottomPromoContent}>
              <div className={styles.slashTitleStack}>
                <span className={styles.slashWordWhite}>PRICE</span>
                <span className={styles.slashWordRed}>SLASH</span>
                <span className={styles.slashWordWhite}>ZONE</span>
              </div>
              <p className={styles.bottomPromoSub}>
                Unmissable Savings &amp; Deals Under QAR 99
              </p>
            </div>

            <div className={styles.bottomPromoVisual}>
              <div className={styles.expressTruckBadge}>
                <Truck size={34} strokeWidth={1.8} />
                <span>EXPRESS</span>
              </div>
              <span className={styles.bottomPromoCtaPill}>Shop now</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBentoSlider;
