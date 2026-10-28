'use client';

// =============================================================================
// Qatify — Public 5-Stage Cross-Border Order Tracking Page (`/track-order`)
// Shows live air cargo updates, AliExpress/Cainiao checkpoints & Hamad Customs
// =============================================================================

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Search,
  Plane,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Package,
} from 'lucide-react';
import { TrackingTimeline } from '@/components/tracking/TrackingTimeline';
import styles from './page.module.scss';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCode = searchParams.get('code') || searchParams.get('order') || searchParams.get('ref') || '';

  const [inputVal, setInputVal] = useState(initialCode);
  const [activeCode, setActiveCode] = useState(initialCode);

  useEffect(() => {
    if (initialCode) {
      setInputVal(initialCode);
      setActiveCode(initialCode);
    }
  }, [initialCode]);

  // Reactive lookup from Convex database
  const trackingData = useQuery(
    api.tracking.getFullTracking,
    activeCode ? { code: activeCode } : 'skip'
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim();
    if (!clean) return;
    setActiveCode(clean);
    router.replace(`/track-order?code=${encodeURIComponent(clean)}`);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 1. HERO SEARCH SECTION */}
      <div className={styles.searchHero}>
        <h1 className={styles.pageTitle}>Track Your International Air Shipment</h1>
        <p className={styles.pageSub}>
          Enter your Qatify order reference (e.g. <code>QA-89421</code>) or your tracking code to view live aircraft logistics, customs clearance, and doorstep delivery in Qatar.
        </p>

        <form onSubmit={handleSearch} className={styles.searchBoxWrap}>
          <div className={styles.searchInputWrap}>
            <Search size={18} color="#71717a" />
            <input
              type="text"
              placeholder="Enter Order Ref (e.g. QA-123456) or Tracking Code..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>
          <button type="submit" className={styles.searchSubmitBtn}>
            <span>Track Parcel</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {/* 2. LIVE RESULTS AREA */}
      <div className={styles.resultsArea}>
        {activeCode ? (
          trackingData === undefined ? (
            <div className={styles.notFoundCard}>
              <div className="spin" style={{ display: 'inline-block', marginBottom: '12px' }}>
                <Plane size={32} color="#e06c2a" />
              </div>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#0a0a0c' }}>
                Connecting to Logistics Network...
              </h3>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#71717a' }}>
                Fetching real-time aircraft and customs clearance checkpoints for {activeCode}.
              </p>
            </div>
          ) : trackingData === null ? (
            <div className={styles.notFoundCard}>
              <AlertCircle size={40} color="#f59e0b" style={{ marginBottom: '12px' }} />
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0a0a0c' }}>
                Shipment Record Not Found
              </h3>
              <p style={{ margin: '8px auto', maxWidth: '440px', fontSize: '13.5px', color: '#71717a' }}>
                No active order found matching &quot;<strong>{activeCode}</strong>&quot;. Please verify the order number on your confirmation email or invoice.
              </p>
            </div>
          ) : (
            <TrackingTimeline order={trackingData as any} />
          )
        ) : (
          <div className={styles.notFoundCard}>
            <Package size={44} color="#d4d4d8" style={{ marginBottom: '14px' }} />
            <h3 style={{ margin: 0, fontSize: '17px', color: '#0a0a0c' }}>
              Awaiting Tracking Reference
            </h3>
            <p style={{ margin: '8px auto 0', maxWidth: '440px', fontSize: '13.5px', color: '#71717a' }}>
              Your tracking code was sent via SMS and email immediately upon checkout confirmation.
            </p>
          </div>
        )}

        {/* 3. ASSISTANCE FOOTNOTE */}
        <div className={styles.supportHelpRow}>
          <span>Need assistance with your delivery in Qatar? </span>
          <a href="https://wa.me/97450000000" target="_blank" rel="noopener noreferrer">
            Contact VIP Concierge on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#71717a' }}>
          Loading Air Tracking Console...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}

