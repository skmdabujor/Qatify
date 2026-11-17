// =============================================================================
// Qatify — Cross-Border Operations & Logistics Data (Qatar Direct Air Express)
// Inspired by Amazon Seller Central, Daraz Seller Center, and AliExpress Logistics
// =============================================================================

export interface LogisticsScanHistoryItem {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
  isLatest?: boolean;
}

export interface CrossBorderOrder {
  id: string;
  _id?: string;
  orderNumber: string; // e.g. QA-896533
  date: string;
  timeFormatted: string; // e.g. "Nov 17, 13:40"
  customerName: string;
  phone: string;
  paymentMethod: string; // e.g. "Apple Pay"
  municipality: string; // e.g. Doha, Lusail City
  municipalityAr: string; // e.g. العاصمة, مدينة لوسيل
  zoneNumber: string; // e.g. Zone 38, Zone 69
  streetAddress: string; // e.g. Al Sadd, Marina District
  fullAddressText: string;
  itemsSummary: string; // e.g. 1× Porodo Multi-Function MagSafe...
  itemsCount: number;
  totalQAR: number;
  netProfitQAR: number;
  marginPercent: string;
  estDelivery: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  trackingNumber: string; // QAT-AIR-XXXXXX
  aliexpressTrackingNumber?: string; // e.g. LP00684928481234
  aliexpressCarrier?: string; // cainiao
  status:
    | 'Order Confirmed'
    | 'Air Hub Transit'
    | 'Qatar Customs (DOH)'
    | 'Out for Delivery'
    | 'Delivered'
    | 'Cancelled';
  stageLabel: string; // e.g. Pending Dispatch, Qatar Customs (DOH)
  stageSubtitle: string; // e.g. Supplier Pack, Hamad Cargo Hub
  milestoneIndex: number; // 1: Confirmed, 2: Dispatched, 3: Air CN->DOH, 4: DOH Customs, 5: Delivered
  customerNote?: string;
  scanHistory: LogisticsScanHistoryItem[];
}

export interface LiveActionEvent {
  id: string;
  timestamp: string;
  type: 'STATUS_CHANGE' | 'AWB_LINK' | 'DISPATCH_ALERT' | 'CUSTOMS_SYNC' | 'MANIFEST_EXPORT' | 'MANUAL_ORDER';
  orderRef?: string;
  title: string;
  detail: string;
  badge: string;
  badgeColor: 'amber' | 'blue' | 'green' | 'teal' | 'red';
}

