import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyShell, TocItem } from '@/components/policy/PolicyShell';
import styles from '@/components/policy/PolicyShell.module.scss';

export const metadata: Metadata = {
  title: 'Privacy Policy — Qatar Data Protection Compliant | Qatify Qatar',
  description:
    'Official privacy policy for Qatify Qatar. Compliant with Qatar Law No. 13 of 2016 (PDPPL). PCI-DSS payment tokenization, zero card storage, and strict data security.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Qatify Qatar',
    description:
      'Personal data protection and payment security standards for consumers across the State of Qatar. Compliant with Qatar PDPPL.',
    url: 'https://shopqatify.com/privacy',
  },
};

const TOC: TocItem[] = [
  { id: 'introduction', label: '1. Regulatory Scope & Data Controller Identification' },
  { id: 'data-we-collect', label: '2. Categories of Personal Data Collected' },
  { id: 'how-we-use-data', label: '3. Lawful Grounds & Purposes of Processing' },
  { id: 'payment-security', label: '4. Payment Security & Zero Card Storage Standard' },
  { id: 'data-sharing', label: '5. Data Disclosures to Logistics & Service Partners' },
  { id: 'cookies-tracking', label: '6. Cookies & Session Storage Architecture' },
  { id: 'your-rights', label: '7. Data Subject Rights Under Qatar PDPPL' },
  { id: 'data-retention', label: '8. Data Retention Periods & Security Safeguards' },
  { id: 'contact-dpo', label: '9. Data Protection Officer Contact Details' },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyShell
      title="Privacy Policy"
      subtitle="Data protection standards and personal information processing practices compliant with Qatar Law No. 13 of 2016 (PDPPL)."
      lastUpdated="November 2026"
      readTime="5 min read"
      activeSlug="privacy"
      tableOfContents={TOC}
    >
      {/* 1. INTRODUCTION */}
      <section id="introduction">
        <h2>1. Regulatory Scope & Data Controller Identification</h2>
        <p>
          This Privacy Policy sets out the data processing framework governed by <strong>Qatify</strong> (accessible at <code>https://shopqatify.com</code>, referred to as &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) regarding the collection, storage, transfer, and utilization of personal information relating to individuals interacting with our platform in the State of Qatar.
        </p>
        <p>
          All data processing activities are conducted in strict adherence to the <strong>State of Qatar Law No. 13 of 2016 concerning the Protection of the Privacy of Personal Data (PDPPL)</strong>, alongside applicable national consumer electronic commerce standards.
        </p>
      </section>

      {/* 2. DATA WE COLLECT */}
      <section id="data-we-collect">
        <h2>2. Categories of Personal Data Collected</h2>
        <p>
          We restrict data collection to verified information required for commercial transactions, order fulfillment, customs declaration, and customer support:
        </p>
        <ul>
          <li>
            <strong>Identity & Contact Information:</strong> Full legal name, verified email address, and active Qatar mobile telephone number.
          </li>
          <li>
            <strong>Consignment Delivery Coordinates:</strong> Administrative municipality in Qatar, Zone Number, Street Name/Number, Building Number, Unit/Apartment identifier, and optional delivery landmark.
          </li>
          <li>
            <strong>Transaction & Billing Data:</strong> Order reference identifiers (e.g., <code>QA-89421</code>), purchased SKUs and variants, subtotal amounts, applicable delivery tariffs, and payment transaction authorizations.
          </li>
          <li>
            <strong>Customer Communications:</strong> Transcripts of customer service interactions via Live Chat, email records, and warranty claim documentation.
          </li>
          <li>
            <strong>Technical & Session Information:</strong> Internet Protocol (IP) address, operating system, browser specifications, and encrypted session identifiers utilized for checkout security.
          </li>
        </ul>
      </section>

      {/* 3. HOW WE USE DATA */}
      <section id="how-we-use-data">
        <h2>3. Lawful Grounds & Purposes of Processing</h2>
        <p>Personal data is processed strictly under established commercial and legal grounds:</p>
        <ol>
          <li><strong>Contract Performance & Order Execution:</strong> Order staging, pre-dispatch quality verification, international air cargo routing, and arrival processing at Hamad International Airport.</li>
          <li><strong>Doorstep Delivery Fulfillment:</strong> Providing domestic Qatar courier partners with designated address coordinates and recipient contact details for scheduled last-mile delivery.</li>
          <li><strong>Logistics Notifications:</strong> Automated transmission of tracking milestones, customs clearance status, and out-for-delivery notifications via email and SMS.</li>
          <li><strong>Warranty Administration & Returns:</strong> Facilitating authorized product returns, functional evaluations, and transit loss reimbursements.</li>
          <li><strong>Platform Security & Fraud Prevention:</strong> Automated algorithmic verification to prevent unauthorized credit card usage, identity misrepresentation, and malicious automated queries.</li>
        </ol>
      </section>

      {/* 4. PAYMENT SECURITY */}
      <section id="payment-security">
        <h2>4. Payment Security & Zero Card Storage Standard</h2>
        <div className={styles.calloutGuarantee}>
          <div className={styles.calloutHeader}>
            <span>PCI-DSS Tokenization & Zero Card Storage Standard</span>
          </div>
          <p>
            <strong>Cardholder Data Protection:</strong> Qatify <strong>does not capture, record, process, or store complete credit or debit card numbers, expiration dates, or Card Verification Values (CVV/CVC)</strong> on its servers.
          </p>
          <p>
            All electronic payment authorizations are executed directly through certified, PCI-DSS Level 1 compliant financial processing partners (including Polar, Apple Pay, Google Pay, Visa, and Mastercard) using 256-bit TLS/SSL encrypted communication channels.
          </p>
        </div>
      </section>

      {/* 5. DATA SHARING */}
      <section id="data-sharing">
        <h2>5. Data Disclosures to Logistics & Service Partners</h2>
        <p>
          <strong>Qatify does not sell, rent, commercialize, or transfer personal information</strong> to third-party marketing organizations, advertising networks, or independent data brokers.
        </p>
        <p>Data disclosure is restricted exclusively to authorized operational service providers:</p>
        <ul>
          <li><strong>International Air Cargo Carriers:</strong> For international flight manifest registration, airway bill documentation, and cargo routing.</li>
          <li><strong>Licensed Qatar Couriers:</strong> For last-mile transit and physical delivery coordination within Qatar.</li>
          <li><strong>Financial Gateway Providers:</strong> For payment authentication, charge authorization, and refund processing in Qatari Riyal (QAR).</li>
          <li><strong>Regulatory Authorities:</strong> Where disclosure is mandated under the statutory laws of the State of Qatar, customs inspection directives, or official judicial proceedings.</li>
        </ul>
      </section>

      {/* 6. COOKIES & TRACKING */}
      <section id="cookies-tracking">
        <h2>6. Cookies & Session Storage Architecture</h2>
        <p>
          Our platform utilizes functional session cookies and browser <code>localStorage</code> solely to ensure technical system integrity:
        </p>
        <ul>
          <li><strong>Cart State Preservation:</strong> Retaining selected items and custom bundles across browsing sessions without requiring immediate account creation.</li>
          <li><strong>Authentication Tokens:</strong> Maintaining secure, encrypted sessions during the checkout process and protecting against cross-site request forgery (CSRF).</li>
          <li><strong>Interface Preferences:</strong> Preserving layout and filtering choices across product categories.</li>
        </ul>
        <p>
          Users may disable cookies via individual browser settings; however, core transactional features including checkout continuity may be affected.
        </p>
      </section>

      {/* 7. YOUR RIGHTS UNDER QATAR PDPPL */}
      <section id="your-rights">
        <h2>7. Data Subject Rights Under Qatar PDPPL (Law No. 13 of 2016)</h2>
        <p>Under the Qatar Personal Data Privacy Protection Law, data subjects residing in Qatar possess enforceable statutory rights:</p>
        <ul>
          <li><strong>Right of Access:</strong> The right to obtain formal confirmation and an itemized record of personal data held by Qatify.</li>
          <li><strong>Right of Rectification:</strong> The right to demand correction of inaccurate, outdated, or incomplete personal records.</li>
          <li><strong>Right of Erasure:</strong> The right to request the permanent deletion of personal accounts, subject to statutory tax, accounting, and commercial retention mandates under Qatar law.</li>
          <li><strong>Right to Withdraw Consent:</strong> The right to revoke consent for promotional announcements at any time with immediate effect.</li>
        </ul>
      </section>

      {/* 8. DATA RETENTION & SECURITY */}
      <section id="data-retention">
        <h2>8. Data Retention Periods & Security Safeguards</h2>
        <p>
          Transactional records, commercial invoices, and fulfillment documentation are retained for the minimum statutory period required to satisfy product warranty obligations and Qatar commercial compliance regulations.
        </p>
        <p>
          Technical infrastructure is protected through enterprise-grade safeguards: TLS 1.3 cryptographic protocols for data in transit, AES-256 encryption for database records, multi-factor authentication for operational personnel, and routine vulnerability assessments.
        </p>
      </section>

      {/* 9. CONTACT DPO */}
      <section id="contact-dpo">
        <h2>9. Data Protection Officer Contact Details</h2>
        <p>
          For regulatory inquiries, rights requests under the Qatar PDPPL, or formal data protection communications, contact our compliance team:
        </p>
        <ul>
          <li><strong>Email:</strong> <code>support@shopqatify.com</code> (Attention: <em>Data Privacy Compliance</em>)</li>
          <li><strong>Online Help Desk:</strong> Inquiries may be submitted via our official <Link href="/contact" style={{ color: '#ffb800', textDecoration: 'underline' }}>Contact portal</Link>.</li>
          <li><strong>Jurisdiction:</strong> State of Qatar.</li>
        </ul>
      </section>
    </PolicyShell>
  );
}
