'use client';

// =============================================================================
// Qatify — White-Labeled Live Shipment Tracking Component
// Translates raw AliExpress/Cainiao logistics into luxury Qatify Air Express UI
// =============================================================================

import React, { useState } from 'react';
import Image from 'next/image';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Plane,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  RotateCw,
  Copy,
  Check,
  Building,
  Truck,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import styles from './TrackingTimeline.module.scss';

interface TrackingCheckpoint {
  time: string;
  status: string;
  location: string;
  description: string;
  carrier?: string;
}

interface TimelineStage {
  stage: string;
  title: string;
  description: string;
  location: string;
  date: string;
  completed: boolean;
  current?: boolean;
}

interface TrackingTimelineProps {
  order: {
    orderNumber: string;
    trackingNumber: string;
    aliexpressTrackingNumber?: string;
    status: string;
    date: string;
    estimatedDeliveryWindow?: string;
    timeline?: TimelineStage[];
    liveCheckpoints?: TrackingCheckpoint[];
    lastTrackingSync?: string;
    carrier?: string;
    address?: {
      fullName?: string;
      municipality?: string;
      zoneNumber?: string;
      buildingNumber?: string;
    };
    municipality?: string;
    items?: Array<{
      title: string;
      quantity: number;
      image: string;
    }>;
  };
  onRefreshSuccess?: () => void;
}

