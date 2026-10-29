'use client';

// =============================================================================
// Qatify — Homepage (High-Density Regional Qatar Dropshipping Storefront)
// 3-Col Hero + 2-Row Category Ribbon + Curated Shelves
// =============================================================================

import React from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Zap,
  ArrowRight,
  Plane,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Sparkles,
  Smartphone,
  Watch,
  Headphones,
  BatteryCharging,
  Car,
  Gamepad2,
  Camera,
  Home,
  Laptop,
  Cable,
  Flame,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { CircularCategoryNav } from '@/components/category';
import { FirstTimeDiscountPopup } from '@/components/popup/FirstTimeDiscountPopup';
import { HomeComboDealsSection } from '@/components/home/HomeComboDealsSection';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { toProduct, toCategory } from '@/types/product';
import styles from './page.module.scss';

// Category icon mapper helper
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Smartphone':
      return <Smartphone size={16} />;
    case 'Watch':
      return <Watch size={16} />;
    case 'Headphones':
      return <Headphones size={16} />;
    case 'Zap':
      return <BatteryCharging size={16} />;
    case 'Car':
      return <Car size={16} />;
    case 'Gamepad2':
      return <Gamepad2 size={16} />;
    case 'Camera':
      return <Camera size={16} />;
    case 'Home':
      return <Home size={16} />;
    case 'Laptop':
      return <Laptop size={16} />;
    case 'Cable':
      return <Cable size={16} />;
    default:
      return <Sparkles size={16} />;
  }
};

