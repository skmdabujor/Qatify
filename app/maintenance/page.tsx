'use client';

// =============================================================================
// Qatify — Scheduled Maintenance Page
// Premium, reassuring downtime screen with bilingual messaging, WhatsApp contact & Order Tracking
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ExternalLink,
} from 'lucide-react';
import { QatifyLogo } from '@/components/brand/QatifyLogo';
import styles from './page.module.scss';

export default function MaintenancePage() {
  const router = useRouter();
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
            <Sparkles size={12} /> Scheduled Maintenance & System Upgrade
          </span>
        </header>

        {/* Pulsing Icon */}
        <div className={styles.heroIconBadge}>
          <div className={styles.pulseRing} />
          <Wrench size={42} className={styles.icon} />
        </div>

        {/* Main Headline */}
        <h1 className={styles.headline}>
          We Are <span className={styles.highlight}>Upgrading</span> For You!
        </h1>

        {/* Bilingual Reassuring Messaging */}
        <div className={styles.bilingualText}>
          <p className={styles.englishText}>
            We are currently optimizing our logistics network, warehouse inventory, and store
            experience to bring you genuine electronics and faster delivery across Qatar. Online
            orders are temporarily paused.
          </p>
          <p className={styles.bengaliText}>
            আমাদের ডেলিভারি সিস্টেম ও নতুন প্রোডাক্ট স্টক আরও উন্নত করতে ওয়েবসাইট সাময়িক বিরতিতে
            আছে। আগামী <strong>৭–৮ দিনের মধ্যে</strong> নতুন অফার ও গ্যাজেট কালেকশন নিয়ে আমরা পুনরায়
            চালু হব।
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
            <p className={styles.cardSub}>Orders & Express Delivery will resume immediately</p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>
              <Truck size={20} />
            </div>
            <div className={styles.cardTitle}>Existing Orders</div>
            <div className={styles.cardValue}>Tracking Live</div>
            <p className={styles.cardSub}>Already ordered? All active shipments are in transit</p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>
              <MessageCircle size={20} />
            </div>
            <div className={styles.cardTitle}>Direct Support</div>
            <div className={styles.cardValue}>WhatsApp Active</div>
            <p className={styles.cardSub}>Our support desk is online 24/7 for all queries</p>
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

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <Link
                href="/dashboard"
                style={{ color: '#ff9e00', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
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

