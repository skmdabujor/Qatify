import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyShell, TocItem } from '@/components/policy/PolicyShell';
import styles from '@/components/policy/PolicyShell.module.scss';
import {
  ShieldCheck,
  RotateCcw,
  PackageX,
  CreditCard,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund & Return Policy — 100% Transit Guarantee | Qatify Qatar',
  description:
    'Our customer promise in Qatar: If your order is lost or missing in courier transit, we guarantee a 100% full refund Insha’Allah. Enjoy 14-day returns, authentic electronics, and prompt local support.',
  alternates: {
    canonical: '/refund-policy',
  },
  openGraph: {
    title: 'Refund & Return Policy | Qatify Qatar',
    description:
      'Transparent, zero-risk return and refund policy in Qatar. Lost in courier transit? 100% money-back guarantee Insha’Allah.',
    url: 'https://shopqatify.com/refund-policy',
  },
};

const TOC: TocItem[] = [
  { id: 'lost-transit-guarantee', label: '1. Lost in Transit Guarantee (Insha’Allah)' },
  { id: '14-day-returns', label: '2. 14-Day Return Window' },
  { id: 'eligibility', label: '3. What Is Eligible for Return?' },
  { id: 'non-returnable', label: '4. Non-Returnable Items' },
  { id: 'how-to-claim', label: '5. How to Initiate a Return or Refund' },
  { id: 'refund-timeline', label: '6. Refund Processing & Payment Methods' },
  { id: 'damaged-defective', label: '7. Damaged or Wrong Item Received' },
  { id: 'order-cancellation', label: '8. Order Cancellations' },
];

