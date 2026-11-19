'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useShop } from '@/context/ShopContext';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  RotateCcw,
  Plane,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import styles from './page.module.scss';

const SUBJECT_OPTIONS = [
  'Order Status & Tracking Inquiry',
  'Transit Loss & Non-Delivery Claim (100% Refund)',
  'Warranty Claim or Replacement (14-Day Policy)',
  'Product Specifications & Device Compatibility',
  'Payment & Billing Inquiries (Apple Pay / Card / COD)',
  'Bulk or Corporate Procurement Inquiry',
  'General Inquiry',
];

const FAQS = [
  {
    q: 'How long does delivery take across Qatar?',
    a: 'Orders are delivered directly to your doorstep within 6 to 10 business days via scheduled direct air express into Hamad International Airport (DOH). Free delivery applies automatically to orders QAR 150 and above.',
    link: '/shipping-policy',
    linkText: 'Read Shipping Policy →',
  },
  {
    q: 'What happens if a consignment is lost or delayed in transit?',
    a: 'Under our Transit Protection Policy, Qatify assumes full commercial liability. If an order is confirmed missing by carrier logistics, we issue an immediate 100% full refund or arrange priority replacement dispatch at zero added cost.',
    link: '/refund-policy',
    linkText: 'View Transit Guarantee →',
  },
  {
    q: 'Can I monitor my international air shipment in real time?',
    a: 'Yes. Enter your order reference (e.g., QA-89421) on our dedicated tracking portal to verify live flight departure, Doha customs clearance, and courier dispatch milestones.',
    link: '/track-order',
    linkText: 'Track Your Consignment →',
  },
  {
    q: 'Which payment methods are supported in Qatar?',
    a: 'We process native payments in Qatari Riyal (QAR) via Apple Pay, Google Pay, Visa, Mastercard, and American Express with zero foreign exchange fees, as well as Cash on Delivery across Qatar.',
    link: '/terms',
    linkText: 'Review Commercial Terms →',
  },
];

