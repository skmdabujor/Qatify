import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyShell, TocItem } from '@/components/policy/PolicyShell';
import styles from '@/components/policy/PolicyShell.module.scss';
import {
  Plane,
  Truck,
  Clock,
  MapPin,
  ShieldCheck,
  Search,
  PackageCheck,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy — 6-10 Days Direct Air Express | Qatify Qatar',
  description:
    'Learn how Qatify delivers authentic electronics and trending gadgets directly to your doorstep in Qatar within 6–10 business days via express air freight. Free shipping over QAR 150.',
  alternates: {
    canonical: '/shipping-policy',
  },
  openGraph: {
    title: 'Shipping & Delivery Policy | Qatify Qatar',
    description:
      'Direct Global Air Express shipping to Doha, Lusail, Al Rayyan, and all of Qatar within 6–10 days. Tracked at every step.',
    url: 'https://shopqatify.com/shipping-policy',
  },
};

const TOC: TocItem[] = [
  { id: 'air-model', label: '1. How Direct Global Air Express Works' },
  { id: 'timeline-breakdown', label: '2. 6–10 Days Step-by-Step Timeline' },
  { id: 'coverage-zones', label: '3. Coverage Across Qatar Municipalities' },
  { id: 'rates-thresholds', label: '4. Shipping Rates & Free Delivery' },
  { id: 'realtime-tracking', label: '5. Live Tracking Your Air Shipment' },
  { id: 'customs-handling', label: '6. Customs & Import Clearance (DOH)' },
  { id: 'lost-transit-pledge', label: '7. Lost Courier Parcel Guarantee (Insha’Allah)' },
];