export default function ShopHomePage() {
  // Real-time Convex database queries
  const liveCategories = useQuery(api.categories.list, { limit: 12 });
  const liveTrending = useQuery(api.products.getTrending, { limit: 10 });
  const liveUnder99 = useQuery(api.products.getUnder99, { limit: 15 });
  const liveBestSellers = useQuery(api.products.getBestSellers, { limit: 5 });

  // Use live data with fallback to mock data while hydrating/loading
  const categories = liveCategories && liveCategories.length > 0
    ? liveCategories.map(toCategory)
    : CATEGORIES;
  const trendingProducts = liveTrending && liveTrending.length > 0
    ? liveTrending.map(toProduct)
    : PRODUCTS.filter((p) => p.isTrending).slice(0, 10);
  const under99Products = (
    liveUnder99 && liveUnder99.length > 0
      ? liveUnder99.map(toProduct)
      : PRODUCTS.filter((p) => p.isUnder99)
  ).slice(0, 15);
  const bestSellerProducts = liveBestSellers && liveBestSellers.length > 0
    ? liveBestSellers.map(toProduct)
    : PRODUCTS.filter((p) => p.isBestSeller).slice(0, 5);

  return (
    <div className={styles.homeContainer}>
      <div className="container">
        {/* ===================================================================
            SECTION 1: HIGH-CONVERSION YELLOW STRIP BANNER (Daraz/E-Commerce Style)
            - Vibrant Golden-Yellow Canvas with Confetti
            - Left: 3D Angled "PAYDAY SALE" Ribbon with Date Pill
            - Center-Left: Promo Badges ("UP TO 50% OFF" + "FREE DELIVERY")
            - Center: Featured Tech Product Cluster (Earbuds, GaN Charger, Smartwatch)
            - Center-Right: Bold 3D "SALE IS LIVE NOW" Typography
            - Right: Single High-Impact Crimson Pill Button ("SHOP NOW >")
        ==================================================================== */}
        <section className={styles.heroSection}>
          <div className={styles.yellowPromoStrip}>
            {/* Background Confetti Accents */}
            <span className={`${styles.confetti} ${styles.confetti1}`} />
            <span className={`${styles.confetti} ${styles.confetti2}`} />
            <span className={`${styles.confetti} ${styles.confetti3}`} />
            <span className={`${styles.confetti} ${styles.confetti4}`} />
            <span className={`${styles.confetti} ${styles.confetti5}`} />

            {/* Block 1: Angled Campaign Ribbon */}
            <div className={styles.ribbonBlock}>
              <div className={styles.ribbonShape}>
                <span className={styles.ribbonMainText}>MEGA TECH SALE</span>
              </div>
              <div className={styles.ribbonDatePill}>
                <span>BEST DEALS IN QATAR</span>
              </div>
            </div>

            {/* Block 2: Value Badges (% OFF & FREE DELIVERY) */}
            <div className={styles.offersBlock}>
              <div className={styles.discountTicket}>
                <span className={styles.ticketPercent}>%</span>
                <div className={styles.ticketText}>
                  <span className={styles.ticketLabel}>UP TO</span>
                  <span className={styles.ticketValue}>50% OFF</span>
                </div>
              </div>
              <div className={styles.freeDeliveryBadge}>
                <span className={styles.freeDeliveryPill}>FREE</span>
                <span className={styles.freeDeliveryText}>DELIVERY</span>
              </div>
            </div>

            {/* Block 3: Center Product Cluster (Earbuds + GaN Charger + Smartwatch) */}
            <div className={styles.productClusterBlock}>
              <div className={styles.productItemLeft} title={PRODUCTS[1].title}>
                <img
                  src={PRODUCTS[1].images[0] || '/placeholder.svg'}
                  alt={PRODUCTS[1].title}
                  className={styles.clusterImg}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/placeholder.svg')) {
                      target.src = '/placeholder.svg';
                    }
                  }}
                />
              </div>
              <div className={styles.productItemCenter} title={PRODUCTS[0].title}>
                <img
                  src={PRODUCTS[0].images[0] || '/placeholder.svg'}
                  alt={PRODUCTS[0].title}
                  className={styles.clusterImgMain}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/placeholder.svg')) {
                      target.src = '/placeholder.svg';
                    }
                  }}
                />
              </div>
              <div className={styles.productItemRight} title={PRODUCTS[2].title}>
                <img
                  src={PRODUCTS[2].images[0] || '/placeholder.svg'}
                  alt={PRODUCTS[2].title}
                  className={styles.clusterImg}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/placeholder.svg')) {
                      target.src = '/placeholder.svg';
                    }
                  }}
                />
              </div>
            </div>

            {/* Block 4: "SALE IS LIVE NOW" Big Bold Typography */}
            <div className={styles.titleLiveBlock}>
              <span className={styles.titleLine1}>SALE IS</span>
              <span className={styles.titleLine2}>LIVE NOW</span>
            </div>

            {/* Block 5: Single Pill CTA Button ("SHOP NOW >") */}
            <div className={styles.ctaButtonBlock}>
              <Link href="/shop" className={styles.shopNowPillBtn}>
                <span className={styles.btnText}>SHOP NOW</span>
                <span className={styles.btnArrowCircle}>
                  <ChevronRight size={14} strokeWidth={3.5} />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 2: COMPACT 2-ROW CATEGORY RIBBON (High-Density Quick Filters)
        ==================================================================== */}
        <section className={styles.categoryRibbonSection}>
          <div className={styles.sectionHeaderCompact}>
            <div className={styles.sectionTitleBlock}>
              <h2 className={styles.sectionTitle}>Shop by Popular Category</h2>
              <span className={styles.sectionSub}>Instant filtered discovery</span>
            </div>
            <Link href="/shop" className={styles.viewAllTextLink}>
              View All 10 Categories →
            </Link>
          </div>

          <div className={styles.categoryGridRibbon}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?cat=${cat.slug}`}
                className={styles.categoryRibbonCard}
              >
                <div className={styles.ribbonIconCircle}>
                  {getCategoryIcon(cat.icon)}
                </div>
                <span className={styles.ribbonCatName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 2.5: PROMOTIONAL SALE IMAGE BANNER (Single Clickable Image)
        ==================================================================== */}
        <section className={styles.promoImageBannerSection}>
          <Link
            href="/shop?sale=true"
            className={styles.promoBannerLink}
            aria-label="Explore Mid-Season Mega Sale on Trending Tech"
          >
            <picture>
              <source srcSet="/banners/sale-promo-banner.webp" type="image/webp" />
              <img
                src="/banners/sale-promo-banner.png"
                alt="Mega Tech Sale - Up to 60% Off Trending Gadgets"
                className={styles.promoBannerImg}
                width={1200}
                height={260}
                loading="lazy"
              />
            </picture>
          </Link>
        </section>

        {/* ===================================================================
            SECTION 3: CIRCULAR CATEGORY NAVIGATION (Between 60% Banner & Products)
        ==================================================================== */}
        <section className={styles.circularCategoryNavSection}>
          <CircularCategoryNav />
        </section>

        {/* ===================================================================
            SECTION 4: TRENDING IN DOHA THIS WEEK (Dense 4-Column Shelf)
        ==================================================================== */}
        <section className={styles.shelfSection}>
          <div className={styles.shelfHeaderRow}>
            <div className={styles.shelfTitleGroup}>
              <div className={styles.shelfTag}>
                <TrendingUp size={14} />
                <span>POPULAR IN QATAR</span>
              </div>
              <h2 className={styles.shelfHeading}>Trending in Doha This Week</h2>
            </div>
            <Link href="/shop?sort=trending" className={styles.viewMoreBtn}>
              <span>View All Trending</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.shelfGrid4Col}>
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 5: MID-PAGE PROMOTIONAL AIR CARGO BANNER
        ==================================================================== */}
        <section className={styles.airCargoPromoBanner}>
          <div className={styles.airCargoInner}>
            <div className={styles.airCargoContent}>
              <span className={styles.cargoPill}>🚚 FAST & RELIABLE QATAR DELIVERY</span>
              <h3 className={styles.cargoTitle}>
                Direct Doorstep Delivery Across All Qatar Municipalities
              </h3>
              <p className={styles.cargoDesc}>
                We bring you genuine global tech and viral gadget innovations at unbeatable prices. Every product is authenticated, securely packaged, and dispatched with prompt tracked delivery across Qatar.
              </p>
              <div className={styles.cargoPerks}>
                <div className={styles.cargoPerk}>
                  <CheckCircle2 size={15} />
                  <span>Doha, Lusail, Al Rayyan, Al Wakrah & Al Khor</span>
                </div>
                <div className={styles.cargoPerk}>
                  <CheckCircle2 size={15} />
                  <span>Fast express delivery with live tracking</span>
                </div>
                <div className={styles.cargoPerk}>
                  <CheckCircle2 size={15} />
                  <span>100% genuine guaranteed with local warranty</span>
                </div>
              </div>
            </div>

            <div className={styles.cargoTrackingWidget}>
              <div className={styles.trackingMockHeader}>
                <Plane size={16} />
                <span>Live Delivery Journey</span>
              </div>
              <div className={styles.trackingSteps}>
                <div className={styles.trackingStep}>
                  <div className={`${styles.stepDot} ${styles.done}`} />
                  <div className={styles.stepInfo}>
                    <strong>Order Confirmed</strong>
                    <span>Quality Inspected & Packed</span>
                  </div>
                </div>
                <div className={styles.trackingStep}>
                  <div className={`${styles.stepDot} ${styles.done}`} />
                  <div className={styles.stepInfo}>
                    <strong>Express Air Transit</strong>
                    <span>Direct Flight to Doha</span>
                  </div>
                </div>
                <div className={styles.trackingStep}>
                  <div className={`${styles.stepDot} ${styles.current}`} />
                  <div className={styles.stepInfo}>
                    <strong>Hamad Int’l Hub</strong>
                    <span>Customs Clearance</span>
                  </div>
                </div>
                <div className={styles.trackingStep}>
                  <div className={styles.stepDot} />
                  <div className={styles.stepInfo}>
                    <strong>Qatar Doorstep</strong>
                    <span>Delivered to Your Address</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 5.5: QATIFY COMBO DEALS & SHELL SHOCKER SPOTLIGHT
        ==================================================================== */}
        <HomeComboDealsSection />

        {/* ===================================================================
            SECTION 6: BEST-SELLING SMART ACCESSORIES & UNDER QAR 99
        ==================================================================== */}
        <section className={styles.shelfSection}>
          <div className={styles.shelfHeaderRow}>
            <div className={styles.shelfTitleGroup}>
              <div className={styles.shelfTagYellow}>
                <Sparkles size={14} />
                <span>POCKET-FRIENDLY FINDS</span>
              </div>
              <h2 className={styles.shelfHeading}>Super Deals Under QAR 99</h2>
            </div>
            <Link href="/shop?filter=under-99" className={styles.viewMoreBtn}>
              <span>View All Under 99</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.shelfGrid4Col}>
            {under99Products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 7: BEST SELLERS SHELF
        ==================================================================== */}
        <section className={styles.shelfSection}>
          <div className={styles.shelfHeaderRow}>
            <div className={styles.shelfTitleGroup}>
              <div className={styles.shelfTag}>
                <Flame size={14} />
                <span>TOP RATED BY CUSTOMERS</span>
              </div>
              <h2 className={styles.shelfHeading}>Best-Selling Flagships</h2>
            </div>
            <Link href="/shop?sort=rating" className={styles.viewMoreBtn}>
              <span>View Top Rated</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.shelfGrid4Col}>
            {bestSellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>

      {/* First-Time Visitor Signup 10% Discount Popup Modal */}
      <FirstTimeDiscountPopup />
    </div>
  );
}

