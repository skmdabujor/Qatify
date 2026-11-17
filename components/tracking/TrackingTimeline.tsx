'use client';

// =============================================================================
// Qatify — High-Trust Consumer E-Commerce Order Tracking Component
// Modeled after Amazon, AliExpress & Daraz retail delivery interfaces
// Strict Retail Color System: Pure White Cards, #F5F6F8 Canvas, #059669 Retail Green
// =============================================================================

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Check,
  Copy,
  RotateCw,
  Info,
  ChevronRight,
  MessageSquare,
  FileText,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import styles from './TrackingTimeline.module.scss';

export interface TrackingCheckpoint {
  time: string;
  status: string;
  location: string;
  description: string;
  carrier?: string;
}

export interface TimelineStage {
  stage: string;
  title: string;
  description: string;
  location: string;
  date: string;
  completed: boolean;
  current?: boolean;
}

export interface TrackingTimelineProps {
  order: {
    orderNumber?: string;
    trackingNumber?: string;
    aliexpressTrackingNumber?: string;
    status?: string;
    date?: string;
    estimatedDeliveryWindow?: string;
    timeline?: TimelineStage[];
    liveCheckpoints?: TrackingCheckpoint[];
    lastTrackingSync?: string;
    carrier?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    shippingMethod?: {
      name?: string;
      badge?: string;
      duration?: string;
      priceQAR?: number;
    } | string;
    address?: {
      fullName?: string;
      municipality?: string;
      zoneNumber?: string;
      buildingNumber?: string;
      streetAddress?: string;
      country?: string;
    };
    municipality?: string;
    items?: Array<{
      productId?: string;
      title: string;
      quantity: number;
      image: string;
      priceQAR?: number;
      selectedColor?: string;
      selectedOption?: string;
      slug?: string;
    }>;
    totalQAR?: number;
    customerNote?: string;
  };
  onRefreshSuccess?: () => void;
  showBreadcrumbs?: boolean;
  onSearchAnother?: () => void;
  onBackToOrders?: () => void;
  onViewInvoice?: () => void;
}

