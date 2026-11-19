import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyShell, TocItem } from '@/components/policy/PolicyShell';
import styles from '@/components/policy/PolicyShell.module.scss';
import { Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy — 6-10 Days Direct Air Express | Qatify Qatar',
  description:
    'Official shipping policy for Qatify Qatar. 6–10 business day tracked direct air express delivery across Doha, Lusail, and all Qatar municipalities. Free shipping over QAR 150.',
  alternates: {
    canonical: '/shipping-policy',
  },
  openGraph: {
    title: 'Shipping & Delivery Policy | Qatify Qatar',
    description:
      'Direct Global Air Express shipping across Doha, Lusail, Al Rayyan, and all of Qatar within 6–10 business days with full milestone tracking.',
    url: 'https://shopqatify.com/shipping-policy',
  },
};

const TOC: TocItem[] = [
  { id: 'air-model', label: '1. International Fulfillment & Logistics Framework' },
  { id: 'timeline-breakdown', label: '2. Transit Milestones: 6–10 Business Day Schedule' },
  { id: 'coverage-zones', label: '3. Delivery Coverage Across Qatar Municipalities' },
  { id: 'rates-thresholds', label: '4. Shipping Tariffs & Free Delivery Thresholds' },
  { id: 'realtime-tracking', label: '5. Consignment Tracking & Status Updates' },
  { id: 'customs-handling', label: '6. Customs Clearance & Import Regulation Compliance' },
  { id: 'lost-transit-pledge', label: '7. Carrier Liability & Transit Protection Guarantee' },
];

