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
  ToyBrick,
  Baby,
  Puzzle,
} from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { CircularCategoryNav } from '@/components/category';
import { FirstTimeDiscountPopup } from '@/components/popup/FirstTimeDiscountPopup';
import { HomeCategoriesSection } from '@/components/home/HomeCategoriesSection';
import { HeroBentoSlider } from '@/components/home/HeroBentoSlider';
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
    case 'ToyBrick':
      return <ToyBrick size={16} />;
    case 'Baby':
      return <Baby size={16} />;
    case 'Puzzle':
      return <Puzzle size={16} />;
    default:
      return <Sparkles size={16} />;
  }
};

export default function ShopHomePage() {
  // Real-time Convex database queries (aligned to 6-col grid: 12 items = 2 full rows of 6)
  const liveCategories = useQuery(api.categories.list, { limit: 12 });
  const liveTrending = useQuery(api.products.getTrending, { limit: 12 });
  const liveUnder99 = useQuery(api.products.getUnder99, { limit: 12 });
  const liveBestSellers = useQuery(api.products.getBestSellers, { limit: 12 });

  // Use live data with fallback to mock data while hydrating/loading
  const categories = liveCategories && liveCategories.length > 0
    ? liveCategories.map(toCategory)
    : CATEGORIES;
  const trendingProducts = liveTrending && liveTrending.length > 0
    ? liveTrending.map(toProduct)
    : PRODUCTS.filter((p) => p.isTrending).slice(0, 12);
  const under99Products = (
    liveUnder99 && liveUnder99.length > 0
      ? liveUnder99.map(toProduct)
      : PRODUCTS.filter((p) => p.isUnder99)
  ).slice(0, 12);
  const bestSellerProducts = liveBestSellers && liveBestSellers.length > 0
    ? liveBestSellers.map(toProduct)
    : PRODUCTS.filter((p) => p.isBestSeller).slice(0, 12);

  return (
    <div className={styles.homeContainer}>
      <div className="container">
        {/* ===================================================================
            SECTION 1: 3-PANEL BENTO HERO BANNER WITH INTERACTIVE LEFT SLIDER
        ==================================================================== */}
        <HeroBentoSlider />

        {/* ===================================================================
            SECTION 2: COMPACT 2-ROW CATEGORY RIBBON (High-Density Quick Filters)
        ==================================================================== */}
        <section className={styles.categoryRibbonSection}>
          <div className={styles.sectionHeaderCompact}>
            <div className={styles.sectionTitleBlock}>
              <h2 className={styles.sectionTitle}>Shop by Popular Category</h2>
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
            <img
              src="https://mellow-puma-618.eu-west-1.convex.cloud/api/storage/b8714d05-1279-4150-bda2-3f158eb13ec0"
              alt="Mega Tech Sale - Up to 60% Off Trending Gadgets"
              className={styles.promoBannerImg}
              width={1200}
              height={260}
              loading="lazy"
            />
          </Link>
        </section>

        {/* ===================================================================
            SECTION 3: CIRCULAR CATEGORY NAVIGATION (Between 60% Banner & Products)
        ==================================================================== */}
        <section className={styles.circularCategoryNavSection}>
          <CircularCategoryNav />
        </section>

        {/* ===================================================================
            SECTION 4: TRENDING THIS WEEK (Dense 4-Column Shelf)
        ==================================================================== */}
        <section className={styles.shelfSection}>
          <div className={styles.shelfHeaderRow}>
            <div className={styles.shelfTitleGroup}>
              <h2 className={styles.shelfHeading}>Trending This Week</h2>
            </div>
            <Link href="/shop?sort=trending" className={styles.viewMoreBtn}>
              <span>View All Trending</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.shelfGrid6Col}>
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 5: CATEGORIES SHOWCASE (MAIN CATEGORIES & PRODUCT PREVIEWS)
        ==================================================================== */}
        <HomeCategoriesSection />

        {/* ===================================================================
            SECTION 6: BEST-SELLING SMART ACCESSORIES & UNDER QAR 99
        ==================================================================== */}
        <section className={styles.shelfSection}>
          <div className={styles.shelfHeaderRow}>
            <div className={styles.shelfTitleGroup}>
              <h2 className={styles.shelfHeading}>Super Deals Under QAR 99</h2>
            </div>
            <Link href="/shop?filter=under-99" className={styles.viewMoreBtn}>
              <span>View All Under 99</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.shelfGrid6Col}>
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
              <h2 className={styles.shelfHeading}>Best Selling</h2>
            </div>
            <Link href="/shop?sort=rating" className={styles.viewMoreBtn}>
              <span>View Top Rated</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.shelfGrid6Col}>
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