export default function ShippingPolicyPage() {
  return (
    <PolicyShell
      title="Shipping & Delivery Policy"
      badge="Direct Air Express Logistics"
      subtitle="Transparent, reliable, and trackable 6–10 business day delivery straight to your doorstep across Qatar."
      lastUpdated="November 2026"
      readTime="6 min read"
      activeSlug="shipping-policy"
      tableOfContents={TOC}
    >
      {/* 1. DIRECT GLOBAL AIR EXPRESS MODEL */}
      <section id="air-model">
        <h2>
          <Plane size={22} color="#ffb800" />
          1. How Direct Global Air Express Works
        </h2>
        <p>
          At Qatify, we operate on a modern cross-border air logistics model designed specifically for Qatar. Unlike traditional retail stores in Doha that mark up electronics by 40% to 70% to cover expensive mall rent and domestic warehousing overhead, <strong>Qatify connects you directly with top-tier verified global manufacturers</strong> (specializing in Anker, Baseus, Green Lion, Porodo, Soundcore, and trending viral gadgets).
        </p>
        <p>
          Instead of holding aging stock on local shelves, every item ordered on Qatify is freshly dispatched from certified production hubs, thoroughly inspected for quality, packed in protective air cushions, and flown directly into <strong>Hamad International Airport (DOH)</strong> via express international air freight.
        </p>
        <div className={styles.calloutHighlight}>
          <div className={styles.calloutHeader}>
            <Sparkles size={18} />
            <span>Why 6–10 Days Is the Sweet Spot</span>
          </div>
          <p>
            By consolidating shipments and using dedicated air cargo lanes, you get factory-fresh tech, untouched seals, and unbeatable prices in Qatari Riyal — delivered straight to your door in <strong>6 to 10 business days</strong>. No middleman markup, no outdated inventory.
          </p>
        </div>
      </section>

      {/* 2. 6-10 DAYS TIMELINE BREAKDOWN */}
      <section id="timeline-breakdown">
        <h2>
          <Clock size={22} color="#ffb800" />
          2. The 6–10 Business Days Timeline: Day by Day
        </h2>
        <p>
          We believe in total transparency. Here is the realistic journey your parcel takes from the moment you click checkout until it reaches your hands in Qatar:
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.policyTable}>
            <thead>
              <tr>
                <th>Logistics Stage</th>
                <th>Typical Window</th>
                <th>What Happens Behind the Scenes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Stage 1: Verification & Dispatch</strong></td>
                <td>Day 1 – Day 2</td>
                <td>
                  Order confirmed, anti-fraud check cleared, item collected from manufacturer, and subjected to a 100% manual quality test before being sealed for flight.
                </td>
              </tr>
              <tr>
                <td><strong>Stage 2: Express Air Cargo Flight</strong></td>
                <td>Day 2 – Day 5</td>
                <td>
                  Consolidated into air freight containers, loaded onto international commercial/cargo flights heading to the Middle East, with live airline tracking waybills.
                </td>
              </tr>
              <tr>
                <td><strong>Stage 3: Qatar Customs Clearance (DOH)</strong></td>
                <td>Day 5 – Day 7</td>
                <td>
                  Flight touches down at Hamad International Airport (DOH). Electronic customs manifest processing and clearance handled by Qatar General Authority of Customs.
                </td>
              </tr>
              <tr>
                <td><strong>Stage 4: Local Courier Sorting</strong></td>
                <td>Day 7 – Day 8</td>
                <td>
                  Package is handed over to our verified local Qatar courier logistics partner and sorted into regional dispatch vans based on your Zone and Street.
                </td>
              </tr>
              <tr>
                <td><strong>Stage 5: Doorstep Delivery</strong></td>
                <td>Day 8 – Day 10</td>
                <td>
                  The local delivery courier coordinates arrival and delivers the package directly to your doorstep, apartment, or villa.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <em>*Note: Business days exclude official public holidays in Qatar (e.g., Eid holidays, Qatar National Day) and severe international flight disruptions.</em>
        </p>
      </section>

      {/* 3. COVERAGE ACROSS QATAR */}
      <section id="coverage-zones">
        <h2>
          <MapPin size={22} color="#ffb800" />
          3. Complete Coverage Across All Qatar Municipalities
        </h2>
        <p>
          Qatify delivers to every residential, commercial, and compound address across the State of Qatar. Whether you reside in high-rise towers or suburban communities, our couriers reach you:
        </p>
        <ul>
          <li><strong>Doha Municipality:</strong> West Bay, The Pearl-Qatar, Al Sadd, Al Mansoura, Rawdat Al Khail, Bin Mahmoud, Old Airport, Najma, Madinat Khalifa.</li>
          <li><strong>Al Daayen & Lusail:</strong> Lusail Marina, Fox Hills, Waterfront, Energy City, Qatar University area.</li>
          <li><strong>Al Rayyan:</strong> Education City, Mueither, Al Waab, Abu Hamour, Ain Khaled, Gharrafa, Al Sailiya.</li>
          <li><strong>Al Wakrah & Al Wukair:</strong> Al Wakrah city, Ezdan compounds, Barwa City, Mesaieed industrial/residential zones.</li>
          <li><strong>Northern & Western Municipalities:</strong> Al Khor, Umm Salal, Al Shamal, Al Shahaniya, Dukhan.</li>
        </ul>
      </section>

      {/* 4. RATES & FREE SHIPPING */}
      <section id="rates-thresholds">
        <h2>
          <Truck size={22} color="#ffb800" />
          4. Shipping Rates & Free Delivery Threshold
        </h2>
        <p>We keep our delivery pricing clear and straightforward with no hidden handling or airport fees:</p>

        <div className={styles.tableWrapper}>
          <table className={styles.policyTable}>
            <thead>
              <tr>
                <th>Order Subtotal (QAR)</th>
                <th>Express Air Delivery Rate</th>
                <th>Estimated Doorstep Delivery</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Orders QAR 150 and above</strong></td>
                <td><strong style={{ color: '#16a34a' }}>FREE (0 QAR)</strong></td>
                <td>6 to 10 Business Days</td>
              </tr>
              <tr>
                <td><strong>Orders below QAR 150</strong></td>
                <td><strong>QAR 15 flat rate</strong></td>
                <td>6 to 10 Business Days</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The delivery fee is automatically calculated and shown transparently in your shopping cart and checkout drawer before you finalize payment.
        </p>
      </section>

      {/* 5. REALTIME TRACKING */}
      <section id="realtime-tracking">
        <h2>
          <Search size={22} color="#ffb800" />
          5. Live Tracking Your Air Shipment
        </h2>
        <p>
          You are never in the dark about your shipment. Within 24 to 48 hours of completing your order, we generate your personalized tracking reference (e.g., <code>QA-89421</code>) and send you the tracking link via email.
        </p>
        <p>
          You can visit our dedicated tracking page at any time:
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
          Our live tracking system reveals genuine cargo milestones: flight departure, arrival at Hamad International Airport, customs clearance completion, van dispatch, and out-for-delivery status.
        </p>
      </section>

      {/* 6. CUSTOMS & IMPORT CLEARANCE */}
      <section id="customs-handling">
        <h2>
          <ShieldCheck size={22} color="#ffb800" />
          6. Customs & Import Clearance (Hamad International Airport)
        </h2>
        <p>
          All consumer items sold on Qatify comply with import rules set by the Qatar General Authority of Customs and the Communications Regulatory Authority (CRA) for consumer electronics and mobile accessories.
        </p>
        <p>
          <strong>No surprise customs charges:</strong> All customs clearance duties, handling fees, and import documentation are fully handled by Qatify and our freight partners. You will never be asked by the driver to pay extra unexpected import duties at the door.
        </p>
      </section>

      {/* 7. LOST COURIER PARCEL GUARANTEE */}
      <section id="lost-transit-pledge">
        <h2>
          <ShieldCheck size={22} color="#ffb800" />
          7. Missing or Lost in Courier Transit Guarantee (Insha’Allah)
        </h2>
        <div className={styles.calloutGuarantee}>
          <div className={styles.calloutHeader}>
            <ShieldCheck size={20} />
            <span>Our Zero-Risk Guarantee for Every Qatify Shopper</span>
          </div>
          <p>
            We know the anxiety of ordering something online and wondering, <em>&quot;What if the courier loses my package?&quot;</em>
          </p>
          <p>
            Here is our unequivocal promise: <strong>If your shipment is lost, damaged in cargo transit, or goes missing through the courier, Qatify will refund 100% of your money or reship a brand-new item immediately at zero additional expense. We are deeply committed to this, Insha&apos;Allah.</strong>
          </p>
          <p>
            Your money is safe, your order is protected, and our online customer support team is always available to assist you.
          </p>
        </div>
      </section>

      {/* NEED ASSISTANCE */}
      <div className={styles.calloutHighlight}>
        <div className={styles.calloutHeader}>
          <HelpCircle size={18} />
          <span>Have a Delivery Question or Need Special Timing?</span>
        </div>
        <p>
          Need to change your delivery address before flight dispatch, or have an inquiry regarding your shipment? Reach out to our online support desk via Live Chat or email <strong>support@shopqatify.com</strong>.
        </p>
      </div>
    </PolicyShell>
  );
}