export const INITIAL_CROSS_BORDER_ORDERS: CrossBorderOrder[] = [
  {
    id: 'ord-896533',
    orderNumber: 'QA-896533',
    date: 'Nov 17, 2026',
    timeFormatted: 'Nov 17, 13:40',
    customerName: 'Mohammed Al-Sayed',
    phone: '+974 5512 8492',
    paymentMethod: 'Apple Pay',
    municipality: 'Doha',
    municipalityAr: 'العاصمة',
    zoneNumber: 'Zone 38',
    streetAddress: 'Al Sadd',
    fullAddressText: 'Al Sadd, Zone 38',
    itemsSummary: '1× Porodo Multi-Function MagSafe...',
    itemsCount: 1,
    totalQAR: 55.0,
    netProfitQAR: 21.12,
    marginPercent: '38.4%',
    estDelivery: 'Nov 22, 2026',
    paymentStatus: 'Paid',
    trackingNumber: 'QAT-AIR-896533',
    status: 'Order Confirmed',
    stageLabel: 'Pending Dispatch',
    stageSubtitle: 'Supplier Pack',
    milestoneIndex: 1,
    scanHistory: [
      {
        id: 'scan-1',
        title: 'Supplier Packaging Queued',
        time: 'Nov 17, 13:40',
        location: 'Guangzhou Direct Air Hub',
        description: 'Order confirmed and waiting for AliExpress Cainiao parcel consolidation.',
        isLatest: true,
      },
      {
        id: 'scan-2',
        title: 'Order Confirmed & Paid',
        time: 'Nov 17, 13:40',
        location: 'Qatify Online (Doha)',
        description: 'Payment settled via Apple Pay (QAR 55.00).',
      },
    ],
  },
  {
    id: 'ord-885700',
    orderNumber: 'QA-885700',
    date: 'Nov 17, 2026',
    timeFormatted: 'Nov 17, 11:15',
    customerName: 'Mohammed Al-Sayed',
    phone: '+974 5512 8492',
    paymentMethod: 'Apple Pay',
    municipality: 'Doha',
    municipalityAr: 'العاصمة',
    zoneNumber: 'Zone 38',
    streetAddress: 'Al Sadd',
    fullAddressText: 'Al Sadd, Zone 38',
    itemsSummary: '1× Anker Prime 100W GaN Wall Ch...',
    itemsCount: 1,
    totalQAR: 149.0,
    netProfitQAR: 57.22,
    marginPercent: '38.4%',
    estDelivery: 'Nov 22, 2026',
    paymentStatus: 'Paid',
    trackingNumber: 'QAT-AIR-885700',
    status: 'Order Confirmed',
    stageLabel: 'Pending Dispatch',
    stageSubtitle: 'Supplier Pack',
    milestoneIndex: 1,
    scanHistory: [
      {
        id: 'scan-1',
        title: 'Consolidation Scheduled',
        time: 'Nov 17, 11:15',
        location: 'Shenzhen Air Logistics Center',
        description: 'Awaiting upstream seller Cainiao dispatch barcode generation.',
        isLatest: true,
      },
      {
        id: 'scan-2',
        title: 'Order Confirmed',
        time: 'Nov 17, 11:15',
        location: 'Qatify Online (Doha)',
        description: 'Payment authorized and verified (QAR 149.00).',
      },
    ],
  },
  {
    id: 'ord-122944',
    orderNumber: 'QA-122944',
    date: 'Nov 12, 2026',
    timeFormatted: 'Nov 12, 16:08',
    customerName: 'Tariq Al-Mansoor',
    phone: '+974 6672 8831',
    paymentMethod: 'Apple Pay',
    municipality: 'Lusail City',
    municipalityAr: 'مدينة لوسيل',
    zoneNumber: 'Zone 69',
    streetAddress: 'Marina District',
    fullAddressText: 'Marina District, Zone 69',
    itemsSummary: '1× Soundcore by Anker Liberty 4 NC',
    itemsCount: 1,
    totalQAR: 270.0,
    netProfitQAR: 103.68,
    marginPercent: '38.4%',
    estDelivery: 'Nov 18, 2026',
    paymentStatus: 'Paid',
    trackingNumber: 'QAT-AIR-122944',
    aliexpressTrackingNumber: 'LP00684928481234',
    aliexpressCarrier: 'cainiao',
    status: 'Qatar Customs (DOH)',
    stageLabel: 'Qatar Customs (DOH)',
    stageSubtitle: 'Hamad Cargo Hub',
    milestoneIndex: 4,
    scanHistory: [
      {
        id: 'scan-1',
        title: 'Customs Duty Assessment Cleared',
        time: 'Nov 17, 08:55',
        location: 'Hamad International Airport Cargo (DOH)',
        description: 'Released for Q-Post / Aramex last-mile handover in Lusail.',
        isLatest: true,
      },
      {
        id: 'scan-2',
        title: 'Linehaul Arrival at Doha Hub',
        time: 'Nov 16, 22:45',
        location: 'In Flight · QR Cargo (CAN → DOH)',
        description: 'Unloaded from cargo container PMC-4491.',
      },
      {
        id: 'scan-3',
        title: 'Order Confirmed',
        time: 'Nov 12, 16:08',
        location: 'Qatify Checkout (Lusail)',
        description: 'Payment settled (QAR 270.00).',
      },
    ],
  },
  {
    id: 'ord-571986',
    orderNumber: 'QA-571986',
    date: 'Nov 16, 2026',
    timeFormatted: 'Nov 16, 20:51',
    customerName: 'Tariq Al-Mansoor',
    phone: '+974 6672 8831',
    paymentMethod: 'Apple Pay',
    municipality: 'Lusail City',
    municipalityAr: 'مدينة لوسيل',
    zoneNumber: 'Zone 69',
    streetAddress: 'Fox Hills',
    fullAddressText: 'Fox Hills, Zone 69',
    itemsSummary: '1× Soundcore by Anker Liberty 4 NC',
    itemsCount: 1,
    totalQAR: 169.0,
    netProfitQAR: 64.9,
    marginPercent: '38.4%',
    estDelivery: 'Nov 21, 2026',
    paymentStatus: 'Paid',
    trackingNumber: 'QAT-AIR-571986',
    status: 'Order Confirmed',
    stageLabel: 'Pending Dispatch',
    stageSubtitle: 'Supplier Pack',
    milestoneIndex: 1,
    scanHistory: [
      {
        id: 'scan-1',
        title: 'Order Queued for Sourcing',
        time: 'Nov 16, 20:51',
        location: 'Fox Hills Lusail Logistics',
        description: 'Order confirmed and awaiting supplier package assignment.',
        isLatest: true,
      },
    ],
  },
  {
    id: 'ord-975144',
    orderNumber: 'QA-975144',
    date: 'Nov 16, 2026',
    timeFormatted: 'Nov 16, 17:34',
    customerName: 'Sheak Mohammad Abujor',
    phone: '+974 7789 2014',
    paymentMethod: 'Credit Card',
    municipality: 'Doha',
    municipalityAr: 'العاصمة',
    zoneNumber: 'Zone 61',
    streetAddress: 'West Bay',
    fullAddressText: 'West Bay, Zone 61',
    itemsSummary: '2× PulsePro ANC 48dB Hybrid Hea...',
    itemsCount: 2,
    totalQAR: 250.0,
    netProfitQAR: 96.0,
    marginPercent: '38.4%',
    estDelivery: 'Nov 21, 2026',
    paymentStatus: 'Paid',
    trackingNumber: 'QAT-AIR-975144',
    status: 'Order Confirmed',
    stageLabel: 'Pending Dispatch',
    stageSubtitle: 'Supplier Pack',
    milestoneIndex: 1,
    scanHistory: [
      {
        id: 'scan-1',
        title: 'Direct Air Pack Prepared',
        time: 'Nov 16, 17:34',
        location: 'West Bay Dispatch Hub',
        description: 'Ready for cross-border flight allocation to DOH.',
        isLatest: true,
      },
    ],
  },
  {
    id: 'ord-805048',
    orderNumber: 'QA-805048',
    date: 'Nov 16, 2026',
    timeFormatted: 'Nov 16, 14:12',
    customerName: 'Tariq Al-Mansoor',
    phone: '+974 6672 8831',
    paymentMethod: 'Apple Pay',
    municipality: 'Lusail City',
    municipalityAr: 'مدينة لوسيل',
    zoneNumber: 'Zone 69',
    streetAddress: 'Marina District',
    fullAddressText: 'Marina District, Zone 69',
    itemsSummary: '1× PulsePro ANC 48dB Hybrid Hea...',
    itemsCount: 1,
    totalQAR: 169.0,
    netProfitQAR: 64.9,
    marginPercent: '38.4%',
    estDelivery: 'Nov 21, 2026',
    paymentStatus: 'Paid',
    trackingNumber: 'QAT-AIR-805048',
    status: 'Order Confirmed',
    stageLabel: 'Pending Dispatch',
    stageSubtitle: 'Supplier Pack',
    milestoneIndex: 1,
    scanHistory: [
      {
        id: 'scan-1',
        title: 'Supplier Pack Queued',
        time: 'Nov 16, 14:12',
        location: 'Marina District Hub',
        description: 'Ready for AliExpress Cainiao dispatch consolidation.',
        isLatest: true,
      },
    ],
  },
  {
    id: 'ord-814198',
    orderNumber: 'QA-814198',
    date: 'Nov 16, 2026',
    timeFormatted: 'Nov 16, 10:05',
    customerName: 'Hamad Al-Thani',
    phone: '+974 5533 9921',
    paymentMethod: 'Apple Pay',
    municipality: 'Doha',
    municipalityAr: 'العاصمة',
    zoneNumber: 'Zone 55',
    streetAddress: 'Al Waab',
    fullAddressText: 'Al Waab, Zone 55',
    itemsSummary: '1× PulsePro ANC 48dB Hybrid Hea...',
    itemsCount: 1,
    totalQAR: 154.0,
    netProfitQAR: 59.14,
    marginPercent: '38.4%',
    estDelivery: 'Nov 21, 2026',
    paymentStatus: 'Paid',
    trackingNumber: 'QAT-AIR-814198',
    status: 'Order Confirmed',
    stageLabel: 'Pending Dispatch',
    stageSubtitle: 'Supplier Pack',
    milestoneIndex: 1,
    scanHistory: [
      {
        id: 'scan-1',
        title: 'Payment Confirmed',
        time: 'Nov 16, 10:05',
        location: 'Al Waab Zone 55',
        description: 'Pending CN export freight manifest attachment.',
        isLatest: true,
      },
    ],
  },
  {
    id: 'ord-244097',
    orderNumber: 'QA-244097',
    date: 'Nov 15, 2026',
    timeFormatted: 'Nov 15, 22:47',
    customerName: 'Hamad Al-Thani',
    phone: '+974 5533 9921',
    paymentMethod: 'Apple Pay',
    municipality: 'Doha',
    municipalityAr: 'العاصمة',
    zoneNumber: 'Zone 55',
    streetAddress: 'Al Waab',
    fullAddressText: 'Al Waab, Zone 55',
    itemsSummary: '1× PulsePro ANC 48dB Hybrid Hea...',
    itemsCount: 1,
    totalQAR: 154.0,
    netProfitQAR: 59.14,
    marginPercent: '38.4%',
    estDelivery: 'Nov 20, 2026',
    paymentStatus: 'Paid',
    trackingNumber: 'QAT-AIR-244097',
    status: 'Order Confirmed',
    stageLabel: 'Pending Dispatch',
    stageSubtitle: 'Supplier Pack',
    milestoneIndex: 1,
    scanHistory: [
      {
        id: 'scan-1',
        title: 'Order Processing',
        time: 'Nov 15, 22:47',
        location: 'Al Waab',
        description: 'Waiting for upstream Cainiao AWB barcode.',
        isLatest: true,
      },
    ],
  },
  {
    id: 'ord-800485',
    orderNumber: 'QA-800485',
    date: 'Nov 15, 2026',
    timeFormatted: 'Nov 15, 18:19',
    customerName: 'Tariq Al-Nuaimi',
    phone: '+974 5544 1120',
    paymentMethod: 'Credit Card',
    municipality: 'Doha',
    municipalityAr: 'العاصمة',
    zoneNumber: 'Zone 45',
    streetAddress: 'Old Airport',
    fullAddressText: 'Old Airport, Zone 45',
    itemsSummary: '1× PulsePro ANC 48dB Hybrid Hea...',
    itemsCount: 1,
    totalQAR: 169.0,
    netProfitQAR: 64.9,
    marginPercent: '38.4%',
    estDelivery: 'Nov 20, 2026',
    paymentStatus: 'Paid',
    trackingNumber: 'QAT-AIR-800485',
    status: 'Order Confirmed',
    stageLabel: 'Pending Dispatch',
    stageSubtitle: 'Supplier Pack',
    milestoneIndex: 1,
    scanHistory: [
      {
        id: 'scan-1',
        title: 'Order Confirmed',
        time: 'Nov 15, 18:19',
        location: 'Old Airport Zone 45',
        description: 'Payment authorized and queued for direct air flight.',
        isLatest: true,
      },
    ],
  },
  {
    id: 'ord-824322',
    orderNumber: 'QA-824322',
    date: 'Nov 12, 2026',
    timeFormatted: 'Nov 12, 11:30',
    customerName: 'Tariq Al-Mansoor',
    phone: '+974 6672 8831',
    paymentMethod: 'Apple Pay',
    municipality: 'Lusail City',
    municipalityAr: 'مدينة لوسيل',
    zoneNumber: 'Zone 69',
    streetAddress: 'Energy City',
    fullAddressText: 'Energy City, Zone 69',
    itemsSummary: '1× PulsePro ANC 48dB Hybrid Headphones',
    itemsCount: 1,
    totalQAR: 169.0,
    netProfitQAR: 64.9,
    marginPercent: '38.4%',
    estDelivery: 'Nov 18, 2026',
    paymentStatus: 'Paid',
    trackingNumber: 'QAT-AIR-824322',
    aliexpressTrackingNumber: 'LP00684919004811',
    aliexpressCarrier: 'cainiao',
    status: 'Qatar Customs (DOH)',
    stageLabel: 'Qatar Customs (DOH)',
    stageSubtitle: 'Hamad Cargo Hub',
    milestoneIndex: 4,
    scanHistory: [
      {
        id: 'scan-1',
        title: 'Customs Duty Assessment Cleared',
        time: 'Nov 17, 08:55',
        location: 'Hamad International Airport Cargo (DOH)',
        description: 'Released for Q-Post / Aramex last-mile handover in Lusail.',
        isLatest: true,
      },
      {
        id: 'scan-2',
        title: 'Linehaul Arrival at Doha Hub',
        time: 'Nov 16, 22:45',
        location: 'In Flight · QR Cargo (CAN → DOH)',
        description: 'Unloaded from cargo container PMC-4491.',
      },
      {
        id: 'scan-3',
        title: 'Order Confirmed',
        time: 'Nov 12, 11:30',
        location: 'Qatify Checkout (Lusail)',
        description: 'Payment settled (QAR 169.00).',
      },
    ],
  },
];

