'use client';

// =============================================================================
// Qatify — Dynamic Product Detail Page (`/products/[slug]`)
// Gallery + Buy Box + Volume Discounts + Interactive 6-10 Day Qatar Timeline
// =============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toProduct } from '@/types/product';
import {
  Star,
  Heart,
  ShoppingCart,
  Plane,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Share2,
  Clock,
  MapPin,
  Package,
  Layers,
  ChevronRight,
  Flame,
  Plus,
  Minus,
  Sparkles,
  Zap,
  MessageCircle,
} from 'lucide-react';
import { PRODUCTS, QATAR_MUNICIPALITIES } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { useShop } from '@/context/ShopContext';
import styles from './page.module.scss';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const routeParams = useParams();

  // Extract slug synchronously from useParams to prevent Fast Refresh Suspense reloads
  const paramSlug = routeParams?.slug;
  const slug = (typeof paramSlug === 'string' ? paramSlug : Array.isArray(paramSlug) ? paramSlug[0] : '') || '';

  const { addToCart, toggleWishlist, isInWishlist, showToast, openChat } = useShop();

  const liveProduct = useQuery(api.products.getBySlug, slug ? { slug } : 'skip');
  const fallbackProduct = PRODUCTS.find((p) => p.slug === slug);
  const product = liveProduct ? toProduct(liveProduct) : fallbackProduct;

  // Gallery active image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState(
    product?.variants?.colors?.[0]?.name || ''
  );
  const [selectedOption, setSelectedOption] = useState(
    product?.variants?.options?.[0]?.values?.[0] || ''
  );
  const [quantity, setQuantity] = useState(1);

  // Sync variants when live product arrives
  useEffect(() => {
    if (product) {
      if (!selectedColor && product.variants?.colors?.[0]?.name) {
        setSelectedColor(product.variants.colors[0].name);
      }
      if (!selectedOption && product.variants?.options?.[0]?.values?.[0]) {
        setSelectedOption(product.variants.options[0].values[0]);
      }
    }
  }, [product, selectedColor, selectedOption]);

  // Municipality selector for 6-10 day dynamic timeline
  const [selectedMunicipality, setSelectedMunicipality] = useState(
    QATAR_MUNICIPALITIES[0].name
  );

  // Active information tab
  const [activeTab, setActiveTab] = useState<'specs' | 'contents' | 'shipping' | 'reviews'>('specs');

  // Related products from Convex or mock fallback (skipped if categorySlug is not yet loaded)
  const liveRelated = useQuery(
    api.products.list,
    product?.categorySlug
      ? {
          categorySlug: product.categorySlug,
          limit: 6,
        }
      : 'skip'
  );

  // Live verified reviews from Convex (skipped if productId/slug is not yet available to prevent validation errors)
  const reviewTargetId = product?.id || product?.slug || slug;
  const liveReviews = useQuery(
    api.reviews.listByProduct,
    reviewTargetId
      ? {
          productId: reviewTargetId,
          limit: 20,
        }
      : 'skip'
  );
  const submitReviewMutation = useMutation(api.reviews.submitReview);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLocation, setReviewLocation] = useState('Doha, Qatar');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Missing Fields', 'Please provide your name and review comment.', 'warning');
      return;
    }
    try {
      setIsSubmittingReview(true);
      await submitReviewMutation({
        productId: product?.id || product?.slug || slug,
        authorName: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        location: reviewLocation.trim() || 'Doha, Qatar',
      });
      showToast('Review Submitted! 🎉', 'Shukran for sharing your feedback with Qatar shoppers.', 'success');
      setReviewComment('');
      setShowReviewForm(false);
    } catch (err: any) {
      showToast('Submission Failed', err?.message || 'Could not submit review.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const relatedProducts = (
    liveRelated && liveRelated.length > 0
      ? liveRelated.filter((p) => (p.productId || p._id) !== product?.id).map(toProduct)
      : PRODUCTS.filter((p) => product && p.id !== product.id && p.categorySlug === product.categorySlug)
  ).slice(0, 5);

  if (liveProduct === null && !fallbackProduct) {
    notFound();
  }

  if (!product) {
    return (
      <div className={styles.productDetailPage}>
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <p>Loading product details from Qatar hub...</p>
        </div>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  // Calculate pricing based on volume discount if selected
  const activeVolumeTier = product.volumeDiscounts?.find((tier) => tier.quantity === quantity) || {
    pricePerUnitQAR: product.priceQAR,
  };
  const unitPrice = activeVolumeTier.pricePerUnitQAR;
  const totalPrice = unitPrice * quantity;

  // Calculate dynamic dates for timeline
  const today = new Date();
  const dispatchDate = new Date(today);
  dispatchDate.setDate(today.getDate() + 2);
  const flightDate = new Date(today);
  flightDate.setDate(today.getDate() + 4);
  const customsDate = new Date(today);
  customsDate.setDate(today.getDate() + 6);
  const finalDeliveryDate = new Date(today);
  finalDeliveryDate.setDate(today.getDate() + 9);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedOption);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedOption);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied! 🔗', 'Product URL copied to clipboard.');
    }
  };

  return (
    <div className={styles.productDetailPage}>
      <div className="container">
        {/* Breadcrumb Trail */}
        <nav className={styles.breadcrumbNav}>
          <Link href="/" className={styles.crumbLink}>Home</Link>
          <ChevronRight size={13} className={styles.crumbChevron} />
          <Link href="/shop" className={styles.crumbLink}>Catalog</Link>
          <ChevronRight size={13} className={styles.crumbChevron} />
          <Link href={`/shop?cat=${product.categorySlug}`} className={styles.crumbLink}>
            {product.category}
          </Link>
          <ChevronRight size={13} className={styles.crumbChevron} />
          <span className={styles.currentCrumb}>{product.title}</span>
        </nav>

        {/* ===================================================================
            MAIN PRODUCT STAGE: Gallery (Left) & Configuration / Buy Box (Right)
        ==================================================================== */}
        <div className={styles.mainStageGrid}>
          {/* Left Column: Media Gallery */}
          <div className={styles.galleryCol}>
            <div className={styles.mainImageStage}>
              {/* Badges Overlay */}
              <div className={styles.galleryBadges}>
                <span className={styles.discountBadge}>
                  -{product.discountPercent}% OFF
                </span>
                <span className={styles.qualityBadge}>
                  <ShieldCheck size={12} />
                  <span>Quality Inspected • Global Direct</span>
                </span>
              </div>

              <img
                src={(product.images && product.images.length > 0) ? (product.images[activeImageIndex] || product.images[0]) : '/placeholder.svg'}
                alt={product.title}
                className={styles.mainZoomImage}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/placeholder.svg')) {
                    target.src = '/placeholder.svg';
                  }
                }}
              />
            </div>

            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className={styles.thumbnailStrip}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`${styles.thumbBtn} ${
                      activeImageIndex === idx ? styles.activeThumb : ''
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className={styles.thumbImg}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith('/placeholder.svg')) {
                          target.src = '/placeholder.svg';
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Direct Air Express Delivery Trust Banner under Gallery */}
            <div className={styles.galleryDeliveryCard}>
              <div className={styles.delivIconCircle}>
                <Plane size={18} />
              </div>
              <div className={styles.delivCardText}>
                <strong>Direct Global Air Express • 6–10 Days to Qatar</strong>
                <p>
                  Departed via air freight to Hamad International Airport (DOH) with tracked electronic customs clearance.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Configuration & Buy Box */}
          <div className={styles.buyBoxCol}>
            {/* Header info: Brand, SKU, Title */}
            <div className={styles.headerInfoBlock}>
              <div className={styles.brandSkuRow}>
                <span className={styles.brandBadge}>{product.brand}</span>
                <span className={styles.skuText}>SKU: {product.id.toUpperCase()}</span>
                {product.badge && (
                  <span className={styles.spotlightBadge}>{product.badge}</span>
                )}
              </div>

              <h1 className={styles.productHeading}>{product.title}</h1>

              {/* Rating & Sold count */}
              <div className={styles.ratingAndStatsRow}>
                <div className={styles.starsWrapper}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      fill="#FACC15"
                      color="#FACC15"
                    />
                  ))}
                  <span className={styles.ratingScoreBold}>{product.rating}</span>
                </div>
                <span className={styles.statDivider}>•</span>
                <span className={styles.reviewCountText}>
                  {product.reviewCount} Verified Qatar Reviews
                </span>
                <span className={styles.statDivider}>•</span>
                <span className={styles.soldHighlight}>
                  <Flame size={13} />
                  <span>{product.soldCount} Sold in Qatar</span>
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className={styles.priceContainer}>
              <div className={styles.priceRowMain}>
                <div className={styles.currentPriceWrap}>
                  <span className={styles.qarSymbol}>QAR</span>
                  <span className={styles.qarNumber}>{unitPrice}</span>
                </div>
                {product.originalPriceQAR > unitPrice && (
                  <div className={styles.strikethroughPrice}>
                    QAR {product.originalPriceQAR * quantity}
                  </div>
                )}
                <div className={styles.savingsPill}>
                  Save QAR {(product.originalPriceQAR - unitPrice) * quantity}
                </div>
              </div>

              <p className={styles.taxNotice}>
                Price inclusive of all Qatar import customs duties & handling.
              </p>
            </div>

            {/* Volume Discounts Tier Box */}
            {product.volumeDiscounts && product.volumeDiscounts.length > 0 && (
              <div className={styles.volumeDiscountsBox}>
                <div className={styles.volumeHeader}>
                  <Sparkles size={14} />
                  <span>Multi-Buy Volume Dropship Discounts</span>
                </div>
                <div className={styles.volumeTiersList}>
                  {product.volumeDiscounts.map((tier) => (
                    <button
                      key={tier.quantity}
                      type="button"
                      onClick={() => setQuantity(tier.quantity)}
                      className={`${styles.volumeTierCard} ${
                        quantity === tier.quantity ? styles.selectedTier : ''
                      }`}
                    >
                      <div className={styles.tierQty}>
                        <strong>Buy {tier.quantity}</strong>
                      </div>
                      <div className={styles.tierPrice}>
                        <span className="price-qar">QAR {tier.pricePerUnitQAR}</span> / each
                      </div>
                      <div className={styles.tierSavings}>{tier.savingsText}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selectors: Colors */}
            {product.variants?.colors && product.variants.colors.length > 0 && (
              <div className={styles.variantGroup}>
                <span className={styles.variantLabel}>
                  Color: <strong>{selectedColor}</strong>
                </span>
                <div className={styles.colorSwatches}>
                  {product.variants.colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`${styles.colorChip} ${
                        selectedColor === color.name ? styles.activeChip : ''
                      }`}
                      title={color.name}
                    >
                      <span
                        className={styles.colorDot}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className={styles.colorText}>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selectors: Edition / Options */}
            {product.variants?.options && product.variants.options.length > 0 && (
              <div className={styles.variantGroup}>
                {product.variants.options.map((opt) => (
                  <div key={opt.name} className={styles.optBlock}>
                    <span className={styles.variantLabel}>
                      {opt.name}: <strong>{selectedOption}</strong>
                    </span>
                    <div className={styles.optionPills}>
                      {opt.values.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSelectedOption(val)}
                          className={`${styles.optionBtn} ${
                            selectedOption === val ? styles.activeOption : ''
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Stepper */}
            <div className={styles.quantitySection}>
              <span className={styles.variantLabel}>Quantity:</span>
              <div className={styles.quantityStepper}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={styles.stepBtn}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className={styles.stepValue}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className={styles.stepBtn}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className={styles.subtotalHint}>
                Subtotal: <strong>QAR {totalPrice}</strong>
              </span>
            </div>

            {/* Dual CTAs */}
            <div className={styles.ctaActionRow}>
              <button
                type="button"
                onClick={handleAddToCart}
                className={styles.primaryAddToCartBtn}
              >
                <ShoppingCart size={18} />
                <span>Add to Cart — QAR {totalPrice}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className={styles.expressBuyNowBtn}
              >
                <Zap size={18} />
                <span>Buy Now — Express Checkout</span>
              </button>
            </div>

            {/* Secondary actions: Wishlist, Share */}
            <div className={styles.secondaryActionsRow}>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`${styles.auxBtn} ${isFavorited ? styles.activeWish : ''}`}
              >
                <Heart size={16} fill={isFavorited ? '#E11D48' : 'none'} />
                <span>{isFavorited ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className={styles.auxBtn}
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>

            {/* ===============================================================
                INTERACTIVE 6–10 DAY QATAR DELIVERY TIMELINE CARD
            ================================================================ */}
            <div className={styles.deliveryTimelineCard}>
              <div className={styles.timelineCardHeader}>
                <div className={styles.timelineHeaderTitle}>
                  <Plane size={16} className={styles.yellowPlane} />
                  <span>Estimated Doorstep Delivery in Qatar</span>
                </div>

                {/* Municipality Selector */}
                <div className={styles.municipalitySelectWrap}>
                  <MapPin size={13} className={styles.pinIcon} />
                  <select
                    value={selectedMunicipality}
                    onChange={(e) => setSelectedMunicipality(e.target.value)}
                    className={styles.municipalitySelect}
                  >
                    {QATAR_MUNICIPALITIES.map((mun) => (
                      <option key={mun.code} value={mun.name}>
                        {mun.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.timelineCardBody}>
                <div className={styles.timelineWindowSummary}>
                  <span>Target Window: </span>
                  <strong suppressHydrationWarning>{formatDate(today)} — {formatDate(finalDeliveryDate)}</strong>
                  <span className={styles.windowPill}>6–10 Business Days</span>
                </div>

                {/* 5-Step Visual Route */}
                <div className={styles.timelineStepsFlow}>
                  <div className={styles.tStep}>
                    <div className={`${styles.tNode} ${styles.completed}`} />
                    <div className={styles.tContent}>
                      <span className={styles.tTitle}>Order Placed Today</span>
                      <span className={styles.tDate} suppressHydrationWarning>{formatDate(today)}</span>
                    </div>
                  </div>

                  <div className={styles.tStep}>
                    <div className={`${styles.tNode} ${styles.completed}`} />
                    <div className={styles.tContent}>
                      <span className={styles.tTitle}>Quality Check & Air Pack</span>
                      <span className={styles.tDate} suppressHydrationWarning>{formatDate(dispatchDate)}</span>
                    </div>
                  </div>

                  <div className={styles.tStep}>
                    <div className={`${styles.tNode} ${styles.current}`} />
                    <div className={styles.tContent}>
                      <span className={styles.tTitle}>Direct Flight to Qatar</span>
                      <span className={styles.tDate} suppressHydrationWarning>{formatDate(flightDate)}</span>
                    </div>
                  </div>

                  <div className={styles.tStep}>
                    <div className={styles.tNode} />
                    <div className={styles.tContent}>
                      <span className={styles.tTitle}>Hamad Airport Customs</span>
                      <span className={styles.tDate} suppressHydrationWarning>{formatDate(customsDate)}</span>
                    </div>
                  </div>

                  <div className={styles.tStep}>
                    <div className={styles.tNode} />
                    <div className={styles.tContent}>
                      <span className={styles.tTitle}>Doorstep in {selectedMunicipality.split(' ')[0]}</span>
                      <span className={styles.tDate} suppressHydrationWarning>{formatDate(finalDeliveryDate)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.timelineGuaranteesRow}>
                  <div className={styles.tGuarantee}>
                    <CheckCircle2 size={13} />
                    <span>Insured doorstep delivery across Qatar</span>
                  </div>
                  <div className={styles.tGuarantee}>
                    <CheckCircle2 size={13} />
                    <span>14-day defect replacement policy</span>
                  </div>
                </div>

                {/* Live Chat Support Strip */}
                <div className={styles.productChatHelpStrip}>
                  <div className={styles.helpTextCol}>
                    <span className={styles.helpHeading}>Have questions about {product.title}?</span>
                    <span className={styles.helpSub}>
                      Chat live with our Doha electronics specialist for compatibility & bulk inquiries.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openChat(`I have a question about ${product.title} (QAR ${unitPrice})`)}
                    className={styles.productChatBtn}
                  >
                    <MessageCircle size={15} />
                    <span>Chat With Us</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            TABBED TECHNICAL INFORMATION SECTION
        ==================================================================== */}
        <section className={styles.tabbedInfoSection}>
          <div className={styles.tabHeaders}>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`${styles.tabBtn} ${activeTab === 'specs' ? styles.activeTab : ''}`}
            >
              Technical Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contents')}
              className={`${styles.tabBtn} ${activeTab === 'contents' ? styles.activeTab : ''}`}
            >
              Package Contents ({product.packageContents?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`${styles.tabBtn} ${activeTab === 'shipping' ? styles.activeTab : ''}`}
            >
              Shipping & 14-Day Guarantee
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
            >
              Verified Reviews ({product.reviewCount || 0})
            </button>
          </div>

          <div className={styles.tabContentCard}>
            {/* Tab 1: Specifications Table (Alternating Monochrome Rows) */}
            {activeTab === 'specs' && (
              <div className={styles.specsTab}>
                <h3 className={styles.tabHeading}>Hardware & Engineering Specifications</h3>
                <table className={styles.specsTable}>
                  <tbody>
                    {Object.entries(product.specifications || {}).map(([key, value], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? styles.evenRow : styles.oddRow}
                      >
                        <td className={styles.specKey}>{key}</td>
                        <td className={styles.specVal}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 2: Package Contents */}
            {activeTab === 'contents' && (
              <div className={styles.contentsTab}>
                <h3 className={styles.tabHeading}>What’s Inside the Retail Box</h3>
                <ul className={styles.contentsList}>
                  {(product.packageContents || []).map((item, idx) => (
                    <li key={idx} className={styles.contentItem}>
                      <CheckCircle2 size={16} className={styles.checkIcon} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tab 3: Shipping & 14-Day Guarantee */}
            {activeTab === 'shipping' && (
              <div className={styles.shippingTab}>
                <h3 className={styles.tabHeading}>Qatify Qatar Delivery & Return Policy</h3>
                <div className={styles.policyGrid}>
                  <div className={styles.policyCard}>
                    <Plane size={22} className={styles.policyIcon} />
                    <h4>6–10 Days Direct Air Freight</h4>
                    <p>
                      Orders board direct commercial air cargo to Hamad International Airport (DOH). Customs clearance takes 24–48 hours, followed by courier doorstep delivery across Doha, Lusail, Al Rayyan, Al Wakrah, and Al Khor.
                    </p>
                  </div>

                  <div className={styles.policyCard}>
                    <ShieldCheck size={22} className={styles.policyIcon} />
                    <h4>100% Quality Inspection</h4>
                    <p>
                      Prior to air dispatch, each unit is checked for cosmetic integrity, battery charging safety, and accessory completeness. Tamper-evident seals applied.
                    </p>
                  </div>

                  <div className={styles.policyCard}>
                    <RotateCcw size={22} className={styles.policyIcon} />
                    <h4>14-Day Return Protection</h4>
                    <p>
                      If any item arrives defective or does not match specifications, contact our Doha support team via WhatsApp for an immediate free local replacement.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Verified Reviews */}
            {activeTab === 'reviews' && (
              <div className={styles.reviewsTab}>
                <div className={styles.reviewsSummaryRow}>
                  <div className={styles.reviewScoreCard}>
                    <span className={styles.hugeScore}>{product.rating}</span>
                    <div className={styles.scoreStars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={15} fill="#FACC15" color="#FACC15" />
                      ))}
                    </div>
                    <span className={styles.totalRevLabel}>
                      Based on {product.reviewCount} Qatar Shoppers
                    </span>
                  </div>

                  <div className={styles.ratingBars}>
                    <div className={styles.barRow}>
                      <span>5 Star</span>
                      <div className={styles.barTrack}>
                        <div className={styles.barFill} style={{ width: '85%' }} />
                      </div>
                      <span>85%</span>
                    </div>
                    <div className={styles.barRow}>
                      <span>4 Star</span>
                      <div className={styles.barTrack}>
                        <div className={styles.barFill} style={{ width: '12%' }} />
                      </div>
                      <span>12%</span>
                    </div>
                    <div className={styles.barRow}>
                      <span>3 Star</span>
                      <div className={styles.barTrack}>
                        <div className={styles.barFill} style={{ width: '3%' }} />
                      </div>
                      <span>3%</span>
                    </div>
                  </div>
                </div>

                {/* Write Review Action Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #e4e4e7' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0a0a0c' }}>
                    Customer Reviews ({liveReviews && liveReviews.length > 0 ? liveReviews.length : product.reviewCount})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: showReviewForm ? '#f4f4f5' : '#0a0a0c',
                      color: showReviewForm ? '#0a0a0c' : '#ffffff',
                      border: '1px solid #e4e4e7',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {showReviewForm ? 'Cancel' : '✍️ Write a Review'}
                  </button>
                </div>

                {/* Inline Review Submission Form */}
                {showReviewForm && (
                  <form
                    onSubmit={handleReviewSubmit}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '18px',
                      marginBottom: '24px',
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0a0a0c', marginBottom: '6px' }}>
                        Your Rating
                      </label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                            }}
                          >
                            <Star
                              size={20}
                              fill={star <= reviewRating ? '#FACC15' : 'transparent'}
                              color={star <= reviewRating ? '#FACC15' : '#a1a1aa'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#52525b', marginBottom: '4px' }}>
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Tariq Al-Mansoor"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#52525b', marginBottom: '4px' }}>
                          Location in Qatar
                        </label>
                        <input
                          type="text"
                          value={reviewLocation}
                          onChange={(e) => setReviewLocation(e.target.value)}
                          placeholder="e.g. Lusail, Qatar"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#52525b', marginBottom: '4px' }}>
                        Review Comment
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience regarding delivery time, product quality, or features..."
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#e11d48',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: isSubmittingReview ? 'not-allowed' : 'pointer',
                        opacity: isSubmittingReview ? 0.7 : 1,
                      }}
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Post Verified Review'}
                    </button>
                  </form>
                )}

                {/* Verified Reviews List (Live from Convex or Fallback) */}
                <div className={styles.sampleReviewsList}>
                  {liveReviews && liveReviews.length > 0 ? (
                    liveReviews.map((rev) => (
                      <div key={rev._id} className={styles.reviewItem}>
                        <div className={styles.revHeader}>
                          <span className={styles.revAuthor}>
                            {rev.authorName} ({rev.location})
                          </span>
                          {rev.verifiedBuyer && (
                            <span className={styles.revVerified}>✓ Verified Qatar Buyer</span>
                          )}
                          <span className={styles.revDate}>{rev.date}</span>
                        </div>
                        <div className={styles.revRating}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              fill={s <= rev.rating ? '#FACC15' : 'transparent'}
                              color={s <= rev.rating ? '#FACC15' : '#cbd5e1'}
                            />
                          ))}
                        </div>
                        <p className={styles.revBody}>{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className={styles.reviewItem}>
                        <div className={styles.revHeader}>
                          <span className={styles.revAuthor}>Nasser K. (Lusail)</span>
                          <span className={styles.revVerified}>✓ Verified Qatar Buyer</span>
                          <span className={styles.revDate}>3 days ago</span>
                        </div>
                        <div className={styles.revRating}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} fill="#FACC15" color="#FACC15" />
                          ))}
                        </div>
                        <p className={styles.revBody}>
                          Arrived in exactly 7 days to my apartment in Fox Hills, Lusail. The tracking from Shenzhen hub to Hamad Airport customs was very accurate. Product quality is authentic and feels premium.
                        </p>
                      </div>

                      <div className={styles.reviewItem}>
                        <div className={styles.revHeader}>
                          <span className={styles.revAuthor}>Fatima A. (Al Rayyan)</span>
                          <span className={styles.revVerified}>✓ Verified Qatar Buyer</span>
                          <span className={styles.revDate}>1 week ago</span>
                        </div>
                        <div className={styles.revRating}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} fill="#FACC15" color="#FACC15" />
                          ))}
                        </div>
                        <p className={styles.revBody}>
                          Ordered 2 units with the volume discount. Saved quite a bit compared to local retail mall prices in Doha. Highly recommended dropshipper!
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================================
            RELATED PRODUCTS SHELF
        ==================================================================== */}
        {relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.relatedHeader}>
              <h2 className={styles.relatedTitle}>Customers Also Ordered in Qatar</h2>
              <Link href={`/shop?cat=${product.categorySlug}`} className={styles.viewCategoryLink}>
                More in {product.category} →
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

