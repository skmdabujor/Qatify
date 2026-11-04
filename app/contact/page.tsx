import React from 'react';
import type { Metadata } from 'next';
import { ContactClient } from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us — Online Customer Support | Qatify Qatar',
  description:
    'Need help with your order or international shipment tracking in Qatar? Contact Qatify online customer support via 24/7 live chat or email support@shopqatify.com. We are here to help.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Qatify Qatar',
    description:
      'Direct online customer support, live chat assistance, and order inquiries for Qatify Qatar. Fast responses 7 days a week.',
    url: 'https://shopqatify.com/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}