export const INITIAL_LIVE_ACTION_EVENTS: LiveActionEvent[] = [
  {
    id: 'act-001',
    timestamp: '16:40:12',
    type: 'CUSTOMS_SYNC',
    orderRef: 'QAT-AIR-824322',
    title: 'Customs Clearance Advance',
    detail: 'Hamad Cargo Terminal (DOH) cleared inbound batch #QC-814. AWB LP00684919004811 verified.',
    badge: 'CUSTOMS DOH',
    badgeColor: 'blue',
  },
  {
    id: 'act-002',
    timestamp: '16:22:05',
    type: 'AWB_LINK',
    orderRef: 'QAT-AIR-122944',
    title: 'AliExpress Cainiao AWB Attached',
    detail: 'Operator linked Cainiao Direct Line tracking LP00684928481234 to Lusail order QA-122944.',
    badge: 'AWB LINK',
    badgeColor: 'teal',
  },
  {
    id: 'act-003',
    timestamp: '15:58:30',
    type: 'STATUS_CHANGE',
    orderRef: 'QAT-AIR-896533',
    title: 'Fulfillment Order Confirmed',
    detail: 'Direct Air Express booking confirmed for Mohammed Al-Sayed (Al Sadd, Zone 38).',
    badge: 'DISPATCH',
    badgeColor: 'amber',
  },
  {
    id: 'act-004',
    timestamp: '15:14:18',
    type: 'DISPATCH_ALERT',
    orderRef: 'HUB-DOH-EXP-01',
    title: 'Air Freight Manifest Scheduled',
    detail: 'Shenzhen Baoan (SZX) → Hamad International (DOH) Qatar Cargo flight QR-8821 assigned.',
    badge: 'AIR FREIGHT',
    badgeColor: 'green',
  },
  {
    id: 'act-005',
    timestamp: '14:30:00',
    type: 'CUSTOMS_SYNC',
    orderRef: 'SYS-AUDIT',
    title: 'Logistics Telemetry Online',
    detail: 'Live sync established with AliExpress Cainiao API & Qatar Customs General Authority.',
    badge: 'ONLINE',
    badgeColor: 'green',
  },
];

