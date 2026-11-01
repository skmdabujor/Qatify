'use client';

// =============================================================================
// Qatify — Grab Or Gone! Today's Top Deals Shelf Component
// Features:
// - Title ("Grab Or Gone!") & Subtitle ("Today's Top Deals") from Image 2
// - Live Real-Time Countdown Timer ("ENDS IN 01 DAYS : 02 HRS : 00 MIN : 09 SEC")
// - Full Mouse Click-and-Drag Horizontal Scroll for Product Grid & Left Banner
// - Entire Product Card is Clickable (navigates to product page unless dragged)
// - Wishlist & Add-to-Cart buttons operate independently without page navigation
// =============================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Heart, Plus, Check, ArrowRight } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { Product, toProduct } from '@/types/product';
import styles from './GrabOrGoneSection.module.scss';

// Promo banner slides for the tall left card
const PROMO_SLIDES = [
  {
    id: 1,
    title: "Grab Or Gone!\nTop Deals",
    subtitle: "Today's top tech discounts across Qatar",
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
    link: '/shop?filter=deals',
  },
  {
    id: 2,
    title: "Fast GaN Power\n& Desk Tech",
    subtitle: 'High-speed chargers & powerbanks',
    imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=chargers-powerbanks',
  },
  {
    id: 3,
    title: "Spatial Audio &\nANC Earbuds",
    subtitle: 'Up to 45% OFF flagship wireless audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=tws-audio',
  },
];

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export const GrabOrGoneSection: React.FC = () => {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  // Scroll Container Ref
  const scrollRef = useRef<HTMLDivElement>(null);

  // States
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Grid Drag-to-Scroll Tracking Refs
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Banner Drag-to-Slide Tracking Refs
  const bannerIsDownRef = useRef(false);
  const bannerStartXRef = useRef(0);
  const bannerHasDraggedRef = useRef(false);

  // 1. Live Countdown Timer State
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '01',
    hours: '02',
    minutes: '00',
    seconds: '09',
  });

  useEffect(() => {
    const getTargetTime = () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59).getTime();
    };

    const targetTime = getTargetTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: String(d).padStart(2, '0'),
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(s).padStart(2, '0'),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Auto-cycle banner slides (every 7 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!bannerIsDownRef.current) {
        setActiveSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
      }
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // 3. Global Mouse Drag Listener for the Product Grid
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDownRef.current || !scrollRef.current) return;
      const deltaX = e.pageX - startXRef.current;

      if (Math.abs(deltaX) > 4) {
        hasDraggedRef.current = true;
        setIsDragging(true);
      }

      if (hasDraggedRef.current) {
        e.preventDefault();
        scrollRef.current.scrollLeft = scrollLeftRef.current - deltaX;
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDownRef.current) {
        isDownRef.current = false;
        setIsDragging(false);
        // Retain hasDraggedRef for 120ms so any click event triggered right after mouseup is prevented
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 120);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // 4. Fetch products from Convex with catalog fallback
  const liveProducts = useQuery(api.products.list, { limit: 20 });

  const products: Product[] = useMemo(() => {
    if (liveProducts && liveProducts.length >= 8) {
      return liveProducts.map(toProduct);
    }
    return PRODUCTS.slice(0, 16);
  }, [liveProducts]);

  // 5. Arrow navigation scrolling
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollDistance = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth',
      });
    }
  };

  // 6. Grid MouseDown Handler
  const handleGridMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current || e.button !== 0) return;
    const target = e.target as HTMLElement;
    // Don't initiate scroll drag if clicking Wishlist or Add button directly
    if (target.closest('button')) return;

    isDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  // 7. Entire Product Card Click Handler
  const handleCardClick = (product: Product, e: React.MouseEvent) => {
    // If the user was dragging the grid, do NOT navigate!
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    router.push(`/products/${product.slug}`);
  };

  // 8. Wishlist Handler
  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // 9. Add to Cart Handler
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 1500);
  };

  // 10. Left Banner Drag & Touch Handlers
  const handleBannerMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest(`.${styles.indicatorDash}`)) return;

    bannerIsDownRef.current = true;
    bannerStartXRef.current = e.pageX;
    bannerHasDraggedRef.current = false;
  };

  const handleBannerMouseMove = (e: React.MouseEvent) => {
    if (!bannerIsDownRef.current) return;
    const deltaX = e.pageX - bannerStartXRef.current;
    if (Math.abs(deltaX) > 8) {
      bannerHasDraggedRef.current = true;
    }
  };

  const handleBannerMouseUp = (e: React.MouseEvent) => {
    if (!bannerIsDownRef.current) return;
    bannerIsDownRef.current = false;
    const deltaX = e.pageX - bannerStartXRef.current;

    if (Math.abs(deltaX) > 25) {
      if (deltaX < 0) {
        // Drag left -> Next slide
        setActiveSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
      } else {
        // Drag right -> Previous slide
        setActiveSlide((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
      }
    }

    if (bannerHasDraggedRef.current) {
      setTimeout(() => {
        bannerHasDraggedRef.current = false;
      }, 120);
    }
  };

  const handleBannerTouchStart = (e: React.TouchEvent) => {
    bannerStartXRef.current = e.touches[0].clientX;
    bannerHasDraggedRef.current = false;
  };

  const handleBannerTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - bannerStartXRef.current;
    if (Math.abs(deltaX) > 25) {
      bannerHasDraggedRef.current = true;
      if (deltaX < 0) {
        setActiveSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
      } else {
        setActiveSlide((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
      }
    }
  };

  const handleBannerClick = (e: React.MouseEvent) => {
    if (bannerHasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    router.push(currentSlide.link);
  };

  const currentSlide = PROMO_SLIDES[activeSlide];

  return (
    <section className={styles.sectionWrapper} aria-label="Grab Or Gone Today's Top Deals">
      {/* SECTION HEADER: TITLE & ALL FROM 2ND TEXT SCREENSHOT */}
      <div className={styles.headerRow}>
        {/* Title & Subtitle */}
        <div className={styles.titleArea}>
          <h2 className={styles.heading}>Grab Or Gone!</h2>
          <p className={styles.subtitle}>Today&apos;s Top Deals</p>
        </div>

        {/* Live Countdown Timer */}
        <div className={styles.timerContainer} role="timer" aria-live="polite">
          <span className={styles.timerLabel}>ENDS IN</span>
          <div className={styles.timerBlocks}>
            <div className={styles.timerBox}>
              <span className={styles.timerNumber}>{timeLeft.days}</span>
              <span className={styles.timerUnit}>DAYS</span>
            </div>
            <span className={styles.timerColon}>:</span>
            <div className={styles.timerBox}>
              <span className={styles.timerNumber}>{timeLeft.hours}</span>
              <span className={styles.timerUnit}>HRS</span>
            </div>
            <span className={styles.timerColon}>:</span>
            <div className={styles.timerBox}>
              <span className={styles.timerNumber}>{timeLeft.minutes}</span>
              <span className={styles.timerUnit}>MIN</span>
            </div>
            <span className={styles.timerColon}>:</span>
            <div className={styles.timerBox}>
              <span className={styles.timerNumber}>{timeLeft.seconds}</span>
              <span className={styles.timerUnit}>SEC</span>
            </div>
          </div>
        </div>

        {/* View All Action */}
        <Link href="/shop?filter=deals" className={styles.viewAllBtn}>
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* MAIN CONTAINER: LEFT BANNER + RIGHT 2-ROW GRID */}
      <div className={styles.mainContainer}>
        {/* LEFT VERTICAL PROMO BANNER (Full Drag & Swipe Support) */}
        <div
          className={styles.leftBanner}
          style={{ backgroundImage: `url(${currentSlide.imageUrl})` }}
          aria-label={currentSlide.title}
          role="button"
          tabIndex={0}
          onClick={handleBannerClick}
          onMouseDown={handleBannerMouseDown}
          onMouseMove={handleBannerMouseMove}
          onMouseUp={handleBannerMouseUp}
          onTouchStart={handleBannerTouchStart}
          onTouchEnd={handleBannerTouchEnd}
          onKeyDown={(e) => {
            if (e.key === 'Enter') router.push(currentSlide.link);
          }}
        >
          <div className={styles.bannerContent}>
            <h3 className={styles.bannerTitle}>{currentSlide.title}</h3>
            <p className={styles.bannerSubtitle}>{currentSlide.subtitle}</p>
          </div>

          {/* Indicator Dashes */}
          <div className={styles.bannerIndicators}>
            {PROMO_SLIDES.map((slide, index) => (
              <span
                key={slide.id}
                className={`${styles.indicatorDash} ${
                  index === activeSlide ? styles.activeDash : styles.inactiveDash
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveSlide(index);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT PRODUCT CAROUSEL WRAPPER */}
        <div className={styles.rightCarouselWrapper}>
          {/* Left Arrow Button */}
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>

          {/* 2-Row Grid Track (Native Mouse Drag Enabled) */}
          <div
            className={`${styles.gridTrack} ${isDragging ? styles.isDragging : ''}`}
            ref={scrollRef}
            onMouseDown={handleGridMouseDown}
          >
            {products.map((product) => {
              const isWishlisted = isInWishlist(product.id);
              const isAdded = addedProductId === product.id;
              const hasDiscount =
                product.originalPriceQAR > product.priceQAR &&
                product.discountPercent >= 15;

              return (
                <div
                  key={product.id}
                  className={styles.productCard}
                  onClick={(e) => handleCardClick(product, e)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') router.push(`/products/${product.slug}`);
                  }}
                >
                  {/* Top-Right Wishlist Heart Button */}
                  <button
                    type="button"
                    className={styles.wishlistBtn}
                    onClick={(e) => handleToggleWishlist(e, product)}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart
                      size={17}
                      className={isWishlisted ? styles.heartActive : styles.heartDefault}
                    />
                  </button>

                  {/* Centered Product Image */}
                  <div className={styles.imageWrapper}>
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className={styles.productImg}
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  {/* Brand Tag (Left) + Red '+' Button (Right) */}
                  <div className={styles.brandActionRow}>
                    <span className={styles.brandBadge}>
                      {product.brand || product.category}
                    </span>
                    <button
                      type="button"
                      className={`${styles.addBtn} ${isAdded ? styles.added : ''}`}
                      onClick={(e) => handleAddToCart(e, product)}
                      aria-label={`Add ${product.title} to cart`}
                    >
                      {isAdded ? (
                        <Check size={15} strokeWidth={2.5} />
                      ) : (
                        <Plus size={15} strokeWidth={2.5} />
                      )}
                    </button>
                  </div>

                  {/* Product Title (2-Line Clamped) */}
                  <h3 className={styles.productTitle} title={product.title}>
                    {product.title}
                  </h3>

                  {/* Price Row (Yellow Highlight Badge for Discounts, Normal for Regular) */}
                  <div className={styles.priceRow}>
                    {hasDiscount ? (
                      <>
                        <span className={styles.priceYellowBadge}>
                          QAR {product.priceQAR.toFixed(2)}
                        </span>
                        <span className={styles.priceStrike}>
                          {product.originalPriceQAR.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className={styles.priceNormal}>
                        QAR {product.priceQAR.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default GrabOrGoneSection;
