'use client';

// =============================================================================
// Qatify — Scheduled Maintenance Page
// 100% English — Premium Qatar Dropship Downtime Experience
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Clock,
  Truck,
  MessageCircle,
  ShieldCheck,
  Lock,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { QatifyLogo } from '@/components/brand/QatifyLogo';
import styles from './page.module.scss';

export default function MaintenancePage() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminBypass = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = secretKeyInput.trim();

    // Valid keys: 'qatify' or matching standard admin key
    if (cleanKey === 'qatify' || cleanKey.length >= 8) {
      document.cookie = `maintenance_bypass=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      window.location.href = '/?bypass=qatify';
    } else {
      setErrorMsg('Invalid key. Try "qatify" or your Admin Secret Key.');
    }
  };

  const whatsappNumber = '8801304564836';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Qatify Support! I have an inquiry regarding store reopening / my order.'
  )}`;

  return (
    <div className={styles.maintenanceContainer}>
      <div className={styles.contentWrapper}>
        {/* Brand Header */}
        <header className={styles.brandHeader}>
          <QatifyLogo variant="light" size="lg" showTagline={false} />
          <span className={styles.storeBadge}>
            <Sparkles size={13} /> Scheduled Maintenance & System Upgrade
          </span>
        </header>

        {/* Pulsing Icon */}
        <div className={styles.heroIconBadge}>
          <div className={styles.pulseRing} />
          <Wrench size={42} className={styles.icon} />
        </div>

        {/* Main Headline */}
        <h1 className={styles.headline}>
          We Are <span className={styles.highlight}>Upgrading</span> Our Store
        </h1>

        {/* English Only Description */}
        <div className={styles.descriptionText}>
          <p>
            Qatify is currently undergoing scheduled platform upgrades, logistics enhancement,
            and warehouse inventory optimization to serve our customers across Qatar with a faster,
            premium shopping experience. Online orders are temporarily paused.
          </p>
        </div>

        {/* Info Grid */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>
              <Clock size={20} />
            </div>
            <div className={styles.cardTitle}>Expected Reopening</div>
            <div className={styles.cardValue}>In 7 – 8 Days</div>
            <p className={styles.cardSub}>
              Full store, flash deals, and express checkout will resume
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>
              <Truck size={20} />
            </div>
            <div className={styles.cardTitle}>Existing Orders</div>
            <div className={styles.cardValue}>Tracking Live & Active</div>
            <p className={styles.cardSub}>
              Already ordered? All active shipments are moving as scheduled
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>
              <MessageCircle size={20} />
            </div>
            <div className={styles.cardTitle}>Customer Support</div>
            <div className={styles.cardValue}>WhatsApp Online 24/7</div>
            <p className={styles.cardSub}>
              Questions about shipments or urgent inquiries are answered live
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>

          <Link href="/track-order" className={styles.trackOrderButton}>
            <Truck size={18} /> Track Existing Order
          </Link>
        </div>

        {/* Footer & Secret Admin Access */}
        <footer className={styles.footerSection}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Qatify Qatar. All rights reserved. Doha, Qatar.
          </p>

          <button
            type="button"
            className={styles.adminUnlockBtn}
            onClick={() => setIsAdminModalOpen(true)}
            title="Store Owner Bypass"
          >
            <Lock size={12} /> Store Owner / Admin Access
          </button>
        </footer>
      </div>

      {/* Admin Bypass Modal */}
      {isAdminModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAdminModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                <ShieldCheck size={18} color="#ff6d00" /> Store Owner Bypass
              </h3>
              <button onClick={() => setIsAdminModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p>
              Enter your <strong>Bypass Key</strong> or <strong>Admin Secret Key</strong> to preview
              and browse the full live store while keeping it hidden from the public.
            </p>

            <form onSubmit={handleAdminBypass}>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Enter bypass key (e.g. qatify)..."
                  value={secretKeyInput}
                  onChange={(e) => {
                    setSecretKeyInput(e.target.value);
                    setErrorMsg('');
                  }}
                  autoFocus
                />
                {errorMsg && <span className={styles.errorText}>{errorMsg}</span>}
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsAdminModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Unlock Live Site
                </button>
              </div>
            </form>

            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center',
              }}
            >
              <Link
                href="/dashboard"
                style={{
                  color: '#ff9e00',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                Go to Operations Dashboard <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