export function generateManifestCsv(orders: CrossBorderOrder[]): string {
  const headers = [
    'Order Ref',
    'Date & Time',
    'Tracking Number',
    'Carrier',
    'AliExpress Cainiao AWB',
    'Customer Name',
    'Phone',
    'Municipality',
    'Municipality (AR)',
    'Zone',
    'Street / Landmark',
    'Items Summary',
    'Items Qty',
    'Declared Value (QAR)',
    'Est Net Profit (QAR)',
    'Payment Status',
    'Fulfillment Stage',
    'Hub Code',
  ];

  const rows = orders.map((o) => [
    `"${o.orderNumber}"`,
    `"${o.timeFormatted}"`,
    `"${o.trackingNumber}"`,
    `"${o.aliexpressCarrier || 'cainiao'}"`,
    `"${o.aliexpressTrackingNumber || 'UNLINKED'}"`,
    `"${o.customerName}"`,
    `"${o.phone}"`,
    `"${o.municipality}"`,
    `"${o.municipalityAr}"`,
    `"${o.zoneNumber}"`,
    `"${o.streetAddress}"`,
    `"${o.itemsSummary.replace(/"/g, '""')}"`,
    o.itemsCount,
    o.totalQAR.toFixed(2),
    o.netProfitQAR.toFixed(2),
    `"${o.paymentStatus}"`,
    `"${o.stageLabel}"`,
    `"DOH-EXP-01"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}