export default function ShippingPolicyPage() {
  return (
    <PolicyShell
      title="Shipping & Delivery Policy"
      subtitle="Official logistics framework, express air transit timelines, and delivery terms across the State of Qatar."
      lastUpdated="November 2026"
      readTime="5 min read"
      activeSlug="shipping-policy"
      tableOfContents={TOC}
    >
      {/* 1. INTERNATIONAL FULFILLMENT FRAMEWORK */}
      <section id="air-model">
        <h2>1. International Fulfillment & Logistics Framework</h2>
        <p>
          Qatify operates a dedicated cross-border fulfillment network providing consumers in Qatar with factory-direct access to verified global electronics manufacturers. By fulfilling orders directly from certified production and distribution hubs, Qatify minimizes warehousing delays and removes intermediate distribution costs associated with traditional multi-tiered retail channels.
        </p>
        <p>
          Every item ordered on the platform is subject to standardized pre-dispatch inspection, secured in protective shock-absorbing packaging, and dispatched on scheduled international air freight flights into <strong>Hamad International Airport (DOH)</strong> in Doha, Qatar.
        </p>
        <div className={styles.calloutHighlight}>
          <div className={styles.calloutHeader}>
            <span>Direct Manufacturer Dispatch</span>
          </div>
          <p>
            Direct air routing ensures that all consumer electronic devices, charging equipment, and accessories arrive factory-sealed, untouched by secondary retail handling, and fully covered under manufacturer specifications—delivered to your doorstep within <strong>6 to 10 business days</strong>.
          </p>
        </div>
      </section>

      {/* 2. 6-10 DAYS TIMELINE BREAKDOWN */}
      <section id="timeline-breakdown">
        <h2>2. Transit Milestones: 6–10 Business Day Schedule</h2>
        <p>
          Orders fulfilled for delivery within Qatar follow a structured 5-stage logistics schedule designed to ensure consistent transit within 6 to 10 business days under standard operating conditions:
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.policyTable}>
            <thead>
              <tr>
                <th>Logistics Stage</th>
                <th>Standard Window</th>
                <th>Operational Procedures</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Stage 1: Verification & Dispatch Preparation</strong></td>
                <td>Day 1 – Day 2</td>
                <td>
                  Order verification, anti-fraud screening, inventory allocation from manufacturing hubs, functional inspection, and serialized packing into sealed air containers.
                </td>
              </tr>
              <tr>
                <td><strong>Stage 2: Express Air Cargo Flight</strong></td>
                <td>Day 2 – Day 5</td>
                <td>
                  Consignment allocation to scheduled international commercial or cargo flights bound for Doha; generation of international air waybill (AWB) tracking data.
                </td>
              </tr>
              <tr>
                <td><strong>Stage 3: Qatar Customs Clearance (DOH)</strong></td>
                <td>Day 5 – Day 7</td>
                <td>
                  Inbound flight arrival at Hamad International Airport (DOH); electronic manifest submission, regulatory clearance, and inspection under Qatar General Authority of Customs protocols.
                </td>
              </tr>
              <tr>
                <td><strong>Stage 4: Regional Sorting & Courier Handover</strong></td>
                <td>Day 7 – Day 8</td>
                <td>
                  Consignment transfer to verified local Qatar courier partners; sorting by municipal zone, street number, and dispatch route.
                </td>
              </tr>
              <tr>
                <td><strong>Stage 5: Final Doorstep Delivery</strong></td>
                <td>Day 8 – Day 10</td>
                <td>
                  Last-mile courier coordination and final delivery directly to the customer’s residential, commercial, or compound address in Qatar.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <em>*Note: Business days are defined as Sunday through Thursday, excluding official statutory public holidays in the State of Qatar (e.g., Eid holidays, Qatar National Day) and unforeseen civil aviation disruptions.</em>
        </p>
      </section>

      {/* 3. COVERAGE ACROSS QATAR */}
      <section id="coverage-zones">
        <h2>3. Delivery Coverage Across Qatar Municipalities</h2>
        <p>
          Qatify maintains comprehensive delivery coverage across all eight administrative municipalities of the State of Qatar, servicing residential properties, corporate offices, and private compounds:
        </p>
        <ul>
          <li><strong>Doha Municipality:</strong> West Bay, The Pearl Island, Al Sadd, Bin Mahmoud, Al Mansoura, Rawdat Al Khail, Madinat Khalifa, Old Airport, Najma, and surrounding districts.</li>
          <li><strong>Al Daayen & Lusail City:</strong> Lusail Marina, Fox Hills, Waterfront District, Energy City, Qatar University corridor, and Al Kheesa.</li>
          <li><strong>Al Rayyan Municipality:</strong> Education City, Al Waab, Mueither, Abu Hamour, Ain Khaled, Al Gharrafa, and Al Sailiya.</li>
          <li><strong>Al Wakrah & Al Wukair:</strong> Al Wakrah Central, Barwa City, Ezdan Residential Communities, and Mesaieed industrial/residential sectors.</li>
          <li><strong>Northern & Western Municipalities:</strong> Al Khor, Umm Salal, Al Shamal, Al Shahaniya, and Dukhan.</li>
        </ul>
      </section>

      {/* 4. RATES & FREE SHIPPING */}
      <section id="rates-thresholds">
        <h2>4. Shipping Tariffs & Free Delivery Thresholds</h2>
        <p>
          Delivery tariffs are clearly calculated and displayed during checkout prior to final payment authorization. Rates are structured as follows:
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.policyTable}>
            <thead>
              <tr>
                <th>Order Subtotal (QAR)</th>
                <th>Delivery Tariff</th>
                <th>Estimated Transit Window</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Orders QAR 150.00 and above</strong></td>
                <td><strong style={{ color: '#16a34a' }}>FREE (0.00 QAR)</strong></td>
                <td>6 to 10 Business Days</td>
              </tr>
              <tr>
                <td><strong>Orders below QAR 150.00</strong></td>
                <td><strong>QAR 15.00 Flat Rate</strong></td>
                <td>6 to 10 Business Days</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          No hidden fuel surcharges, residential delivery surcharges, or airport handling fees are charged at checkout or upon delivery.
        </p>
      </section>

      {/* 5. REALTIME TRACKING */}
      <section id="realtime-tracking">
        <h2>5. Consignment Tracking & Status Updates</h2>
        <p>
          Upon flight manifest registration (typically within 24 to 48 hours of order confirmation), a unique consignment tracking reference is issued and dispatched via automated email notification.
        </p>
        <p>
          Customers can query live status updates at any time through our online tracking system:
        </p>
        <div style={{ margin: '16px 0' }}>
          <Link
            href="/track-order"
            className={styles.guaranteeBtn}
            style={{ width: 'auto', display: 'inline-flex', padding: '10px 20px' }}
          >
            <span>Track Your Order Now</span>
            <Search size={15} />
          </Link>
        </div>
        <p>
          The tracking system displays verified cargo milestones including flight departure, touchdown at Hamad International Airport, customs clearance completion, sorting center dispatch, and out-for-delivery confirmation.
        </p>
      </section>

      {/* 6. CUSTOMS & IMPORT CLEARANCE */}
      <section id="customs-handling">
        <h2>6. Customs Clearance & Import Regulation Compliance</h2>
        <p>
          All consumer items cataloged on Qatify comply with statutory import standards established by the Qatar General Authority of Customs and the Communications Regulatory Authority (CRA) governing consumer electronics, telecommunications peripherals, and mobile accessories.
        </p>
        <p>
          <strong>Pre-cleared import documentation:</strong> All customs duties, electronic clearance manifests, and administrative import processing are fully managed by Qatify and our licensed freight partners. Customers are guaranteed zero unexpected import tariffs or customs fees at the point of delivery.
        </p>
      </section>

      {/* 7. LOST COURIER PARCEL GUARANTEE */}
      <section id="lost-transit-pledge">
        <h2>7. Carrier Liability & Transit Protection Guarantee</h2>
        <div className={styles.calloutGuarantee}>
          <div className={styles.calloutHeader}>
            <span>Transit Protection & Non-Delivery Guarantee</span>
          </div>
          <p>
            Qatify maintains commercial liability for shipments throughout transit. If a consignment is confirmed lost, damaged during international air cargo transit, or untraceable by carrier logistics past the guaranteed delivery window:
          </p>
          <p>
            <strong>Qatify will issue a 100% full refund to the original payment method or dispatch a priority replacement consignment immediately at zero additional expense, based on the customer’s selection.</strong>
          </p>
          <p>
            Customers do not bear financial loss for logistics mishaps, carrier misrouting, or freight transit damage.
          </p>
        </div>
      </section>

      {/* NEED ASSISTANCE */}
      <div className={styles.calloutHighlight}>
        <div className={styles.calloutHeader}>
          <span>Logistics Inquiries & Delivery Assistance</span>
        </div>
        <p>
          For inquiries concerning delivery address amendments prior to flight dispatch, consignment status clarifications, or delivery coordination, contact our support desk via Live Chat or email <strong>support@shopqatify.com</strong>.
        </p>
      </div>
    </PolicyShell>
  );
}

