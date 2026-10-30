'use client';

// =============================================================================
// Qatify — Dedicated Wholesale Tiered Bundle Cart (`/bundle-cart`)
// 100% Isolated from Regular Cart — Tiered Savings Apply Strictly to Bundle Items
// - Tiers: 5 items = 5%, 10 items = 10%, 15 items = 15%, 20 items = 20%
// =============================================================================

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Plane,
  ShieldCheck,
  Gift,
  Tag,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Check,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import {
  ApplePayIcon,
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  GooglePayIcon,
  QarCurrencyIcon,
} from '@/components/ui/PaymentIcons';
import { useShop } from '@/context/ShopContext';
import styles from './page.module.scss';

function BundleCartContent() {
  const router = useRouter();
  const {
    bundleCart,
    bundleItemCount,
    bundleSubtotal,
    bundleTierPercent,
    bundleDiscountQAR,
    bundleFinalTotal,
    updateBundleQuantity,
    removeFromBundleCart,
    clearBundleCart,
  } = useShop();

  // Motivation message
  const getMotivation = () => {
    if (bundleItemCount < 5) {
      const remaining = 5 - bundleItemCount;
      return {
        text: `Add ${remaining} more item${remaining > 1 ? 's' : ''} in Bundle Studio to unlock 5% OFF!`,
        action: 'Add Items for 5% OFF',
      };
    }
    if (bundleItemCount < 10) {
      const remaining = 10 - bundleItemCount;
      return {
        text: `5% OFF Active! Add ${remaining} more item${remaining > 1 ? 's' : ''} to unlock 10% OFF!`,
        action: 'Upgrade to 10% OFF',
      };
    }
    if (bundleItemCount < 15) {
      const remaining = 15 - bundleItemCount;
      return {
        text: `10% OFF Active! Add ${remaining} more item${remaining > 1 ? 's' : ''} to unlock 15% OFF!`,
        action: 'Upgrade to 15% OFF',
      };
    }
    if (bundleItemCount < 20) {
      const remaining = 20 - bundleItemCount;
      return {
        text: `15% OFF Active! Add ${remaining} more item${remaining > 1 ? 's' : ''} for MAX 20% OFF + VIP Gift!`,
        action: 'Unlock 20% + VIP Gift',
      };
    }
    return {
      text: '🏆 MAX TIER ACHIEVED: 20% Wholesale Discount + Next Purchase VIP Gift Unlocked!',
      action: null,
    };
  };

  const motivation = getMotivation();

  const handleProceedToCheckout = () => {
    router.push('/checkout?mode=bundle');
  };

  return (
    <div className={styles.bundleCartPage}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumbNav}>
          <Link href="/" className={styles.crumbLink}>Home</Link>
          <ChevronRight size={13} className={styles.crumbChevron} />
          <Link href="/bundle-builder" className={styles.crumbLink}>Bundle Studio</Link>
          <ChevronRight size={13} className={styles.crumbChevron} />
          <span className={styles.currentCrumb}>Dedicated Bundle Cart</span>
        </nav>

        {/* Isolation Alert Banner */}
        <div className={styles.isolationAlert}>
          <div className={styles.isolationIconWrap}>
            <Lock size={16} />
          </div>
          <div className={styles.isolationText}>
            <strong>Dedicated Wholesale Bundle Cart:</strong> This cart operates independently from your regular cart.
            Tiered discounts (5% to 20% OFF) apply strictly to items built in our Bundle Studio.
          </div>
        </div>

        {/* 4-Tier Ladder Visual */}
        <div className={styles.tierLadderGrid}>
          <div
            className={`${styles.tierCard} ${
              bundleItemCount >= 5 && bundleItemCount < 10 ? styles.activeTier : ''
            } ${bundleItemCount >= 10 ? styles.unlockedTier : ''}`}
          >
            <div className={styles.tierDot}>
              {bundleItemCount >= 5 ? <Check size={14} strokeWidth={3} /> : '5'}
            </div>
            <div className={styles.tierInfo}>
              <strong>5 Items: 5% OFF</strong>
              <span>{bundleItemCount >= 5 ? '✓ Unlocked' : 'Starter Tier'}</span>
            </div>
          </div>

          <div
            className={`${styles.tierCard} ${
              bundleItemCount >= 10 && bundleItemCount < 15 ? styles.activeTier : ''
            } ${bundleItemCount >= 15 ? styles.unlockedTier : ''}`}
          >
            <div className={styles.tierDot}>
              {bundleItemCount >= 10 ? <Check size={14} strokeWidth={3} /> : '10'}
            </div>
            <div className={styles.tierInfo}>
              <strong>10 Items: 10% OFF</strong>
              <span>{bundleItemCount >= 10 ? '✓ Unlocked' : 'Popular Tier'}</span>
            </div>
          </div>

          <div
            className={`${styles.tierCard} ${
              bundleItemCount >= 15 && bundleItemCount < 20 ? styles.activeTier : ''
            } ${bundleItemCount >= 20 ? styles.unlockedTier : ''}`}
          >
            <div className={styles.tierDot}>
              {bundleItemCount >= 15 ? <Check size={14} strokeWidth={3} /> : '15'}
            </div>
            <div className={styles.tierInfo}>
              <strong>15 Items: 15% OFF</strong>
              <span>{bundleItemCount >= 15 ? '✓ Unlocked' : 'Pro Saver'}</span>
            </div>
          </div>

          <div
            className={`${styles.tierCard} ${
              bundleItemCount >= 20 ? styles.activeTier : ''
            }`}
          >
            <div className={styles.tierDot}>
              {bundleItemCount >= 20 ? <Check size={14} strokeWidth={3} /> : <Gift size={13} />}
            </div>
            <div className={styles.tierInfo}>
              <strong>20 Items: 20% OFF</strong>
              <span>{bundleItemCount >= 20 ? '✓ Max VIP Tier' : 'VIP Gift Tier'}</span>
            </div>
          </div>
        </div>

        {/* Header Row */}
        <div className={styles.cartHeaderRow}>
          <div className={styles.headerTitleWrap}>
            <h1 className={styles.cartHeading}>Your Wholesale Bundle Cart</h1>
            <span className={styles.cartCountPill}>
              {bundleItemCount} {bundleItemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          {bundleCart.length > 0 && (
            <button
              type="button"
              onClick={clearBundleCart}
              className={styles.clearCartBtn}
            >
              Clear Entire Bundle
            </button>
          )}
        </div>

        {/* Empty State */}
        {bundleCart.length === 0 ? (
          <div className={styles.emptyCartCard}>
            <div className={styles.emptyIconCircle}>
              <Layers size={46} />
            </div>
            <h2 className={styles.emptyTitle}>Your Bundle Cart is Empty</h2>
            <p className={styles.emptyDesc}>
              Pick 5 to 20 products from our Bundle Studio to unlock wholesale tiered discounts up to 20% OFF with direct tracked air delivery across Qatar.
            </p>
            <Link href="/bundle-builder" className={styles.startShoppingBtn}>
              <span>Open Bundle Studio</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            {/* Progress / Motivation Banner */}
            <div className={styles.motivationCard}>
              <div className={styles.motivationLeft}>
                <Sparkles size={18} className={styles.motivationIcon} />
                <div className={styles.motivationText}>
                  {motivation.text}
                </div>
              </div>
              {motivation.action && (
                <Link href="/bundle-builder" className={styles.addMoreStudioBtn}>
                  <Plus size={14} />
                  <span>{motivation.action}</span>
                </Link>
              )}
            </div>

            {/* Cart Layout */}
            <div className={styles.cartLayout}>
              {/* Left Column: Items List */}
              <div className={styles.itemsList}>
                {bundleCart.map((item) => {
                  const unitOriginal = item.product.priceQAR;
                  const unitDiscount =
                    bundleTierPercent > 0
                      ? Math.round((unitOriginal * bundleTierPercent) / 100)
                      : 0;
                  const unitFinal = unitOriginal - unitDiscount;
                  const lineTotal = unitFinal * item.quantity;

                  return (
                    <div key={item.id} className={styles.cartItemCard}>
                      <div className={styles.itemImageWrap}>
                        <img
                          src={item.product.images[0] || '/placeholder.svg'}
                          alt={item.product.title}
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.endsWith('/placeholder.svg')) {
                              target.src = '/placeholder.svg';
                            }
                          }}
                        />
                      </div>

                      <div className={styles.itemMainInfo}>
                        {item.product.brand && (
                          <span className={styles.itemBrand}>{item.product.brand}</span>
                        )}
                        <h3 className={styles.itemTitle}>
                          <Link href={`/products/${item.product.slug}`}>
                            {item.product.title}
                          </Link>
                        </h3>

                        <div className={styles.itemVariants}>
                          {item.selectedColor && (
                            <span className={styles.variantPill}>Color: {item.selectedColor}</span>
                          )}
                          {item.selectedOption && (
                            <span className={styles.variantPill}>{item.selectedOption}</span>
                          )}
                        </div>

                        {bundleTierPercent > 0 && (
                          <div className={styles.tierSavingsBadge}>
                            <Tag size={12} />
                            <span>{bundleTierPercent}% Bundle Tier Discount Applied</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.itemActionsCol}>
                        <div className={styles.priceCol}>
                          <span className={styles.unitPrice}>
                            QAR {lineTotal.toLocaleString()}
                          </span>
                          {bundleTierPercent > 0 && (
                            <span className={styles.strikePrice}>
                              QAR {(unitOriginal * item.quantity).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className={styles.stepperRow}>
                          <div className={styles.stepper}>
                            <button
                              type="button"
                              onClick={() => updateBundleQuantity(item.id, -1)}
                              className={styles.stepBtn}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className={styles.stepQty}>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateBundleQuantity(item.id, 1)}
                              className={styles.stepBtn}
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromBundleCart(item.id)}
                            className={styles.removeBtn}
                            aria-label="Remove item from bundle"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Order Summary Card */}
              <aside className={styles.summaryCard}>
                <h2 className={styles.summaryHeading}>Bundle Order Summary</h2>

                <div className={styles.summaryLines}>
                  <div className={styles.summaryLine}>
                    <span>Bundle Subtotal</span>
                    <span className="price-qar">QAR {bundleSubtotal.toLocaleString()}</span>
                  </div>

                  {bundleDiscountQAR > 0 ? (
                    <div className={`${styles.summaryLine} ${styles.discountLine}`}>
                      <span>Tier Discount ({bundleTierPercent}% OFF)</span>
                      <span>- QAR {bundleDiscountQAR.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className={styles.summaryLine}>
                      <span>Tier Discount</span>
                      <span style={{ color: '#ea580c', fontSize: '12px' }}>
                        Add {5 - bundleItemCount} more for 5% OFF
                      </span>
                    </div>
                  )}

                  <div className={`${styles.summaryLine} ${styles.totalLine}`}>
                    <span>Total Amount (QAR)</span>
                    <span className={styles.grandPrice}>
                      QAR {bundleFinalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className={styles.checkoutCtaBtn}
                >
                  <span>Proceed to Qatar Checkout</span>
                  <ArrowRight size={17} />
                </button>

                <Link href="/bundle-builder" className={styles.backStudioLink}>
                  ← Edit Bundle in Studio
                </Link>

                {/* Guaranteed Safe & Secure Checkout Trust Card */}
                <div className={styles.paymentTrustCard}>
                  <div className={styles.paymentTrustHeader}>
                    <div className={styles.paymentTrustTitleWrap}>
                      <ShieldCheck size={15} />
                      <span>Guaranteed Safe & Secure Checkout</span>
                    </div>
                    <div className={styles.paymentSecurityBadge}>
                      <Lock size={11} />
                      <span>256-Bit SSL</span>
                    </div>
                  </div>

                  {/* Payment Card Badges Row */}
                  <div className={styles.paymentCardsGrid} aria-label="Accepted Payment Methods in Qatar">
                    <span className={styles.payCardBadge} title="Apple Pay — Touch ID / Face ID Instant Pay">
                      <ApplePayIcon width={40} height={26} />
                    </span>
                    <span className={styles.payCardBadge} title="Visa Debit & Credit Cards">
                      <VisaIcon width={40} height={26} />
                    </span>
                    <span className={styles.payCardBadge} title="Mastercard">
                      <MastercardIcon width={40} height={26} />
                    </span>
                    <span className={styles.payCardBadge} title="American Express">
                      <AmexIcon width={40} height={26} />
                    </span>
                    <span className={styles.payCardBadge} title="Google Pay">
                      <GooglePayIcon width={40} height={26} />
                    </span>
                    <span className={styles.payCardBadge} title="Official Qatari Riyal (ر.ق)">
                      <QarCurrencyIcon width={40} height={26} />
                    </span>
                  </div>

                  {/* Payment Trust Bullet Highlights */}
                  <div className={styles.paymentTrustHighlights}>
                    <div className={styles.trustHighlightItem}>
                      <CheckCircle2 size={12} />
                      <span>100% Buyer Protection Guaranteed</span>
                    </div>
                    <div className={styles.trustHighlightItem}>
                      <CheckCircle2 size={12} />
                      <span>Qatar Debit & Credit Cards</span>
                    </div>
                    <div className={styles.trustHighlightItem}>
                      <CheckCircle2 size={12} />
                      <span>Zero Processing Surcharge</span>
                    </div>
                  </div>
                </div>

                <div className={styles.trustBox}>
                  <div className={styles.trustRow}>
                    <Plane size={15} />
                    <span>Direct Air Express to Qatar</span>
                  </div>
                  <div className={styles.trustRow}>
                    <ShieldCheck size={15} />
                    <span>100% Quality Inspected before dispatch</span>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function BundleCartPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px 20px', textAlign: 'center' }}>Loading Bundle Cart...</div>}>
      <BundleCartContent />
    </Suspense>
  );
}