export const ContactClient: React.FC = () => {
  const { showToast, openChat } = useShop();
  const submitInquiry = useMutation(api.inquiries.submitInquiry);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMsg = message.trim();

    if (!cleanName) {
      showToast('Validation Error', 'Please enter your name.', 'warning');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Validation Error', 'Please enter a valid email address.', 'warning');
      return;
    }
    if (!cleanMsg || cleanMsg.length < 10) {
      showToast('Validation Error', 'Please provide a message with at least 10 characters.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullSubject = orderRef.trim()
        ? `[${orderRef.trim().toUpperCase()}] ${subject}`
        : subject;

      await submitInquiry({
        name: cleanName,
        email: cleanEmail,
        phone: phone.trim() || undefined,
        subject: fullSubject,
        message: cleanMsg,
      });

      setSubmitted(true);
      showToast('Message Delivered! 🎉', 'Our Doha support desk will reach out within a few hours.', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setOrderRef('');
      setMessage('');
    } catch (err: any) {
      showToast('Submission Failed', err?.message || 'Could not send message. Please try WhatsApp.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* 1. HERO HEADER */}
      <header className={styles.hero}>
        <div className="container">
          <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
            <Link href="/">Home</Link>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>Contact Us</span>
          </nav>

          <div className={styles.heroContent}>
            <h1 className={styles.title}>Contact Customer Support</h1>
            <p className={styles.subtitle}>
              Official customer service desk for order inquiries, consignment tracking, warranty assistance, and technical device specifications.
            </p>
          </div>
        </div>
      </header>

      {/* 2. MAIN 2-COLUMN SECTION */}
      <div className="container">
        <div className={styles.contactGrid}>
          {/* LEFT: DIRECT REACH CHANNELS */}
          <div>
            <div className={styles.channelCards}>
              {/* Live Chat Card */}
              <div className={styles.channelCard}>
                <div className={styles.channelIcon}>
                  <MessageCircle size={20} />
                </div>
                <h4 className={styles.channelTitle}>Live Chat Support</h4>
                <div className={styles.channelInfo}>Direct 1-on-1 Help</div>
                <div className={styles.channelSub}>Fastest response right in your browser</div>
                <button
                  type="button"
                  onClick={() => openChat()}
                  className={styles.channelBtn}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <span>Launch Live Chat</span>
                  <ExternalLink size={13} />
                </button>
              </div>

              {/* Email Card */}
              <div className={styles.channelCard}>
                <div className={styles.channelIcon}>
                  <Mail size={20} />
                </div>
                <h4 className={styles.channelTitle}>Official Email</h4>
                <div className={styles.channelInfo}>support@shopqatify.com</div>
                <div className={styles.channelSub}>Replied within 6 to 12 business hours</div>
                <a href="mailto:support@shopqatify.com" className={styles.channelBtn}>
                  <span>Send Email</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Order Tracking Card */}
              <div className={styles.channelCard}>
                <div className={styles.channelIcon}>
                  <Search size={20} />
                </div>
                <h4 className={styles.channelTitle}>Live Cargo Tracking</h4>
                <div className={styles.channelInfo}>Real-Time Flight Waybills</div>
                <div className={styles.channelSub}>Track checkpoints to your Qatar doorstep</div>
                <Link href="/track-order" className={styles.channelBtn}>
                  <span>Open Tracker</span>
                  <ExternalLink size={13} />
                </Link>
              </div>

              {/* Response Guarantee Card */}
              <div className={styles.channelCard}>
                <div className={styles.channelIcon}>
                  <Clock size={20} />
                </div>
                <h4 className={styles.channelTitle}>Response Guarantee</h4>
                <div className={styles.channelInfo}>Within 12 Hours</div>
                <div className={styles.channelSub}>All order inquiries logged and tracked</div>
                <span className={styles.channelSub} style={{ color: '#16a34a', fontWeight: 600 }}>
                  Active 7 Days a Week
                </span>
              </div>
            </div>

            {/* Online Store Model Details */}
            <div className={styles.hubCard}>
              <div className={styles.hubHeader}>
                <h3 className={styles.hubTitle}>Customer Service & Logistics Operations</h3>
              </div>
              <div className={styles.hubDetails}>
                <div className={styles.hubRow}>
                  <span>
                    <strong>Direct Sourcing:</strong> Operating as a dedicated digital commerce platform providing authentic electronic hardware fulfilled directly from certified international manufacturing hubs.
                  </span>
                </div>
                <div className={styles.hubRow}>
                  <span>
                    <strong>Support Hours:</strong> Active customer service available daily from 8:00 AM – 11:00 PM (GMT+3 Doha Time) for order tracking, technical inquiries, and warranty administration.
                  </span>
                </div>
                <div className={styles.hubRow}>
                  <span>
                    <strong>Service Coverage:</strong> Tracked doorstep delivery across Doha, Lusail, Al Rayyan, Al Wakrah, and all Qatar municipalities within 6–10 business days.
                  </span>
                </div>
              </div>
            </div>

            {/* Live Chat Banner */}
            <div className={styles.chatBanner}>
              <div className={styles.chatBannerText}>
                <h4>Need immediate assistance?</h4>
                <p>Connect directly with an online support specialist via real-time Live Chat.</p>
              </div>
              <button
                type="button"
                onClick={() => openChat()}
                className={styles.chatBannerBtn}
              >
                <MessageCircle size={15} />
                <span>Launch Live Chat</span>
              </button>
            </div>
          </div>

          {/* RIGHT: INQUIRY FORM */}
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3>Send Us a Message</h3>
              <p>Fill out the details below. Our team reviews every inquiry and responds promptly.</p>
            </div>

            {submitted ? (
              <div className={styles.successAlert}>
                <div className={styles.successIcon}>
                  <CheckCircle2 size={28} />
                </div>
                <h4>Message Received Successfully!</h4>
                <p>
                  Thank you for reaching out to Qatify Qatar. We have logged your inquiry and our support desk will respond to your email or WhatsApp shortly.
                </p>
                <button type="button" onClick={() => setSubmitted(false)}>
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="name">
                      Full Name <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="email">
                      Email Address <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="phone">
                      Contact Phone / WhatsApp (Optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Phone or WhatsApp number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="orderRef">
                      Order Reference
                    </label>
                    <input
                      id="orderRef"
                      type="text"
                      placeholder="Order reference number"
                      value={orderRef}
                      onChange={(e) => setOrderRef(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="subject">
                    Subject / Department <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    {SUBJECT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="message">
                    Your Message <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    placeholder="Write your message or inquiry here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Submitting to Desk...' : 'Send Inquiry to Qatify'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 3. FREQUENTLY ASKED QUESTIONS */}
        <div className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <h3>Frequently Asked Questions</h3>
            <p>Quick answers to common questions about shopping, shipping, and guarantees with Qatify Qatar.</p>
          </div>

          <div className={styles.faqGrid}>
            {FAQS.map((faq, idx) => (
              <div key={idx} className={styles.faqCard}>
                <div className={styles.faqQuestion}>
                  <HelpCircle size={18} color="#18181b" />
                  <span>{faq.q}</span>
                </div>
                <p className={styles.faqAnswer}>{faq.a}</p>
                <Link
                  href={faq.link}
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#ffb800',
                    marginTop: 'auto',
                    paddingTop: '6px',
                  }}
                >
                  {faq.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

