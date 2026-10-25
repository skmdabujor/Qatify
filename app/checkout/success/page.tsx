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
            Your order has been recorded into Qatify cloud. We are routing your items to our
            Shenzhen export center for express air transit to Hamad International Airport (DOH).
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

