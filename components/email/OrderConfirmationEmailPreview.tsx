'use client';

// =============================================================================
// Qatify — Order Confirmation Email Preview Component (React + Next.js + SCSS)
// Matches Qatify's official typography ('Plus Jakarta Sans', 'Nunito Sans', 'JetBrains Mono')
// and regional Qatar air express marketplace identity.
// =============================================================================

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  CheckCircle2,
  Copy,
  Mail,
  Send,
  Calendar,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import styles from './OrderConfirmationEmailPreview.module.scss';

export interface EmailOrderItem {
  productId: string;
  title: string;
  slug?: string;
  priceQAR: number;
  quantity: number;
  image: string;
  selectedColor?: string;
  selectedOption?: string;
}

export interface EmailOrderData {
  orderNumber: string;
  trackingNumber?: string;
  date?: string;
  estimatedDeliveryWindow?: string;
  subtotalQAR: number;
  shippingQAR: number;
  discountQAR?: number;
  totalQAR: number;
  couponCode?: string;
  paymentMethod: string;
  paymentStatus?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: EmailOrderItem[];
  address: {
    fullName: string;
    firstName?: string;
    lastName?: string;
    phone: string;
    email?: string;
    streetAddress?: string;
    streetNumber?: string;
    apartmentSuite?: string;
    buildingNumber?: string;
    unitNumber?: string;
    municipality: string;
    zoneNumber: string;
    postalCode?: string;
    country?: string;
  };
}

// Sample fallback order matching Mohammed Al-Sayed's QA-896533
export const SAMPLE_EMAIL_ORDER: EmailOrderData = {
  orderNumber: 'QA-896533',
  trackingNumber: 'QA-896533',
  date: 'Nov 14, 2026',
  estimatedDeliveryWindow: 'Nov 20 – Nov 24, 2026',
  subtotalQAR: 35,
  shippingQAR: 20,
  discountQAR: 0,
  totalQAR: 55,
  paymentMethod: 'polar',
  paymentStatus: 'paid',
  customerEmail: 'sheakmohammadabujor@gmail.com',
  customerPhone: '+974 55123456',
  address: {
    fullName: 'Mohammed Al-Sayed',
    firstName: 'Mohammed',
    lastName: 'Al-Sayed',
    phone: '+974 55123456',
    email: 'mohammed.alsayed@gmail.com',
    streetAddress: 'Al Sadd Street',
    apartmentSuite: 'Building 45, Apartment 3B',
    municipality: 'Doha',
    zoneNumber: 'Zone 24',
    postalCode: '9204',
    country: 'Qatar',
  },
  items: [
    {
      productId: 'qat-017',
      title: 'Porodo Multi-Functional 7-in-1 Electronic & Earbud Cleaning Kit',
      priceQAR: 35,
      quantity: 1,
      selectedColor: 'Clean White',
      image:
        'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
    },
  ],
};

