'use client';

// =============================================================================
// Qatify — Order Confirmation Email Preview Page
// Interactive React & SCSS Email Previewer with live data & test email dispatch
// =============================================================================

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import OrderConfirmationEmailPreview, {
  SAMPLE_EMAIL_ORDER,
  EmailOrderData,
} from '@/components/email/OrderConfirmationEmailPreview';

export default function EmailPreviewPage() {
  const orderFromDb = useQuery(api.orders.getByOrderNumber, {
    orderNumber: 'QA-896533',
  });

  const orderData: EmailOrderData = orderFromDb
    ? {
        orderNumber: orderFromDb.orderNumber,
        trackingNumber: orderFromDb.trackingNumber,
        date: orderFromDb.date,
        estimatedDeliveryWindow: orderFromDb.estimatedDeliveryWindow,
        subtotalQAR: orderFromDb.subtotalQAR,
        shippingQAR: orderFromDb.shippingQAR,
        discountQAR: orderFromDb.discountQAR,
        totalQAR: orderFromDb.totalQAR,
        couponCode: orderFromDb.couponCode,
        paymentMethod: orderFromDb.paymentMethod,
        paymentStatus: orderFromDb.paymentStatus,
        customerEmail: orderFromDb.customerEmail || orderFromDb.address?.email,
        customerPhone: orderFromDb.customerPhone || orderFromDb.address?.phone,
        items: orderFromDb.items.map((it: any) => ({
          productId: it.productId,
          title: it.title,
          slug: it.slug,
          priceQAR: it.priceQAR,
          quantity: it.quantity,
          image: it.image,
          selectedColor: it.selectedColor,
          selectedOption: it.selectedOption,
        })),
        address: {
          fullName: orderFromDb.address.fullName,
          firstName: orderFromDb.address.firstName,
          lastName: orderFromDb.address.lastName,
          phone: orderFromDb.address.phone,
          email: orderFromDb.address.email,
          streetAddress: orderFromDb.address.streetAddress,
          streetNumber: orderFromDb.address.streetNumber,
          apartmentSuite: orderFromDb.address.apartmentSuite,
          buildingNumber: orderFromDb.address.buildingNumber,
          unitNumber: orderFromDb.address.unitNumber,
          municipality: orderFromDb.address.municipality,
          zoneNumber: orderFromDb.address.zoneNumber,
          postalCode: orderFromDb.address.postalCode,
          country: orderFromDb.address.country,
        },
      }
    : SAMPLE_EMAIL_ORDER;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <OrderConfirmationEmailPreview
        order={orderData}
        siteUrl="https://shopqatify.com"
        showToolbar={true}
      />
    </main>
  );
}