export default function RefundPolicyPage() {
  return (
    <PolicyShell
      title="Refund & Return Policy"
      badge="100% Customer Protection Pledge"
      subtitle="At Qatify, your trust and hard-earned money are sacred. If something goes wrong with your shipment or product, we make things right without hurdles."
      lastUpdated="November 2026"
      readTime="5 min read"
      activeSlug="refund-policy"
      tableOfContents={TOC}
    >
      {/* 1. LOST IN TRANSIT PLEDGE */}
      <section id="lost-transit-guarantee">
        <h2>
          <ShieldCheck size={22} color="#FF6D00" />
          1. Our Core Promise: 100% Lost in Courier Transit Guarantee
        </h2>
        <p>
          Online shopping should always feel reassuring, not stressful. When you place an order with Qatify, you place your trust in our care. We recognize that international air transit and local courier logistics across Qatar involve multiple handoffs.
        </p>

        {/* Highlighted Guarantee Banner */}
        <div className={styles.calloutGuarantee}>
          <div className={styles.calloutHeader}>
            <HeartHandshake size={20} />
            <span>Our Core Promise — 100% Lost Parcel Money-Back Guarantee</span>
          </div>
          <p>
            <strong>If you do not receive your parcel because it goes missing, becomes untraceable, or is lost during courier transit:</strong>
          </p>
          <p>
            Qatify takes full, unconditional responsibility. <strong>We will refund 100% of your paid amount back to you, or dispatch an immediate express replacement free of charge — entirely according to your preference.</strong>
          </p>
          <p>
            We stand firmly committed to this pledge, <strong>Insha&apos;Allah</strong>. You will never bear financial loss for courier mishandling.
          </p>
        </div>

        <p>
          If your tracking status shows no carrier update for more than 7 consecutive business days past the maximum estimated delivery window, simply notify our online customer support team. We investigate directly with the freight cargo line and Qatar courier team, and if the parcel cannot be found, your refund is approved on the spot.
        </p>
      </section>

      {/* 2. 14-DAY RETURN WINDOW */}
      <section id="14-day-returns">
        <h2>
          <RotateCcw size={22} color="#FF6D00" />
          2. 14-Day Return Window
        </h2>
        <p>
          We want you to feel completely confident about every gadget you unpack. That is why Qatify offers a <strong>14-day inspection and return policy</strong> starting from the exact calendar day your order is marked as delivered at your doorstep anywhere in Qatar.
        </p>
        <p>
          Within these 14 days, if your device shows any functional manufacturing defect, hardware malfunction, or differs from what was described on our store, you are entitled to a full replacement or a complete refund.
        </p>
      </section>

      {/* 3. ELIGIBILITY */}
      <section id="eligibility">
        <h2>
          <CheckCircle2 size={22} color="#FF6D00" />
          3. What Is Eligible for Return?
        </h2>
        <p>To ensure a smooth and fair inspection for everyone, returned items must satisfy the following conditions:</p>
        <ul>
          <li>
            <strong>Defective or Malfunctioning:</strong> The product exhibits technical, electrical, or structural defects out-of-the-box not caused by user mishandling.
          </li>
          <li>
            <strong>Incorrect Product Delivered:</strong> You received the wrong color, variant, model, or completely different item than what is stated on your order invoice.
          </li>
          <li>
            <strong>Cosmetic or Transit Damage:</strong> The item arrived with visible scratches, cracks, or dents incurred during air cargo flight or local Qatar courier handling.
          </li>
          <li>
            <strong>Original Packaging & Accessories:</strong> Please retain the original product box, instruction manuals, charging cables, and included adapters so the return can be processed.
          </li>
        </ul>
      </section>

      {/* 4. NON-RETURNABLE ITEMS */}
      <section id="non-returnable">
        <h2>
          <PackageX size={22} color="#FF6D00" />
          4. Non-Returnable Items
        </h2>
        <p>For hygiene, safety, and operational reasons, the following scenarios cannot be accepted for refund:</p>
        <ul>
          <li>Products returned past the 14-day delivery window without prior written notice.</li>
          <li>Physical damage caused by drops, liquid submersion (unless product is explicitly certified waterproof and failure happened under normal rated use), electrical surges from uncertified wall adapters, or third-party unauthorized repair attempts.</li>
          <li>Hygiene-sensitive items such as in-ear silicone ear tips that have been unsealed and used, unless verified defective upon immediate initial arrival.</li>
          <li>Items missing serial numbers, tamper seals, or original identification stickers.</li>
        </ul>
      </section>

      {/* 5. HOW TO CLAIM */}
      <section id="how-to-claim">
        <h2>
          <Sparkles size={22} color="#FF6D00" />
          5. How to Initiate a Return or Refund (3 Simple Steps)
        </h2>
        <p>
          We do not believe in complicated bureaucracy or endless automated phone menus. Returning or claiming a refund at Qatify is simple and direct:
        </p>

        <div className={styles.stepGrid}>
          <div className={styles.stepCard}>
            <span className={styles.stepNum}>1</span>
            <h4 className={styles.stepTitle}>Reach Out With Order #</h4>
            <p className={styles.stepDesc}>
              Reach out via Live Chat on our website, submit our Contact Form, or email <strong>support@shopqatify.com</strong>. Include your Order ID (e.g., <code>QA-89421</code>) and a brief description of the issue.
            </p>
          </div>

          <div className={styles.stepCard}>
            <span className={styles.stepNum}>2</span>
            <h4 className={styles.stepTitle}>Quick 24h Review</h4>
            <p className={styles.stepDesc}>
              For damaged or defective goods, share a quick 10-second video or photo showing the issue. For missing courier parcels, we pull the airline/courier manifests directly. Our customer care team responds within 12–24 hours.
            </p>
          </div>

          <div className={styles.stepCard}>
            <span className={styles.stepNum}>3</span>
            <h4 className={styles.stepTitle}>Doorstep Pickup or Refund</h4>
            <p className={styles.stepDesc}>
              If a physical return is needed, the local courier collects the item directly from your address in Qatar. Once verified, your full refund is credited or a brand-new replacement is dispatched.
            </p>
          </div>
        </div>
      </section>

      {/* 6. REFUND TIMELINE & PAYMENT METHODS */}
      <section id="refund-timeline">
        <h2>
          <CreditCard size={22} color="#FF6D00" />
          6. Refund Processing Times & Methods
        </h2>
        <p>
          All refunds are issued in <strong>Qatari Riyal (QAR)</strong>. Once your refund is approved by our care team, here is how you will receive your funds:
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.policyTable}>
            <thead>
              <tr>
                <th>Original Payment Method</th>
                <th>Refund Channel</th>
                <th>Estimated Processing Timeline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Apple Pay / Google Pay</strong></td>
                <td>Directly to the linked debit/credit card</td>
                <td><strong>2 to 5 business days</strong> (depending on your bank)</td>
              </tr>
              <tr>
                <td><strong>Credit or Debit Card (Visa, Mastercard, Amex)</strong></td>
                <td>Original bank account credited</td>
                <td><strong>3 to 7 business days</strong> (QNB, CBQ, QIB, Dukhan, etc.)</td>
              </tr>
              <tr>
                <td><strong>Cash on Delivery (COD)</strong></td>
                <td>Local Qatar IBAN Bank Transfer or Instant Qatify Store Credit</td>
                <td><strong>Instant</strong> for store credit; <strong>24–48 hours</strong> for local Qatar bank transfer</td>
              </tr>
              <tr>
                <td><strong>Lost in Courier Transit Claim</strong></td>
                <td>100% full refund to original payment source</td>
                <td>Initiated within <strong>24 hours</strong> of claim verification</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <em>Note: We do not deduct any restocking fee, administrative fee, or return shipping surcharge when an item is defective, wrong, or lost by the courier. You receive 100% of the money you paid.</em>
        </p>
      </section>

      {/* 7. DAMAGED OR WRONG ITEM RECEIVED */}
      <section id="damaged-defective">
        <h2>
          <AlertTriangle size={22} color="#FF6D00" />
          7. Damaged or Wrong Item Received
        </h2>
        <p>
          Every item leaving our international warehouse undergoes a thorough visual and functional quality inspection. However, rough turbulence during air cargo flight or transit bumps can occasionally cause cosmetic damage.
        </p>
        <p>
          If your package arrives with an opened seal, crushed outer box, or incorrect contents:
        </p>
        <ol>
          <li>Take clear pictures of the outer parcel box, the shipping label, and the product itself.</li>
          <li>Contact our support team within <strong>48 hours of delivery</strong>.</li>
          <li>We will immediately arrange a complimentary replacement air-shipped to your door, or process a full refund without making you wait weeks for manufacturer investigations.</li>
        </ol>
      </section>

      {/* 8. ORDER CANCELLATIONS */}
      <section id="order-cancellation">
        <h2>
          <RotateCcw size={22} color="#FF6D00" />
          8. Order Cancellations
        </h2>
        <p>
          Because we strive to deliver within 6 to 10 business days across Qatar, our logistics team begins preparing and batching air shipments within 2 to 4 hours of order placement.
        </p>
        <ul>
          <li>
            <strong>Before Dispatch:</strong> If you change your mind shortly after ordering, reach out to us immediately via Live Chat or email support@shopqatify.com. If your order has not yet been processed for flight manifest, we will cancel it instantly and issue a 100% immediate refund.
          </li>
          <li>
            <strong>After Flight Dispatch:</strong> Once an international air waybill has been generated and your parcel is in mid-flight or at customs clearance, the shipment cannot be intercepted in mid-air. In this case, simply accept the package and notify us to coordinate a 14-day return upon arrival.
          </li>
        </ul>
      </section>

      {/* CONTACT BOX */}
      <div className={styles.calloutHighlight}>
        <div className={styles.calloutHeader}>
          <HeartHandshake size={20} />
          <span>Need Help With a Return or Missing Shipment?</span>
        </div>
        <p>
          Our online customer care team is dedicated to resolving your issue personally and swiftly. Reach out via Live Chat, submit an inquiry on our <Link href="/contact" style={{ color: '#FF6D00', textDecoration: 'underline' }}>Contact page</Link>, or email us anytime at <strong>support@shopqatify.com</strong>.
        </p>
      </div>
    </PolicyShell>
  );
}

