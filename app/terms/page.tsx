import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyShell, TocItem } from '@/components/policy/PolicyShell';
import styles from '@/components/policy/PolicyShell.module.scss';
import {
  FileText,
  Scale,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions — User Agreement | Qatify Qatar',
  description:
    'Review the terms and conditions governing purchases, deliveries, and services on Qatify Qatar. Transparent, fair, and governed by the laws of the State of Qatar.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms & Conditions | Qatify Qatar',
    description:
      'Official terms of service for shopping on ShopQatify.com in Qatar. Governed by Qatar e-commerce and consumer protection regulations.',
    url: 'https://shopqatify.com/terms',
  },
};

const TOC: TocItem[] = [
  { id: 'agreement', label: '1. Agreement to Terms' },
  { id: 'business-model', label: '2. Cross-Border Air Fulfillment Model' },
  { id: 'pricing-currency', label: '3. Pricing & Currency (QAR)' },
  { id: 'orders-acceptance', label: '4. Orders & Acceptance' },
  { id: 'customer-obligations', label: '5. Customer Address Obligations' },
  { id: 'shipping-risk', label: '6. Delivery & Missing Courier Guarantee' },
  { id: 'returns-warranties', label: '7. 14-Day Returns & Product Quality' },
  { id: 'intellectual-property', label: '8. Intellectual Property' },
  { id: 'limitation-liability', label: '9. Limitation of Liability' },
  { id: 'governing-law', label: '10. Governing Law & Jurisdiction' },
];