interface OrderConfirmationEmailPreviewProps {
  order?: EmailOrderData;
  siteUrl?: string;
  onSendTest?: (recipientEmail: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  showToolbar?: boolean;
}

export const OrderConfirmationEmailPreview: React.FC<OrderConfirmationEmailPreviewProps> = ({
  order = SAMPLE_EMAIL_ORDER,
  siteUrl = 'https://shopqatify.com',
  onSendTest,
  showToolbar = true,
}) => {
  const [recipient, setRecipient] = useState(order.customerEmail || 'sheakmohammadabujor@gmail.com');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Derive Customer Name
  const customerFirstName =
    order.address?.firstName?.trim() ||
    order.address?.fullName?.trim().split(' ')[0] ||
    'Mohammed';

  // Dynamic Subject Line requested by user:
  // "Thanks for your order, Mohammed! (#QA-896533)"
  const emailSubject = `Thanks for your order, ${customerFirstName}! (#${order.orderNumber})`;

  const trackingNumber = order.trackingNumber || order.orderNumber;
  const deliveryWindow = order.estimatedDeliveryWindow || 'Nov 20 – Nov 24, 2026';
  const trackUrl = `${siteUrl}/track/${order.orderNumber}`;
  const whatsappUrl = `https://wa.me/8801304564836?text=${encodeURIComponent(
    `Hi Qatify, I have an inquiry regarding Order #${order.orderNumber}`
  )}`;

  // Format Qatar Address
  const streetPart = order.address.streetAddress || order.address.streetNumber || 'Al Sadd Street';
  const buildingPart =
    order.address.apartmentSuite ||
    order.address.buildingNumber ||
    'Building 45, Apartment 3B';
  const cityZonePart = `${order.address.municipality || 'Doha'}, ${
    order.address.zoneNumber?.startsWith('Zone')
      ? order.address.zoneNumber
      : `Zone ${order.address.zoneNumber || '24'}`
  }${order.address.postalCode ? `, ${order.address.postalCode}` : ''}, ${order.address.country || 'Qatar'}`;

  // Handle Send Test Email
  const handleSendTest = async () => {
    if (!recipient) return;
    setSending(true);
    setFeedback(null);
    try {
      if (onSendTest) {
        const res = await onSendTest(recipient);
        if (res.success) {
          setFeedback({
            type: 'success',
            message: res.message || `Test confirmation email dispatched to ${recipient}!`,
          });
        } else {
          setFeedback({
            type: 'error',
            message: res.error || 'Failed to dispatch email.',
          });
        }
      } else {
        // Direct API call if available
        const res = await fetch('/api/emails/test-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber: order.orderNumber,
            recipientEmail: recipient,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setFeedback({
            type: 'success',
            message: `Live confirmation email sent to ${recipient}! (ID: ${data.emailId || 'OK'})`,
          });
        } else {
          setFeedback({
            type: 'error',
            message: data.error || 'Failed to dispatch email.',
          });
        }
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error occurred dispatching test email.',
      });
    } finally {
      setSending(false);
    }
  };

  // Copy Subject line to clipboard
  const handleCopySubject = () => {
    navigator.clipboard.writeText(emailSubject);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.emailWrapper}>
      {/* 0. Optional Interactive Admin Toolbar */}
      {showToolbar && (
        <div className={styles.actionBar}>
          <div className={styles.actionBarInfo}>
            <div className={styles.subjectBadge}>
              <span className={styles.subjectTag}>Subject</span>
              <span>{emailSubject}</span>
            </div>
          </div>
          <div className={styles.actionBarButtons}>
            <button
              type="button"
              onClick={handleCopySubject}
              className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
              title="Copy email subject"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Subject'}
            </button>
            <button
              type="button"
              onClick={handleSendTest}
              disabled={sending}
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            >
              {sending ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
              Send Test to Abu Jor
            </button>
          </div>
        </div>
      )}

      {/* Status Feedback Banner */}
      {feedback && (
        <div
          className={`${styles.statusNotification} ${
            feedback.type === 'success'
              ? styles.statusNotificationSuccess
              : styles.statusNotificationError
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* =========================================================================
          MAIN 600PX EMAIL CARD
          Exact layout structure & styling provided by user, updated with site fonts & official logo
          ========================================================================= */}
      <div className={styles.emailCard}>
        {/* Header: Clean Marketplace Brand Identity with Site Logo */}
        <header className={styles.header}>
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.logoLink}
          >
            {/* Official site logo asset */}
            <img
              src="https://www.shopqatify.com/brand/qatify-final-logo.png"
              alt="Shop Qatify"
              className={styles.logoImage}
            />
          </a>
        </header>

        {/* Hero Confirmation Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Shukran, {customerFirstName}!</h1>
          <p className={styles.heroSubtitle}>
            Your order is confirmed &amp; secured. Items are being packed at our global air export hub
            for direct flight to Qatar.
          </p>
        </section>

        {/* Air Express Tracking & Delivery Window Section */}
        <section className={styles.trackingSection}>
          <div className={styles.trackingCard}>
            <div className={styles.trackingRow}>
              <span className={styles.trackingLabel}>Tracking Number</span>
              <span className={styles.trackingValue}>{trackingNumber}</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.deliveryWindowRow}>
              <div className={styles.deliveryLabel}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Estimated Doorstep Arrival:</span>
              </div>
              <span className={styles.deliveryValue}>{deliveryWindow}</span>
            </div>

            <a
              href={trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.trackCtaButton}
            >
              Track Your Air Shipment Live →
            </a>
          </div>
        </section>

        {/* Items in this Shipment Section */}
        <section className={styles.itemsSection}>
          <div className={styles.itemsHeader}>
            Items in this shipment ({order.items.length})
          </div>

          {order.items.map((item, index) => (
            <div key={`${item.productId}-${index}`} className={styles.itemRow}>
              <img
                src={item.image || 'https://placehold.co/128x128/F8FAFC/0F172A?text=Product'}
                alt={item.title}
                className={styles.itemThumbnail}
              />
              <div className={styles.itemDetails}>
                <div className={styles.itemTitle}>{item.title}</div>
                {item.selectedColor && (
                  <div className={styles.itemVariant}>
                    Color: <span>{item.selectedColor}</span>
                  </div>
                )}
                {item.selectedOption && (
                  <div className={styles.itemVariant}>
                    Option: <span>{item.selectedOption}</span>
                  </div>
                )}
                <div className={styles.itemQuantity}>
                  Qty: <strong>{item.quantity}</strong> × QAR {item.priceQAR.toLocaleString()}
                </div>
              </div>
              <div className={styles.itemPrice}>
                QAR {(item.priceQAR * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </section>

        {/* Payment Summary Box */}
        <section className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span>Items Subtotal</span>
              <span className={styles.summaryRowVal}>
                QAR {order.subtotalQAR.toLocaleString()}
              </span>
            </div>

            {order.discountQAR && order.discountQAR > 0 ? (
              <div className={`${styles.summaryRow} ${styles.summaryRowDiscount}`}>
                <span>Promo Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                <span className={styles.summaryRowVal}>
                  - QAR {order.discountQAR.toLocaleString()}
                </span>
              </div>
            ) : null}

            <div className={`${styles.summaryRow} ${styles.summaryRowDelivery}`}>
              <span>Delivery in Qatar</span>
              <span className={styles.summaryRowVal}>
                {order.shippingQAR === 0 ? (
                  <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span>
                ) : (
                  `QAR ${order.shippingQAR.toLocaleString()}`
                )}
              </span>
            </div>

            <div className={styles.summaryDashedLine} />

            <div className={styles.summaryTotalRow}>
              <span className={styles.totalLabel}>Total Amount</span>
              <span className={styles.totalAmount}>
                QAR {order.totalQAR.toLocaleString()}
              </span>
            </div>

            <div className={styles.paymentMethodRow}>
              <div className={styles.paymentMethodLabel}>
                Payment Method:{' '}
                <strong>
                  {order.paymentMethod === 'cash_on_delivery'
                    ? 'Cash on Delivery'
                    : 'Polar Gateway'}
                </strong>
              </div>
              {order.paymentMethod === 'cash_on_delivery' ? (
                <span className={styles.unpaidBadge}>Pending (COD)</span>
              ) : (
                <span className={styles.paidBadge}>Paid ✓</span>
              )}
            </div>
          </div>
        </section>

        {/* Delivery Destination Card */}
        <section className={styles.destinationSection}>
          <div className={styles.destinationCard}>
            <div className={styles.destinationTitle}>Delivery Destination (Qatar)</div>
            <div className={styles.recipientLine}>
              {order.address.fullName} &nbsp;•&nbsp;{' '}
              <a href={`tel:${order.address.phone}`} className={styles.phoneLink}>
                {order.address.phone}
              </a>
            </div>
            <div className={styles.addressLine}>
              {streetPart}, {buildingPart}
              <br />
              {cityZonePart}
            </div>
          </div>
        </section>

        {/* Light, Fresh Marketplace Footer */}
        <footer className={styles.footer}>
          <div className={styles.helpTitle}>Need help with your order or delivery?</div>

          <div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          <div className={styles.contactLinks}>
            WhatsApp Support:{' '}
            <a href="https://wa.me/8801304564836" target="_blank" rel="noopener noreferrer">
              +880 1304 564836
            </a>
            <span className={styles.contactSep}>|</span>
            Email:{' '}
            <a href="mailto:support@shopqatify.com" target="_blank" rel="noopener noreferrer">
              support@shopqatify.com
            </a>
          </div>

          <div className={styles.trustBadges}>
            100% Quality Inspected Before Flight Dispatch &nbsp;•&nbsp; 24/7 Dedicated Support
          </div>

          <div className={styles.copyright}>
            © 2026 Qatify Technologies W.L.L. Doha, State of Qatar.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default OrderConfirmationEmailPreview;
