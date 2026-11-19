import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyShell, TocItem } from '@/components/policy/PolicyShell';
import styles from '@/components/policy/PolicyShell.module.scss';

export const metadata: Metadata = {
  title: 'Terms & Conditions — User Agreement | Qatify Qatar',
  description:
    'Official terms and conditions governing purchases, deliveries, warranties, and platform services on Qatify Qatar. Governed by the laws of the State of Qatar.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms & Conditions | Qatify Qatar',
    description:
      'Official terms of service for shopping on ShopQatify.com in Qatar. Compliant with Qatar e-commerce and consumer protection regulations.',
    url: 'https://shopqatify.com/terms',
  },
};

const TOC: TocItem[] = [
  { id: 'agreement', label: '1. Agreement to Commercial Terms' },
  { id: 'business-model', label: '2. International Cross-Border Fulfillment Framework' },
  { id: 'pricing-currency', label: '3. Pricing & Currency Integrity (QAR)' },
  { id: 'orders-acceptance', label: '4. Order Confirmation, Acceptance & Cancellation' },
  { id: 'customer-obligations', label: '5. Customer Address & Verification Obligations' },
  { id: 'shipping-risk', label: '6. Delivery Timelines & Carrier Transit Liability' },
  { id: 'returns-warranties', label: '7. 14-Day Warranty & Return Provisions' },
  { id: 'intellectual-property', label: '8. Intellectual Property & Brand Trademarks' },
  { id: 'limitation-liability', label: '9. Limitation of Liability & Force Majeure' },
  { id: 'governing-law', label: '10. Governing Law & Dispute Resolution' },
];