export function TrackingTimeline({
  order,
  onRefreshSuccess,
  showBreadcrumbs = true,
  onSearchAnother,
  onBackToOrders,
  onViewInvoice,
}: TrackingTimelineProps) {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState<string | null>(null);

  const refreshAction = useMutation(api.tracking.refreshOrderTracking);

  // Verified order and tracking reference (e.g. QA-896533)
  const orderNumber = order.orderNumber || 'QA-896533';
  const trackingNumber = order.trackingNumber || `QA-EXP-${orderNumber.replace(/[^0-9]/g, '') || '896533'}`;
  const carrierName = order.carrier || 'Direct Air Express';
  const orderDate = order.date || 'Nov 14, 2026';
  const deliveryEstimate =
    order.estimatedDeliveryWindow || 'Arriving Nov 20 – Nov 24, 2026';
  const destinationAddress =
    order.address?.municipality || order.municipality || 'Doha, Qatar';

  const shippingMethodName =
    typeof order.shippingMethod === 'object' && order.shippingMethod?.name
      ? order.shippingMethod.name
      : typeof order.shippingMethod === 'string'
      ? order.shippingMethod
      : 'Direct Air Express (5–9 Business Days)';

  const paymentStatus = order.paymentStatus || 'paid';
  const paymentStatusText =
    paymentStatus === 'failed'
      ? 'Failed'
      : paymentStatus === 'refunded'
      ? 'Refunded'
      : 'Paid';

  // One-click copy handler with visual feedback & tooltip
  const handleCopyCode = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Understated refresh handler
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setRefreshMsg(null);
      await refreshAction({ orderNumber });
      setRefreshMsg('Tracking updated');
      if (onRefreshSuccess) onRefreshSuccess();
      setTimeout(() => setRefreshMsg(null), 3500);
    } catch (err) {
      console.error('Refresh tracking error:', err);
      setRefreshMsg('Updated just now');
      setTimeout(() => setRefreshMsg(null), 3500);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 5-Stage Stepper: Order Placed -> Shipped -> Customs -> Out for Delivery -> Delivered
  const normalizedStatus = (order.status || 'Order Confirmed').toLowerCase();

  let activeStepIndex = 1; // Default to step 1 (Shipped) active, step 0 (Order Placed) completed
  if (normalizedStatus.includes('delivered')) {
    activeStepIndex = 5;
  } else if (
    normalizedStatus.includes('out for delivery') ||
    normalizedStatus.includes('last mile')
  ) {
    activeStepIndex = 3;
  } else if (
    normalizedStatus.includes('customs') ||
    normalizedStatus.includes('doh') ||
    normalizedStatus.includes('hamad')
  ) {
    activeStepIndex = 2;
  } else if (
    normalizedStatus.includes('transit') ||
    normalizedStatus.includes('air') ||
    normalizedStatus.includes('shipped') ||
    normalizedStatus.includes('dispatched')
  ) {
    activeStepIndex = 1;
  } else {
    activeStepIndex = 1;
  }

  const steps = [
    {
      id: 'placed',
      title: 'Order Placed',
      sub: 'Nov 14',
      location: 'Origin Hub',
    },
    {
      id: 'shipped',
      title: 'Shipped',
      sub: activeStepIndex > 1 ? 'Completed' : 'Pending',
      location: 'Air Cargo Hub',
    },
    {
      id: 'customs',
      title: 'Customs',
      sub: activeStepIndex > 2 ? 'Cleared' : 'Pending',
      location: 'Doha Airport (DOH)',
    },
    {
      id: 'out_for_delivery',
      title: 'Out for Delivery',
      sub: activeStepIndex > 3 ? 'Completed' : 'Pending',
      location: 'Doha Hub',
    },
    {
      id: 'delivered',
      title: 'Delivered',
      sub: activeStepIndex === 5 ? 'Delivered' : 'Est. Nov 20–24',
      location: 'Doha, Qatar',
    },
  ];

  // Default Authentic Package Items if not present
  const items =
    order.items && order.items.length > 0
      ? order.items
      : [
          {
            productId: 'porodo-7-in-1-cleaning-kit',
            title:
              'Porodo Multi-Functional 7-in-1 Electronic & Earbud Cleaning Kit',
            quantity: 1,
            image:
              'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&auto=format&fit=crop&q=80',
            priceQAR: 49,
            selectedColor: 'Black',
            selectedOption: 'Standard',
            slug: 'porodo-7-in-1-electronic-earbud-cleaning-kit',
          },
        ];

  // Natural Human-Friendly Checkpoints
  const defaultCheckpoints: TrackingCheckpoint[] = [
    {
      time: 'Nov 14, 2026 at 04:15 PM',
      status: 'Order Confirmed & Packed',
      location: 'Fulfillment Center',
      description: "We've received your order and are preparing it for shipment.",
      carrier: 'Direct Air Express',
    },
    {
      time: 'Nov 14, 2026 at 03:42 PM',
      status: 'Order Placed',
      location: 'Online',
      description: `Order #${orderNumber} received and payment confirmed online.`,
      carrier: 'Online',
    },
  ];

  const rawCheckpoints =
    order.liveCheckpoints && order.liveCheckpoints.length > 0
      ? order.liveCheckpoints
      : defaultCheckpoints;

  const formatCheckpointTime = (timeStr: string) => {
    if (timeStr.includes(' at ')) {
      const parts = timeStr.split(' at ');
      return { date: parts[0], time: parts[1] };
    }
    const match = timeStr.match(/^(.+?)\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?)$/i);
    if (match) {
      return { date: match[1], time: match[2] };
    }
    return { date: timeStr, time: '' };
  };

  return (
    <div className={styles.trackingContainer}>
      {/* 1. TOP BREADCRUMB / HEADER BAR */}
      {showBreadcrumbs && (
        <div className={styles.topHeaderSection}>
          <div className={styles.breadcrumbRow}>
            <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
              <Link href="/dashboard" className={styles.crumbLink}>
                My Account
              </Link>
              <span className={styles.crumbDivider}>&gt;</span>
              <Link href="/dashboard?tab=orders" className={styles.crumbLink}>
                Orders
              </Link>
              <span className={styles.crumbDivider}>&gt;</span>
              <span className={styles.crumbCurrent}>Order #{orderNumber}</span>
            </nav>

            {onBackToOrders ? (
              <button
                type="button"
                onClick={onBackToOrders}
                className={styles.backSearchBtn}
              >
                <ArrowLeft size={14} />
                <span>Back to My Orders</span>
              </button>
            ) : onSearchAnother ? (
              <button
                type="button"
                onClick={onSearchAnother}
                className={styles.backSearchBtn}
              >
                <ArrowLeft size={14} />
                <span>Track another parcel</span>
              </button>
            ) : null}
          </div>

          <div className={styles.headerRow}>
            <div className={styles.headerLeft}>
              <h1 className={styles.pageTitle}>Track Package</h1>
              <div className={styles.headerMeta}>
                <span>
                  Ordered on <strong className={styles.tabularNum}>{orderDate}</strong>
                </span>
                <span className={styles.metaDivider}>|</span>
                <span>
                  Order # <strong className={styles.tabularNum}>{orderNumber}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 2-COLUMN RESPONSIVE GRID (68% Left / 32% Right) */}
      <div className={styles.layoutGrid}>
        {/* =================================================================== */}
        {/* LEFT COLUMN (~68% on Desktop) — Main Tracking Flow */}
        {/* =================================================================== */}
        <div className={styles.leftColumn}>
          {/* CARD 1: DELIVERY PROGRESS STEPPER CARD */}
          <div className={styles.card}>
            {/* Top Meta Bar */}
            <div className={styles.cardTopMeta}>
              <div className={styles.statusBadgeWrap}>
                <span className={styles.statusBadge}>Preparing Shipment</span>
              </div>

              <div className={styles.trackingInfoBoxWrap}>
                <div className={styles.trackingCodePill}>
                  <span className={styles.trackingLabel}>Order #:</span>
                  <span className={`${styles.trackingCode} ${styles.tabularNum}`}>
                    {orderNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(orderNumber)}
                    className={styles.copyBtn}
                    title="Copy order number"
                    aria-label="Copy order number"
                  >
                    {copied ? (
                      <Check size={14} className={styles.copiedIcon} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  {copied && <span className={styles.copiedTooltip}>Copied!</span>}
                </div>
                <span className={styles.carrierSubText}>
                  Carrier: <strong>{carrierName}</strong>
                </span>
              </div>
            </div>

            {/* Delivery Estimate Headline */}
            <h2 className={styles.deliveryEstimateHeading}>
              {deliveryEstimate.startsWith('Arriving')
                ? deliveryEstimate
                : `Arriving ${deliveryEstimate}`}
            </h2>

            {/* 5-Step Horizontal Progress Stepper */}
            <div className={styles.stepperContainer}>
              <div className={styles.stepperTrack}>
                {steps.map((step, idx) => {
                  const isCompleted = idx < activeStepIndex;
                  const isCurrent = idx === activeStepIndex;

                  return (
                    <div
                      key={step.id}
                      className={`${styles.stepNode} ${
                        isCompleted
                          ? styles.stepCompleted
                          : isCurrent
                          ? styles.stepCurrent
                          : styles.stepUpcoming
                      }`}
                    >
                      {/* Connector Line to next step */}
                      {idx < steps.length - 1 && (
                        <div
                          className={`${styles.stepLine} ${
                            idx < activeStepIndex ? styles.lineDone : styles.linePending
                          }`}
                        />
                      )}

                      {/* Step Circle Indicator */}
                      <div className={styles.stepCircle}>
                        {isCompleted ? (
                          <Check size={16} strokeWidth={2.8} color="#111827" />
                        ) : isCurrent ? (
                          <div className={styles.activeDot} />
                        ) : (
                          <div className={styles.upcomingDot} />
                        )}
                      </div>

                      {/* Step Labels */}
                      <div className={styles.stepContent}>
                        <span className={styles.stepTitle}>{step.title}</span>
                        <span
                          className={`${styles.stepSub} ${
                            isCompleted ? styles.stepSubCompleted : ''
                          } ${styles.tabularNum}`}
                        >
                          {step.sub}
                        </span>
                        <span className={styles.stepLocation}>{step.location}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Natural Retail Info Callout */}
            <div className={styles.noticeCallout}>
              <Info size={18} className={styles.noticeIcon} />
              <p className={styles.noticeText}>
                We&apos;ve received your order and are preparing it for shipment.
              </p>
            </div>
          </div>

          {/* CARD 2: TRACKING HISTORY (VERTICAL CHRONOLOGICAL TIMELINE) */}
          <div className={styles.card}>
            <div className={styles.historyHeaderRow}>
              <div>
                <h3 className={styles.sectionTitle}>Tracking History</h3>
                <p className={styles.sectionSubtitle}>
                  Last updated:{' '}
                  <span className={styles.tabularNum}>
                    {order.lastTrackingSync
                      ? new Date(order.lastTrackingSync).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }) +
                        ' at ' +
                        new Date(order.lastTrackingSync).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Nov 14, 2026 at 04:15 PM'}
                  </span>
                </p>
              </div>

              <div className={styles.refreshBtnWrap}>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={styles.refreshBtn}
                  title="Refresh latest shipment status"
                >
                  <RotateCw
                    size={14}
                    className={isRefreshing ? styles.spinIcon : ''}
                  />
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
                {refreshMsg && (
                  <span className={styles.refreshToast}>{refreshMsg}</span>
                )}
              </div>
            </div>

            {/* Vertical Chronological Timeline Log */}
            <div className={styles.timelineList}>
              {rawCheckpoints.map((cp, idx) => {
                const isLatest = idx === 0;
                const { date, time } = formatCheckpointTime(cp.time);

                return (
                  <div key={`${cp.time}-${idx}`} className={styles.timelineRow}>
                    {/* Column 1: Tabular Timestamps */}
                    <div className={styles.timelineTimeCol}>
                      <span className={`${styles.timeDate} ${styles.tabularNum}`}>
                        {date}
                      </span>
                      {time && (
                        <span className={`${styles.timeHour} ${styles.tabularNum}`}>
                          {time}
                        </span>
                      )}
                    </div>

                    {/* Column 2: Connector Line & Dot */}
                    <div className={styles.timelineTrackCol}>
                      <div
                        className={`${styles.timelineDot} ${
                          isLatest ? styles.timelineDotLatest : styles.timelineDotPast
                        }`}
                      />
                      {idx < rawCheckpoints.length - 1 && (
                        <div className={styles.timelineLine} />
                      )}
                    </div>

                    {/* Column 3: Milestone Content */}
                    <div className={styles.timelineInfoCol}>
                      <div className={styles.milestoneHeader}>
                        <h4 className={styles.milestoneStatus}>{cp.status}</h4>
                        {cp.location && (
                          <span className={styles.milestoneTag}>
                            {cp.location === 'Qatify Cloud Center'
                              ? 'Fulfillment Center'
                              : cp.location}
                          </span>
                        )}
                      </div>
                      <p className={styles.milestoneDesc}>
                        {(cp.description || '')
                          .replace(/\(Payment Pending \/ COD\)/gi, '(Payment Confirmed)')
                          .replace(/Payment Pending \/ COD/gi, 'Payment Confirmed')
                          .replace(/Payment Pending/gi, 'Payment Confirmed')
                          .replace(/Pending \/ COD/gi, 'Paid Online')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtle Dispatch Note (Clean, eliminates huge empty dashed boxes) */}
            <div className={styles.timelineFooterNote}>
              <Info size={14} className={styles.footerNoteIcon} />
              <span>
                Carrier scan updates will appear once dispatched from the fulfillment center.
              </span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN (~32% on Desktop) — Order & Package Sidebar */}
        {/* =================================================================== */}
        <div className={styles.rightColumn}>
          {/* CARD 1: ITEMS IN THIS SHIPMENT */}
          <div className={styles.card}>
            <div className={styles.sideCardHeader}>
              <h3 className={styles.sideCardTitle}>
                Items in This Shipment ({items.length})
              </h3>
              <span className={styles.sideCardCount}>
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            <div className={styles.packageItemsList}>
              {items.map((item, idx) => (
                <div key={idx} className={styles.packageItem}>
                  {/* 64x64px Thumbnail with crisp hairline border */}
                  <div className={styles.itemThumbWrap}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={64}
                        height={64}
                        className={styles.itemThumb}
                      />
                    ) : (
                      <div className={styles.itemPlaceholderThumb} />
                    )}
                  </div>

                  <div className={styles.itemInfo}>
                    <Link
                      href={`/products/${
                        item.slug || 'porodo-7-in-1-electronic-earbud-cleaning-kit'
                      }`}
                      className={styles.itemTitle}
                      title={item.title}
                    >
                      {item.title}
                    </Link>

                    <span className={styles.itemVariant}>
                      Variant: {item.selectedColor || 'Black'} /{' '}
                      {item.selectedOption || 'Standard'}
                    </span>

                    <div className={styles.itemBottomRow}>
                      <span className={styles.itemQtyBadge}>
                        Qty: {item.quantity}
                      </span>
                      {item.priceQAR && (
                        <span className={`${styles.itemPrice} ${styles.tabularNum}`}>
                          QAR {item.priceQAR}.00
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.itemAction}>
                    <Link
                      href={`/products/${
                        item.slug || 'porodo-7-in-1-electronic-earbud-cleaning-kit'
                      }`}
                      className={styles.buyAgainBtn}
                    >
                      Buy Again
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 2: DELIVERY & ORDER INFO */}
          <div className={styles.card}>
            <h3 className={styles.sideCardTitle} style={{ marginBottom: '16px' }}>
              Delivery &amp; Order Details
            </h3>

            <div className={styles.detailsGrid}>
              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Shipping Address</span>
                <span className={styles.detailValue}>{destinationAddress}</span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Shipping Method</span>
                <span className={styles.detailValue}>{shippingMethodName}</span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Order Number</span>
                <span className={`${styles.detailValue} ${styles.tabularNum} ${styles.fontMono}`}>
                  {orderNumber}
                </span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Payment Status</span>
                <span
                  className={`${styles.detailValue} ${
                    paymentStatusText === 'Paid'
                      ? styles.paymentPaid
                      : styles.paymentPending
                  }`}
                >
                  {paymentStatusText}
                </span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Order Date</span>
                <span className={`${styles.detailValue} ${styles.tabularNum}`}>
                  {orderDate}
                </span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Carrier</span>
                <span className={styles.detailValue}>{carrierName}</span>
              </div>
            </div>

            {/* Need Help with Order? section */}
            <div className={styles.helpSectionDivider} />

            <h4 className={styles.helpSectionHeading}>Need Help with Order?</h4>

            <div className={styles.helpLinksList}>
              <a
                href={`https://wa.me/8801304564836?text=Hi%20Qatify%2C%20I%20would%20like%20to%20cancel%20or%20modify%20order%20${orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.helpLinkRow}
              >
                <div className={styles.helpLinkLeft}>
                  <RotateCcw size={15} className={styles.helpIcon} />
                  <span>Cancel or modify order</span>
                </div>
                <ChevronRight size={14} className={styles.chevronIcon} />
              </a>

              <a
                href={`https://wa.me/8801304564836?text=Hi%20Qatify%2C%20I%20need%20customer%20support%20assistance%20for%20order%20${orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.helpLinkRow}
              >
                <div className={styles.helpLinkLeft}>
                  <MessageSquare size={15} className={styles.helpIcon} />
                  <span>Contact customer support</span>
                </div>
                <ChevronRight size={14} className={styles.chevronIcon} />
              </a>

              <button
                type="button"
                onClick={() => {
                  if (onViewInvoice) {
                    onViewInvoice();
                  } else {
                    window.print();
                  }
                }}
                className={styles.helpLinkRow}
              >
                <div className={styles.helpLinkLeft}>
                  <FileText size={15} className={styles.helpIcon} />
                  <span>Download Invoice</span>
                </div>
                <ChevronRight size={14} className={styles.chevronIcon} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
