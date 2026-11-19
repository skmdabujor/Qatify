'use client';

// =============================================================================
// Qatify — Customer & Operations Dashboard (`/dashboard`)
// Role Switcher: Customer View (5-Stage Air Shipment Tracker) vs Admin View (Analytics)
// =============================================================================

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useAction, useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Package,
  Plane,
  Clock,
  MapPin,
  Heart,
  RotateCcw,
  Headphones,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronRight,
  ShieldCheck,
  Building,
  Phone,
  FileText,
  Plus,
  ArrowUpRight,
  Truck,
  ExternalLink,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Send,
  RotateCw,
  Edit3,
  Lock,
  Key,
  X,
  ChevronDown,
  Check,
  Mail,
  HelpCircle,
  UploadCloud,
  Menu,
  Activity,
  Terminal,
  Download,
  Copy,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  INITIAL_CROSS_BORDER_ORDERS,
  INITIAL_LIVE_ACTION_EVENTS,
  generateManifestCsv,
  CrossBorderOrder,
  LiveActionEvent,
} from '@/data/adminCrossBorderOrders';
import { TelegramAlertsManager } from '@/components/admin/TelegramAlertsManager';
import { TrackingTimeline } from '@/components/tracking/TrackingTimeline';
import { InvoiceModal } from '@/components/orders/InvoiceModal';
import { AliExpressLinkModal } from '@/components/admin/AliExpressLinkModal';
import { DashboardSkeleton } from '@/components/ui/skeleton';
import { useAuthActions } from '@convex-dev/auth/react';
import { AuthModal } from '@/components/auth/AuthModal';
import { useShop } from '@/context/ShopContext';
import {
  QATAR_MUNICIPALITIES,
  SUPPORTED_COUNTRIES,
  ALIEXPRESS_QATAR_MUNICIPALITIES,
  ALIEXPRESS_MUNICIPALITY_ZONES,
  ALL_QATAR_ZONES,
} from '@/data/products';
import { QatarAddress, Order } from '@/types/product';
import { CountryFlag } from '@/components/ui/CountryFlags';
import styles from './page.module.scss';

