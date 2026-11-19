import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyShell, TocItem } from '@/components/policy/PolicyShell';
import styles from '@/components/policy/PolicyShell.module.scss';

export const metadata: Metadata = {
  title: 'Refund & Return Policy — 14-Day Warranty & Transit Protection | Qatify Qatar',
  description:
    'Official refund and return policy for Qatify Qatar. 14-day warranty for consumer electronics, 100% money-back guarantee for transit loss, and local bank processing.',
  alternates: {
    canonical: '/refund-policy',
  },
  openGraph: {
    title: 'Refund & Return Policy | Qatify Qatar',
    description:
      'Transparent return and refund standards in Qatar. 14-day warranty, full transit loss protection, and local bank disbursement in Qatari Riyal.',
    url: 'https://shopqatify.com/refund-policy',
  },
};

const TOC: TocItem[] = [
  { id: 'lost-transit-guarantee', label: '1. Transit Loss Protection & Non-Delivery Guarantee' },
  { id: '14-day-returns', label: '2. 14-Day Return & Replacement Period' },
  { id: 'eligibility', label: '3. Return Eligibility & Product Condition Standards' },
  { id: 'non-returnable', label: '4. Non-Returnable Items & Exclusions' },
  { id: 'how-to-claim', label: '5. Return & Exchange Authorization Procedure' },
  { id: 'refund-timeline', label: '6. Refund Processing Timelines & Disbursement Methods' },
  { id: 'damaged-defective', label: '7. Damaged, Defective, or Incorrect Deliveries' },
  { id: 'order-cancellation', label: '8. Order Cancellation Guidelines' },
];

