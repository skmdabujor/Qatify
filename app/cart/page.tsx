'use client';

// =============================================================================
// Qatify — Full Cart Page (`/cart`)
// Line Items + 6–10 Day Delivery Windows + Under QAR 35 Upsell + Order Summary
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Plane,
  ShieldCheck,
  Tag,
  Sparkles,
  Heart,
  ChevronRight,
  Headset,
  MessageCircle,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import styles from './page.module.scss';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    cartCount,
    freeShippingThreshold,
    freeShippingRemaining,
    isFreeShipping,
    updateQuantity,
    removeFromCart,
    clearCart,
    addToCart,
    toggleWishlist,
    showToast,
    openChat,
    appliedCoupon,
    appliedDiscountQAR,
    setCoupon,
    bundleItemCount,
    bundleTierPercent,
    bundleDiscountQAR,
  } = useShop();

  const convex = useConvex();
  const [couponCode, setCouponCode] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Delivery arrival preview dates
  const today = new Date();
  const minDeliveryDate = new Date(today);
  minDeliveryDate.setDate(today.getDate() + 6);
  const maxDeliveryDate = new Date(today);
  maxDeliveryDate.setDate(today.getDate() + 10);

  const deliveryDateString = `${minDeliveryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} – ${maxDeliveryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`;

  const progressPercent = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );

  const couponDiscount = appliedDiscountQAR || 0;
  const totalDiscount = couponDiscount + (bundleDiscountQAR || 0);
  const shippingFee = isFreeShipping || cart.length === 0 ? 0 : 20;
  const grandTotal = Math.max(0, cartSubtotal - totalDiscount + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    setIsValidatingCoupon(true);
    try {
      const res = await convex.query(api.coupons.validateCoupon, {
        code,
        subtotalQAR: cartSubtotal,
        currentDate: new Date().toISOString().slice(0, 10),
      });

      if (res.isValid && res.code) {
        setCoupon(res.code, res.discountQAR);
        showToast('Promo Code Applied! 🏷️', res.message, 'success');
        setCouponCode('');
      } else {
        showToast('Coupon Not Applied', res.message, 'warning');
      }
    } catch (err) {
      console.error('Coupon validation error:', err);
      showToast('Validation Error', 'Could not verify promo code.', 'error');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Impulse upsells under QAR 50 / QAR 35
  const impulseProducts = PRODUCTS.filter((p) => p.priceQAR <= 49).slice(0, 3);

  return (
    <div className={styles.cartPage}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumbNav}>
          <Link href="/" className={styles.crumbLink}>Home</Link>
          <ChevronRight size={13} className={styles.crumbChevron} />
          <span className={styles.currentCrumb}>Shopping Cart</span>
        </nav>

        <div className={styles.cartHeaderRow}>
          <div className={styles.headerTitleWrap}>
            <h1 className={styles.cartHeading}>Your Shopping Cart</h1>
            <span className={styles.cartCountPill}>
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className={styles.clearCartBtn}
            >
              Clear Entire Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className={styles.emptyCartCard}>
            <div className={styles.emptyIconCircle}>
              <ShoppingBag size={48} />
            </div>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyDesc}>
              Discover trending electronics, MagSafe wireless chargers, and smart lifestyle gear with 6–10 day tracked air delivery across Qatar.
            </p>
            <Link href="/shop" className={styles.startShoppingBtn}>
              <span>Explore Qatar Super Deals</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            {/* Left Column: Cart Items & Upsells */}
            <div className={styles.itemsColumn}>
              {/* Free Shipping Progress Alert */}
              <div className={styles.shippingAlertCard}>
                <div className={styles.alertContent}>
                  <div className={styles.alertIcon}>
                    <Plane size={20} />
                  </div>
                  <div className={styles.alertTextWrap}>
                    {isFreeShipping ? (
                      <p className={styles.freeUnlocked}>
                        🎉 <strong>Free Express Delivery in Qatar unlocked!</strong> Your order qualifies for free delivery.
                      </p>
                    ) : (
                      <p className={styles.freeNeeded}>
                        Add <strong className="price-qar">QAR {freeShippingRemaining}</strong> more to get <strong>FREE Express Delivery</strong> across Qatar!
                      </p>
                    )}
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className={styles.cartItemsList}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartItemRow}>
                    <div className={styles.itemImageWrap}>
                      <img
                        src={item.product.images[0] || '/placeholder.svg'}
                        alt={item.product.title}
                        className={styles.itemImage}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.endsWith('/placeholder.svg')) {
                            target.src = '/placeholder.svg';
                          }
                        }}
                      />
                    </div>

                    <div className={styles.itemMainCol}>
                      <div className={styles.itemHeader}>
                        <div className={styles.itemBrandAndTitle}>
                          <span className={styles.itemBrand}>{item.product.brand}</span>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className={styles.itemTitleLink}
                          >
                            <h3 className={styles.itemTitle}>{item.product.title}</h3>
                          </Link>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className={styles.deleteBtn}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Variant Badges */}
                      {(item.selectedColor || item.selectedOption) && (
                        <div className={styles.itemVariants}>
                          {item.selectedColor && (
                            <span className={styles.variantBadge}>
                              Color: {item.selectedColor}
                            </span>
                          )}
                          {item.selectedOption && (
                            <span className={styles.variantBadge}>
                              {item.selectedOption}
                            </span>
                          )}
                        </div>
                      )}

                      {/* 6-10 Day Delivery Timeline notice per item */}
                      <div className={styles.itemDeliveryNotice}>
                        <Plane size={12} className={styles.planeNoticeIcon} />
                        <span>Estimated Air Arrival in Qatar: <strong>{deliveryDateString}</strong></span>
                      </div>

                      {/* Pricing and Quantity Stepper */}
                      <div className={styles.itemFooterRow}>
                        <div className={styles.priceCol}>
                          <span className={styles.unitPrice}>
                            QAR {item.product.priceQAR}
                          </span>
                          {item.product.originalPriceQAR > item.product.priceQAR && (
                            <span className={styles.originalPrice}>
                              QAR {item.product.originalPriceQAR}
                            </span>
                          )}
                        </div>

                        <div className={styles.stepperAndSave}>
                          <div className={styles.stepper}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className={styles.stepBtn}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className={styles.stepQty}>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className={styles.stepBtn}
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              toggleWishlist(item.product);
                              removeFromCart(item.id);
                            }}
                            className={styles.saveForLaterBtn}
                          >
                            <Heart size={13} />
                            <span>Save for Later</span>
                          </button>
                        </div>

                        <div className={styles.lineItemTotal}>
                          <span>Total: </span>
                          <strong className="price-qar">
                            QAR {item.product.priceQAR * item.quantity}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Impulse Upsell Section: Under QAR 50 */}
              <div className={styles.upsellSection}>
                <div className={styles.upsellHeader}>
                  <Sparkles size={16} />
                  <span>Frequently Added Accessories Under QAR 50</span>
                </div>
                <div className={styles.upsellGrid}>
                  {impulseProducts.map((p) => (
                    <div key={p.id} className={styles.upsellCard}>
                      <img
                        src={p.images[0] || '/placeholder.svg'}
                        alt={p.title}
                        className={styles.upsellImg}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.endsWith('/placeholder.svg')) {
                            target.src = '/placeholder.svg';
                          }
                        }}
                      />
                      <div className={styles.upsellInfo}>
                        <h4 className={styles.upsellTitle}>{p.title}</h4>
                        <span className={styles.upsellPrice}>QAR {p.priceQAR}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(p, 1)}
                        className={styles.quickAddBtn}
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Order Summary */}
            <div className={styles.summaryColumn}>
              <div className={styles.summaryCard}>
                <h3 className={styles.summaryTitle}>Order Summary</h3>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                  <div className={styles.couponInputWrap}>
                    <Tag size={15} className={styles.couponTagIcon} />
                    <input
                      type="text"
                      placeholder="Promo Code (WELCOME10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className={styles.couponInput}
                    />
                  </div>
                  <button type="submit" className={styles.couponBtn}>
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className={styles.couponSuccessNotice}>
                    <span>Coupon <strong>{appliedCoupon}</strong> active (-QAR {couponDiscount})</span>
                    <button
                      type="button"
                      onClick={() => setCoupon(null, 0)}
                      className={styles.removeCouponAction}
                    >
                      Remove
                    </button>
                  </div>
                )}

                {bundleDiscountQAR > 0 && (
                  <div className={styles.couponSuccessNotice} style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}>
                    <span>🎁 <strong>Tiered Bundle ({bundleTierPercent}% OFF)</strong> active! (-QAR {bundleDiscountQAR.toLocaleString()})</span>
                  </div>
                )}

                {/* Summary Calculations */}
                <div className={styles.summaryRowsList}>
                  <div className={styles.summaryRow}>
                    <span>Items Subtotal</span>
                    <span className="price-qar">QAR {cartSubtotal.toLocaleString()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                      <span>Promo Coupon</span>
                      <span>- QAR {couponDiscount}</span>
                    </div>
                  )}

                  {bundleDiscountQAR > 0 && (
                    <div className={`${styles.summaryRow} ${styles.discountRow}`} style={{ color: '#16a34a' }}>
                      <span>Tiered Bundle ({bundleTierPercent}% OFF)</span>
                      <span>- QAR {bundleDiscountQAR.toLocaleString()}</span>
                    </div>
                  )}

                  <div className={styles.summaryRow}>
                    <div className={styles.shippingLabelCol}>
                      <span>Direct Tracked Air Express</span>
                      <span className={styles.shippingNotice}>6–10 Days to Qatar</span>
                    </div>
                    <span className="price-qar">
                      {isFreeShipping ? (
                        <strong className={styles.freeText}>FREE</strong>
                      ) : (
                        `QAR ${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className={`${styles.summaryRow} ${styles.grandTotalRow}`}>
                    <span>Total Amount (QAR)</span>
                    <span className={styles.grandTotalValue}>
                      QAR {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Primary Checkout CTA */}
                <button
                  type="button"
                  onClick={() => router.push('/checkout')}
                  className={styles.checkoutSubmitBtn}
                >
                  <span>Proceed to Qatar Checkout</span>
                  <ArrowRight size={17} />
                </button>

                <Link href="/shop" className={styles.continueShoppingLink}>
                  ← Continue Shopping Catalog
                </Link>

                {/* Assurance Badges */}
                <div className={styles.summaryTrustBox}>
                  <div className={styles.trustRow}>
                    <ShieldCheck size={16} />
                    <span>100% Quality Inspected before dispatch</span>
                  </div>
                  <div className={styles.trustRow}>
                    <Headset size={16} />
                    <span>24/7 dedicated support via WhatsApp & chat</span>
                  </div>
                  <div className={styles.trustRow}>
                    <Plane size={16} />
                    <span>Live step-by-step air tracking via Hamad Airport</span>
                  </div>
                </div>

                {/* Cart Live Chat Help Card */}
                <div className={styles.cartChatSupportCard}>
                  <div className={styles.cartChatText}>
                    <strong>Need help with your cart?</strong>
                    <span>Chat live with our Doha support team</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openChat('I have questions about my cart items or Qatar delivery.')}
                    className={styles.cartChatBtn}
                  >
                    <MessageCircle size={14} />
                    <span>Chat With Us</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