export default function TermsPage() {
  return (
    <PolicyShell
      title="Terms & Conditions"
      subtitle="Commercial user agreement governing platform access, transactions, and consumer rights across the State of Qatar."
      lastUpdated="November 2026"
      readTime="6 min read"
      activeSlug="terms"
      tableOfContents={TOC}
    >
      {/* 1. AGREEMENT */}
      <section id="agreement">
        <h2>1. Agreement to Commercial Terms</h2>
        <p>
          These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding commercial agreement between the user (&quot;Customer&quot;, &quot;you&quot;, or &quot;your&quot;) and <strong>Qatify</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operating in the State of Qatar through <code>https://shopqatify.com</code>.
        </p>
        <p>
          Accessing this platform, creating a user profile, or finalizing an order signifies your comprehensive agreement to these Terms, alongside our incorporated <Link href="/privacy"><strong>Privacy Policy</strong></Link>, <Link href="/shipping-policy"><strong>Shipping & Delivery Policy</strong></Link>, and <Link href="/refund-policy"><strong>Refund & Return Policy</strong></Link>.
        </p>
      </section>

      {/* 2. BUSINESS MODEL */}
      <section id="business-model">
        <h2>2. International Cross-Border Fulfillment Framework</h2>
        <p>
          Qatify operates a curated cross-border digital commerce infrastructure connecting consumers in Qatar directly with verified international electronic hardware manufacturers and brand distributors.
        </p>
        <p>
          Consignments are inspected at regional fulfillment centers and air-shipped directly into Qatar via scheduled express air freight with an estimated delivery window of <strong>6 to 10 business days</strong>. Qatify acts as the commercial retailer and primary importer of record, managing all international air logistics, customs declarations, and local courier handovers.
        </p>
      </section>

      {/* 3. PRICING & CURRENCY */}
      <section id="pricing-currency">
        <h2>3. Pricing & Currency Integrity (QAR)</h2>
        <p>
          All product valuations, applicable delivery tariffs, bundle discounts, and promotional adjustments on Qatify are denominated and billed exclusively in <strong>Qatari Riyal (QAR / ر.ق)</strong>.
        </p>
        <ul>
          <li><strong>Zero Foreign Conversion Fees:</strong> Because transactions are billed natively in QAR, transactions on cards issued by licensed Qatari banks (such as QNB, Commercial Bank, QIB, Doha Bank, and Dukhan Bank) incur no cross-border currency conversion margins.</li>
          <li><strong>Pricing Integrity:</strong> Prices displayed at checkout are final. In the event of an obvious technical error resulting in a misquoted price, Qatify reserves the right to notify the customer prior to flight manifest registration to confirm the revised transaction or cancel the order with a full refund.</li>
        </ul>
      </section>

      {/* 4. ORDERS & ACCEPTANCE */}
      <section id="orders-acceptance">
        <h2>4. Order Confirmation, Acceptance & Cancellation</h2>
        <p>
          Submission of an order through our checkout constitutes a commercial offer to purchase. An order is formally accepted once payment authorization is confirmed and a serialized invoice identifier (e.g., <code>QA-89421</code>) is issued to your verified contact credentials.
        </p>
        <p>
          <strong>Cancellations:</strong> Customers may cancel an order free of charge prior to international air cargo manifest registration (typically within 2 to 4 hours following payment authorization). Once an air waybill is registered and the consignment is in international flight transit or customs inspection, the shipment cannot be intercepted in transit; standard 14-day return protocols apply upon delivery.
        </p>
      </section>

      {/* 5. CUSTOMER ADDRESS OBLIGATIONS */}
      <section id="customer-obligations">
        <h2>5. Customer Address & Verification Obligations</h2>
        <p>
          To maintain standard 6 to 10 business day delivery timelines across Qatar, customers are required to supply:
        </p>
        <ul>
          <li>An active local mobile telephone number capable of receiving incoming calls and WhatsApp delivery coordination.</li>
          <li>Complete Qatar postal coordinates including designated Municipality, Zone Number, Street Name or Number, Building Number, and Unit/Apartment identification.</li>
          <li>Timely presence or authorized agent availability at the designated address during courier delivery attempts.</li>
        </ul>
      </section>

      {/* 6. DELIVERY & MISSING COURIER GUARANTEE */}
      <section id="shipping-risk">
        <h2>6. Delivery Timelines & Carrier Transit Liability</h2>
        <p>
          Standard delivery schedules target <strong>6 to 10 business days</strong> across all administrative municipalities of Qatar.
        </p>

        <div className={styles.calloutGuarantee}>
          <div className={styles.calloutHeader}>
            <span>Carrier Liability & Non-Delivery Guarantee</span>
          </div>
          <p>
            Qatify maintains direct commercial responsibility for consignment security throughout transit.
          </p>
          <p>
            <strong>If an order is confirmed lost, damaged, or permanently untraceable during international air transit or local courier delivery, Qatify is legally bound to disburse a 100% full refund to the customer or dispatch an immediate replacement shipment at no added cost.</strong>
          </p>
        </div>
      </section>

      {/* 7. 14-DAY RETURNS */}
      <section id="returns-warranties">
        <h2>7. 14-Day Warranty & Return Provisions</h2>
        <p>
          All electronic hardware purchased on Qatify is covered by a <strong>14-Day Warranty & Return Policy</strong> governing manufacturing defects, hardware failures, and order fulfillment errors, compliant with Qatar Consumer Protection Law No. 8 of 2008. Complete return criteria, exclusions, and settlement procedures are detailed in our <Link href="/refund-policy"><strong>Refund & Return Policy</strong></Link>.
        </p>
      </section>

      {/* 8. INTELLECTUAL PROPERTY */}
      <section id="intellectual-property">
        <h2>8. Intellectual Property & Brand Trademarks</h2>
        <p>
          All original platform architecture, UI design components, proprietary algorithms, and written materials on <code>shopqatify.com</code> are the protected intellectual property of Qatify.
        </p>
        <p>
          Third-party brand names, trademarks, and logos (including Anker, Baseus, Green Lion, Porodo, Soundcore, Apple, and others) remain the exclusive property of their respective trademark holders and are utilized on the platform strictly for product identification and technical descriptive purposes.
        </p>
      </section>

      {/* 9. LIMITATION OF LIABILITY */}
      <section id="limitation-liability">
        <h2>9. Limitation of Liability & Force Majeure</h2>
        <p>
          Qatify shall not be held liable for delivery delays arising from Force Majeure events beyond reasonable operational control, including severe meteorological phenomena, civil aviation airspace closures, or statutory border inspection mandates, provided diligent commercial efforts are made to expedite clearance.
        </p>
        <p>
          Under all circumstances, Qatify’s total financial liability in connection with any claim shall be limited strictly to the total purchase price paid by the customer for the relevant transaction.
        </p>
      </section>

      {/* 10. GOVERNING LAW */}
      <section id="governing-law">
        <h2>10. Governing Law & Dispute Resolution</h2>
        <p>
          These Terms and all commercial transactions conducted through the platform are governed by and construed in accordance with the <strong>statutory laws of the State of Qatar</strong>, specifically Qatar Consumer Protection Law No. 8 of 2008 and Electronic Commerce and Transactions Law No. 16 of 2010.
        </p>
        <p>
          Any disputes arising from or relating to these Terms that cannot be settled amicably through our customer support desk shall be submitted to the exclusive jurisdiction of the competent courts of <strong>Doha, State of Qatar</strong>.
        </p>
      </section>

      {/* CONTACT */}
      <div className={styles.calloutHighlight}>
        <div className={styles.calloutHeader}>
          <span>Commercial & Legal Inquiries</span>
        </div>
        <p>
          For contractual inquiries, commercial partnership questions, or formal legal correspondence, contact our operations desk at <strong>support@shopqatify.com</strong> or via our online <Link href="/contact" style={{ color: '#ffb800', textDecoration: 'underline' }}>Contact portal</Link>.
        </p>
      </div>
    </PolicyShell>
  );
}