export default function TermsPage() {
  return (
    <PolicyShell
      title="Terms & Conditions"
      badge="Official User Agreement"
      subtitle="Please read these terms carefully before placing an order. They outline our mutual rights, delivery obligations, and guarantees across the State of Qatar."
      lastUpdated="November 2026"
      readTime="6 min read"
      activeSlug="terms"
      tableOfContents={TOC}
    >
      {/* 1. AGREEMENT */}
      <section id="agreement">
        <h2>
          <Scale size={22} color="#ffb800" />
          1. Agreement to Terms
        </h2>
        <p>
          These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;Customer&quot;, &quot;you&quot;, or &quot;your&quot;) and <strong>Qatify</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operating in the State of Qatar through <code>https://shopqatify.com</code>.
        </p>
        <p>
          By browsing our site, registering an account, or purchasing products from Qatify, you signify your full agreement to these Terms, our <Link href="/privacy"><strong>Privacy Policy</strong></Link>, <Link href="/shipping-policy"><strong>Shipping Policy</strong></Link>, and <Link href="/refund-policy"><strong>Refund & Return Policy</strong></Link>. If you do not agree to these terms, please do not use our services.
        </p>
      </section>

      {/* 2. BUSINESS MODEL */}
      <section id="business-model">
        <h2>
          <ShoppingBag size={22} color="#ffb800" />
          2. Direct Cross-Border Air Fulfillment Model
        </h2>
        <p>
          Qatify operates a modern, curated cross-border air logistics platform. We source authentic lifestyle electronics, mobile accessories, and trending tech gadgets directly from certified manufacturers worldwide.
        </p>
        <p>
          Items ordered through Qatify are consolidated at central quality inspection centers and delivered to your doorstep in Qatar via <strong>Direct Global Air Express in 6 to 10 business days</strong>. We do not represent ourselves as an offline brick-and-mortar storefront or a same-hour grocery delivery service.
        </p>
      </section>

      {/* 3. PRICING & CURRENCY */}
      <section id="pricing-currency">
        <h2>
          <CreditCard size={22} color="#ffb800" />
          3. Pricing & Currency (Qatari Riyal — QAR)
        </h2>
        <p>
          All product prices, shipping fees, and discounts on Qatify are displayed and charged exclusively in <strong>Qatari Riyal (QAR / ر.ق)</strong>.
        </p>
        <ul>
          <li><strong>No Hidden Currency Conversion:</strong> Because prices are in QAR, customers using Qatari debit or credit cards (issued by QNB, Commercial Bank, QIB, Doha Bank, Dukhan Bank, etc.) incur zero foreign exchange conversion surcharges.</li>
          <li><strong>Pricing Accuracy:</strong> We strive to maintain 100% price accuracy. In the rare event of a typographical or system error displaying an obviously incorrect price (e.g. QAR 1 instead of QAR 199), we reserve the right to contact you before air dispatch to cancel or adjust the order with your consent.</li>
        </ul>
      </section>

      {/* 4. ORDERS & ACCEPTANCE */}
      <section id="orders-acceptance">
        <h2>
          <CheckCircle2 size={22} color="#ffb800" />
          4. Orders, Acceptance & Cancellations
        </h2>
        <p>
          Placing an order constitutes an offer to purchase. An order is accepted by Qatify once payment authorization is confirmed and an official order confirmation receipt (e.g., <code>QA-XXXXX</code>) is issued to your email or WhatsApp.
        </p>
        <p>
          <strong>Cancellations:</strong> You may cancel your order free of charge before international air freight dispatch has been processed (typically within 2 to 4 hours of order placement). Once an international cargo air waybill has been generated and the package is in transit, the order cannot be recalled until arrival at your address in Qatar, at which point our 14-day return procedure applies.
        </p>
      </section>

      {/* 5. CUSTOMER ADDRESS OBLIGATIONS */}
      <section id="customer-obligations">
        <h2>
          <Truck size={22} color="#ffb800" />
          5. Customer Responsibilities: Qatar Address Accuracy
        </h2>
        <p>
          To ensure timely doorstep delivery within our promised 6–10 business day window, customers are responsible for providing:
        </p>
        <ul>
          <li>An active phone number for the delivery courier to coordinate package arrival.</li>
          <li>Accurate delivery address details within Qatar (zone/area, street, and building/villa).</li>
          <li>Prompt coordination when the courier delivers your package to your doorstep.</li>
        </ul>
      </section>

      {/* 6. DELIVERY & MISSING COURIER GUARANTEE */}
      <section id="shipping-risk">
        <h2>
          <Truck size={22} color="#ffb800" />
          6. Delivery, Transit Times & The Missing Courier Guarantee
        </h2>
        <p>
          We target a delivery window of <strong>6 to 10 business days</strong> across all municipalities of Qatar (Doha, Lusail, Al Rayyan, Al Wakrah, Al Khor, etc.).
        </p>

        <div className={styles.calloutGuarantee}>
          <div className={styles.calloutHeader}>
            <Scale size={20} />
            <span>Our Unconditional Missing Package Guarantee (Insha’Allah)</span>
          </div>
          <p>
            Unlike marketplaces that evade responsibility by blaming third-party shipping couriers, Qatify provides full consumer protection:
          </p>
          <p>
            <strong>If an order is lost, missing, or confirmed damaged during courier transit, Qatify is bound and committed (Insha&apos;Allah) to issuing a 100% full refund to the customer, or sending a replacement immediately at no added cost.</strong>
          </p>
        </div>
      </section>

      {/* 7. 14-DAY RETURNS */}
      <section id="returns-warranties">
        <h2>
          <RotateCcw size={22} color="#ffb800" />
          7. 14-Day Returns & Product Quality
        </h2>
        <p>
          All products sold on Qatify are backed by our <strong>14-Day Return Policy</strong> for any verified manufacturing defect or fulfillment discrepancy. Please refer to our full <Link href="/refund-policy"><strong>Refund & Return Policy</strong></Link> for detailed eligibility criteria and return logistics.
        </p>
      </section>

      {/* 8. INTELLECTUAL PROPERTY */}
      <section id="intellectual-property">
        <h2>
          <FileText size={22} color="#ffb800" />
          8. Intellectual Property & Brand Names
        </h2>
        <p>
          All original website design elements, UI architecture, graphics, and written content on <code>shopqatify.com</code> are the proprietary intellectual property of Qatify.
        </p>
        <p>
          Third-party brand names, logos, and trademarks (such as Anker, Baseus, Green Lion, Porodo, Soundcore, Apple, etc.) belong strictly to their respective registered owners and are utilized solely for descriptive product identification.
        </p>
      </section>

      {/* 9. LIMITATION OF LIABILITY */}
      <section id="limitation-liability">
        <h2>
          <AlertCircle size={22} color="#ffb800" />
          9. Limitation of Liability & Force Majeure
        </h2>
        <p>
          Qatify shall not be liable for delivery delays resulting from extraordinary circumstances outside our reasonable control (Force Majeure), including extreme adverse weather, regional airport closures, or official regulatory customs holds, provided we make every diligent effort to notify you and expedite clearance.
        </p>
        <p>
          In all cases, Qatify&apos;s total financial liability shall not exceed the total amount paid by the customer for the specific order in question.
        </p>
      </section>

      {/* 10. GOVERNING LAW */}
      <section id="governing-law">
        <h2>
          <Scale size={22} color="#ffb800" />
          10. Governing Law & Dispute Resolution
        </h2>
        <p>
          These Terms and any non-contractual obligations arising out of or in connection with them shall be governed by and construed in accordance with the <strong>laws of the State of Qatar</strong>, including Qatar Consumer Protection Law No. 8 of 2008 and Electronic Commerce and Transactions Law No. 16 of 2010.
        </p>
        <p>
          Any disputes that cannot be resolved amicably through our customer support channels shall be subject to the exclusive jurisdiction of the competent courts of <strong>Doha, State of Qatar</strong>.
        </p>
      </section>

      {/* CONTACT */}
      <div className={styles.calloutHighlight}>
        <div className={styles.calloutHeader}>
          <HelpCircle size={18} />
          <span>Questions or Legal Inquiries?</span>
        </div>
        <p>
          For questions regarding these Terms, contract queries, or commercial terms, reach out to our legal and operations desk at <strong>support@shopqatify.com</strong> or contact us via our online <Link href="/contact" style={{ color: '#ffb800', textDecoration: 'underline' }}>Contact Us</Link> portal.
        </p>
      </div>
    </PolicyShell>
  );
}

