// =============================================================================
// Qatify — Authentic Qatar Retail Consumer Orders (Amazon / AliExpress Style)
// Matches high-trust storefront design specs
// =============================================================================

export interface RetailOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  carrier: string;
  trackingNumber: string;
  estimatedDeliveryWindow: string;
  shippingMethod: string;
  totalQAR: number;
  subtotalQAR: number;
  shippingQAR: number;
  discountQAR?: number;
  address: {
    fullName: string;
    municipality: string;
    zoneNumber: string;
    streetAddress: string;
    buildingNumber: string;
    phone: string;
    country?: string;
  };
  items: Array<{
    productId: string;
    title: string;
    slug: string;
    quantity: number;
    priceQAR: number;
    selectedColor?: string;
    selectedOption?: string;
    image: string;
  }>;
  liveCheckpoints?: Array<{
    time: string;
    status: string;
    location: string;
    description: string;
  }>;
}

export const DEFAULT_RETAIL_ORDERS: RetailOrder[] = [
  {
    id: 'ord-896533',
    orderNumber: 'QA-896533',
    date: 'Nov 14, 2026',
    status: 'Order Confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'apple_pay',
    carrier: 'Direct Air Express',
    trackingNumber: 'QA-EXP-6190925',
    estimatedDeliveryWindow: 'Arriving Tomorrow, Nov 20',
    shippingMethod: 'Direct Air Express (5–9 Business Days)',
    totalQAR: 55,
    subtotalQAR: 35,
    shippingQAR: 20,
    discountQAR: 0,
    address: {
      fullName: 'Qatar Guest',
      municipality: 'Doha, Qatar',
      zoneNumber: 'Zone 24',
      streetAddress: 'Al Corniche Street',
      buildingNumber: 'Building 12',
      phone: '+974 4437 4646',
      country: 'Qatar',
    },
    items: [
      {
        productId: 'qat-017',
        title: 'Porodo Multi-Functional 7-in-1 Electronic & Earbud Cleaning Kit',
        slug: 'porodo-7-in-1-electronic-earbud-cleaning-kit',
        quantity: 1,
        priceQAR: 35,
        selectedColor: 'Black',
        selectedOption: 'Standard',
        image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
      },
    ],
    liveCheckpoints: [
      {
        time: 'Nov 14, 2026 at 04:15 PM',
        status: 'Order Confirmed & Packed',
        location: 'Fulfillment Center',
        description: "We've received your order and are preparing it for shipment.",
      },
      {
        time: 'Nov 14, 2026 at 03:42 PM',
        status: 'Order Placed',
        location: 'Online',
        description: 'Order received and payment confirmed online.',
      },
    ],
  },
  {
    id: 'ord-855408',
    orderNumber: 'QA-855408',
    date: 'Nov 14, 2026',
    status: 'Order Confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    carrier: 'Direct Air Express',
    trackingNumber: 'QA-EXP-8554086',
    estimatedDeliveryWindow: 'Arriving Nov 20 – Nov 24, 2026',
    shippingMethod: 'Direct Air Express (5–9 Business Days)',
    totalQAR: 149,
    subtotalQAR: 129,
    shippingQAR: 20,
    discountQAR: 0,
    address: {
      fullName: 'Qatar Guest',
      municipality: 'Doha, Qatar',
      zoneNumber: 'Zone 24',
      streetAddress: 'Al Corniche Street',
      buildingNumber: 'Building 12',
      phone: '+974 4437 4646',
      country: 'Qatar',
    },
    items: [
      {
        productId: 'qat-002',
        title: 'Anker Prime 100W GaN 3-Port Fast Wall Charger with PowerIQ 4.0 (UK 3-Pin)',
        slug: 'hypercharge-100w-gan-prime-4-port-desktop-travel-charger',
        quantity: 1,
        priceQAR: 129,
        selectedColor: 'Space Gray',
        selectedOption: 'UK 3-Pin',
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      },
    ],
    liveCheckpoints: [
      {
        time: 'Nov 14, 2026 at 02:10 PM',
        status: 'Order Confirmed & Packed',
        location: 'Fulfillment Center',
        description: 'Payment authorized. Routed for direct air dispatch.',
      },
      {
        time: 'Nov 14, 2026 at 01:25 PM',
        status: 'Order Placed',
        location: 'Online',
        description: 'Order received and payment verified.',
      },
    ],
  },
  {
    id: 'ord-609298',
    orderNumber: 'QA-609298',
    date: 'Oct 28, 2026',
    status: 'Order Confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'apple_pay',
    carrier: 'Direct Air Express',
    trackingNumber: 'QA-EXP-6092982',
    estimatedDeliveryWindow: 'Arriving Nov 21 – Nov 25, 2026',
    shippingMethod: 'Direct Air Express (5–9 Business Days)',
    totalQAR: 298,
    subtotalQAR: 298,
    shippingQAR: 0,
    discountQAR: 0,
    address: {
      fullName: 'Qatar Guest',
      municipality: 'Doha, Qatar',
      zoneNumber: 'Zone 24',
      streetAddress: 'Al Corniche Street',
      buildingNumber: 'Building 12',
      phone: '+974 4437 4646',
      country: 'Qatar',
    },
    items: [
      {
        productId: 'qat-001',
        title: 'Soundcore by Anker Liberty 4 NC Wireless Noise Cancelling Earbuds (48dB Hybrid ANC)',
        slug: 'pulse-pro-active-noise-cancelling-wireless-earbuds',
        quantity: 2,
        priceQAR: 149,
        selectedColor: 'Obsidian Black',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      },
    ],
    liveCheckpoints: [
      {
        time: 'Oct 28, 2026 at 11:20 AM',
        status: 'Order Confirmed',
        location: 'Origin Hub',
        description: 'Order placed & scheduled for export freight.',
      },
    ],
  },
  {
    id: 'ord-844448',
    orderNumber: 'QA-844448',
    date: 'Oct 26, 2026',
    status: 'Order Confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    carrier: 'Direct Air Express',
    trackingNumber: 'QA-EXP-8444487',
    estimatedDeliveryWindow: 'Arriving Nov 21 – Nov 25, 2026',
    shippingMethod: 'Direct Air Express (5–9 Business Days)',
    totalQAR: 169,
    subtotalQAR: 149,
    shippingQAR: 20,
    discountQAR: 0,
    address: {
      fullName: 'Qatar Guest',
      municipality: 'Doha, Qatar',
      zoneNumber: 'Zone 24',
      streetAddress: 'Al Corniche Street',
      buildingNumber: 'Building 12',
      phone: '+974 4437 4646',
      country: 'Qatar',
    },
    items: [
      {
        productId: 'qat-001',
        title: 'Soundcore by Anker Liberty 4 NC Wireless Noise Cancelling Earbuds (48dB Hybrid ANC)',
        slug: 'pulse-pro-active-noise-cancelling-wireless-earbuds',
        quantity: 1,
        priceQAR: 149,
        selectedColor: 'Pearl White',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      },
    ],
    liveCheckpoints: [
      {
        time: 'Oct 26, 2026 at 09:40 AM',
        status: 'Order Confirmed',
        location: 'Origin Hub',
        description: 'Order placed and quality checked.',
      },
    ],
  },
  {
    id: 'ord-476145',
    orderNumber: 'QA-476145',
    date: 'Oct 25, 2026',
    status: 'Order Confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'apple_pay',
    carrier: 'Direct Air Express',
    trackingNumber: 'QA-EXP-4761451',
    estimatedDeliveryWindow: 'Arriving Nov 21 – Nov 25, 2026',
    shippingMethod: 'Direct Air Express (5–9 Business Days)',
    totalQAR: 298,
    subtotalQAR: 298,
    shippingQAR: 0,
    discountQAR: 0,
    address: {
      fullName: 'Qatar Guest',
      municipality: 'Doha, Qatar',
      zoneNumber: 'Zone 24',
      streetAddress: 'Al Corniche Street',
      buildingNumber: 'Building 12',
      phone: '+974 4437 4646',
      country: 'Qatar',
    },
    items: [
      {
        productId: 'qat-001',
        title: 'PulsePro ANC 48dB Hybrid Spatial Wireless Earbuds',
        slug: 'pulse-pro-active-noise-cancelling-wireless-earbuds',
        quantity: 2,
        priceQAR: 149,
        selectedColor: 'Obsidian Black',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      },
    ],
    liveCheckpoints: [
      {
        time: 'Oct 25, 2026 at 06:15 PM',
        status: 'Order Confirmed',
        location: 'Origin Hub',
        description: 'Order registered for international dispatch.',
      },
    ],
  },
];