const SUPPORT_FAQS = [
  {
    q: 'How long does Direct Air Express delivery take to Qatar?',
    a: 'Standard Direct Air Express orders typically arrive at your doorstep in Doha, Lusail, or Al Rayyan within 5–9 business days from fulfillment dispatch.',
  },
  {
    q: 'What should I do if my items are damaged or missing?',
    a: 'Submit a request using the form on the left or reach out via our WhatsApp concierge with photos within 14 days of delivery for immediate replacement or full refund.',
  },
  {
    q: 'Are Qatar customs and import duties covered?',
    a: 'Yes! All orders shipped via Qatify include 100% customs clearance at Hamad International Airport (DOH) with zero surprise doorstep delivery fees.',
  },
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';
  const initialRole = searchParams.get('role') || 'customer';

  // Role State: 'customer' | 'admin'
  const [role, setRole] = useState<'customer' | 'admin'>(
    initialRole === 'admin' ? 'admin' : 'customer'
  );

  // Customer Active Tab
  const [customerTab, setCustomerTab] = useState<
    'orders' | 'tracking' | 'addresses' | 'wishlist' | 'support'
  >(
    initialTab === 'tracking'
      ? 'tracking'
      : initialTab === 'addresses'
      ? 'addresses'
      : initialTab === 'wishlist'
      ? 'wishlist'
      : initialTab === 'support'
      ? 'support'
      : 'orders'
  );

  // Admin Active Tab Filter ('all' | 'analytics' | 'pipeline' | 'orders' | 'telegram')
  const [adminTab, setAdminTab] = useState<
    'all' | 'analytics' | 'pipeline' | 'orders' | 'telegram'
  >('all');

  const convex = useConvex();
  const viewer = useQuery(api.users.viewer);
  const { signOut } = useAuthActions();

  // User Account Email from localStorage (Customer Hub)
  const [userEmail, setUserEmail] = useState<string>('');

  // Account Sign-in / Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');

  // Admin Master Key Authentication State
  const [adminKey, setAdminKey] = useState<string>('');
  const [isAdminKeyModalOpen, setIsAdminKeyModalOpen] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [adminKeyError, setAdminKeyError] = useState('');

  // Hydrate adminKey from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = sessionStorage.getItem('qatify_admin_key') || '';
      if (storedKey) {
        setAdminKey(storedKey);
      }
    }
  }, []);

  // Hydrate user email from Convex viewer or localStorage
  useEffect(() => {
    if (viewer?.email) {
      setUserEmail(viewer.email);
      if (typeof window !== 'undefined') {
        localStorage.setItem('qatify_user_email', viewer.email);
      }
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('qatify_user_email') || '';
      setUserEmail(stored);
    }
  }, [viewer]);

  // Server-side Dynamic Admin Access Check against Convex `admins` table
  const adminCheck = useQuery(
    api.admins.checkIsAdmin,
    adminKey ? { adminKey } : {}
  );
  const isAdmin = Boolean(adminCheck?.isAdmin || viewer?.isAdmin);
  const adminRole = adminCheck?.role || viewer?.adminRole || null;
  const adminName = adminCheck?.name || viewer?.name || null;

  // Keep or sync admin role state safely
  useEffect(() => {
    if (initialRole === 'admin') {
      setRole('admin');
    }
  }, [initialRole]);

  // Manage body class for admin isolation (hiding storefront elements)
  useEffect(() => {
    if (role === 'admin') {
      document.body.classList.add('admin-ops-mode');
    } else {
      document.body.classList.remove('admin-ops-mode');
    }
    return () => {
      document.body.classList.remove('admin-ops-mode');
    };
  }, [role]);

  const {
    orders,
    activeOrder,
    savedAddresses,
    addAddress,
    wishlist,
    removeFromCart,
    addToCart,
    removeFromWishlist,
    showToast,
  } = useShop();

  const handleSwitchToAdmin = () => {
    if (isAdmin) {
      setRole('admin');
      showToast('Store Admin 🛡️', 'Switched to Dropship Operations', 'success');
    } else {
      setIsAdminKeyModalOpen(true);
    }
  };

  const handleUnlockWithAdminKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = adminKeyInput.trim();
    if (!cleanKey) {
      setAdminKeyError('Please enter the Admin Secret Key.');
      return;
    }

    try {
      const res = await convex.query(api.admins.checkIsAdmin, { adminKey: cleanKey });
      if (res.isAdmin) {
        setAdminKey(cleanKey);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('qatify_admin_key', cleanKey);
        }
        setIsAdminKeyModalOpen(false);
        setRole('admin');
        setAdminKeyError('');
        setAdminKeyInput('');
        showToast('Admin Access Granted 🛡️', 'Welcome to Dropship Operations', 'success');
      } else {
        setAdminKeyError('Invalid Admin Secret Key. Access denied.');
      }
    } catch (err: any) {
      console.error('Admin key verification error:', err);
      setAdminKeyError('Error verifying Admin Secret Key. Please try again.');
    }
  };

  const handleOpenEmailModal = () => {
    router.push('/login?redirect=/dashboard');
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = emailInput.trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    localStorage.setItem('qatify_user_email', clean);
    setUserEmail(clean);
    setIsEmailModalOpen(false);
    showToast('Account Connected 🇶🇦', `Signed in as ${clean}`, 'success');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
    localStorage.removeItem('qatify_user_email');
    setUserEmail('');
    setRole('customer');
    showToast('Signed Out', 'Switched to Guest Session', 'info');
  };

  const orderFromUrl = searchParams.get('order') || searchParams.get('orderNumber') || '';

  // Retrieve stored guest email or last order number from localStorage for instant guest order pickup
  const [guestEmail, setGuestEmail] = useState('');
  const [lastOrderNum, setLastOrderNum] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedGuestEmail = localStorage.getItem('qatify_customer_email') || '';
        if (storedGuestEmail) setGuestEmail(storedGuestEmail);

        const storedLastNum = localStorage.getItem('qatify_last_order_number') || '';
        if (storedLastNum) setLastOrderNum(storedLastNum);
      } catch (e) {}
    }
  }, []);

  // Customer-scoped orders: strictly fetch orders for authenticated accounts from Convex
  const customerLiveOrders = useQuery(
    api.orders.getOrdersByCustomer,
    viewer?.email ? { email: viewer.email, limit: 50 } : 'skip'
  );

  // Guest order search state
  const [guestInputVal, setGuestInputVal] = useState<string>(orderFromUrl || '');
  const [searchedOrderCode, setSearchedOrderCode] = useState<string>(orderFromUrl || '');
  const [guestSearchError, setGuestSearchError] = useState<string>('');
  const [isGuestSearching, setIsGuestSearching] = useState<boolean>(false);

  // Single order lookup from Convex (e.g. QA-89421 passed via URL or searched by guest)
  const singleConvexOrder = useQuery(
    api.tracking.getFullTracking,
    searchedOrderCode ? { code: searchedOrderCode } : 'skip'
  );

  useEffect(() => {
    if (orderFromUrl) {
      setSearchedOrderCode(orderFromUrl);
      setGuestInputVal(orderFromUrl);
    }
  }, [orderFromUrl]);

  const handleGuestTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = guestInputVal.trim().toUpperCase();
    if (!clean) {
      setGuestSearchError('Please enter an Order Number or Tracking Number.');
      return;
    }
    setGuestSearchError('');
    setIsGuestSearching(true);
    setSearchedOrderCode(clean);
    setTimeout(() => setIsGuestSearching(false), 500);
  };

  // Admin-scoped live orders: strictly fetched only when user is verified in Convex
  const adminLiveOrders = useQuery(
    api.orders.listRecentOrders,
    isAdmin
      ? {
          adminEmail: userEmail || viewer?.email || undefined,
          adminKey: adminKey || undefined,
          limit: 50,
        }
      : 'skip'
  );

  const updateStatus = useMutation(api.orders.updateOrderStatus);
  const refreshTracking = useMutation(api.tracking.refreshOrderTracking);
  const resendConfirmationEmail = useAction(api.emails.resendOrderConfirmationEmailAction);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [linkingOrder, setLinkingOrder] = useState<any>(null);

  // Combine live orders strictly based on current authenticated role
  const displayOrders: any[] =
    role === 'admin'
      ? (adminLiveOrders && adminLiveOrders.length > 0 ? adminLiveOrders : [])
      : (customerLiveOrders && customerLiveOrders.length > 0
          ? customerLiveOrders
          : orders);

  // Cross-Border Operations State (Amazon Seller Central / AliExpress Logistics style)
  const [crossBorderOrders, setCrossBorderOrders] = useState<CrossBorderOrder[]>(INITIAL_CROSS_BORDER_ORDERS);
  const [liveActionEvents, setLiveActionEvents] = useState<LiveActionEvent[]>(INITIAL_LIVE_ACTION_EVENTS);
  const [opsAdminTab, setOpsAdminTab] = useState<'all' | 'analytics' | 'pipeline' | 'orders' | 'live_feed' | 'telegram'>('all');
  const [isOpsSidebarOpen, setIsOpsSidebarOpen] = useState(true);
  const [opsSearch, setOpsSearch] = useState('');
  const [opsPipelineStage, setOpsPipelineStage] = useState<'all' | 'pending' | 'in_transit' | 'customs' | 'delivered'>('all');
  const [opsZoneFilter, setOpsZoneFilter] = useState<string>('all');
  const [opsAwbFilter, setOpsAwbFilter] = useState<'all' | 'linked' | 'unlinked'>('all');
  const [opsCurrentPage, setOpsCurrentPage] = useState(1);
  const [copiedAwb, setCopiedAwb] = useState<string | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [activeDrawerOrder, setActiveDrawerOrder] = useState<CrossBorderOrder | null>(null);
  const [isTrackingDrawerOpen, setIsTrackingDrawerOpen] = useState(false);
  const [drawerAwbInput, setDrawerAwbInput] = useState('');
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isInspectDrawerOpen, setIsInspectDrawerOpen] = useState(false);
  const [selectedInspectionOrder, setSelectedInspectionOrder] = useState<any | null>(null);
  const [manualOrderData, setManualOrderData] = useState({
    customerName: '',
    phone: '+974 ',
    municipality: 'Doha',
    zoneNumber: 'Zone 38',
    streetAddress: 'Al Sadd',
    productTitle: 'PulsePro ANC Wireless Headphones',
    priceQAR: 169,
    quantity: 1,
    cainiaoAwb: '',
  });

  const opsSearchInputRef = useRef<HTMLInputElement>(null);

  // Global ⌘K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        opsSearchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync live orders from Convex into crossBorderOrders
  useEffect(() => {
    if (adminLiveOrders && adminLiveOrders.length > 0) {
      setCrossBorderOrders((prev) => {
        const liveConverted: CrossBorderOrder[] = adminLiveOrders.map((ord: any) => {
          const municipality = ord.address?.municipality || 'Doha';
          const isDoha = municipality.toLowerCase().includes('doha');
          return {
            id: ord._id || ord.orderNumber,
            _id: ord._id,
            orderNumber: ord.orderNumber,
            date: ord.date || 'Nov 17, 2026',
            customerName: ord.address?.fullName || 'Qatar Customer',
            municipality,
            municipalityAr: isDoha ? 'العاصمة' : 'مدينة لوسيل',
            zoneNumber: ord.address?.zoneNumber || 'Zone 24',
            streetAddress: ord.address?.streetAddress || ord.address?.municipality || 'Al Sadd',
            fullAddressText: `${ord.address?.streetAddress || ''}, ${ord.address?.zoneNumber || ''}`.trim(),
            itemsSummary: ord.items?.[0]?.title
              ? `${ord.items.length}× ${ord.items[0].title.slice(0, 24)}...`
              : '1× Qatify Tech Gadget',
            itemsCount: ord.items?.length || 1,
            totalQAR: ord.totalQAR || 169,
            paymentStatus: (ord.paymentStatus === 'paid' ? 'Paid' : 'Pending') as any,
            trackingNumber: ord.trackingNumber || `QAT-AIR-${ord.orderNumber.replace(/[^0-9]/g, '')}`,
            aliexpressTrackingNumber: ord.aliexpressTrackingNumber,
            aliexpressCarrier: ord.aliexpressCarrier || 'cainiao',
            status: ord.status || 'Order Confirmed',
            stageLabel:
              ord.status === 'Order Confirmed'
                ? 'Pending Dispatch'
                : ord.status === 'Air Hub Transit'
                ? 'In Air Transit'
                : ord.status === 'Qatar Customs (DOH)'
                ? 'Qatar Customs (DOH)'
                : ord.status || 'Pending Dispatch',
            stageSubtitle:
              ord.status === 'Order Confirmed'
                ? 'Supplier Pack'
                : ord.status === 'Air Hub Transit'
                ? 'Flight to DOH'
                : ord.status === 'Qatar Customs (DOH)'
                ? 'Hamad Cargo Hub'
                : 'Doorstep Drops',
            timeFormatted: ord.date ? `${ord.date.slice(0, 6)}, 14:00` : 'Nov 17, 13:40',
            phone: ord.address?.phone || '+974 5500 0000',
            paymentMethod: ord.paymentMethod || 'Apple Pay',
            netProfitQAR: Math.round((ord.totalQAR || 169) * 0.384),
            marginPercent: '38.4%',
            estDelivery: 'Nov 22, 2026',
            milestoneIndex:
              ord.status === 'Delivered'
                ? 5
                : ord.status === 'Qatar Customs (DOH)'
                ? 4
                : ord.status === 'Air Hub Transit'
                ? 3
                : 1,
            scanHistory: [
              {
                id: `scan-${ord.orderNumber || Date.now()}-1`,
                title: ord.status === 'Qatar Customs (DOH)' ? 'Customs Assessment Cleared' : 'Order Confirmed',
                time: 'Nov 17, 13:40',
                location: ord.status === 'Qatar Customs (DOH)' ? 'Hamad International Airport Cargo (DOH)' : 'Qatify Checkout',
                description: `Live order synced from Convex database. Payment settled (${ord.totalQAR || 169} QAR).`,
                isLatest: true,
              },
            ],
          };
        });

        const seen = new Set(liveConverted.map((o) => o.orderNumber));
        const nonDuplicateMock = prev.filter((o) => !seen.has(o.orderNumber));
        return [...liveConverted, ...nonDuplicateMock];
      });
    }
  }, [adminLiveOrders]);

  // Dynamic KPIs from actual operations orders
  const opsKpi = useMemo(() => {
    const totalRev = crossBorderOrders.reduce((sum, o) => sum + (o.totalQAR || 0), 0);
    const unlinkedCount = crossBorderOrders.filter((o) => !o.aliexpressTrackingNumber).length;
    const linkedCount = crossBorderOrders.filter((o) => Boolean(o.aliexpressTrackingNumber)).length;
    const dohaCount = crossBorderOrders.filter((o) => o.municipality.toLowerCase().includes('doha')).length;
    const lusailCount = crossBorderOrders.filter((o) => o.municipality.toLowerCase().includes('lusail')).length;
    const avgBasket = crossBorderOrders.length > 0 ? (totalRev / crossBorderOrders.length).toFixed(2) : '176.50';
    const estMarginQAR = Math.round(totalRev * 0.384);

    return {
      grossRevenue: totalRev,
      unlinkedCount,
      linkedCount,
      totalOrders: crossBorderOrders.length,
      dohaCount,
      lusailCount,
      avgBasket,
      estMarginQAR,
    };
  }, [crossBorderOrders]);

  const totalRevenue = opsKpi.grossRevenue;
  const pendingDispatchCount = crossBorderOrders.filter((o) => o.status === 'Order Confirmed').length;
  const inAirTransitCount = crossBorderOrders.filter((o) => o.status === 'Air Hub Transit').length;
  const customsCount = crossBorderOrders.filter((o) => o.status === 'Qatar Customs (DOH)').length;
  const deliveredCount = crossBorderOrders.filter((o) => o.status === 'Delivered').length;

  const filteredOpsOrders = useMemo(() => {
    let list = crossBorderOrders;

    const q = opsSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.trackingNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.itemsSummary.toLowerCase().includes(q) ||
          (o.aliexpressTrackingNumber && o.aliexpressTrackingNumber.toLowerCase().includes(q)) ||
          o.zoneNumber.toLowerCase().includes(q) ||
          o.municipality.toLowerCase().includes(q)
      );
    }

    if (opsPipelineStage === 'pending') {
      list = list.filter((o) => o.status === 'Pending Confirmation' || o.status === 'Order Confirmed');
    } else if (opsPipelineStage === 'in_transit') {
      list = list.filter((o) => o.status === 'Air Hub Transit');
    } else if (opsPipelineStage === 'customs') {
      list = list.filter((o) => o.status === 'Qatar Customs (DOH)');
    } else if (opsPipelineStage === 'delivered') {
      list = list.filter((o) => o.status === 'Delivered');
    }

    if (opsZoneFilter === 'doha') {
      list = list.filter((o) => o.municipality.toLowerCase().includes('doha'));
    } else if (opsZoneFilter === 'lusail') {
      list = list.filter((o) => o.municipality.toLowerCase().includes('lusail'));
    }

    if (opsAwbFilter === 'linked') {
      list = list.filter((o) => Boolean(o.aliexpressTrackingNumber));
    } else if (opsAwbFilter === 'unlinked') {
      list = list.filter((o) => !o.aliexpressTrackingNumber);
    }

    return list;
  }, [crossBorderOrders, opsSearch, opsPipelineStage, opsZoneFilter, opsAwbFilter]);

  const handleStatusChange = async (order: any, newStatus: string) => {
    if (order._id && !String(order._id).startsWith('ord-')) {
      try {
        const res: any = await updateStatus({
          adminKey: adminKey || undefined,
          orderId: order._id,
          status: newStatus as any,
        });
        if (newStatus === 'Order Confirmed') {
          if (res?.emailDispatched) {
            showToast('Order Confirmed & Email Sent! 🚀', `Confirmation email dispatched to customer!`, 'success');
          } else {
            showToast('Order Confirmed', `Order #${order.orderNumber} confirmed`, 'success');
          }
        } else {
          showToast('Status Updated', `Order #${order.orderNumber} set to ${newStatus}`, 'info');
        }
      } catch (err) {
        console.error(err);
        showToast('Update Failed', String(err), 'error');
      }
    }

    setCrossBorderOrders((prev) =>
      prev.map((o) => {
        if (o.id === order.id || o.orderNumber === order.orderNumber) {
          const stageLabel =
            newStatus === 'Pending Confirmation'
              ? 'Pending Approval'
              : newStatus === 'Order Confirmed'
              ? 'Pending Dispatch'
              : newStatus === 'Air Hub Transit'
              ? 'In Air Transit'
              : newStatus === 'Qatar Customs (DOH)'
              ? 'Qatar Customs (DOH)'
              : newStatus;
          const stageSubtitle =
            newStatus === 'Pending Confirmation'
              ? 'Awaiting Confirmation'
              : newStatus === 'Order Confirmed'
              ? 'Supplier Pack'
              : newStatus === 'Air Hub Transit'
              ? 'Flight to DOH'
              : newStatus === 'Qatar Customs (DOH)'
              ? 'Hamad Cargo Hub'
              : 'Doorstep Drops';
          return { ...o, status: newStatus as any, stageLabel, stageSubtitle };
        }
        return o;
      })
    );

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    const newEvent: LiveActionEvent = {
      id: `act-${Date.now()}`,
      timestamp: timeStr,
      type: 'STATUS_CHANGE',
      orderRef: order.trackingNumber || order.orderNumber,
      title: `Status → ${newStatus}`,
      detail: `Operator updated ${order.orderNumber} (${order.customerName}) to [${newStatus}].`,
      badge: 'STATUS',
      badgeColor: newStatus === 'Delivered' ? 'green' : newStatus.includes('Customs') ? 'blue' : 'amber',
    };
    setLiveActionEvents((prev) => [newEvent, ...prev]);
    showToast('Status Updated! ✈️', `${order.orderNumber} is now: ${newStatus}`, 'success');
  };

  const handleCopyAwb = (awb: string, orderRef: string) => {
    navigator.clipboard.writeText(awb);
    setCopiedAwb(awb);
    setTimeout(() => setCopiedAwb(null), 2000);
    showToast('AWB Copied! 📋', awb, 'success');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    setLiveActionEvents((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: timeStr,
        type: 'AWB_LINK',
        orderRef,
        title: 'Cainiao AWB Copied',
        detail: `Operator copied AliExpress tracking ${awb} for shipment reference ${orderRef}.`,
        badge: 'CLIPBOARD',
        badgeColor: 'teal',
      },
      ...prev,
    ]);
  };

  const handleExportManifest = () => {
    const csv = generateManifestCsv(filteredOpsOrders);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Qatify_Manifest_DOH_EXP_01_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Manifest Exported 📄', 'Air Cargo Manifest CSV downloaded successfully', 'success');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    setLiveActionEvents((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: timeStr,
        type: 'MANIFEST_EXPORT',
        orderRef: 'DOH-EXP-01',
        title: 'Manifest Exported',
        detail: `Exported manifest of ${filteredOpsOrders.length} cross-border orders to CSV.`,
        badge: 'MANIFEST',
        badgeColor: 'green',
      },
      ...prev,
    ]);
  };

  const openTrackingDrawer = (ord: CrossBorderOrder) => {
    setActiveDrawerOrder(ord);
    setDrawerAwbInput(ord.aliexpressTrackingNumber || '');
    setIsTrackingDrawerOpen(true);
  };

  const handleSaveDrawerAwb = () => {
    if (!activeDrawerOrder) return;
    const cleanAwb = drawerAwbInput.trim();
    if (!cleanAwb) {
      showToast('AWB Required', 'Please enter a valid tracking code', 'info');
      return;
    }
    setCrossBorderOrders((prev) =>
      prev.map((o) =>
        o.orderNumber === activeDrawerOrder.orderNumber
          ? { ...o, aliexpressTrackingNumber: cleanAwb, aliexpressCarrier: 'cainiao' }
          : o
      )
    );
    setActiveDrawerOrder((prev) =>
      prev
        ? { ...prev, aliexpressTrackingNumber: cleanAwb, aliexpressCarrier: 'cainiao' }
        : null
    );
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    setLiveActionEvents((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: timeStr,
        type: 'AWB_LINK',
        orderRef: activeDrawerOrder.orderNumber,
        title: 'AWB Attached',
        detail: `Attached AliExpress Cainiao tracking ${cleanAwb} to ${activeDrawerOrder.orderNumber}.`,
        badge: 'AWB LINK',
        badgeColor: 'teal',
      },
      ...prev,
    ]);
    showToast('AWB Saved & Synced! ✈️', `AliExpress code ${cleanAwb} bound to ${activeDrawerOrder.orderNumber}`, 'success');
  };

  const handlePushDrawerTelegram = () => {
    if (!activeDrawerOrder) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    setLiveActionEvents((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: timeStr,
        type: 'DISPATCH_ALERT',
        orderRef: activeDrawerOrder.orderNumber,
        title: 'Telegram Alert Sent',
        detail: `Pushed status update [${activeDrawerOrder.status}] for ${activeDrawerOrder.orderNumber} to Telegram subscriber channel.`,
        badge: 'TELEGRAM',
        badgeColor: 'green',
      },
      ...prev,
    ]);
    showToast('Telegram Alert Dispatched! ✈️', `Milestone broadcasted to Qatar channel for ${activeDrawerOrder.orderNumber}`, 'success');
  };

  const toggleSelectOrder = (orderNum: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderNum) ? prev.filter((id) => id !== orderNum) : [...prev, orderNum]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOpsOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOpsOrders.map((o) => o.orderNumber));
    }
  };

  const handleSimulateEvent = () => {
    const sampleSims = [
      {
        badge: 'CUSTOMS DOH',
        badgeColor: 'blue' as const,
        title: 'Hamad Cargo Inspection Passed',
        detail: 'Batch QC-902 customs inspection completed at Hamad Intl Cargo Terminal. Ready for local handover.',
      },
      {
        badge: 'AIR FREIGHT',
        badgeColor: 'amber' as const,
        title: 'Flight QR-8840 Landed',
        detail: 'Qatar Cargo Boeing 777F touched down at DOH runway 34L carrying direct air express containers.',
      },
      {
        badge: 'TELEGRAM DISPATCH',
        badgeColor: 'teal' as const,
        title: 'Alert Broadcast Sent',
        detail: 'Automatic dispatch webhook delivered to Qatify Logistics Bot channel for 10 active manifests.',
      },
    ];
    const picked = sampleSims[Math.floor(Math.random() * sampleSims.length)];
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    setLiveActionEvents((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: timeStr,
        type: 'CUSTOMS_SYNC',
        orderRef: 'DOH-EXP-01',
        title: picked.title,
        detail: picked.detail,
        badge: picked.badge,
        badgeColor: picked.badgeColor,
      },
      ...prev,
    ]);
    showToast('Simulation Event Added', picked.title, 'info');
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualOrderData.customerName.trim()) {
      showToast('Validation Error', 'Customer name is required', 'error');
      return;
    }
    const orderNum = `QA-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingRef = `QAT-AIR-${orderNum.replace('QA-', '')}`;
    const isDoha = manualOrderData.municipality.toLowerCase().includes('doha');
    const newOrder: CrossBorderOrder = {
      id: `ord-man-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName: manualOrderData.customerName.trim(),
      municipality: manualOrderData.municipality,
      municipalityAr: isDoha ? 'العاصمة' : 'مدينة لوسيل',
      zoneNumber: manualOrderData.zoneNumber.trim() || 'Zone 38',
      streetAddress: manualOrderData.streetAddress.trim() || 'Al Sadd',
      fullAddressText: `${manualOrderData.streetAddress}, ${manualOrderData.zoneNumber}`,
      itemsSummary: `1× ${manualOrderData.productTitle.trim()}`,
      itemsCount: manualOrderData.quantity || 1,
      totalQAR: Number(manualOrderData.priceQAR) || 169,
      paymentStatus: 'Paid',
      trackingNumber: trackingRef,
      aliexpressTrackingNumber: manualOrderData.cainiaoAwb.trim() ? manualOrderData.cainiaoAwb.trim().toUpperCase() : undefined,
      aliexpressCarrier: 'cainiao',
      status: 'Order Confirmed',
      stageLabel: 'Pending Dispatch',
      stageSubtitle: 'Supplier Pack',
      timeFormatted: 'Nov 17, 14:00',
      phone: manualOrderData.phone.trim() || '+974 5500 1234',
      paymentMethod: 'Apple Pay',
      netProfitQAR: Math.round((Number(manualOrderData.priceQAR) || 169) * 0.384),
      marginPercent: '38.4%',
      estDelivery: 'Nov 24, 2026',
      milestoneIndex: 1,
      scanHistory: [
        {
          id: `scan-${orderNum}-1`,
          title: 'Order Confirmed (Manual)',
          time: 'Nov 17, 14:00',
          location: 'Qatify Seller Ops Console',
          description: `Manual order created by ops admin for ${manualOrderData.customerName}.`,
          isLatest: true,
        },
      ],
    };

    setCrossBorderOrders((prev) => [newOrder, ...prev]);
    setIsManualOrderModalOpen(false);
    showToast('Order Created! 📦', `${orderNum} added to Qatar fulfillment pipeline`, 'success');

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    setLiveActionEvents((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: timeStr,
        type: 'MANUAL_ORDER',
        orderRef: orderNum,
        title: 'Manual Order Injected',
        detail: `Operator created manual order ${orderNum} for ${newOrder.customerName} (QAR ${newOrder.totalQAR}).`,
        badge: 'NEW ORDER',
        badgeColor: 'green',
      },
      ...prev,
    ]);

    setManualOrderData({
      customerName: '',
      phone: '+974 ',
      municipality: 'Doha',
      zoneNumber: 'Zone 38',
      streetAddress: 'Al Sadd',
      productTitle: 'PulsePro ANC Wireless Headphones',
      priceQAR: 169,
      quantity: 1,
      cainiaoAwb: '',
    });
  };

  // Retail Orders & Two-View State
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<any | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<any | null>(null);
  const [orderSearchInput, setOrderSearchInput] = useState('');
  const [orderFilterTab, setOrderFilterTab] = useState<'all' | 'to_ship' | 'in_transit' | 'delivered'>('all');

  // Combine live orders with authentic retail showcase orders
  const retailOrders = useMemo(() => {
    const list: any[] = [];
    const seenNumbers = new Set<string>();

    const addOrder = (ord: any) => {
      if (!ord) return;
      let num = String(ord.orderNumber || ord.id || '');
      // Clean up legacy QTF- prefix orders to standard QA- format (e.g. QA-896533)
      if (num.startsWith('QTF-')) {
        const digits = num.replace(/[^0-9]/g, '');
        num = digits === '73411' ? 'QA-896533' : `QA-${digits}`;
      }
      const dedupKey = num.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!dedupKey || seenNumbers.has(dedupKey)) return;
      seenNumbers.add(dedupKey);

      const items = (ord.items || []).map((it: any) => ({
        title: it.title || it.product?.title || 'Qatify Tech Gadget',
        quantity: it.quantity || 1,
        priceQAR: it.priceQAR || it.product?.priceQAR || 0,
        slug: it.slug || it.product?.slug || 'porodo-7-in-1-electronic-earbud-cleaning-kit',
        image: it.image || it.product?.images?.[0] || '/placeholder.svg',
        selectedColor: it.selectedColor,
        selectedOption: it.selectedOption,
      }));

      const deliveryEstimate =
        ord.estimatedDeliveryWindow ||
        (ord.status === 'In Transit - Doha' || ord.status === 'In Transit'
          ? 'Arriving Tomorrow, Nov 20'
          : ord.status === 'Delivered'
          ? 'Delivered'
          : 'Arriving Nov 20 – Nov 24, 2026');

      list.push({
        ...ord,
        id: ord.id || ord._id || num,
        orderNumber: num,
        trackingNumber: ord.trackingNumber || `QA-EXP-${num.replace(/[^0-9]/g, '') || '896533'}`,
        date: ord.date || (ord._creationTime ? new Date(ord._creationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Nov 14, 2026'),
        status: ord.status || 'Order Confirmed',
        totalQAR: ord.totalQAR || 55,
        estimatedDeliveryWindow: deliveryEstimate,
        carrier: ord.carrier || 'Direct Air Express',
        paymentStatus: ord.paymentStatus || 'paid',
        paymentMethod: ord.paymentMethod || 'apple_pay',
        shippingMethod: ord.shippingMethod || 'Direct Air Express (5–9 Business Days)',
        items: items.length > 0 ? items : [],
        address: ord.address || {
          fullName: viewer?.name || 'Customer',
          municipality: 'Doha, Qatar',
          zoneNumber: 'Zone 24',
          streetAddress: 'Al Corniche Street',
          buildingNumber: 'Building 12',
          phone: '+974 4437 4646',
        },
      });
    };

    // Authenticated customer: show live orders belonging to their account from Convex
    if (viewer) {
      if (customerLiveOrders && customerLiveOrders.length > 0) {
        customerLiveOrders.forEach(addOrder);
      }
      return list;
    }

    // Guest visitor: only return single tracked order if active or searched
    if (activeTrackingOrder) {
      addOrder(activeTrackingOrder);
      return list;
    }

    if (singleConvexOrder) {
      addOrder(singleConvexOrder);
      return list;
    }

    return [];
  }, [viewer, customerLiveOrders, singleConvexOrder, activeTrackingOrder]);

  // Auto-sync activeTrackingOrder if singleConvexOrder is loaded
  useEffect(() => {
    if (singleConvexOrder) {
      setActiveTrackingOrder(singleConvexOrder);
      setGuestSearchError('');
    } else if (singleConvexOrder === null && searchedOrderCode) {
      setGuestSearchError(
        `No shipment record found for "${searchedOrderCode}". Please verify your order number on your confirmation receipt.`
      );
    }
  }, [singleConvexOrder, searchedOrderCode]);

  // Auto-sync activeTrackingOrder if order param is in URL
  useEffect(() => {
    if (orderFromUrl && retailOrders.length > 0) {
      const match = retailOrders.find(
        (o: any) =>
          o.orderNumber?.toLowerCase() === orderFromUrl.toLowerCase() ||
          o.trackingNumber?.toLowerCase() === orderFromUrl.toLowerCase()
      );
      if (match) {
        setActiveTrackingOrder(match);
      }
    }
  }, [orderFromUrl, retailOrders]);

  const filteredOrders = useMemo(() => {
    let list = retailOrders;
    const q = orderSearchInput.trim().toLowerCase();
    if (q) {
      list = list.filter((ord: any) => {
        const numMatch = ord.orderNumber?.toLowerCase().includes(q);
        const trackMatch = ord.trackingNumber?.toLowerCase().includes(q);
        const itemMatch = ord.items?.some((it: any) => it.title?.toLowerCase().includes(q));
        return numMatch || trackMatch || itemMatch;
      });
    }

    if (orderFilterTab === 'to_ship') {
      list = list.filter((ord: any) => {
        const s = (ord.status || '').toLowerCase();
        return s.includes('confirmed') || s.includes('processing') || s.includes('packed');
      });
    } else if (orderFilterTab === 'in_transit') {
      list = list.filter((ord: any) => {
        const s = (ord.status || '').toLowerCase();
        return s.includes('transit') || s.includes('customs') || s.includes('shipped') || s.includes('air') || s.includes('out for delivery');
      });
    } else if (orderFilterTab === 'delivered') {
      list = list.filter((ord: any) => (ord.status || '').toLowerCase().includes('delivered'));
    }

    return list;
  }, [retailOrders, orderSearchInput, orderFilterTab]);

  const allCount = retailOrders.length;
  const toShipCount = retailOrders.filter((ord: any) => {
    const s = (ord.status || '').toLowerCase();
    return s.includes('confirmed') || s.includes('processing') || s.includes('packed');
  }).length;
  const inTransitCount = retailOrders.filter((ord: any) => {
    const s = (ord.status || '').toLowerCase();
    return s.includes('transit') || s.includes('customs') || s.includes('shipped') || s.includes('air') || s.includes('out for delivery');
  }).length;
  const retailDeliveredCount = retailOrders.filter((ord: any) => (ord.status || '').toLowerCase().includes('delivered')).length;

  // Tracking search input
  const [trackingSearch, setTrackingSearch] = useState(orderFromUrl);
  const [selectedOrder, setSelectedOrder] = useState<any>(
    activeOrder || orders[0] || null
  );

  // Auto-sync selected order from URL or active list
  useEffect(() => {
    if (orderFromUrl && displayOrders.length > 0) {
      const match = displayOrders.find(
        (o) =>
          o.orderNumber.toLowerCase() === orderFromUrl.toLowerCase() ||
          o.trackingNumber.toLowerCase() === orderFromUrl.toLowerCase()
      );
      if (match) {
        setSelectedOrder(match);
        return;
      }
    }
    if (!selectedOrder && displayOrders.length > 0) {
      setSelectedOrder(displayOrders[0]);
    } else if (selectedOrder && displayOrders.length > 0) {
      const updated = displayOrders.find((o: any) => o.orderNumber === selectedOrder.orderNumber);
      if (
        updated &&
        (updated.status !== selectedOrder.status ||
          (updated as any).paymentStatus !== (selectedOrder as any).paymentStatus)
      ) {
        setSelectedOrder({ ...updated, id: updated._id || updated.id });
      }
    }
  }, [orderFromUrl, displayOrders, selectedOrder]);

  // Address Modal State (AliExpress format)
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<QatarAddress>({
    country: 'Qatar',
    firstName: '',
    lastName: '',
    email: userEmail || '',
    phoneCountryCode: '974',
    phoneNumber: '',
    streetAddress: '',
    apartmentSuite: '',
    municipality: '',
    zoneNumber: '',
    postalCode: '',
    isDefault: false,
  });

  const dashboardCountryConfig =
    SUPPORTED_COUNTRIES.find((c) => c.name === newAddress.country) ||
    SUPPORTED_COUNTRIES.find((c) => c.code === newAddress.country) ||
    SUPPORTED_COUNTRIES[0];

  // Custom Dropdown Open States in Dashboard Modal
  const [dashboardCountryOpen, setDashboardCountryOpen] = useState(false);
  const [dashboardMunicipalityOpen, setDashboardMunicipalityOpen] = useState(false);
  const [dashboardZoneOpen, setDashboardZoneOpen] = useState(false);

  const dashboardCountryRef = React.useRef<HTMLDivElement>(null);
  const dashboardMunicipalityRef = React.useRef<HTMLDivElement>(null);
  const dashboardZoneRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dashboardCountryRef.current && !dashboardCountryRef.current.contains(target)) {
        setDashboardCountryOpen(false);
      }
      if (dashboardMunicipalityRef.current && !dashboardMunicipalityRef.current.contains(target)) {
        setDashboardMunicipalityOpen(false);
      }
      if (dashboardZoneRef.current && !dashboardZoneRef.current.contains(target)) {
        setDashboardZoneOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDashboardCountryChange = (countryName: string) => {
    const found = SUPPORTED_COUNTRIES.find((c) => c.name === countryName) || SUPPORTED_COUNTRIES[0];

    setNewAddress((prev) => ({
      ...prev,
      country: found.name,
      phoneCountryCode: found.phoneCode,
      postalCode: '', // Postal code stays empty so user types their own!
      municipality: '',
      zoneNumber: '',
    }));
  };

  // Support / Return Claim Form State
  const [returnForm, setReturnForm] = useState({
    orderNumber: '',
    reason: 'Where is my package?',
    comments: '',
  });
  const [supportFile, setSupportFile] = useState<File | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingSearch.trim()) return;

    const term = trackingSearch.trim().toLowerCase();
    const found = displayOrders.find(
      (o) =>
        o.trackingNumber.toLowerCase() === term ||
        o.orderNumber.toLowerCase() === term
    );

    if (found) {
      setSelectedOrder(found);
      showToast('Shipment Located! 📦', `Tracking ref: ${found.trackingNumber}`);
    } else {
      showToast('Shipment Not Found', 'Check tracking code or try your Order Ref', 'warning');
    }
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newAddress.firstName?.trim() ||
      !newAddress.lastName?.trim() ||
      !newAddress.phoneNumber?.trim() ||
      !newAddress.streetAddress?.trim() ||
      !newAddress.municipality?.trim() ||
      !newAddress.zoneNumber?.trim()
    ) {
      showToast('Incomplete Fields', 'Please complete required shipping details (Name, Phone, Street, City & Zone).', 'warning');
      return;
    }
    if (!newAddress.email?.trim() || !newAddress.email.includes('@') || !newAddress.email.includes('.')) {
      showToast('Valid Email Required', 'Please provide a valid email address.', 'warning');
      return;
    }
    const resolvedFullName = `${newAddress.firstName.trim()} ${newAddress.lastName.trim()}`;
    const resolvedPhone = `+${(newAddress.phoneCountryCode || dashboardCountryConfig.phoneCode).trim()} ${newAddress.phoneNumber.trim()}`;
    addAddress({
      ...newAddress,
      country: newAddress.country || dashboardCountryConfig.name,
      fullName: resolvedFullName,
      phone: resolvedPhone,
      email: newAddress.email.trim(),
      streetNumber: newAddress.streetAddress,
      buildingNumber: newAddress.apartmentSuite || '',
      postalCode: newAddress.postalCode?.trim() || dashboardCountryConfig.defaultPostalCode,
    });
    setIsAddAddressOpen(false);
    setNewAddress({
      country: 'Qatar',
      firstName: '',
      lastName: '',
      email: userEmail || '',
      phoneCountryCode: '974',
      phoneNumber: '',
      streetAddress: '',
      apartmentSuite: '',
      municipality: '',
      zoneNumber: '',
      postalCode: '',
      isDefault: false,
    });
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Support Request Submitted! 📨', 'Our Qatar customer care desk will contact you via WhatsApp / Email shortly.');
    setReturnForm({
      orderNumber: retailOrders[0]?.orderNumber || '',
      reason: 'Where is my package?',
      comments: '',
    });
    setSupportFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // =============================================================================
  // 1. HIGH-TRUST CONSUMER RETAIL STOREFRONT (AMAZON / ALIEXPRESS / DARAZ STYLE)
  // Strict Retail Aesthetics: Pure White Cards, #F5F6F8 Canvas, #FFB800 Brand Accent
  // =============================================================================
  const renderStatusBadge = (statusStr: string) => {
    const s = (statusStr || 'Order Confirmed').toLowerCase();
    if (s.includes('transit') || s.includes('air') || s.includes('customs')) {
      return (
        <span className={styles.statusBadgeTransit}>
          <Plane size={11} strokeWidth={2.4} />
          <span>{statusStr}</span>
        </span>
      );
    }
    if (s.includes('delivered')) {
      return (
        <span className={styles.statusBadgeDelivered}>
          <CheckCircle2 size={11} strokeWidth={2.4} />
          <span>Delivered</span>
        </span>
      );
    }
    // Default & Order Confirmed (Small badge with shield check icon)
    return (
      <span className={styles.statusBadgeConfirmed}>
        <ShieldCheck size={11} strokeWidth={2.4} />
        <span>Order Confirmed</span>
      </span>
    );
  };

  if (role === 'customer') {
    return (
      <div className={styles.retailPage}>
        <div className={styles.retailContainer}>
          {/* Breadcrumb Navigation */}
          <nav className={styles.retailBreadcrumbs} aria-label="Breadcrumb">
            <Link href="/" className={styles.crumbLink}>Home</Link>
            <span className={styles.crumbDivider}>/</span>
            <Link href="/dashboard" className={styles.crumbLink}>Your Account</Link>
            <span className={styles.crumbDivider}>/</span>
            <span className={styles.crumbActive}>
              {customerTab === 'orders' ? 'My Orders' : 'Help & Support'}
            </span>
          </nav>

          {/* Top Account Profile & Sub-Nav Card (Screenshot 2) */}
          <div className={styles.retailAccountCard}>
            <div className={styles.profileTopRow}>
              <div className={styles.profileUserGroup}>
                <div className={styles.profileAvatar}>
                  {viewer
                    ? (viewer.name ? viewer.name.slice(0, 2).toUpperCase() : viewer.email.slice(0, 2).toUpperCase())
                    : 'QG'}
                </div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>
                    {viewer ? (viewer.name || viewer.email.split('@')[0]) : 'Qatar Guest'}
                  </span>
                  <span className={styles.profileLocation}>
                    {viewer ? viewer.email : 'Guest Session • Doha, Qatar'}
                  </span>
                </div>
              </div>

              <div>
                {viewer ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{viewer.email}</span>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className={styles.authBtn}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login?redirect=/dashboard"
                    className={styles.authBtn}
                  >
                    Sign In / Register
                  </Link>
                )}
              </div>
            </div>

            <div className={styles.subNavBar}>
              {viewer ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerTab('orders');
                      setActiveTrackingOrder(null);
                    }}
                    className={`${styles.subNavItem} ${customerTab === 'orders' && !activeTrackingOrder ? styles.activeSubNav : ''}`}
                  >
                    <Package size={16} />
                    <span>My Orders</span>
                    <span className={styles.subNavCountBadge}>{retailOrders.length}</span>
                  </button>

                  {retailOrders.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerTab('orders');
                        setActiveTrackingOrder(retailOrders[0] || null);
                      }}
                      className={`${styles.subNavItem} ${activeTrackingOrder ? styles.activeSubNav : ''}`}
                    >
                      <Truck size={16} />
                      <span>Track Latest Package</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCustomerTab('orders');
                  }}
                  className={`${styles.subNavItem} ${customerTab === 'orders' ? styles.activeSubNav : ''}`}
                >
                  <Truck size={16} />
                  <span>Track Package</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setCustomerTab('support');
                  setActiveTrackingOrder(null);
                }}
                className={`${styles.subNavItem} ${customerTab === 'support' ? styles.activeSubNav : ''}`}
              >
                <HelpCircle size={16} />
                <span>Help &amp; Support</span>
              </button>
            </div>
          </div>

          {/* TAB 1: MY ORDERS & TRACKING */}
          {customerTab === 'orders' && (
            viewer ? (
              /* ============================================================= */
              /* REGISTERED CUSTOMER VIEW: FULL ORDER HISTORY & ACTIVE TRACKER  */
              /* ============================================================= */
              activeTrackingOrder ? (
                /* VIEW A — PACKAGE TRACKING DETAIL VIEW FOR REGISTERED USER */
                <TrackingTimeline
                  order={activeTrackingOrder}
                  onBackToOrders={() => setActiveTrackingOrder(null)}
                  onViewInvoice={() => {
                    setInvoiceModalOrder(activeTrackingOrder);
                    setIsInvoiceModalOpen(true);
                  }}
                />
              ) : (
                /* VIEW B — FULL MY ORDERS LIST */
                <div>
                  {/* Search Orders Bar */}
                  <div className={styles.searchRow}>
                    <div className={styles.searchInputWrapper}>
                      <Search size={16} className={styles.searchIcon} />
                      <input
                        type="text"
                        placeholder="Search by Order ID or product name..."
                        value={orderSearchInput}
                        onChange={(e) => setOrderSearchInput(e.target.value)}
                        className={styles.searchInput}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {}}
                      className={styles.searchBtn}
                    >
                      Search Orders
                    </button>
                  </div>

                  {/* Filter Tabs */}
                  <div className={styles.filterTabsBar}>
                    <button
                      type="button"
                      onClick={() => setOrderFilterTab('all')}
                      className={`${styles.filterTabBtn} ${orderFilterTab === 'all' ? styles.activeFilterTab : ''}`}
                    >
                      All Orders ({allCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderFilterTab('to_ship')}
                      className={`${styles.filterTabBtn} ${orderFilterTab === 'to_ship' ? styles.activeFilterTab : ''}`}
                    >
                      To Ship ({toShipCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderFilterTab('in_transit')}
                      className={`${styles.filterTabBtn} ${orderFilterTab === 'in_transit' ? styles.activeFilterTab : ''}`}
                    >
                      In Transit ({inTransitCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderFilterTab('delivered')}
                      className={`${styles.filterTabBtn} ${orderFilterTab === 'delivered' ? styles.activeFilterTab : ''}`}
                    >
                      Delivered ({retailDeliveredCount})
                    </button>
                  </div>

                  {/* Orders Cards List */}
                  {filteredOrders.length === 0 ? (
                    <div className={styles.emptyOrdersCard}>
                      <Package size={44} color="#9ca3af" style={{ margin: '0 auto 12px auto' }} />
                      <h3 className={styles.emptyTitle}>
                        {orderSearchInput ? 'No matching orders found' : 'No Orders Yet'}
                      </h3>
                      <p className={styles.emptySubtitle}>
                        {orderSearchInput
                          ? `We couldn't find any orders matching "${orderSearchInput}". Try another search term or clear the filter.`
                          : `You haven't placed any orders yet with your account (${viewer.email}). Start shopping our authentic tech gadgets & accessories in Qatar!`}
                      </p>
                      {orderSearchInput ? (
                        <button
                          type="button"
                          onClick={() => {
                            setOrderSearchInput('');
                            setOrderFilterTab('all');
                          }}
                          className={styles.clearFilterBtn}
                        >
                          View All Orders
                        </button>
                      ) : (
                        <Link
                          href="/shop"
                          className={styles.clearFilterBtn}
                          style={{ textDecoration: 'none', display: 'inline-block' }}
                        >
                          Start Shopping →
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className={styles.orderCardList}>
                      {filteredOrders.map((ord: any) => {
                        const firstItem = ord.items?.[0] || {};
                        const itemTitle = firstItem.title || 'Qatify Tech Item';
                        const itemQty = firstItem.quantity || 1;
                        const itemUnitPrice = firstItem.priceQAR || 0;
                        const itemImage = firstItem.image || '/placeholder.svg';
                        const itemSlug = firstItem.slug || '';

                        return (
                          <div key={ord.id || ord.orderNumber} className={styles.retailOrderCard}>
                            {/* Card Header Bar */}
                            <div className={styles.cardHeaderBar}>
                              <div className={styles.cardHeaderLeft}>
                                <div className={styles.metaCol}>
                                  <span className={styles.metaLabel}>ORDER PLACED</span>
                                  <span className={styles.metaVal}>{ord.date}</span>
                                </div>
                                <div className={styles.metaCol}>
                                  <span className={styles.metaLabel}>TOTAL</span>
                                  <span className={styles.metaValBold}>
                                    QAR {Number(ord.totalQAR || 0).toFixed(2)}
                                  </span>
                                </div>
                                <div className={styles.metaCol}>
                                  <span className={styles.metaLabel}>SHIP TO</span>
                                  <span className={styles.metaVal}>
                                    {ord.address?.municipality || 'Doha, Qatar'}
                                  </span>
                                </div>
                              </div>

                              <div className={styles.cardHeaderRight}>
                                <span className={styles.orderNumText}>
                                  <strong>{ord.orderNumber}</strong>
                                </span>
                                {renderStatusBadge(ord.status)}
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className={styles.cardBodyBar}>
                              <div className={styles.bodyProductLeft}>
                                <div className={styles.productThumbBox}>
                                  <img
                                    src={itemImage}
                                    alt={itemTitle}
                                    className={styles.productThumbImg}
                                    onError={(e) => {
                                      const target = e.currentTarget;
                                      if (!target.src.endsWith('/placeholder.svg')) {
                                        target.src = '/placeholder.svg';
                                      }
                                    }}
                                  />
                                </div>

                                <div className={styles.productInfoCol}>
                                  <div className={styles.arrivalDateHeading}>
                                    {ord.estimatedDeliveryWindow}
                                  </div>
                                  <Link
                                    href={itemSlug ? `/products/${itemSlug}` : '/shop'}
                                    className={styles.productTitleLink}
                                    title={itemTitle}
                                  >
                                    {itemTitle}
                                  </Link>
                                  <div className={styles.productSubMeta}>
                                    Qty: {itemQty} • Unit Price: QAR {itemUnitPrice}.00 • Tracking: {ord.trackingNumber}
                                  </div>
                                </div>
                              </div>

                              {/* Action Button: Track Package */}
                              <div className={styles.bodyButtonStack}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTrackingOrder(ord);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className={styles.trackPkgBtn}
                                >
                                  Track Package
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )
            ) : (
              /* ============================================================= */
              /* GUEST VISITOR VIEW: SEARCH ONLY SPECIFIC TRACKED ORDER         */
              /* ============================================================= */
              activeTrackingOrder ? (
                <div>
                  <div className={styles.guestTrackingTopBanner}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTrackingOrder(null);
                        setSearchedOrderCode('');
                      }}
                      className={styles.guestBackSearchBtn}
                    >
                      ← Track Another Package
                    </button>
                    <span>
                      Viewing package details as Guest. Want all your orders saved in one place?{' '}
                      <Link href="/login?redirect=/dashboard">Sign In</Link> or{' '}
                      <Link href="/register?redirect=/dashboard">Create Account</Link>.
                    </span>
                  </div>

                  <TrackingTimeline
                    order={activeTrackingOrder}
                    onBackToOrders={() => {
                      setActiveTrackingOrder(null);
                      setSearchedOrderCode('');
                    }}
                    onViewInvoice={() => {
                      setInvoiceModalOrder(activeTrackingOrder);
                      setIsInvoiceModalOpen(true);
                    }}
                  />
                </div>
              ) : (
                <div className={styles.guestTrackingPortal}>
                  {/* Guest Order Search Card */}
                  <div className={styles.guestSearchCard}>
                    <div className={styles.guestSearchHeader}>
                      <div className={styles.guestSearchIconBox}>
                        <Package size={22} color="#18181b" />
                      </div>
                      <div>
                        <h2 className={styles.guestSearchTitle}>Direct Air Express Package Tracking</h2>
                        <p className={styles.guestSearchSubtitle}>
                          Enter your Order Number (e.g. QA-89421) or Tracking Code to track your shipment checkpoints to Qatar.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleGuestTrackSearch} className={styles.guestSearchForm}>
                      <div className={styles.guestInputWrapper}>
                        <Search size={18} className={styles.guestInputIcon} />
                        <input
                          type="text"
                          placeholder="Enter Order or Tracking Number..."
                          value={guestInputVal}
                          onChange={(e) => {
                            setGuestInputVal(e.target.value);
                            setGuestSearchError('');
                          }}
                          className={styles.guestSearchInput}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isGuestSearching}
                        className={styles.guestSubmitBtn}
                      >
                        {isGuestSearching ? 'Searching...' : 'Track Package'}
                      </button>
                    </form>

                    {guestSearchError && (
                      <div className={styles.guestErrorBanner}>
                        <AlertCircle size={16} />
                        <span>{guestSearchError}</span>
                      </div>
                    )}

                    {lastOrderNum && (
                      <div className={styles.guestRecentOrderHint}>
                        <span>Recently Placed Order:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setGuestInputVal(lastOrderNum);
                            setSearchedOrderCode(lastOrderNum);
                          }}
                          className={styles.guestRecentOrderBtn}
                        >
                          Track {lastOrderNum} →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Registered Account Value Proposition Card */}
                  <div className={styles.guestAccountBenefitsCard}>
                    <div className={styles.benefitsHeader}>
                      <h3>Complete Order History is Exclusive to Registered Accounts</h3>
                    </div>
                    <p className={styles.benefitsSub}>
                      Create a free Qatify account or sign in to access your complete personal orders dashboard:
                    </p>
                    <div className={styles.benefitsGrid}>
                      <div className={styles.benefitItem}>
                        <CheckCircle2 size={15} color="#18181b" />
                        <span><strong>Full Order Archive:</strong> Save and track all your past &amp; ongoing purchases in one place.</span>
                      </div>
                      <div className={styles.benefitItem}>
                        <CheckCircle2 size={15} color="#18181b" />
                        <span><strong>Express 1-Click Checkout:</strong> Save delivery addresses across Doha, Lusail &amp; Al Rayyan.</span>
                      </div>
                      <div className={styles.benefitItem}>
                        <CheckCircle2 size={15} color="#18181b" />
                        <span><strong>Official PDF Tax Invoices:</strong> Instantly view and download detailed invoices anytime.</span>
                      </div>
                      <div className={styles.benefitItem}>
                        <CheckCircle2 size={15} color="#18181b" />
                        <span><strong>VIP Bundle Discounts:</strong> Earn exclusive loyalty perks, cash rewards &amp; promo codes.</span>
                      </div>
                    </div>
                    <div className={styles.benefitsCtaRow}>
                      <Link href="/register?redirect=/dashboard" className={styles.benefitRegisterBtn}>
                        Create Account / Register
                      </Link>
                      <Link href="/login?redirect=/dashboard" className={styles.benefitLoginBtn}>
                        Sign In to Your Account
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )
          )}

          {/* TAB 2: HELP & SUPPORT */}
          {customerTab === 'support' && (
            <div className={styles.helpCenterContainer}>
              <div className={styles.helpCenterGrid}>
                {/* LEFT COLUMN (62%): Clean Order Support Form */}
                <div className={styles.helpFormCard}>
                  <div className={styles.helpCardHeader}>
                    <h2 className={styles.helpCardTitle}>Submit a Support Request</h2>
                    <p className={styles.helpCardDesc}>
                      Have an inquiry regarding delivery, item condition, or returns? Fill out the details below and our Doha customer care team will assist you.
                    </p>
                  </div>

                  <form onSubmit={handleReturnSubmit} className={styles.supportForm}>
                    {/* Order Number / Reference */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Order Number / Reference <span className={styles.requiredStar}>*</span>
                      </label>
                      <select
                        className={styles.formSelect}
                        value={returnForm.orderNumber || (retailOrders[0]?.orderNumber ?? '')}
                        onChange={(e) =>
                          setReturnForm({ ...returnForm, orderNumber: e.target.value })
                        }
                        required
                      >
                        {retailOrders.map((ord: any) => (
                          <option key={ord.id} value={ord.orderNumber}>
                            {ord.orderNumber} — {ord.items[0]?.name ? ord.items[0].name.slice(0, 36) + '...' : 'Air Shipment'}
                          </option>
                        ))}
                        <option value="GENERAL">Other / General Order Inquiry</option>
                      </select>
                    </div>

                    {/* Issue Type */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Issue Type <span className={styles.requiredStar}>*</span>
                      </label>
                      <select
                        className={styles.formSelect}
                        value={returnForm.reason}
                        onChange={(e) =>
                          setReturnForm({ ...returnForm, reason: e.target.value })
                        }
                        required
                      >
                        <option value="Where is my package?">Where is my package?</option>
                        <option value="Damaged or defective item">Damaged or defective item</option>
                        <option value="Missing item or quantity">Missing item or quantity</option>
                        <option value="Return or refund request">Return or refund request</option>
                        <option value="Other inquiry">Other inquiry</option>
                      </select>
                    </div>

                    {/* Message / Details */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Message / Details <span className={styles.requiredStar}>*</span>
                      </label>
                      <textarea
                        rows={4}
                        className={styles.formTextarea}
                        value={returnForm.comments}
                        onChange={(e) =>
                          setReturnForm({ ...returnForm, comments: e.target.value })
                        }
                        placeholder="Describe any issues observed or how we can help..."
                        required
                      />
                    </div>

                    {/* Attachment Option */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Attachment (Optional)
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSupportFile(e.target.files[0]);
                          }
                        }}
                      />
                      {!supportFile ? (
                        <div
                          className={styles.uploadDropzone}
                          onClick={() => fileInputRef.current?.click()}
                          role="button"
                          tabIndex={0}
                        >
                          <UploadCloud size={24} className={styles.uploadIcon} />
                          <div className={styles.uploadTextWrap}>
                            <span className={styles.uploadMainText}>
                              Attach photo or receipt (optional — JPG, PNG up to 5MB)
                            </span>
                            <span className={styles.uploadSubText}>
                              Click to browse or drag file here
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.filePreviewRow}>
                          <div className={styles.fileInfo}>
                            <FileText size={18} className={styles.fileIcon} />
                            <span className={styles.fileName}>{supportFile.name}</span>
                            <span className={styles.fileSize}>
                              ({(supportFile.size / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            className={styles.fileRemoveBtn}
                            onClick={() => {
                              setSupportFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className={styles.formSubmitRow}>
                      <button type="submit" className={styles.submitSupportBtn}>
                        Submit Support Request
                      </button>
                    </div>
                  </form>
                </div>

                {/* RIGHT COLUMN (38%): Direct Contact Channels & Quick Help */}
                <div className={styles.helpSidebarColumn}>
                  {/* Card 1 — Direct Customer Care */}
                  <div className={styles.helpContactCard}>
                    <div className={styles.contactCardHeader}>
                      <div className={styles.contactTitleWrap}>
                        <h3 className={styles.contactCardTitle}>Direct Customer Care</h3>
                        <span className={styles.onlineBadge}>
                          <span className={styles.onlineDot} />
                          Active Now
                        </span>
                      </div>
                      <p className={styles.contactCardSubtitle}>
                        Direct one-on-one assistance for Doha &amp; Qatar orders.
                      </p>
                    </div>

                    <div className={styles.contactChannelsList}>
                      {/* WhatsApp Channel */}
                      <div className={styles.contactChannelItem}>
                        <div className={styles.channelMeta}>
                          <div className={styles.channelIconBoxWhatsApp}>
                            <Phone size={18} />
                          </div>
                          <div className={styles.channelDetails}>
                            <div className={styles.channelLabel}>WhatsApp Support</div>
                            <div className={styles.channelContactValue}>01304564836</div>
                            <div className={styles.channelTiming}>Fastest reply (10 AM – 10 PM)</div>
                          </div>
                        </div>
                        <a
                          href="https://wa.me/8801304564836?text=Hi%20Qatify%2C%20I%20need%20assistance%20with%20my%20order"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.channelWhatsAppBtn}
                        >
                          Chat on WhatsApp →
                        </a>
                      </div>

                      <div className={styles.channelDivider} />

                      {/* Email Channel */}
                      <div className={styles.contactChannelItem}>
                        <div className={styles.channelMeta}>
                          <div className={styles.channelIconBoxEmail}>
                            <Mail size={18} />
                          </div>
                          <div className={styles.channelDetails}>
                            <div className={styles.channelLabel}>Email Support</div>
                            <div className={styles.channelContactValue}>support@shopqatify.com</div>
                            <div className={styles.channelTiming}>Replies within 6–12 hours</div>
                          </div>
                        </div>
                        <a
                          href="mailto:support@shopqatify.com"
                          className={styles.channelEmailBtn}
                        >
                          Send Email →
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 — Quick Self-Service FAQs */}
                  <div className={styles.helpFaqCard}>
                    <div className={styles.faqCardHeader}>
                      <h3 className={styles.faqCardTitle}>Quick Self-Service FAQs</h3>
                      <p className={styles.faqCardSubtitle}>
                        Common questions about delivery and customs in Qatar.
                      </p>
                    </div>

                    <div className={styles.faqAccordionList}>
                      {SUPPORT_FAQS.map((faq, idx) => {
                        const isOpen = openFaqIndex === idx;
                        return (
                          <div
                            key={idx}
                            className={`${styles.faqAccordionItem} ${isOpen ? styles.faqOpen : ''}`}
                          >
                            <button
                              type="button"
                              className={styles.faqQuestionBtn}
                              onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            >
                              <span>{faq.q}</span>
                              <ChevronDown
                                size={16}
                                className={`${styles.faqChevron} ${isOpen ? styles.faqChevronRotated : ''}`}
                              />
                            </button>
                            {isOpen && (
                              <div className={styles.faqAnswer}>
                                <p>{faq.a}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtle Admin Footer Switcher (unobtrusive, allows admin authorized switch) */}
          <div style={{ marginTop: '36px', textAlign: 'center', padding: '16px 0', borderTop: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={handleSwitchToAdmin}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                fontSize: '11.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <ShieldCheck size={12} />
              <span>Store Operations Portal</span>
            </button>
          </div>
        </div>

        {/* Official Qatar Order Invoice Modal */}
        <InvoiceModal
          order={invoiceModalOrder || activeTrackingOrder || retailOrders[0]}
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setInvoiceModalOrder(null);
          }}
        />

        {/* Auth / Email Sign-In Modal */}
        <AuthModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onSuccess={() => setIsEmailModalOpen(false)}
        />

        {/* Add Address Modal (AliExpress standard) */}
        {isAddAddressOpen && (
          <div
            className={styles.modalOverlay}
            onClick={() => setIsAddAddressOpen(false)}
          >
            <div
              className={styles.aliModalCard}
              style={{ maxWidth: '580px', width: '100%', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>

              <div className={styles.aliModalHeader}>
                <h3 className={styles.aliModalTitle}>Add new address</h3>
              </div>

              <form onSubmit={handleSaveNewAddress} className={styles.aliAddressForm}>
                {/* 1. Country/region */}
                <div className={styles.aliSection}>
                  <label className={styles.aliSectionTitle}>Country/region</label>
                  <div
                    ref={dashboardCountryRef}
                    className={`${styles.customSelectWrapper} ${dashboardCountryOpen ? styles.wrapperOpen : ''}`}
                    style={{ maxWidth: '320px' }}
                  >
                    <div
                      className={`${styles.aliCountrySelector} ${dashboardCountryOpen ? styles.dropdownActiveTrigger : ''}`}
                      onClick={() => {
                        setDashboardCountryOpen(!dashboardCountryOpen);
                        setDashboardMunicipalityOpen(false);
                        setDashboardZoneOpen(false);
                      }}
                    >
                      <div className={styles.selectorLeft}>
                        <CountryFlag code={dashboardCountryConfig.code} size={20} />
                        <span className={styles.selectorCountryName}>{newAddress.country}</span>
                      </div>
                      <ChevronDown size={16} className={`${styles.dropdownChevron} ${dashboardCountryOpen ? styles.chevronRotated : ''}`} />
                    </div>

                    {dashboardCountryOpen && (
                      <div className={styles.customDropdownMenu}>
                        {SUPPORTED_COUNTRIES.map((c) => {
                          const isSelected = newAddress.country === c.name || newAddress.country === c.code;
                          return (
                            <div
                              key={c.code}
                              className={`${styles.customDropdownItem} ${isSelected ? styles.itemSelected : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDashboardCountryChange(c.name);
                                setDashboardCountryOpen(false);
                              }}
                            >
                              <div className={styles.itemLeft}>
                                <CountryFlag code={c.code} size={20} />
                                <span className={styles.aliCountryCodeBadge}>{c.code}</span>
                                <span className={styles.itemTitle}>{c.name}</span>
                              </div>
                              <div className={styles.itemRight}>
                                <span className={styles.itemPhoneCode}>+{c.phoneCode}</span>
                                {isSelected && <Check size={16} className={styles.itemCheckIcon} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Contact information */}
                <div className={styles.aliSection}>
                  <label className={styles.aliSectionTitle}>Contact information</label>
                  <div className={styles.aliContactGrid}>
                    <div className={styles.aliContactRow}>
                      <div className={styles.aliInputCol}>
                        <input
                          type="text"
                          required
                          value={newAddress.firstName}
                          onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                          placeholder="First name"
                          className={styles.aliTextInput}
                        />
                      </div>
                      <div className={styles.aliInputCol}>
                        <input
                          type="text"
                          required
                          value={newAddress.lastName}
                          onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                          placeholder="Last name"
                          className={styles.aliTextInput}
                        />
                      </div>
                    </div>

                    <div className={styles.aliContactRow}>
                      <div className={styles.aliInputCol}>
                        <input
                          type="email"
                          required
                          value={newAddress.email || ''}
                          onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                          placeholder="Email address"
                          className={styles.aliTextInput}
                        />
                      </div>
                      <div className={styles.aliInputCol}>
                        <div className={styles.aliPhoneInputWrap}>
                          <span className={styles.aliPhonePrefix}>+{dashboardCountryConfig.phoneCode}</span>
                          <input
                            type="tel"
                            required
                            value={newAddress.phoneNumber}
                            onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                            placeholder="Mobile phone number"
                            className={styles.aliPhoneInput}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Address details */}
                <div className={styles.aliSection}>
                  <label className={styles.aliSectionTitle}>Address</label>
                  <div className={styles.aliAddressFields}>
                    <input
                      type="text"
                      required
                      value={newAddress.streetAddress}
                      onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                      placeholder="Street, house/apartment/unit"
                      className={styles.aliTextInput}
                    />

                    <div className={styles.aliContactRow}>
                      <div className={styles.aliInputCol}>
                        <input
                          type="text"
                          value={newAddress.apartmentSuite}
                          onChange={(e) => setNewAddress({ ...newAddress, apartmentSuite: e.target.value })}
                          placeholder="Apt, suite, unit (optional)"
                          className={styles.aliTextInput}
                        />
                      </div>
                      <div className={styles.aliInputCol}>
                        <input
                          type="text"
                          value={newAddress.zoneNumber}
                          onChange={(e) => setNewAddress({ ...newAddress, zoneNumber: e.target.value })}
                          placeholder="Zone number (e.g. Zone 24)"
                          className={styles.aliTextInput}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkbox Default Address */}
                <label className={styles.aliCheckboxLabel}>
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className={styles.aliCheckbox}
                  />
                  <span>Set as default shipping address</span>
                </label>

                {/* Submit button */}
                <div className={styles.aliFormActions}>
                  <button type="submit" className={styles.aliSaveBtn}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddAddressOpen(false)}
                    className={styles.aliCancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admin Key Modal */}
        {isAdminKeyModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsAdminKeyModalOpen(false)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <h3 className={styles.modalTitle}>Authenticate Store Operations</h3>
              <p className={styles.modalSub}>
                Enter the master admin key to access Qatify Dropship operations.
              </p>
              <form onSubmit={handleUnlockWithAdminKey} style={{ marginTop: '16px' }}>
                <input
                  type="password"
                  placeholder="Master Admin Secret Key..."
                  value={adminKeyInput}
                  onChange={(e) => setAdminKeyInput(e.target.value)}
                  className={styles.emailInput}
                />
                {adminKeyError && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>
                    {adminKeyError}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button type="submit" className={styles.saveEmailBtn}>
                    Verify &amp; Enter
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdminKeyModalOpen(false)}
                    className={styles.cancelModalBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.adminOpsShell}>
      {/* 1. TOP STICKY HEADER (#131921) */}
      <header className={styles.opsHeader}>
        <div className={styles.opsHeaderLeft}>
          <button
            type="button"
            onClick={() => setIsOpsSidebarOpen((prev) => !prev)}
            className={styles.opsHamburgerBtn}
            title="Toggle Sidebar Menu"
            aria-label="Toggle Sidebar Menu"
          >
            <Menu size={18} />
          </button>

          <button
            type="button"
            onClick={() => setOpsAdminTab('all')}
            className={styles.opsLogoWrap}
          >
            <div className={styles.opsLogoBadge}>Q</div>
            <span className={styles.opsLogoText}>Qatify Seller &amp; Ops Central</span>
          </button>

          <div className={styles.opsHubPill}>
            <span className={styles.pulseDotGreen} />
            <span>HUB: DOH-EXP-01</span>
          </div>
        </div>

        {/* Global Search Bar (⌘K) */}
        <div className={styles.opsHeaderCenter}>
          <Search size={14} className={styles.opsSearchIcon} />
          <input
            ref={opsSearchInputRef}
            type="text"
            placeholder="Search Order ID (QA...), Customer, AWB..."
            value={opsSearch}
            onChange={(e) => setOpsSearch(e.target.value)}
            className={styles.opsGlobalSearchInput}
          />
          <kbd className={styles.opsSearchKbd}>⌘K</kbd>
        </div>

        {/* Right Navigation Controls */}
        <div className={styles.opsHeaderRight}>
          <Link
            href="/email-preview"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.opsTelegramBtn}
            style={{ background: '#0F172A', color: '#FFFFFF', borderColor: '#334155' }}
            title="Open Order Confirmation Email Preview"
          >
            <Mail size={13} />
            <span>Email Preview</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpsAdminTab('telegram')}
            className={styles.opsTelegramBtn}
            title="Open Telegram Live Alert Dispatcher"
          >
            <Send size={13} />
            <span>Telegram Live</span>
          </button>

          {/* Mode Switcher Toggle */}
          <div className={styles.opsModeToggle}>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.opsModeBtn}
              title="Open Customer Storefront in New Tab"
            >
              Customer View ↗
            </Link>
            <button
              type="button"
              className={`${styles.opsModeBtn} ${styles.active}`}
            >
              Admin Ops
            </button>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: FIXED 220PX DARK SIDEBAR + CLEAN WORKSPACE */}
      <div className={styles.opsBody}>
        {/* Fixed 220px Dark Left Sidebar */}
        <aside className={`${styles.opsSidebar} ${!isOpsSidebarOpen ? styles.collapsed : ''}`}>
          <div className={styles.opsSidebarNav}>
            <button
              type="button"
              onClick={() => {
                setOpsAdminTab('all');
                if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsOpsSidebarOpen(false);
              }}
              className={`${styles.opsNavItem} ${opsAdminTab === 'all' ? styles.active : ''}`}
            >
              <SlidersHorizontal size={15} />
              <span>All Operations</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpsAdminTab('pipeline');
                if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsOpsSidebarOpen(false);
              }}
              className={`${styles.opsNavItem} ${opsAdminTab === 'pipeline' ? styles.active : ''}`}
            >
              <Truck size={15} />
              <span>Fulfillment Pipeline</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpsAdminTab('orders');
                if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsOpsSidebarOpen(false);
              }}
              className={`${styles.opsNavItem} ${opsAdminTab === 'orders' ? styles.active : ''}`}
            >
              <FileText size={15} />
              <span>Recent Orders (Qatar)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpsAdminTab('live_feed');
                if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsOpsSidebarOpen(false);
              }}
              className={`${styles.opsNavItem} ${opsAdminTab === 'live_feed' ? styles.active : ''}`}
            >
              <Terminal size={15} />
              <span>Live Action Feed</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpsAdminTab('analytics');
                if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsOpsSidebarOpen(false);
              }}
              className={`${styles.opsNavItem} ${opsAdminTab === 'analytics' ? styles.active : ''}`}
            >
              <BarChart3 size={15} />
              <span>Store Analytics &amp; KPI</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpsAdminTab('telegram');
                if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsOpsSidebarOpen(false);
              }}
              className={`${styles.opsNavItem} ${opsAdminTab === 'telegram' ? styles.active : ''}`}
            >
              <Send size={15} />
              <span>Telegram Order Alerts</span>
            </button>
          </div>

          <div className={styles.opsSidebarBottom}>
            <span className={styles.opsAirExpressTag}>✈️ Qatar Direct Air Express</span>
            <span className={styles.opsHubCodeText}>Hub: DOH-EXP-01</span>
            <div className={styles.opsOperatorSession}>
              <span>{userEmail ? userEmail.split('@')[0] : 'ops-admin'}</span>
              <button
                type="button"
                onClick={() => setRole('customer')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '11px',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Exit Ops
              </button>
            </div>
          </div>
        </aside>

        {isOpsSidebarOpen && (
          <div
            className={styles.opsSidebarBackdrop}
            onClick={() => setIsOpsSidebarOpen(false)}
            aria-label="Close Sidebar"
          />
        )}

        {/* Main Workspace */}
        <main className={styles.opsMainWorkspace}>
          {/* Subheader Bar */}
          <div className={styles.opsSubHeader}>
            <div className={styles.opsSubHeaderTitleWrap}>
              <div className={styles.opsTitleRow}>
                <h1 className={styles.opsMainTitle}>Cross-Border Order &amp; Logistics Console</h1>
                <span className={styles.liveSyncPill}>
                  <span className={styles.pulseDotGreen} />
                  <span>Live Sync</span>
                </span>
              </div>
              <p className={styles.opsSubTitleDesc}>
                Manage supplier dispatch, AliExpress/Cainiao AWB linking, and Qatar customs clearance.
              </p>
            </div>

            <div className={styles.opsSubHeaderActions}>
              <button
                type="button"
                onClick={handleExportManifest}
                className={styles.btnExportCsv}
              >
                <Download size={13} />
                <span>Export Manifest CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setIsManualOrderModalOpen(true)}
                className={styles.btnNewOrder}
              >
                <Plus size={14} />
                <span>+ New Manual Order</span>
              </button>
            </div>
          </div>

          {/* 3. KPI HEADER STRIP (Single bordered 4-column metrics bar) */}
          {(opsAdminTab === 'all' || opsAdminTab === 'analytics') && (
            <div className={styles.kpiStrip}>
              {/* Column 1: Gross Revenue */}
              <div className={styles.kpiCell}>
                <div className={styles.kpiTopRow}>
                  <span className={styles.kpiLabel}>30-Day Gross Revenue</span>
                  <span className={styles.kpiPillGreen}>+12.4%</span>
                </div>
                <div className={styles.kpiValueRow}>
                  <span className={styles.kpiValueMain}>
                    QAR {opsKpi.grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className={styles.kpiBottomRow}>
                  {opsKpi.totalOrders} settled transactions · QAR 1,519.50 prev
                </div>
              </div>

              {/* Column 2: Net Dropship Margin */}
              <div className={styles.kpiCell}>
                <div className={styles.kpiTopRow}>
                  <span className={styles.kpiLabel}>Net Dropship Margin</span>
                  <span className={styles.kpiTarget}>TARGET ≥35%</span>
                </div>
                <div className={styles.kpiValueRow}>
                  <span className={styles.kpiValueMain}>
                    38.4%
                  </span>
                  <span className={styles.kpiValueSub}>
                    (Est. QAR {opsKpi.estMarginQAR.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                  </span>
                </div>
                <div className={styles.kpiBottomRow}>
                  After CN supplier &amp; DOH air freight cost
                </div>
              </div>

              {/* Column 3: Active Orders in Pipeline */}
              <div className={styles.kpiCell}>
                <div className={styles.kpiTopRow}>
                  <span className={styles.kpiLabel}>Active Orders in Pipeline</span>
                  <span className={styles.kpiPillAmber}>
                    {opsKpi.unlinkedCount} UNLINKED
                  </span>
                </div>
                <div className={styles.kpiValueRow}>
                  <span className={styles.kpiValueMain}>
                    {opsKpi.totalOrders} Orders
                  </span>
                  <span className={styles.kpiValueSub}>
                    Avg QAR {opsKpi.avgBasket}
                  </span>
                </div>
                <div className={styles.kpiBottomRow}>
                  Doha ({opsKpi.dohaCount}) · Lusail City ({opsKpi.lusailCount})
                </div>
              </div>

              {/* Column 4: Avg Transit */}
              <div className={styles.kpiCell}>
                <div className={styles.kpiTopRow}>
                  <span className={styles.kpiLabel}>Avg Transit (CN → DOH)</span>
                  <span className={styles.kpiSla}>SLA: 9.0D</span>
                </div>
                <div className={styles.kpiValueRow}>
                  <span className={styles.kpiValueMain}>7.4 Days</span>
                  <span className={styles.kpiOnSchedule}>On Schedule</span>
                </div>
                <div className={styles.kpiBottomRow}>
                  Hamad Intl Cargo Terminal (DOH)
                </div>
              </div>
            </div>
          )}

          {/* 4. ORDERS & OPERATIONS VIEW (Pipeline Stage Tabs + Filters + Table) */}
          {(opsAdminTab === 'all' || opsAdminTab === 'pipeline' || opsAdminTab === 'orders') && (
            <>
              {/* Horizontal Pipeline Stages Tabs */}
              <div className={styles.pipelineTabsStrip}>
                <button
                  type="button"
                  onClick={() => setOpsPipelineStage('all')}
                  className={`${styles.pipelineTabBtn} ${opsPipelineStage === 'all' ? styles.active : ''}`}
                >
                  <span>All Orders</span>
                  <span className={styles.tabCountBadge}>{crossBorderOrders.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOpsPipelineStage('pending')}
                  className={`${styles.pipelineTabBtn} ${opsPipelineStage === 'pending' ? styles.active : ''}`}
                >
                  <span>Pending Dispatch</span>
                  <span className={`${styles.tabCountBadge} ${styles.amber}`}>{pendingDispatchCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOpsPipelineStage('in_transit')}
                  className={`${styles.pipelineTabBtn} ${opsPipelineStage === 'in_transit' ? styles.active : ''}`}
                >
                  <span>In Air Transit</span>
                  <span className={`${styles.tabCountBadge} ${styles.gray}`}>{inAirTransitCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOpsPipelineStage('customs')}
                  className={`${styles.pipelineTabBtn} ${opsPipelineStage === 'customs' ? styles.active : ''}`}
                >
                  <span>Qatar Customs (DOH)</span>
                  <span className={`${styles.tabCountBadge} ${styles.blue}`}>{customsCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOpsPipelineStage('delivered')}
                  className={`${styles.pipelineTabBtn} ${opsPipelineStage === 'delivered' ? styles.active : ''}`}
                >
                  <span>Delivered</span>
                  <span className={`${styles.tabCountBadge} ${styles.gray}`}>{deliveredCount}</span>
                </button>
              </div>

              {/* Filter Row */}
              <div className={styles.filterRow}>
                <div className={styles.filterSearchBox}>
                  <Search size={13} className={styles.filterSearchIcon} />
                  <input
                    type="text"
                    placeholder="Filter Order Ref, Customer, AWB..."
                    value={opsSearch}
                    onChange={(e) => setOpsSearch(e.target.value)}
                    className={styles.filterSearchInput}
                  />
                </div>

                <select
                  value={opsZoneFilter}
                  onChange={(e) => setOpsZoneFilter(e.target.value)}
                  className={styles.filterSelectControl}
                >
                  <option value="all">All Qatar Zones ({crossBorderOrders.length})</option>
                  <option value="doha">Doha ({opsKpi.dohaCount})</option>
                  <option value="lusail">Lusail City ({opsKpi.lusailCount})</option>
                </select>

                <select
                  value={opsAwbFilter}
                  onChange={(e) => setOpsAwbFilter(e.target.value as any)}
                  className={styles.filterSelectControl}
                >
                  <option value="all">AWB Status: All</option>
                  <option value="linked">Linked ({opsKpi.linkedCount})</option>
                  <option value="unlinked">Unlinked ({opsKpi.unlinkedCount})</option>
                </select>
              </div>

              {/* High-Density Order Table */}
              <div className={styles.opsTableCard}>
                <div className={styles.opsTableWrap}>
                  <table className={styles.opsTable}>
                    <thead>
                      <tr>
                        <th style={{ width: '38px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={filteredOpsOrders.length > 0 && selectedOrderIds.length === filteredOpsOrders.length}
                            onChange={toggleSelectAll}
                            className={styles.tableCheckbox}
                            title="Select All Orders"
                          />
                        </th>
                        <th>ORDER ID &amp; DATE</th>
                        <th>CUSTOMER &amp; DELIVERY ZONE</th>
                        <th>LINE ITEM(S)</th>
                        <th>TOTAL (QAR)</th>
                        <th>LOGISTICS &amp; CARRIER AWB</th>
                        <th>FULFILLMENT STAGE</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOpsOrders.map((ord) => {
                        const isLinked = Boolean(ord.aliexpressTrackingNumber);
                        const isSelected = selectedOrderIds.includes(ord.orderNumber);
                        return (
                          <tr key={ord.id || ord.orderNumber} className={isSelected ? styles.selectedRow : ''}>
                            {/* Checkbox */}
                            <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectOrder(ord.orderNumber)}
                                className={styles.tableCheckbox}
                              />
                            </td>

                            {/* ORDER ID & DATE */}
                            <td>
                              <button
                                type="button"
                                className={styles.orderIdText}
                                onClick={() => openTrackingDrawer(ord)}
                                title="Open Live Shipment Drawer"
                              >
                                {ord.orderNumber}
                              </button>
                              <div className={styles.orderDateText}>
                                {ord.timeFormatted || ord.date}
                              </div>
                            </td>

                            {/* Customer & Delivery Zone with Bilingual Badge */}
                            <td>
                              <div className={styles.customerNameText}>{ord.customerName}</div>
                              <div className={styles.customerZoneSub}>
                                {ord.streetAddress}, {ord.zoneNumber}
                              </div>
                              <div className={styles.bilingualLocationBadge}>
                                <span>{ord.municipality}</span>
                                <span>·</span>
                                <span dir="rtl">{ord.municipalityAr}</span>
                              </div>
                              {ord.customerNote && (
                                <div style={{ fontSize: '10.5px', color: '#b45309', marginTop: '3px' }}>
                                  📝 {ord.customerNote}
                                </div>
                              )}
                            </td>

                            {/* Line Item(s) */}
                            <td>
                              <div className={styles.itemSummaryText} title={ord.itemsSummary}>
                                {ord.itemsSummary}
                              </div>
                            </td>

                            {/* Total QAR */}
                            <td>
                              <div className={styles.priceQarText}>
                                QAR {ord.totalQAR.toFixed(2)}
                              </div>
                              <div className={styles.paidSubtext}>{ord.paymentStatus}</div>
                            </td>

                            {/* Carrier Tracking AWB */}
                            <td>
                              <div className={styles.qatAirRefText}>{ord.trackingNumber}</div>
                              {isLinked ? (
                                <div className={styles.linkedAwbPill}>
                                  <span>AE: {ord.aliexpressTrackingNumber}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyAwb(ord.aliexpressTrackingNumber!, ord.trackingNumber)}
                                    className={styles.awbActionIconBtn}
                                    title="Copy AliExpress AWB Tracking Code"
                                  >
                                    {copiedAwb === ord.aliexpressTrackingNumber ? (
                                      <Check size={11} style={{ color: '#22c55e' }} />
                                    ) : (
                                      <Copy size={11} />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setLinkingOrder(ord)}
                                    className={styles.awbActionIconBtn}
                                    title="Edit AliExpress Tracking Code"
                                  >
                                    <Edit3 size={11} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setLinkingOrder(ord)}
                                  className={styles.btnLinkAliexpress}
                                >
                                  <span>+ Link AliExpress AWB</span>
                                </button>
                              )}
                            </td>

                            {/* Fulfillment Stage & Quick Action Dropdown */}
                            <td>
                              <div className={styles.stageCellWrap}>
                                <span
                                  className={
                                    ord.status === 'Delivered'
                                      ? styles.stageStatusPillDelivered
                                      : ord.status === 'Qatar Customs (DOH)'
                                      ? styles.stageStatusPillCustoms
                                      : ord.status === 'Air Hub Transit'
                                      ? styles.stageStatusPillTransit
                                      : styles.stageStatusPillPending
                                  }
                                >
                                  • {ord.status === 'Pending Confirmation' ? 'Pending Approval' : (ord.stageLabel || ord.status)}
                                </span>
                                <span className={styles.stageSubtitleText}>
                                  {ord.status === 'Pending Confirmation' ? 'Awaiting Confirmation' : ord.stageSubtitle}
                                </span>

                                {/* Interactive Action Dropdown Select */}
                                <select
                                  value={ord.status}
                                  onChange={(e) => handleStatusChange(ord, e.target.value)}
                                  className={styles.stageActionSelect}
                                  title="Change Order Status"
                                >
                                  <option value="Pending Confirmation">Pending (Awaiting Confirmation)</option>
                                  <option value="Order Confirmed">Order Confirmed (Supplier Pack)</option>
                                  <option value="Air Hub Transit">In Air Transit (Flight to DOH)</option>
                                  <option value="Qatar Customs (DOH)">Qatar Customs (Hamad Cargo DOH)</option>
                                  <option value="Out for Delivery">Out for Delivery (Doorstep)</option>
                                  <option value="Delivered">Delivered (Completed)</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </td>

                            {/* Actions */}
                            <td>
                              <div className={styles.rowActionsGroup}>
                                <button
                                  type="button"
                                  onClick={() => openTrackingDrawer(ord)}
                                  className={styles.btnRowTrack}
                                  title="Track Order in Slide-Over Drawer"
                                >
                                  <Search size={12} />
                                  <span>Track</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openTrackingDrawer(ord)}
                                  className={styles.btnRowInspect}
                                  title="Inspect Order Details"
                                >
                                  <ChevronRight size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className={styles.opsTableFooter}>
                  <span>
                    Showing {filteredOpsOrders.length} of {crossBorderOrders.length} cross-border orders
                  </span>
                  <span>Currency: QAR (Qatari Riyal)</span>
                  <div className={styles.paginationBtns}>
                    <button
                      type="button"
                      disabled={opsCurrentPage <= 1}
                      onClick={() => setOpsCurrentPage((p) => Math.max(1, p - 1))}
                      className={styles.paginationBtn}
                    >
                      Previous
                    </button>
                    <button type="button" className={`${styles.paginationBtn} ${styles.active}`}>
                      {opsCurrentPage}
                    </button>
                    <button
                      type="button"
                      disabled={true}
                      className={styles.paginationBtn}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Compact Collapsible 3-Line Live Activity Ticker Bar for All Operations */}
              {opsAdminTab === 'all' && (
                <div className={styles.compactTickerBar}>
                  <div className={styles.compactTickerLeft}>
                    <span className={styles.pulseDotGreen} />
                    <span className={styles.compactTickerLabel}>LIVE TELEMETRY:</span>
                    <span className={styles.compactTickerText}>
                      {liveActionEvents[0]
                        ? `[${liveActionEvents[0].timestamp}] ${liveActionEvents[0].orderRef ? liveActionEvents[0].orderRef + ': ' : ''}${liveActionEvents[0].detail}`
                        : 'All Hamad DOH customs lines running normally on AST (UTC+3).'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpsAdminTab('live_feed')}
                    className={styles.compactTickerBtn}
                  >
                    <span>View Full Feed</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              )}
            </>
          )}

          {/* 5. REAL-TIME LIVE ACTION FEED TERMINAL (DEDICATED VIEW) */}
          {opsAdminTab === 'live_feed' && (
            <div className={styles.liveTerminalCard}>
              <div className={styles.liveTerminalTop}>
                <div className={styles.liveTerminalTitle}>
                  <span className={styles.pulseDotGreen} />
                  <span>REAL-TIME LIVE ACTION FEED &amp; TELEMETRY AUDIT</span>
                </div>
                <div className={styles.terminalControls}>
                  <button
                    type="button"
                    onClick={handleSimulateEvent}
                    className={styles.terminalBtn}
                    title="Simulate incoming Cainiao / Customs checkpoint event"
                  >
                    <RotateCw size={11} style={{ display: 'inline', marginRight: '4px' }} />
                    <span>Simulate Checkpoint</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLiveActionEvents([])}
                    className={styles.terminalBtn}
                  >
                    Clear Log
                  </button>
                </div>
              </div>

              <div className={styles.terminalFeedList}>
                {liveActionEvents.map((evt) => (
                  <div key={evt.id} className={styles.terminalLine}>
                    <span className={styles.terminalTimestamp}>[{evt.timestamp}]</span>
                    <span className={`${styles.terminalBadge} ${styles[evt.badgeColor]}`}>
                      [{evt.badge}]
                    </span>
                    <span className={styles.terminalMsg}>
                      {evt.orderRef && (
                        <strong style={{ color: '#f59e0b', marginRight: '6px' }}>
                          {evt.orderRef}:
                        </strong>
                      )}
                      {evt.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. TELEGRAM ALERT DISPATCHER (DEDICATED VIEW) */}
          {opsAdminTab === 'telegram' && (
            <TelegramAlertsManager />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* Slide-Over Shipment Tracking Drawer (Matching User Images 3 & 4) */}
      {isTrackingDrawerOpen && activeDrawerOrder && (
        <>
          <div
            className={styles.trackingDrawerBackdrop}
            onClick={() => setIsTrackingDrawerOpen(false)}
            aria-label="Close Tracking Drawer Backdrop"
          />
          <aside className={styles.trackingDrawerPanel} aria-label="Shipment Tracking Details">
            {/* Drawer Header */}
            <div className={styles.drawerHeader}>
              <div className={styles.drawerHeaderTitleRow}>
                <div className={styles.drawerHeaderLeftPills}>
                  <span className={styles.drawerOrderNum}>{activeDrawerOrder.orderNumber}</span>
                  <span className={styles.drawerRefPill}>{activeDrawerOrder.trackingNumber}</span>
                  <span className={styles.drawerStagePill}>
                    {activeDrawerOrder.stageLabel || activeDrawerOrder.status}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.drawerCloseBtn}
                  onClick={() => setIsTrackingDrawerOpen(false)}
                  aria-label="Close Drawer"
                >
                  <X size={18} />
                </button>
              </div>
              <p className={styles.drawerSubtext}>
                Placed {activeDrawerOrder.timeFormatted || activeDrawerOrder.date}, 2026 · {activeDrawerOrder.paymentStatus} · {activeDrawerOrder.paymentMethod || 'Apple Pay'}
              </p>
            </div>

            {/* Drawer Body */}
            <div className={styles.drawerBody}>
              {/* Card 1: Milestone Progress */}
              <div className={styles.drawerCard}>
                <div className={styles.drawerCardHeader}>
                  <span className={styles.drawerCardTitle}>CROSS-BORDER MILESTONE PROGRESS</span>
                  <span className={styles.drawerCardSub}>
                    Est. Delivery: {activeDrawerOrder.estDelivery || 'Nov 18, 2026'}
                  </span>
                </div>
                <div className={styles.milestoneTrack}>
                  {[
                    { idx: 1, label: 'Confirmed' },
                    { idx: 2, label: 'Dispatched' },
                    { idx: 3, label: 'Air CN→DOH' },
                    { idx: 4, label: 'DOH Customs' },
                    { idx: 5, label: 'Delivered' },
                  ].map((st) => {
                    const currentMilestone = activeDrawerOrder.milestoneIndex || 1;
                    const isCompleted = currentMilestone > st.idx;
                    const isCurrent = currentMilestone === st.idx;
                    return (
                      <div key={st.idx} className={styles.milestoneStep}>
                        <div
                          className={`${styles.milestoneCircle} ${
                            isCompleted ? styles.completed : isCurrent ? styles.current : ''
                          }`}
                        >
                          {isCompleted || isCurrent ? <Check size={13} /> : st.idx}
                        </div>
                        <span className={styles.milestoneLabel}>{st.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: Consignee & Package (2-Col) */}
              <div className={styles.drawerCard}>
                <div className={styles.drawerTwoCol}>
                  <div className={styles.drawerCol}>
                    <span className={styles.drawerFieldLabel}>CONSIGNEE &amp; QATAR ADDRESS</span>
                    <span className={styles.drawerFieldValue}>{activeDrawerOrder.customerName}</span>
                    <span className={styles.drawerFieldSub}>
                      {activeDrawerOrder.municipality}{' '}
                      <span dir="rtl">{activeDrawerOrder.municipalityAr}</span> ({activeDrawerOrder.streetAddress}, {activeDrawerOrder.zoneNumber})
                    </span>
                    <span className={styles.drawerFieldSub}>
                      {activeDrawerOrder.phone} · {activeDrawerOrder.paymentStatus} · {activeDrawerOrder.paymentMethod || 'Apple Pay'}
                    </span>
                  </div>

                  <div className={styles.drawerCol}>
                    <span className={styles.drawerFieldLabel}>PACKAGE &amp; VALUATION</span>
                    <span className={styles.drawerFieldValue}>{activeDrawerOrder.itemsSummary}</span>
                    <span className={styles.drawerFieldSub}>
                      Order Total:{' '}
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>
                        QAR {activeDrawerOrder.totalQAR.toFixed(2)}
                      </strong>
                    </span>
                    <span className={styles.drawerMarginText}>
                      Est. Net Profit: +QAR {activeDrawerOrder.netProfitQAR.toFixed(2)} ({activeDrawerOrder.marginPercent || '38.4%'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Upstream Carrier Tracking */}
              <div className={styles.drawerCard}>
                <div className={styles.drawerCardHeader}>
                  <span className={styles.drawerCardTitle}>Upstream Carrier Tracking (AliExpress / Cainiao)</span>
                  <span className={styles.drawerCardSub} style={{ color: '#6b7280' }}>
                    Auto-syncs customs scans
                  </span>
                </div>

                <div className={styles.drawerCarrierRow}>
                  <input
                    type="text"
                    value={drawerAwbInput}
                    onChange={(e) => setDrawerAwbInput(e.target.value)}
                    placeholder="Enter AliExpress Cainiao AWB (e.g. LP006849...)"
                    className={styles.drawerAwbInput}
                  />
                  <button
                    type="button"
                    onClick={handleSaveDrawerAwb}
                    className={styles.btnSaveSyncAwb}
                  >
                    Save &amp; Sync AWB
                  </button>
                </div>

                <div className={styles.drawerStageRow}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4b5563' }}>
                    Fulfillment Stage:
                  </label>
                  <select
                    value={activeDrawerOrder.status}
                    onChange={(e) => handleStatusChange(activeDrawerOrder, e.target.value)}
                    className={styles.drawerStageSelect}
                  >
                    <option value="Order Confirmed">Order Confirmed (Supplier Pack)</option>
                    <option value="Air Hub Transit">In Air Transit (Flight to DOH)</option>
                    <option value="Qatar Customs (DOH)">Qatar Customs (Hamad Cargo DOH)</option>
                    <option value="Out for Delivery">Out for Delivery (Doorstep)</option>
                    <option value="Delivered">Delivered (Completed)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    type="button"
                    onClick={handlePushDrawerTelegram}
                    className={styles.btnPushTelegram}
                  >
                    <Send size={12} />
                    <span>Push Telegram Update</span>
                  </button>
                </div>
              </div>

              {/* Card 4: Detailed Logistics Scan History */}
              <div className={styles.drawerCard}>
                <div className={styles.drawerCardHeader}>
                  <span className={styles.drawerCardTitle}>DETAILED LOGISTICS SCAN HISTORY</span>
                  <span className={styles.drawerCardSub} style={{ color: '#6b7280' }}>
                    Timezone: AST (UTC+3)
                  </span>
                </div>

                <div className={styles.scanHistoryList}>
                  {activeDrawerOrder.scanHistory && activeDrawerOrder.scanHistory.length > 0 ? (
                    activeDrawerOrder.scanHistory.map((scan) => (
                      <div key={scan.id} className={styles.scanItem}>
                        <div
                          className={`${styles.scanDot} ${scan.isLatest ? styles.green : ''}`}
                        />
                        <div className={styles.scanContent}>
                          <div className={styles.scanTopRow}>
                            <span className={styles.scanTitle}>{scan.title}</span>
                            <span className={styles.scanTime}>{scan.time}</span>
                          </div>
                          <div className={styles.scanLoc}>{scan.location}</div>
                          <div className={styles.scanDesc}>{scan.description}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                      No external checkpoint telemetry recorded yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className={styles.drawerFooter}>
              <button
                type="button"
                disabled={isSendingEmail}
                onClick={async () => {
                  if (!activeDrawerOrder) return;
                  setIsSendingEmail(true);
                  showToast('Dispatching Email... ✉️', `Sending confirmation to customer`, 'info');
                  try {
                    const res = await resendConfirmationEmail({
                      orderNumber: activeDrawerOrder.orderNumber,
                    });
                    if (res.success) {
                      showToast('Email Sent! 🚀', `Delivered to ${res.recipient}`, 'success');
                    } else {
                      showToast('Email Failed', res.error || 'Resend error', 'error');
                    }
                  } catch (err: any) {
                    showToast('Dispatch Error', err.message, 'error');
                  } finally {
                    setIsSendingEmail(false);
                  }
                }}
                className={styles.btnCopyLink}
                style={{ background: '#0F172A', color: '#FFFFFF', borderColor: '#1E293B' }}
                title="Send or resend order confirmation email to customer"
              >
                <Mail size={13} />
                <span>{isSendingEmail ? 'Sending...' : 'Send Confirmation Email'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    const url = `${window.location.origin}/dashboard?tab=tracking&order=${activeDrawerOrder.orderNumber}`;
                    navigator.clipboard.writeText(url);
                    showToast('Tracking Link Copied! 📋', url, 'success');
                  }
                }}
                className={styles.btnCopyLink}
              >
                <Copy size={13} />
                <span>Copy Tracking Link</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTrackingDrawerOpen(false)}
                className={styles.btnDone}
              >
                Done
              </button>
            </div>
          </aside>
        </>
      )}

      {/* AliExpress Link Modal */}
      <AliExpressLinkModal
        isOpen={Boolean(linkingOrder)}
        onClose={() => setLinkingOrder(null)}
        order={linkingOrder}
        adminEmail={userEmail}
        adminKey={adminKey}
        onSuccess={(code, carrier) => {
          if (linkingOrder && code) {
            setCrossBorderOrders((prev) =>
              prev.map((o) =>
                o.orderNumber === linkingOrder.orderNumber
                  ? { ...o, aliexpressTrackingNumber: code, aliexpressCarrier: carrier || 'cainiao' }
                  : o
              )
            );
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
            setLiveActionEvents((prev) => [
              {
                id: `act-${Date.now()}`,
                timestamp: timeStr,
                type: 'AWB_LINK',
                orderRef: linkingOrder.trackingNumber || linkingOrder.orderNumber,
                title: 'AWB Attached',
                detail: `Attached AliExpress Cainiao tracking ${code} to ${linkingOrder.orderNumber}.`,
                badge: 'AWB LINK',
                badgeColor: 'teal',
              },
              ...prev,
            ]);
          }
          showToast('Tracking Linked! ✈️', 'AliExpress logistics synced into Qatify timeline', 'success');
        }}
      />

      {/* Manual Order Creation Modal */}
      {isManualOrderModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={() => setIsManualOrderModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '520px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #e5e7eb',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#111827' }}>
                Create Cross-Border Manual Order
              </h3>
              <button
                type="button"
                onClick={() => setIsManualOrderModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Customer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nasser Al-Kuwari"
                    value={manualOrderData.customerName}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, customerName: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Qatar Phone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+974 5500 1234"
                    value={manualOrderData.phone}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Municipality
                  </label>
                  <select
                    value={manualOrderData.municipality}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, municipality: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  >
                    <option value="Doha">Doha (العاصمة)</option>
                    <option value="Lusail City">Lusail City (مدينة لوسيل)</option>
                    <option value="Al Rayyan">Al Rayyan (الريان)</option>
                    <option value="Al Wakrah">Al Wakrah (الوكرة)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Zone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zone 38"
                    value={manualOrderData.zoneNumber}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, zoneNumber: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Street / Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Al Sadd Street, Bldg 14"
                  value={manualOrderData.streetAddress}
                  onChange={(e) => setManualOrderData({ ...manualOrderData, streetAddress: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Product / Items Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1× Porodo MagSafe Power Bank"
                  value={manualOrderData.productTitle}
                  onChange={(e) => setManualOrderData({ ...manualOrderData, productTitle: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Total (QAR)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={manualOrderData.priceQAR}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, priceQAR: Number(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    AliExpress Cainiao AWB (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LP006849..."
                    value={manualOrderData.cainiaoAwb}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, cainiaoAwb: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsManualOrderModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    background: '#ffffff',
                    color: '#374151',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#111827',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Inspection Modal */}
      {isInspectDrawerOpen && selectedInspectionOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={() => setIsInspectDrawerOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '560px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #e5e7eb',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
                  Cross-Border Order Inspector
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 800, color: '#111827' }}>
                  {selectedInspectionOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInspectDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f9fafb', padding: '12px', borderRadius: '4px', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Customer</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{selectedInspectionOrder.customerName}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Zone / City</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                  {selectedInspectionOrder.municipality} ({selectedInspectionOrder.zoneNumber})
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Tracking Ref</div>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#111827' }}>
                  {selectedInspectionOrder.trackingNumber}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Cainiao AWB</div>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: selectedInspectionOrder.aliexpressTrackingNumber ? '#059669' : '#b45309' }}>
                  {selectedInspectionOrder.aliexpressTrackingNumber || 'UNLINKED'}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '6px' }}>
                Line Items
              </div>
              <div style={{ padding: '10px 12px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '13px', fontWeight: 600 }}>
                {selectedInspectionOrder.itemsSummary}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total Declared: </span>
                <strong style={{ fontSize: '15px', fontFamily: 'monospace', color: '#111827' }}>
                  QAR {selectedInspectionOrder.totalQAR.toFixed(2)}
                </strong>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsInspectDrawerOpen(false);
                    setActiveTrackingOrder(selectedInspectionOrder);
                    setIsTrackingModalOpen(true);
                  }}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '4px',
                    background: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Open 5-Stage Tracker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Stage Live Timeline Modal for Admins */}
      {isTrackingModalOpen && activeTrackingOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={() => setIsTrackingModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '820px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #e5e7eb',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
                  Customer Experience Verification
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 800, color: '#111827' }}>
                  Live 5-Stage Shipment Tracker: {activeTrackingOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTrackingModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={20} />
              </button>
            </div>

            <TrackingTimeline order={activeTrackingOrder} />
          </div>
        </div>
      )}

      {/* Convex Auth Sign-In & Sign-Up Modal */}
      <AuthModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSuccess={() => setIsEmailModalOpen(false)}
      />

      {/* Master Admin Secret Key Unlock Modal */}
      {isAdminKeyModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 10, 12, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '460px',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #e4e4e7',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsAdminKeyModalOpen(false);
                setAdminKeyError('');
              }}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#71717a',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#fffbeb',
                  color: '#ffb800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lock size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0a0a0c' }}>
                  Store Admin Access 🛡️
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#71717a' }}>
                  Authorized personnel only
                </p>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#52525b', lineHeight: 1.5, margin: '14px 0 18px 0' }}>
              Enter your <strong>Master Admin Secret Key</strong> to authenticate operations and customer logistics.
            </p>

            <form onSubmit={handleUnlockWithAdminKey}>
              <div style={{ marginBottom: '14px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0a0a0c',
                    marginBottom: '6px',
                  }}
                >
                  Admin Secret Key
                </label>
                <input
                  type="password"
                  value={adminKeyInput}
                  onChange={(e) => {
                    setAdminKeyInput(e.target.value);
                    setAdminKeyError('');
                  }}
                  placeholder="Enter ADMIN_SECRET_KEY..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: adminKeyError ? '1px solid #ef4444' : '1px solid #cbd5e1',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
                {adminKeyError && (
                  <div
                    style={{
                      color: '#ef4444',
                      fontSize: '12px',
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <AlertCircle size={14} />
                    <span>{adminKeyError}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminKeyModalOpen(false);
                    setIsEmailModalOpen(true);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e4e4e7',
                    backgroundColor: '#f4f4f5',
                    color: '#0a0a0c',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Sign In with Email
                </button>

                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#ffb800',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Key size={15} />
                  <span>Unlock Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