export default function RefundPolicyPage() {
  return (
    <PolicyShell
      title="Refund & Return Policy"
      subtitle="Official warranty standards, return authorization procedures, and refund disbursement guidelines across the State of Qatar."
      lastUpdated="November 2026"
      readTime="5 min read"
      activeSlug="refund-policy"
      tableOfContents={TOC}
    >
      {/* 1. LOST IN TRANSIT PLEDGE */}
      <section id="lost-transit-guarantee">
        <h2>1. Transit Loss Protection & Non-Delivery Guarantee</h2>
        <p>
          Qatify guarantees that every placed order is delivered intact to the designated address in Qatar. In the event that a consignment is declared lost by international air freight carriers, untraceable by local couriers, or delayed past seven (7) consecutive business days beyond the maximum estimated delivery window:
        </p>

        {/* Highlighted Guarantee Banner */}
        <div className={styles.calloutGuarantee}>
          <div className={styles.calloutHeader}>
            <span>Transit Loss Protection & Full Reimbursement Policy</span>
          </div>
          <p>
            <strong>If an order is confirmed missing or lost during courier transit:</strong>
          </p>
          <p>
            Qatify assumes full financial and logistics liability. <strong>We will process a 100% full refund to the original payment method or dispatch an immediate priority replacement consignment at zero additional expense—based entirely on the customer’s preference.</strong>
          </p>
          <p>
            Customers do not bear financial responsibility for carrier mishandling, cargo misrouting, or freight transit loss.
          </p>
        </div>

        <p>
          If your tracking status displays no carrier milestone updates for more than seven (7) consecutive business days past the scheduled delivery window, submit a status inquiry to our customer support desk. We coordinate directly with the air freight line and local courier logistics to resolve the status or process immediate reimbursement.
        </p>
      </section>

      {/* 2. 14-DAY RETURN WINDOW */}
      <section id="14-day-returns">
        <h2>2. 14-Day Return & Replacement Period</h2>
        <p>
          In accordance with <strong>Qatar Consumer Protection Law No. 8 of 2008</strong>, Qatify provides a <strong>14-calendar-day inspection and return period</strong> commencing on the documented date of carrier delivery to your address in Qatar.
        </p>
        <p>
          Within this 14-day window, if a product demonstrates any functional manufacturing defect, hardware irregularity, or material discrepancy from the technical specifications cataloged on our platform, customers are entitled to an authorized exchange or a full refund.
        </p>
      </section>

      {/* 3. ELIGIBILITY */}
      <section id="eligibility">
        <h2>3. Return Eligibility & Product Condition Standards</h2>
        <p>To qualify for return authorization, returned items must satisfy the following verification criteria:</p>
        <ul>
          <li>
            <strong>Manufacturing Defects:</strong> The device exhibits verified electrical, audio, mechanical, or component defects not resulting from misuse, drops, or improper charging.
          </li>
          <li>
            <strong>Fulfillment Discrepancies:</strong> The product received differs in model, specification, color, or variant from the confirmed order invoice.
          </li>
          <li>
            <strong>Transit-Related Damage:</strong> The item arrived with visible external or internal damage sustained during international air transit or local courier delivery.
          </li>
          <li>
            <strong>Packaging & Accessories:</strong> The item must be returned with its original manufacturer packaging, user manuals, internal protective inserts, and all bundled accessories (cables, adapters, brackets).
          </li>
        </ul>
      </section>

      {/* 4. NON-RETURNABLE ITEMS */}
      <section id="non-returnable">
        <h2>4. Non-Returnable Items & Exclusions</h2>
        <p>To maintain health, safety, and operational standards, returns cannot be authorized under the following circumstances:</p>
        <ul>
          <li>Claims submitted beyond the 14-calendar-day return window following carrier delivery.</li>
          <li>Physical, liquid, or electrical damage resulting from drops, liquid ingress (unless the product is certified waterproof and failure occurred under rated usage), electrical surges from non-standard adapters, or unauthorized third-party repairs.</li>
          <li>Hygiene-sensitive components (such as unsealed in-ear silicone ear tips) that have been unpacked and used, unless verified defective upon immediate initial unboxing.</li>
          <li>Items missing original serial numbers, manufacturer bar codes, or security warranty seals.</li>
        </ul>
      </section>

      {/* 5. HOW TO CLAIM */}
      <section id="how-to-claim">
        <h2>5. Return & Exchange Authorization Procedure</h2>
        <p>
          Return requests are processed through a structured 3-step authorization procedure:
        </p>

        <div className={styles.stepGrid}>
          <div className={styles.stepCard}>
            <span className={styles.stepNum}>1</span>
            <h4 className={styles.stepTitle}>Submit Return Request</h4>
            <p className={styles.stepDesc}>
              Contact our support desk via Live Chat, submit an inquiry through our Contact page, or email <strong>support@shopqatify.com</strong>. Include your Order ID (e.g., <code>QA-89421</code>) and an objective description of the defect or discrepancy.
            </p>
          </div>

          <div className={styles.stepCard}>
            <span className={styles.stepNum}>2</span>
            <h4 className={styles.stepTitle}>Technical Review (24h)</h4>
            <p className={styles.stepDesc}>
              For defective or damaged hardware, submit clear photos or a short video demonstrating the functional failure. For logistics transit issues, we audit carrier manifests directly. Reviews are completed within 12 to 24 business hours.
            </p>
          </div>

          <div className={styles.stepCard}>
            <span className={styles.stepNum}>3</span>
            <h4 className={styles.stepTitle}>Courier Collection & Settlement</h4>
            <p className={styles.stepDesc}>
              When physical retrieval is required, our local courier partner collects the item directly from your address in Qatar. Upon warehouse inspection, your full refund is processed or replacement hardware is dispatched.
            </p>
          </div>
        </div>
      </section>

      {/* 6. REFUND TIMELINE & PAYMENT METHODS */}
      <section id="refund-timeline">
        <h2>6. Refund Processing Timelines & Disbursement Methods</h2>
        <p>
          All refunds are issued in <strong>Qatari Riyal (QAR)</strong>. Once return verification is completed, reimbursement is disbursed based on the original payment method:
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.policyTable}>
            <thead>
              <tr>
                <th>Original Payment Method</th>
                <th>Disbursement Channel</th>
                <th>Standard Settlement Timeline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Apple Pay / Google Pay</strong></td>
                <td>Reversed directly to linked card account</td>
                <td><strong>2 to 5 business days</strong> (subject to card issuer)</td>
              </tr>
              <tr>
                <td><strong>Credit or Debit Card (Visa, Mastercard, AMEX)</strong></td>
                <td>Original bank card balance credited</td>
                <td><strong>3 to 7 business days</strong> (QNB, Commercial Bank, QIB, Doha Bank, Dukhan Bank)</td>
              </tr>
              <tr>
                <td><strong>Cash on Delivery (COD) / Direct Transfer</strong></td>
                <td>Local Qatar IBAN Bank Transfer or Store Credit</td>
                <td><strong>Instant</strong> for store credit; <strong>24–48 hours</strong> for local Qatar bank transfer</td>
              </tr>
              <tr>
                <td><strong>Approved Transit Loss Claim</strong></td>
                <td>Full reimbursement to original payment channel</td>
                <td>Initiated within <strong>24 hours</strong> of formal claim verification</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <em>*Note: Qatify assesses zero restocking fees, zero return handling deductions, and zero administrative surcharges on verified warranty returns or carrier losses. Customers receive 100% of the funds paid.</em>
        </p>
      </section>

      {/* 7. DAMAGED OR WRONG ITEM RECEIVED */}
      <section id="damaged-defective">
        <h2>7. Damaged, Defective, or Incorrect Deliveries</h2>
        <p>
          Consignments leaving manufacturer facilities undergo serialized visual and electrical inspections. However, rough transit conditions can occasionally result in packaging damage or cosmetic impact.
        </p>
        <p>
          If your delivery arrives with compromised outer packaging, tampered seals, or mismatched SKU contents:
        </p>
        <ol>
          <li>Photograph the outer courier box, waybill label, and the unpacked product condition.</li>
          <li>Notify our support team within <strong>48 hours of carrier delivery</strong>.</li>
          <li>Our operations team will arrange priority replacement dispatch or authorize an immediate refund upon verification.</li>
        </ol>
      </section>

      {/* 8. ORDER CANCELLATIONS */}
      <section id="order-cancellation">
        <h2>8. Order Cancellation Guidelines</h2>
        <p>
          To maintain 6 to 10 business day delivery schedules across Qatar, orders are staged and prepared for air cargo consolidation within 2 to 4 hours of payment authorization:
        </p>
        <ul>
          <li>
            <strong>Cancellations Prior to Flight Manifest:</strong> If an order cancellation request is received prior to air cargo allocation, the order is cancelled immediately with 100% full refund disbursement.
          </li>
          <li>
            <strong>Cancellations Following Flight Manifest:</strong> Once an international air waybill is registered and cargo is in flight or pending customs clearance, shipments cannot be recalled in transit. Customers may receive the parcel and initiate a standard 14-day return upon arrival.
          </li>
        </ul>
      </section>

      {/* CONTACT BOX */}
      <div className={styles.calloutHighlight}>
        <div className={styles.calloutHeader}>
          <span>Warranty Claims & Return Assistance</span>
        </div>
        <p>
          Our customer service desk handles all warranty claims, return authorizations, and delivery inquiries. Connect with our team via Live Chat, submit a ticket through our <Link href="/contact" style={{ color: '#ffb800', textDecoration: 'underline' }}>Contact portal</Link>, or email <strong>support@shopqatify.com</strong>.
        </p>
      </div>
    </PolicyShell>
  );
}

