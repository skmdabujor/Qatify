'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Plane,
  RotateCcw,
  FileText,
  Lock,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  ListOrdered,
  HelpCircle,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import styles from './PolicyShell.module.scss';

export interface TocItem {
  id: string;
  label: string;
}

export interface PolicyShellProps {
  title: string;
  badge: string;
  subtitle: string;
  lastUpdated?: string;
  readTime?: string;
  activeSlug: 'refund-policy' | 'shipping-policy' | 'privacy' | 'terms' | 'contact';
  tableOfContents?: TocItem[];
  children: React.ReactNode;
}

const POLICY_TABS = [
  { slug: 'refund-policy', label: 'Refund & Return Policy', icon: RotateCcw, href: '/refund-policy' },
  { slug: 'shipping-policy', label: 'Shipping & Delivery', icon: Plane, href: '/shipping-policy' },
  { slug: 'privacy', label: 'Privacy Policy', icon: Lock, href: '/privacy' },
  { slug: 'terms', label: 'Terms & Conditions', icon: FileText, href: '/terms' },
  { slug: 'contact', label: 'Contact Us', icon: MessageCircle, href: '/contact' },
];

export const PolicyShell: React.FC<PolicyShellProps> = ({
  title,
  badge,
  subtitle,
  lastUpdated = 'November 2026',
  readTime = '4 min read',
  activeSlug,
  tableOfContents = [],
  children,
}) => {
  const { openChat } = useShop();

  return (
    <div className={styles.wrapper}>
      {/* 1. HERO HEADER */}
      <header className={styles.hero}>
        <div className="container">
          <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
            <Link href="/">Home</Link>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>{title}</span>
          </nav>

          <div className={styles.heroContent}>
            <span className={styles.badgePill}>
              <ShieldCheck size={14} />
              {badge}
            </span>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>

            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                <Clock size={14} /> Last Updated: {lastUpdated}
              </span>
              <span className={styles.dot} />
              <span className={styles.metaItem}>{readTime}</span>
              <span className={styles.dot} />
              <span className={styles.metaItem}>
                <CheckCircle2 size={14} /> Applies across State of Qatar
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. QUICK POLICY TABS */}
      <nav className={styles.policyTabsBar} aria-label="Policy Navigation">
        <div className="container">
          <div className={styles.tabsScroll}>
            {POLICY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.slug === activeSlug;
              return (
                <Link
                  key={tab.slug}
                  href={tab.href}
                  className={`${styles.tabLink} ${isActive ? styles.activeTab : ''}`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 3. MAIN GRID (SIDEBAR + CONTENT) */}
      <div className="container">
        <div className={styles.mainGrid}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            {/* Table of contents */}
            {tableOfContents.length > 0 && (
              <div className={styles.tocCard}>
                <div className={styles.tocHeader}>
                  <ListOrdered size={14} />
                  <span>Table of Contents</span>
                </div>
                <div className={styles.tocList}>
                  {tableOfContents.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className={styles.tocItem}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Package Guarantee Card */}
            <div className={styles.guaranteeCard}>
              <span className={styles.guaranteeBadge}>
                🛡️ 100% Protection Pledge
              </span>
              <h3 className={styles.guaranteeTitle}>
                Lost Parcel? Full Money-Back Guaranteed.
              </h3>
              <p className={styles.guaranteeText}>
                If your parcel is lost or untraceable during courier transit, we are committed (Insha&apos;Allah) to returning every single Riyal or sending an immediate free replacement. Zero risk.
              </p>
              <Link href="/contact" className={styles.guaranteeBtn}>
                <span>Claim Protection</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Need Direct Help? */}
            <div className={styles.helpCard}>
              <span className={styles.helpTitle}>Questions About Policies?</span>
              <a href="mailto:support@shopqatify.com" className={styles.helpLink}>
                <Mail size={14} />
                <span>support@shopqatify.com</span>
              </a>
              <button
                type="button"
                onClick={() => openChat()}
                className={styles.helpLink}
                style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <MessageCircle size={14} />
                <span>Live Chat Support (Instant)</span>
              </button>
              <Link href="/contact" className={styles.helpLink}>
                <ArrowRight size={14} />
                <span>Contact Online Support Desk</span>
              </Link>
            </div>
          </aside>

          {/* CONTENT AREA */}
          <main className={styles.contentArea}>
            <article className={styles.article}>
              {children}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
};

