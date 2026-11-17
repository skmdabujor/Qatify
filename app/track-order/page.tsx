'use client';

// =============================================================================
// Qatify — Track Order Page (`/track-order`)
// 1. If no order code: Shows the Search page (Track Your Shipment)
// 2. When searching: Redirects to /track-order?code=...
// 3. If order code present: Shows the redesigned High-Trust Order Tracking View
// =============================================================================

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Search,
  ArrowRight,
  Package,
  RotateCw,
  AlertCircle,
} from 'lucide-react';
import { TrackingTimeline } from '@/components/tracking/TrackingTimeline';
import styles from './page.module.scss';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active tracking code from URL params
  const codeParam =
    searchParams.get('code') ||
    searchParams.get('order') ||
    searchParams.get('ref') ||
    '';

  const [inputVal, setInputVal] = useState(codeParam);

  useEffect(() => {
    setInputVal(codeParam);
  }, [codeParam]);

  // Reactive lookup from Convex database
  const trackingData = useQuery(
    api.tracking.getFullTracking,
    codeParam ? { code: codeParam } : 'skip'
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim() || 'QA-896533';
    router.push(`/track-order?code=${encodeURIComponent(clean)}`);
  };

  const handleQuickSelect = (sampleCode: string) => {
    setInputVal(sampleCode);
    router.push(`/track-order?code=${encodeURIComponent(sampleCode)}`);
  };

  const handleSearchAnother = () => {
    setInputVal('');
    router.push('/track-order');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* ================================================================= */}
        {/* VIEW A: IF ORDER CODE IS PRESENT -> RENDER TRACKING TIMELINE      */}
        {/* ================================================================= */}
        {codeParam ? (
          trackingData === undefined ? (
            <div className={styles.statusStateCard}>
              <RotateCw size={28} className={styles.spinIcon} color="#059669" />
              <h3 className={styles.stateTitle}>Loading Package Tracking...</h3>
              <p className={styles.stateSubtitle}>
                Fetching current fulfillment and delivery checkpoints for{' '}
                <strong className={styles.tabular}>{codeParam}</strong>.
              </p>
            </div>
          ) : trackingData === null ? (
            <div className={styles.statusStateCard}>
              <AlertCircle size={36} color="#d97706" style={{ marginBottom: '12px' }} />
              <h3 className={styles.stateTitle}>Shipment Record Not Found</h3>
              <p className={styles.stateSubtitle}>
                No active order found matching &quot;
                <strong className={styles.tabular}>{codeParam}</strong>&quot;. Please
                verify the order reference on your confirmation email or invoice.
              </p>
              <div className={styles.notFoundActions}>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('QA-896533')}
                  className={styles.viewSampleBtn}
                >
                  View Sample Order (QA-896533)
                </button>
                <button
                  type="button"
                  onClick={handleSearchAnother}
                  className={styles.tryAnotherBtn}
                >
                  Try Another Order
                </button>
              </div>
            </div>
          ) : (
            <TrackingTimeline
              order={trackingData as any}
              onSearchAnother={handleSearchAnother}
            />
          )
        ) : (
          /* ================================================================= */
          /* VIEW B: IF NO ORDER CODE -> RENDER SEARCH HERO (IMAGE 1)          */
          /* ================================================================= */
          <div className={styles.searchHeroWrapper}>
            <div className={styles.searchHero}>
              <h1 className={styles.pageTitle}>Track Your International Air Shipment</h1>
              <p className={styles.pageSub}>
                Enter your Qatify order reference (<code>QA-89421</code>) or your tracking code to view live aircraft logistics, customs clearance, and doorstep delivery in Qatar.
              </p>

              <form onSubmit={handleSearch} className={styles.searchBoxWrap}>
                <div className={styles.searchInputWrap}>
                  <Search size={18} color="#71717a" />
                  <input
                    type="text"
                    placeholder="Enter order reference or tracking code..."
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

              {/* Quick sample link chip */}
              <div className={styles.sampleChipsRow}>
                <span className={styles.sampleChipLabel}>Try sample order:</span>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('QA-896533')}
                  className={styles.sampleChipBtn}
                >
                  QA-896533
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('QA-89421')}
                  className={styles.sampleChipBtn}
                >
                  QA-89421
                </button>
              </div>
            </div>

            {/* Awaiting Tracking Reference Card */}
            <div className={styles.awaitingCard}>
              <div className={styles.awaitingIconWrap}>
                <Package size={42} strokeWidth={1.5} color="#a1a1aa" />
              </div>
              <h3 className={styles.awaitingTitle}>Awaiting Tracking Reference</h3>
              <p className={styles.awaitingSub}>
                Your tracking code was sent via SMS and email immediately upon checkout confirmation.
              </p>
            </div>

            {/* Assistance Footnote */}
            <div className={styles.supportHelpRow}>
              <span>Need assistance with your delivery in Qatar? </span>
              <a
                href="https://wa.me/8801304564836?text=Hi%20Qatify%2C%20I%20need%20assistance%20tracking%20my%20order"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact VIP Concierge on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.pageWrapper}>
          <div className={styles.container}>
            <div className={styles.statusStateCard}>
              <RotateCw size={24} className={styles.spinIcon} color="#059669" />
              <p style={{ margin: '12px 0 0', color: '#6b7280', fontSize: '14px' }}>
                Loading tracking console...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
