import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyShell, TocItem } from '@/components/policy/PolicyShell';
import styles from '@/components/policy/PolicyShell.module.scss';
import {
  Lock,
  ShieldCheck,
  Eye,
  FileCheck,
  CreditCard,
  UserCheck,
  Server,
  HelpCircle,
  Database,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — Qatar Data Protection Compliant | Qatify Qatar',
  description:
    'Learn how Qatify protects your personal information in accordance with Qatar Law No. 13 of 2016 (PDPPL). Bank-grade payment security, zero card data storage, and strict privacy standards.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Qatify Qatar',
    description:
      'Transparent personal data protection and payment security for shoppers across Qatar. Compliant with Qatar PDPPL.',
    url: 'https://shopqatify.com/privacy',
  },
};

const TOC: TocItem[] = [
  { id: 'introduction', label: '1. Introduction & Who We Are' },
  { id: 'data-we-collect', label: '2. Information We Collect' },
  { id: 'how-we-use-data', label: '3. Why & How We Use Your Data' },
  { id: 'payment-security', label: '4. Payment Security (PCI-DSS)' },
  { id: 'data-sharing', label: '5. Sharing With Logistics & Partners' },
  { id: 'cookies-tracking', label: '6. Cookies & Session Storage' },
  { id: 'your-rights', label: '7. Your Rights Under Qatar PDPPL' },
  { id: 'data-retention', label: '8. Data Retention & Safeguards' },
  { id: 'contact-dpo', label: '9. Contact Our Data Protection Team' },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyShell
      title="Privacy Policy"
      badge="Qatar PDPPL Law No. 13/2016 Compliant"
      subtitle="Your privacy is respected and protected. We do not sell your personal data, and we treat your information with the highest security standards."
      lastUpdated="November 2026"
      readTime="5 min read"
      activeSlug="privacy"
      tableOfContents={TOC}
    >
      {/* 1. INTRODUCTION */}
      <section id="introduction">
        <h2>
          <Lock size={22} color="#FF6D00" />
          1. Introduction & Who We Are
        </h2>
        <p>
          Welcome to <strong>Qatify</strong> (accessible at <code>https://shopqatify.com</code>). This Privacy Policy explains transparently how Qatify (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operating in the State of Qatar, collects, uses, and safeguards your personal data when you visit our website, interact with our customer care, or order products for delivery in Qatar.
        </p>
        <p>
          We are committed to operating in full compliance with the <strong>State of Qatar Law No. 13 of 2016 concerning the Protection of the Privacy of Personal Data (PDPPL)</strong> and internationally recognized data protection principles.
        </p>
      </section>

      {/* 2. DATA WE COLLECT */}
      <section id="data-we-collect">
        <h2>
          <Database size={22} color="#FF6D00" />
          2. The Personal Information We Collect
        </h2>
        <p>We only collect information necessary to fulfill your orders, provide customer assistance, and ensure a seamless shopping experience:</p>
        <ul>
          <li>
            <strong>Contact & Identification Details:</strong> Your full name, email address, and active Qatar mobile / WhatsApp phone number.
          </li>
          <li>
            <strong>Delivery & Geographical Address:</strong> Your municipality in Qatar, Zone Number, Street Number, Building / Unit Number, villa / apartment name, and nearby landmark.
          </li>
          <li>
            <strong>Order & Transaction Records:</strong> Purchased products, selected variants/colors, order references (e.g. <code>QA-89421</code>), subtotal, shipping tier, and billing status.
          </li>
          <li>
            <strong>Customer Communication History:</strong> Records of WhatsApp support chats, inquiries submitted via our contact forms, feedback, and product reviews.
          </li>
          <li>
            <strong>Technical & Device Data:</strong> IP address, browser type, device operating system, language preferences, and basic page interaction metrics collected via anonymous session tokens.
          </li>
        </ul>
      </section>

      {/* 3. HOW WE USE DATA */}
      <section id="how-we-use-data">
        <h2>
          <FileCheck size={22} color="#FF6D00" />
          3. Why & How We Use Your Data
        </h2>
        <p>We process your personal information strictly for legitimate commercial and fulfillment purposes:</p>
        <ol>
          <li><strong>Order Processing & Fulfillment:</strong> Preparing your order, conducting pre-dispatch quality checks, and coordinating express air transit into Hamad International Airport.</li>
          <li><strong>Doorstep Delivery in Qatar:</strong> Providing delivery drivers and local courier services with your street address and phone number for last-mile drop-off and WhatsApp location confirmation.</li>
          <li><strong>Live Order Updates:</strong> Sending automated email or WhatsApp notifications regarding flight departures, customs clearance, and courier dispatch.</li>
          <li><strong>Customer Care & Warranty Resolution:</strong> Processing return requests, resolving inquiries, and fulfilling our 100% lost-parcel money-back guarantee.</li>
          <li><strong>Fraud Prevention & Platform Security:</strong> Detecting and mitigating malicious traffic, fraudulent card transactions, and abuse of discount vouchers.</li>
        </ol>
      </section>

      {/* 4. PAYMENT SECURITY */}
      <section id="payment-security">
        <h2>
          <CreditCard size={22} color="#FF6D00" />
          4. Payment Security & Strict Zero Card Storage
        </h2>
        <div className={styles.calloutGuarantee}>
          <div className={styles.calloutHeader}>
            <ShieldCheck size={20} />
            <span>Bank-Grade Payment Encryption (Zero Card Storage Policy)</span>
          </div>
          <p>
            <strong>Your financial safety is absolute:</strong> Qatify <strong>NEVER stores, logs, or views your complete credit or debit card numbers, expiration dates, or 3-digit CVV/CVC security codes</strong> on any server.
          </p>
          <p>
            All online payments are tokenized and processed through certified, PCI-DSS Level 1 compliant financial payment gateways (including Polar, Apple Pay, Google Pay, Visa, and Mastercard). Transactions use 256-bit TLS/SSL encryption.
          </p>
        </div>
      </section>

      {/* 5. DATA SHARING */}
      <section id="data-sharing">
        <h2>
          <UserCheck size={22} color="#FF6D00" />
          5. Sharing With Logistics Partners (Strict Anti-Sale Policy)
        </h2>
        <p>
          <strong>We never sell, rent, monetize, or trade your personal information</strong> with third-party advertisers, data brokers, or marketing networks.
        </p>
        <p>Your details are disclosed solely to essential service providers who enable your order to arrive:</p>
        <ul>
          <li><strong>International Air Freight Lines:</strong> To manifest cargo flights and provide accurate parcel tracking identifiers.</li>
          <li><strong>Qatar Local Couriers:</strong> To deliver physical parcels to your doorstep and communicate arrival timings via call or WhatsApp.</li>
          <li><strong>Payment Processors:</strong> To authenticate and process transactions in Qatari Riyal (QAR).</li>
          <li><strong>Legal Authorities:</strong> Only when strictly required by Qatar law, customs regulations, or court order.</li>
        </ul>
      </section>

      {/* 6. COOKIES & TRACKING */}
      <section id="cookies-tracking">
        <h2>
          <Eye size={22} color="#FF6D00" />
          6. Cookies & Local Session Storage
        </h2>
        <p>
          Qatify uses lightweight cookies and browser <code>localStorage</code> to maintain core storefront functionality:
        </p>
        <ul>
          <li><strong>Shopping Cart & Drawer:</strong> Preserving items in your cart and bundle builder between page reloads.</li>
          <li><strong>Wishlist & Product Comparison:</strong> Remembering your saved electronics without forcing an immediate account sign-up.</li>
          <li><strong>Security Tokens:</strong> Protecting against cross-site request forgery and ensuring authenticated checkout sessions.</li>
        </ul>
        <p>
          You can disable cookies in your browser settings at any time; however, some interactive features like cart preservation may be impaired.
        </p>
      </section>

      {/* 7. YOUR RIGHTS UNDER QATAR PDPPL */}
      <section id="your-rights">
        <h2>
          <ShieldCheck size={22} color="#FF6D00" />
          7. Your Rights Under Qatar PDPPL (Law No. 13 of 2016)
        </h2>
        <p>Under the Qatar Personal Data Privacy Protection Law, you hold specific, enforceable rights over your personal data:</p>
        <ul>
          <li><strong>Right to Access:</strong> You can request a summary of the personal information we hold about you.</li>
          <li><strong>Right to Rectification:</strong> You can update or correct any incomplete or inaccurate delivery details at any time.</li>
          <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request the deletion of your account and personal history, subject to our statutory recordkeeping obligations under Qatar commercial regulations.</li>
          <li><strong>Right to Withdraw Consent:</strong> You can unsubscribe from promotional deal alerts or newsletters with a single click.</li>
        </ul>
      </section>

      {/* 8. DATA RETENTION & SECURITY */}
      <section id="data-retention">
        <h2>
          <Server size={22} color="#FF6D00" />
          8. Data Retention & Safeguards
        </h2>
        <p>
          We retain your order and invoice records for as long as necessary to fulfill warranty obligations, process potential returns, and comply with Qatar commercial tax and accounting requirements.
        </p>
        <p>
          All data is protected using industry-standard technical measures: full SSL/TLS encryption for all in-transit traffic, encrypted databases, role-based access controls, and periodic vulnerability reviews.
        </p>
      </section>

      {/* 9. CONTACT DPO */}
      <section id="contact-dpo">
        <h2>
          <HelpCircle size={22} color="#FF6D00" />
          9. Contact Our Data Protection Team
        </h2>
        <p>
          If you have questions regarding this Privacy Policy, wish to exercise your rights under Qatar PDPPL regulations, or want to review your stored personal data, our online customer support team is ready to assist:
        </p>
        <ul>
          <li><strong>Email:</strong> <code>support@shopqatify.com</code> (Subject: <em>Data Privacy Officer</em>)</li>
          <li><strong>Online Help Desk:</strong> Submit an inquiry via our <Link href="/contact" style={{ color: '#FF6D00', textDecoration: 'underline' }}>Contact Us</Link> portal or Live Chat.</li>
          <li><strong>Operating Model:</strong> Digital E-Commerce Platform providing direct express air deliveries across the State of Qatar.</li>
        </ul>
      </section>
    </PolicyShell>
  );
}

