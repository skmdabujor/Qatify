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

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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

// -----------------------------------------------------------------------------
// Independent Infinite Loop Product Row Slider Component
// Each row slides, drags, and loops completely independently of the other!
// -----------------------------------------------------------------------------
interface ProductRowSliderProps {
  products: Product[];
  rowId: string;
  addedProductId: string | null;
  onAddToCart: (e: React.MouseEvent, product: Product) => void;
  onToggleWishlist: (e: React.MouseEvent, product: Product) => void;
  isInWishlist: (id: string) => boolean;
}

const ProductRowSlider: React.FC<ProductRowSliderProps> = ({
  products,
  rowId,
  addedProductId,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}) => {
  const router = useRouter();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  // Position & Interaction Refs
  const currentOffsetRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 5 Sets of products to guarantee seamless, uninterrupted infinite looping
  const duplicatedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const sets: { product: Product; key: string }[] = [];
    for (let s = 0; s < 5; s++) {
      products.forEach((p, idx) => {
        sets.push({ product: p, key: `${rowId}-s${s}-${p.id}-${idx}` });
      });
    }
    return sets;
  }, [products, rowId]);

  // Dynamically measure card width + gap from layout
  const getStepSize = useCallback(() => {
    if (trackRef.current && trackRef.current.children.length >= 2) {
      const first = trackRef.current.children[0] as HTMLElement;
      const second = trackRef.current.children[1] as HTMLElement;
      const diff = second.offsetLeft - first.offsetLeft;
      if (diff > 50) return diff;
    }
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 180; // 170px width + 10px gap on mobile
    }
    return 229; // 215px width + 14px gap on desktop
  }, []);

  // Seamlessly keep offset centered around Set 2 [2 * setWidth, 3 * setWidth)
  const normalizeOffset = useCallback(() => {
    if (!trackRef.current || products.length === 0) return;
    const step = getStepSize();
    const setWidth = products.length * step;
    if (setWidth <= 0) return;

    let current = currentOffsetRef.current;
    let changed = false;

    while (current >= 3 * setWidth) {
      current -= setWidth;
      changed = true;
    }
    while (current < 2 * setWidth) {
      current += setWidth;
      changed = true;
    }

    if (changed) {
      currentOffsetRef.current = current;
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translate3d(-${current}px, 0, 0)`;
    }
  }, [getStepSize, products.length]);

  // Initial positioning to middle Set 2
  useEffect(() => {
    if (products.length === 0) return;
    const step = getStepSize();
    const setWidth = products.length * step;
    const initialPos = 2 * setWidth;
    currentOffsetRef.current = initialPos;

    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translate3d(-${initialPos}px, 0, 0)`;
    }

    const handleResize = () => {
      normalizeOffset();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, [products.length, getStepSize, normalizeOffset]);

  // Transition End: Normalize silently back into center set
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current) return;
    isTransitioningRef.current = false;
    normalizeOffset();
  };

  // Next Arrow Button Click
  const slideNext = () => {
    if (products.length === 0) return;
    const step = getStepSize();
    const visibleWidth = viewportRef.current?.clientWidth || 800;
    const cardsToSlide = visibleWidth < 600 ? 1 : 2;
    const distance = step * cardsToSlide;

    const nextTarget = currentOffsetRef.current + distance;
    currentOffsetRef.current = nextTarget;
    isTransitioningRef.current = true;

    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.32s cubic-bezier(0.25, 1, 0.5, 1)';
      trackRef.current.style.transform = `translate3d(-${nextTarget}px, 0, 0)`;
    }
  };

  // Prev Arrow Button Click
  const slidePrev = () => {
    if (products.length === 0) return;
    const step = getStepSize();
    const visibleWidth = viewportRef.current?.clientWidth || 800;
    const cardsToSlide = visibleWidth < 600 ? 1 : 2;
    const distance = step * cardsToSlide;

    const nextTarget = currentOffsetRef.current - distance;
    currentOffsetRef.current = nextTarget;
    isTransitioningRef.current = true;

    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.32s cubic-bezier(0.25, 1, 0.5, 1)';
      trackRef.current.style.transform = `translate3d(-${nextTarget}px, 0, 0)`;
    }
  };

  // Pointer Down (Mouse / Touch / Stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    if (!trackRef.current || !viewportRef.current) return;

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;

    // Grab mid-flight without jumping if mid-transition
    if (trackRef.current) {
      const style = window.getComputedStyle(trackRef.current);
      const matrix = new DOMMatrixReadOnly(style.transform);
      if (!isNaN(matrix.m41) && matrix.m41 !== 0) {
        currentOffsetRef.current = -matrix.m41;
      }
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translate3d(-${currentOffsetRef.current}px, 0, 0)`;
    }
    startOffsetRef.current = currentOffsetRef.current;
  };

  // Pointer Move (Mouse / Touch)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !trackRef.current) return;

    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    if (!hasDraggedRef.current) {
      if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
        hasDraggedRef.current = true;
        setIsDragging(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
      } else if (Math.abs(deltaY) > 8) {
        // Vertical scroll intent on mobile
        isPointerDownRef.current = false;
        return;
      }
    }

    if (hasDraggedRef.current) {
      let newOffset = startOffsetRef.current - deltaX;
      const step = getStepSize();
      const setWidth = products.length * step;
      if (setWidth > 0) {
        while (newOffset >= 3.5 * setWidth) {
          newOffset -= setWidth;
          startOffsetRef.current -= setWidth;
        }
        while (newOffset < 1.5 * setWidth) {
          newOffset += setWidth;
          startOffsetRef.current += setWidth;
        }
      }
      currentOffsetRef.current = newOffset;
      trackRef.current.style.transform = `translate3d(-${newOffset}px, 0, 0)`;
    }
  };

  // Pointer Up (Mouse / Touch release)
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    if (hasDraggedRef.current) {
      const deltaX = e.clientX - startXRef.current;
      const step = getStepSize();

      let target = currentOffsetRef.current;
      if (Math.abs(deltaX) > 25) {
        if (deltaX < 0) {
          target = Math.ceil(target / step) * step;
        } else {
          target = Math.floor(target / step) * step;
        }
      } else {
        target = Math.round(target / step) * step;
      }

      currentOffsetRef.current = target;
      isTransitioningRef.current = true;

      if (trackRef.current) {
        trackRef.current.style.transition = 'transform 0.32s cubic-bezier(0.25, 1, 0.5, 1)';
        trackRef.current.style.transform = `translate3d(-${target}px, 0, 0)`;
      }

      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 150);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
  };

  // Horizontal Wheel / Trackpad support
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 4) {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        let newOffset = currentOffsetRef.current + e.deltaX;
        const step = getStepSize();
        const setWidth = products.length * step;
        if (setWidth > 0) {
          while (newOffset >= 3.5 * setWidth) newOffset -= setWidth;
          while (newOffset < 1.5 * setWidth) newOffset += setWidth;
        }
        currentOffsetRef.current = newOffset;
        trackRef.current.style.transform = `translate3d(-${newOffset}px, 0, 0)`;

        if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
        wheelTimeoutRef.current = setTimeout(() => {
          const snapped = Math.round(currentOffsetRef.current / step) * step;
          currentOffsetRef.current = snapped;
          if (trackRef.current) {
            trackRef.current.style.transition = 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)';
            trackRef.current.style.transform = `translate3d(-${snapped}px, 0, 0)`;
          }
        }, 120);
      }
    }
  };

  // Card click: Navigate only if not dragged
  const handleCardClick = (product: Product, e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    router.push(`/products/${product.slug}`);
  };

  return (
    <div className={styles.sliderRow}>
      {/* Left Arrow Button */}
      <button
        type="button"
        className={`${styles.navBtn} ${styles.navPrev}`}
        onClick={slidePrev}
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Viewport with touch & pointer support */}
      <div
        className={`${styles.sliderViewport} ${isDragging ? styles.isDragging : ''}`}
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onWheel={handleWheel}
      >
        <div
          className={styles.sliderTrack}
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
        >
          {duplicatedProducts.map(({ product, key }) => {
            const isWishlisted = isInWishlist(product.id);
            const isAdded = addedProductId === product.id;
            const hasDiscount =
              product.originalPriceQAR > product.priceQAR &&
              product.discountPercent >= 15;

            return (
              <div
                key={key}
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
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => onToggleWishlist(e, product)}
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
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => onAddToCart(e, product)}
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
      </div>

      {/* Right Arrow Button */}
      <button
        type="button"
        className={`${styles.navBtn} ${styles.navNext}`}
        onClick={slideNext}
        aria-label="Scroll right"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export const GrabOrGoneSection: React.FC = () => {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  // States
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

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

  // 3. Fetch products from Convex with catalog fallback
  const liveProducts = useQuery(api.products.list, { limit: 20 });

  const products: Product[] = useMemo(() => {
    if (liveProducts && liveProducts.length >= 8) {
      return liveProducts.map(toProduct);
    }
    return PRODUCTS.slice(0, 16);
  }, [liveProducts]);

  // Separate top & bottom rows matching screenshot
  // Top: Even index items (qat-001 Soundcore, qat-003 Joyroom, qat-005 Green Lion, qat-007 Wanbo, ...)
  // Bottom: Odd index items (qat-002 Anker, qat-004 Baseus, qat-006 Anker 737, qat-008 Porodo, ...)
  const topProducts = useMemo(() => {
    return products.filter((_, idx) => idx % 2 === 0);
  }, [products]);

  const bottomProducts = useMemo(() => {
    return products.filter((_, idx) => idx % 2 === 1);
  }, [products]);

  // Wishlist Handler
  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Add to Cart Handler
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 1500);
  };

  // Left Banner Drag & Touch Handlers
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

      {/* MAIN CONTAINER: LEFT BANNER + RIGHT 2 INDEPENDENT SLIDERS */}
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

        {/* RIGHT PRODUCT CAROUSEL WRAPPER: 2 INDEPENDENT INFINITE LOOP SLIDERS */}
        <div className={styles.rightCarouselWrapper}>
          {/* Top Slider Row (Slides independently & loops infinitely) */}
          <ProductRowSlider
            products={topProducts}
            rowId="row-top"
            addedProductId={addedProductId}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={isInWishlist}
          />

          {/* Bottom Slider Row (Slides independently & loops infinitely) */}
          <ProductRowSlider
            products={bottomProducts}
            rowId="row-bottom"
            addedProductId={addedProductId}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={isInWishlist}
          />
        </div>
      </div>
    </section>
  );
};

export default GrabOrGoneSection;
