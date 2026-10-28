'use client';

// =============================================================================
// Qatify — Checkout Success & Instant Order Confirmation (`/checkout/success`)
// Displays Verified Qatar Air Express Tracking & Order Receipt
// =============================================================================

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  CheckCircle2,
  Plane,
  ShieldCheck,
  Package,
  MapPin,
  Clock,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import styles from '../page.module.scss';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';
  const method = searchParams.get('method') || '';
  const { clearCart } = useShop();

  const order = useQuery(api.orders.getByOrderNumber, {
    orderNumber: orderNumber || 'QA-000000',
  });

  const [copied, setCopied] = useState(false);

  // Clear cart upon arriving at success page
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  if (!orderNumber) {
    return (
      <div className={styles.orderSuccessPage}>
        <div className="container">
          <div className={styles.successCard}>
            <h2>Order Not Found</h2>
            <p className={styles.successSub}>No order number was provided in the URL.</p>
            <Link href="/shop" className={styles.backHomeBtn}>
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderSuccessPage}>
      <div className="container">
        <div className={styles.successCard}>
          <div className={styles.successIconCircle}>
            <CheckCircle2 size={54} />
          </div>

          <span className={styles.successPill}>
            {order?.paymentStatus === 'paid'
              ? 'PAYMENT VERIFIED • AIR FREIGHT BOOKED'
              : method === 'cod'
              ? 'COD ORDER CONFIRMED • CASH ON DELIVERY'
              : 'ORDER RECEIVED • PROCESSING'}
          </span>

          <h1 className={styles.successHeading}>Shukran! Your Order is Placed</h1>
          <p className={styles.successSub}>
            Your order has been recorded into Qatify cloud. We are preparing your items for
            prompt dispatch and tracked express delivery directly to your doorstep in Qatar.
          </p>

          {/* Primary Metadata Box */}
          <div className={styles.orderMetadataBox}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Order Number</span>
              <strong className={styles.metaValueMono}>{orderNumber}</strong>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Air Express Tracking</span>
              <strong className={styles.trackingNumberHighlight}>
                {order?.trackingNumber || `QAT-AIR-${orderNumber.replace('QA-', '')}`}
              </strong>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Delivery Destination</span>
              <span className={styles.metaValue}>
                {order?.address
                  ? `${order.address.municipality}, ${order.address.zoneNumber}, Bldg ${order.address.buildingNumber}`
                  : 'Qatar National Address'}
              </span>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Estimated Arrival</span>
              <strong className={styles.metaValue}>
                6–10 Business Days via Hamad Int’l Airport (DOH)
              </strong>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Total {order?.paymentStatus === 'paid' ? 'Paid' : 'Due'}</span>
              <strong className={styles.metaValuePrice}>
                QAR {order?.totalQAR ? order.totalQAR.toLocaleString() : '---'}
              </strong>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Payment Status</span>
              <span
                style={{
                  fontWeight: 700,
                  color: order?.paymentStatus === 'paid' ? '#059669' : '#d97706',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                }}
              >
                ● {order?.paymentStatus === 'paid' ? 'Paid & Authorized' : 'Pending Authorization'}
              </span>
            </div>
          </div>

          {/* VIP Reward Coupon Box (Rendered when 20 items were purchased) */}
          {order?.vipRewardCoupon && (
            <div
              style={{
                marginTop: '22px',
                marginBottom: '20px',
                padding: '18px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                border: '2px dashed #e06c2a',
                boxShadow: '0 4px 16px rgba(224, 108, 42, 0.18)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#c2410c',
                  fontWeight: 800,
                  fontSize: '15px',
                  marginBottom: '8px',
                }}
              >
                <span>🎁 EXCLUSIVE VIP REWARD UNLOCKED!</span>
              </div>
              <p
                style={{
                  fontSize: '13.5px',
                  color: '#9a3412',
                  marginBottom: '12px',
                  lineHeight: '1.4',
                }}
              >
                Congratulations on purchasing the 20-item Mega Bundle! Here is your exclusive single-use coupon for <strong>20% OFF on any single product</strong> on your next purchase:
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: '1px solid #fdba74',
                }}
              >
                <code
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#e06c2a',
                    letterSpacing: '0.08em',
                  }}
                >
                  {order.vipRewardCoupon}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    if (order.vipRewardCoupon) {
                      navigator.clipboard.writeText(order.vipRewardCoupon);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }
                  }}
                  style={{
                    background: '#e06c2a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {copied ? '✓ Copied!' : 'Copy Code'}
                </button>
              </div>
              <span
                style={{
                  display: 'block',
                  fontSize: '11px',
                  color: '#c2410c',
                  marginTop: '8px',
                  fontWeight: 500,
                }}
              >
                Valid for 60 days on Qatify catalog • Single redemption
              </span>
            </div>
          )}

          {/* Action CTAs */}
          <div className={styles.successCtaRow}>
            <Link
              href={`/dashboard?tab=tracking&order=${orderNumber}`}
              className={styles.trackShipmentBtn}
            >
              <Plane size={16} />
              <span>Track International Air Shipment</span>
            </Link>

            <Link href="/shop" className={styles.backHomeBtn}>
              <ShoppingBag size={15} style={{ marginRight: '6px' }} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '80px 20px', textAlign: 'center', color: '#666' }}>
          Loading order receipt...
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