export function TrackingTimeline({ order, onRefreshSuccess }: TrackingTimelineProps) {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState<string | null>(null);

  const refreshAction = useMutation(api.tracking.refreshOrderTracking);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setRefreshMsg(null);
      await refreshAction({ orderNumber: order.orderNumber });
      setRefreshMsg('Sync scheduled! Refreshing location data...');
      if (onRefreshSuccess) onRefreshSuccess();
      setTimeout(() => setRefreshMsg(null), 4000);
    } catch (err) {
      console.error('Refresh tracking error:', err);
      setRefreshMsg('Sync request sent. Updates will reflect shortly.');
      setTimeout(() => setRefreshMsg(null), 4000);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Determine stage icons
  const getStageIcon = (stage: string, isDone: boolean, isCurrent?: boolean) => {
    if (isDone) return <CheckCircle2 size={16} />;
    if (stage.includes('Air') || stage.includes('Transit')) return <Plane size={16} />;
    if (stage.includes('Customs') || stage.includes('DOH')) return <Building size={16} />;
    if (stage.includes('Out for Delivery')) return <Truck size={16} />;
    if (stage.includes('Delivered')) return <ShieldCheck size={16} />;
    return <Package size={16} />;
  };

  const checkpoints = order.liveCheckpoints || [];
  // Reverse to show latest event first at the top of the feed
  const sortedCheckpoints = [...checkpoints].reverse();

  const destinationCity =
    order.address?.municipality || order.municipality || 'Doha, Qatar';

  return (
    <div className={styles.trackingContainer}>
      {/* 1. HERO OVERVIEW BANNER */}
      <div className={styles.shipmentOverviewBanner}>
        <div className={styles.overviewLeft}>
          <div className={styles.badgeRow}>
            <span className={styles.liveBadge}>
              <span className={styles.pulseDot} />
              <span>LIVE AIR CARGO FEED</span>
            </span>
            <span className={styles.carrierPill}>
              <Plane size={12} />
              <span>{order.carrier || 'Qatify Direct Air Express'}</span>
            </span>
          </div>

          <h3 className={styles.trackingCodeTitle}>
            <span>{order.trackingNumber}</span>
            <button
              type="button"
              onClick={() => handleCopyCode(order.trackingNumber)}
              className={styles.copyBtn}
              title="Copy Tracking Number"
            >
              {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
            </button>
          </h3>

          <div className={styles.orderSubInfo}>
            <span>Order Reference: <strong>{order.orderNumber}</strong></span>
            <span>•</span>
            <span>Placed on: {order.date}</span>
            {order.lastTrackingSync && (
              <>
                <span>•</span>
                <span>
                  Last Synced:{' '}
                  {new Date(order.lastTrackingSync).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        <div className={styles.overviewRight}>
          <div className={styles.etaBox}>
            <span className={styles.etaLabel}>Target Delivery Window:</span>
            <span className={styles.etaValue}>
              {order.estimatedDeliveryWindow || '6–10 Business Days'}
            </span>
            <span className={styles.destText}>
              <MapPin size={12} />
              <span>Destination: {destinationCity}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={styles.refreshBtn}
          >
            <RotateCw size={13} className={isRefreshing ? styles.spin : ''} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Live Status'}</span>
          </button>
          {refreshMsg && (
            <span style={{ fontSize: '11px', color: '#facc15' }}>{refreshMsg}</span>
          )}
        </div>
      </div>

      {/* 2. 5-STAGE MACRO SHIPMENT TIMELINE */}
      <div className={styles.macroStepperCard}>
        <h4 className={styles.sectionHeading}>
          <ShieldCheck size={18} color="#e06c2a" />
          <span>Cross-Border 5-Stage Logistics Pipeline</span>
        </h4>
        <p className={styles.sectionSub}>
          Full chain of custody from international fulfillment to doorstep handover in Qatar.
        </p>

        <div className={styles.stepperTrack}>
          {(order.timeline || []).map((step, idx) => {
            const isDone = step.completed;
            const isCurrent = step.current;

            return (
              <div
                key={step.stage}
                className={`${styles.stepNode} ${
                  isDone ? styles.stepDone : isCurrent ? styles.stepCurrent : ''
                }`}
              >
                <div className={styles.stepIconWrap}>
                  {getStageIcon(step.stage, isDone, isCurrent)}
                </div>
                <div className={styles.stepTextWrap}>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <span className={styles.stepLocation}>{step.location}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DETAILED LIVE CHECKPOINTS FEED (ALIEXPRESS SYNCED) */}
      <div className={styles.liveCheckpointsCard}>
        <div className={styles.checkpointsHeader}>
          <div>
            <h4 className={styles.sectionHeading}>
              <Clock size={18} color="#e06c2a" />
              <span>Live International Transit Log & Air Cargo Checkpoints</span>
            </h4>
            <p className={styles.sectionSub} style={{ marginBottom: 0 }}>
              Chronological milestones recorded by air freight customs and logistics hubs.
            </p>
          </div>
          <span
            style={{
              fontSize: '11.5px',
              color: '#71717a',
              background: '#f4f4f5',
              padding: '4px 10px',
              borderRadius: '20px',
              fontWeight: 600,
            }}
          >
            {sortedCheckpoints.length} Checkpoints Logged
          </span>
        </div>

        {sortedCheckpoints.length > 0 ? (
          <div className={styles.checkpointsList}>
            {sortedCheckpoints.map((cp, idx) => {
              const isLatest = idx === 0;

              return (
                <div
                  key={`${cp.time}-${idx}`}
                  className={`${styles.checkpointItem} ${isLatest ? styles.latest : ''}`}
                >
                  <div className={styles.checkpointBullet} />
                  <div className={styles.checkpointBody}>
                    <div className={styles.checkpointTopRow}>
                      <span className={styles.checkpointStatus}>
                        {isLatest && '📍 [Latest] '}
                        {cp.status}
                      </span>
                      <span className={styles.checkpointTime}>{cp.time}</span>
                    </div>

                    <p className={styles.checkpointDesc}>{cp.description}</p>

                    <div className={styles.checkpointLocationRow}>
                      <MapPin size={13} color="#e06c2a" />
                      <span>{cp.location}</span>
                      {cp.carrier && (
                        <>
                          <span>•</span>
                          <span>Via {cp.carrier}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyCheckpointsNote}>
            <Package size={28} color="#a1a1aa" style={{ marginBottom: '8px' }} />
            <p style={{ margin: 0, fontWeight: 600, color: '#18181b' }}>
              Preparing for International Air Dispatch
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px' }}>
              Your order is packaged and undergoing quality check at our global fulfillment center. Live flight and sorting milestones will appear as soon as the carrier registers departure.
            </p>
          </div>
        )}
      </div>

      {/* 4. PACKAGE CONTENTS SUMMARY */}
      {order.items && order.items.length > 0 && (
        <div className={styles.macroStepperCard}>
          <h4 className={styles.sectionHeading}>
            <Package size={17} color="#e06c2a" />
            <span>Package Contents ({order.items.length} items)</span>
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 12px',
                  background: '#fafafa',
                  borderRadius: '8px',
                  border: '1px solid #f4f4f5',
                }}
              >
                {item.image && (
                  <div
                    style={{
                      position: 'relative',
                      width: '46px',
                      height: '46px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e4e4e7',
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="46px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0a0a0c',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.title}
                  </p>
                  <span style={{ fontSize: '11.5px', color: '#71717a' }}>
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

