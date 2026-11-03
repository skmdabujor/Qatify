'use client';

// =============================================================================
// Qatify — Customer & Operations Dashboard (`/dashboard`)
// Role Switcher: Customer View (5-Stage Air Shipment Tracker) vs Admin View (Analytics)
// =============================================================================

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useConvex } from 'convex/react';
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
} from 'lucide-react';
import { TelegramAlertsManager } from '@/components/admin/TelegramAlertsManager';
import { TrackingTimeline } from '@/components/tracking/TrackingTimeline';
import { AliExpressLinkModal } from '@/components/admin/AliExpressLinkModal';
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

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'tracking';
  const initialRole = searchParams.get('role') || 'customer';

  // Role State: 'customer' | 'admin'
  const [role, setRole] = useState<'customer' | 'admin'>(
    initialRole === 'admin' ? 'admin' : 'customer'
  );

  // Customer Active Tab
  const [customerTab, setCustomerTab] = useState<
    'tracking' | 'orders' | 'addresses' | 'wishlist' | 'support'
  >(
    initialTab === 'orders'
      ? 'orders'
      : initialTab === 'addresses'
      ? 'addresses'
      : initialTab === 'wishlist'
      ? 'wishlist'
      : initialTab === 'support'
      ? 'support'
      : 'tracking'
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
    adminKey ? { adminKey } : viewer ? {} : 'skip'
  );
  const isAdmin = Boolean(adminCheck?.isAdmin);
  const adminRole = adminCheck?.role || null;
  const adminName = adminCheck?.name || null;

  // If role is admin but user is not verified in Convex backend, revert to customer view
  useEffect(() => {
    if (!isAdmin && role === 'admin') {
      setRole('customer');
    }
  }, [isAdmin, role]);

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
    setEmailInput(userEmail || '');
    setEmailError('');
    setIsEmailModalOpen(true);
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

  const orderFromUrl = searchParams.get('order') || '';

  // Customer-scoped orders: fetch only orders matching the user's email
  const customerLiveOrders = useQuery(
    api.orders.getOrdersByCustomer,
    userEmail ? { email: userEmail, limit: 30 } : 'skip'
  );

  // Admin-scoped live orders: strictly fetched only when user is verified in Convex
  const adminLiveOrders = useQuery(
    api.orders.listRecentOrders,
    isAdmin ? { adminKey: adminKey || undefined, limit: 50 } : 'skip'
  );

  const updateStatus = useMutation(api.orders.updateOrderStatus);
  const refreshTracking = useMutation(api.tracking.refreshOrderTracking);
  const [linkingOrder, setLinkingOrder] = useState<any>(null);

  // Combine live orders strictly based on current authenticated role
  const displayOrders: any[] =
    role === 'admin'
      ? (adminLiveOrders && adminLiveOrders.length > 0 ? adminLiveOrders : [])
      : (customerLiveOrders && customerLiveOrders.length > 0
          ? customerLiveOrders
          : orders);

  // Dynamic KPIs from actual database orders
  const totalRevenue = displayOrders.reduce((sum, o) => sum + (o.totalQAR || 0), 0);
  const pendingDispatchCount = displayOrders.filter((o) => o.status === 'Order Confirmed').length;
  const inAirTransitCount = displayOrders.filter((o) => o.status === 'Air Hub Transit').length;
  const customsCount = displayOrders.filter((o) => o.status === 'Qatar Customs (DOH)').length;
  const deliveredCount = displayOrders.filter((o) => o.status === 'Delivered').length;

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
    orderNumber: orders[0]?.orderNumber || '',
    reason: 'Damaged or defective item',
    comments: '',
  });

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
    showToast('Return Request Logged! 🔄', 'Qatar customer care will contact you via WhatsApp in 2 hours.');
    setReturnForm({
      orderNumber: orders[0]?.orderNumber || '',
      reason: 'Damaged or defective item',
      comments: '',
    });
  };

  return (
    <div className={styles.dashboardPage}>
      <div className="container">
        {/* Top Header & Role Switcher Bar */}
        <div className={styles.topControlBar}>
          <div className={styles.dashboardTitleBlock}>
            <h1 className={styles.dashboardHeading}>
              {role === 'customer'
                ? 'Qatar Customer Hub & Air Tracking'
                : 'Qatify Dropship Operations & Admin'}
            </h1>
            <p className={styles.dashboardSubheading}>
              {role === 'customer'
                ? 'Monitor live international air shipments, manage your Qatar addresses, and view order receipts.'
                : 'Real-time fulfillment metrics, airport customs throughput, and Qatar cross-border sales.'}
            </p>
          </div>

          {/* Role Switcher Pill */}
          <div className={styles.roleSwitcherWrap}>
            <span className={styles.switcherLabel}>View Mode:</span>
            <div className={styles.rolePillsGroup}>
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`${styles.rolePill} ${role === 'customer' ? styles.active : ''}`}
                aria-pressed={role === 'customer'}
              >
                Customer Account
              </button>
              <button
                type="button"
                onClick={handleSwitchToAdmin}
                className={`${styles.rolePill} ${role === 'admin' ? styles.active : ''}`}
                aria-pressed={role === 'admin'}
              >
                {isAdmin
                  ? `🛡️ Store Admin (${adminRole === 'owner' ? 'Owner' : 'Admin'})`
                  : '🔒 Store Admin'}
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Shell: Dark Sidebar + Clean Canvas */}
        <div className={styles.dashboardShell}>
          {/* =================================================================
              COLLAPSIBLE DARK SIDEBAR (#0A0A0C)
          ================================================================== */}
          <aside className={styles.darkSidebar}>
            {role === 'customer' ? (
              <>
                <div className={styles.userProfileMini}>
                  <div className={styles.userProfileLeft}>
                    <div className={styles.avatarCircle}>
                      {viewer?.name ? viewer.name.slice(0, 2).toUpperCase() : (userEmail ? userEmail.slice(0, 2).toUpperCase() : 'QA')}
                    </div>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>
                        {isAdmin
                          ? (adminName || 'Store Admin')
                          : (viewer?.name || (userEmail ? 'Qatar Customer' : 'Qatar Guest'))}
                      </span>
                      <span className={styles.userLocation} title={userEmail || 'Guest Session'}>
                        {userEmail || 'Guest Account'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.userStatusPill}>
                    <span className={styles.statusDot} />
                    <span>
                      {isAdmin
                        ? (adminRole === 'owner' ? 'Store Owner' : 'Admin Authorized')
                        : (viewer ? 'Verified Convex Account' : (userEmail ? 'Verified Account' : 'Guest Account'))}
                    </span>
                  </div>
                </div>

                {/* Account Action: Sign In or Switch/Sign Out */}
                <div style={{ padding: '0 16px 12px' }}>
                  {userEmail ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                      <button
                        type="button"
                        onClick={handleOpenEmailModal}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#a1a1aa',
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                          fontSize: '11px',
                        }}
                      >
                        Switch Account
                      </button>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '11px',
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenEmailModal}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        background: '#18181b',
                        color: '#facc15',
                        border: '1px solid #27272a',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Users size={13} />
                      <span>Sign In with Email</span>
                    </button>
                  )}
                </div>

                <div className={styles.sidebarNav}>
                  <div className={styles.navGroupTitle}>Order Tracking</div>
                  <button
                    type="button"
                    onClick={() => setCustomerTab('tracking')}
                    className={`${styles.navItem} ${customerTab === 'tracking' ? styles.active : ''}`}
                  >
                    <Plane size={16} />
                    <span>5-Stage Air Tracker</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerTab('orders')}
                    className={`${styles.navItem} ${customerTab === 'orders' ? styles.active : ''}`}
                  >
                    <Package size={16} />
                    <span>My Orders ({orders.length})</span>
                  </button>

                  <div className={styles.navGroupTitle}>Preferences</div>
                  <button
                    type="button"
                    onClick={() => setCustomerTab('addresses')}
                    className={`${styles.navItem} ${customerTab === 'addresses' ? styles.active : ''}`}
                  >
                    <MapPin size={16} />
                    <span>Saved Qatar Addresses</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerTab('wishlist')}
                    className={`${styles.navItem} ${customerTab === 'wishlist' ? styles.active : ''}`}
                  >
                    <Heart size={16} />
                    <span>Saved Wishlist ({wishlist.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerTab('support')}
                    className={`${styles.navItem} ${customerTab === 'support' ? styles.active : ''}`}
                  >
                    <Headphones size={16} />
                    <span>Support & Help Desk</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.adminBadgeBlock}>
                  <div className={styles.adminBadgeLeft}>
                    <span className={styles.adminPill}>
                      {adminRole === 'owner' ? 'STORE OWNER' : 'DROPSHIP ADMIN'}
                    </span>
                    <span className={styles.adminStoreName}>Qatify Qatar Hub</span>
                  </div>
                  <div className={styles.adminLiveStatus}>
                    <span className={styles.pulseGreenDot} />
                    <span>Live Operations</span>
                  </div>
                </div>

                <div className={styles.sidebarNav}>
                  <div className={styles.navGroupTitle}>Operations</div>
                  <button
                    type="button"
                    onClick={() => setAdminTab('all')}
                    className={`${styles.navItem} ${adminTab === 'all' ? styles.active : ''}`}
                  >
                    <SlidersHorizontal size={16} />
                    <span>All Operations</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab('analytics')}
                    className={`${styles.navItem} ${adminTab === 'analytics' ? styles.active : ''}`}
                  >
                    <BarChart3 size={16} />
                    <span>Store Analytics & KPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab('pipeline')}
                    className={`${styles.navItem} ${adminTab === 'pipeline' ? styles.active : ''}`}
                  >
                    <Truck size={16} />
                    <span>Fulfillment Pipeline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab('orders')}
                    className={`${styles.navItem} ${adminTab === 'orders' ? styles.active : ''}`}
                  >
                    <FileText size={16} />
                    <span>Recent Orders (Qatar)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab('telegram')}
                    className={`${styles.navItem} ${adminTab === 'telegram' ? styles.active : ''}`}
                  >
                    <Send size={16} />
                    <span>Telegram Order Alerts</span>
                  </button>
                </div>

                <div className={styles.adminSessionBar}>
                  <div className={styles.adminSessionText}>
                    <span className={styles.adminSessionEmail} title={userEmail}>
                      {userEmail}
                    </span>
                    <span className={styles.adminSessionRole}>
                      {adminRole === 'owner' ? 'Store Owner' : 'Store Admin'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={styles.adminLogoutBtn}
                    title="Switch to Customer Account view"
                  >
                    Customer Hub
                  </button>
                </div>
              </>
            )}

            <div className={styles.sidebarFooter}>
              <span className={styles.supportTag}>✈️ Qatar Direct Air Express</span>
              <span className={styles.hubId}>Hub: DOH-EXP-01</span>
            </div>
          </aside>

          {/* =================================================================
              CLEAN WORKSPACE (#F8F9FA)
          ================================================================== */}
          <main className={styles.workspace}>
            {/* ===============================================================
                CUSTOMER VIEW
            ================================================================ */}
            {role === 'customer' && (
              <>
                {/* 3 KPI Summary Cards */}
                <div className={styles.kpiCardsRow}>
                  <div
                    className={`${styles.kpiCard} ${styles.kpiCardClickable}`}
                    onClick={() => setCustomerTab('tracking')}
                    role="button"
                    tabIndex={0}
                    title="View 5-Stage Air Tracker"
                  >
                    <div className={styles.kpiIconWrapYellow}>
                      <Plane size={20} />
                    </div>
                    <div className={styles.kpiContent}>
                      <span className={styles.kpiLabel}>In-Transit Orders</span>
                      <strong className={styles.kpiValue}>1 Package</strong>
                      <span className={styles.kpiSub}>Arriving in 3 days</span>
                    </div>
                  </div>

                  <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrapRed}>
                      <Sparkles size={20} />
                    </div>
                    <div className={styles.kpiContent}>
                      <span className={styles.kpiLabel}>Qatify Rewards</span>
                      <strong className={styles.kpiValue}>420 Points</strong>
                      <span className={styles.kpiSub}>= QAR 42 Store Credit</span>
                    </div>
                  </div>

                  <div
                    className={`${styles.kpiCard} ${styles.kpiCardClickable}`}
                    onClick={() => setCustomerTab('wishlist')}
                    role="button"
                    tabIndex={0}
                    title="View Saved Wishlist"
                  >
                    <div className={styles.kpiIconWrapDark}>
                      <Heart size={20} />
                    </div>
                    <div className={styles.kpiContent}>
                      <span className={styles.kpiLabel}>Saved Wishlist</span>
                      <strong className={styles.kpiValue}>
                        {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
                      </strong>
                      <span className={styles.kpiSub}>Price drop alerts on</span>
                    </div>
                  </div>
                </div>

                {/* TAB 1: 5-STAGE INTERNATIONAL SHIPMENT TRACKER */}
                {customerTab === 'tracking' && (
                  <div className={styles.tabContentCard}>
                    <div className={styles.trackerSearchHeader}>
                      <div>
                        <h2 className={styles.cardHeading}>5-Stage International Shipment Tracker</h2>
                        <p className={styles.cardSub}>
                          Track air cargo from global export centers to customs clearance at Hamad International Airport (DOH).
                        </p>
                      </div>

                      {/* Package Code Search */}
                      <form onSubmit={handleSearchTracking} className={styles.trackerSearchForm}>
                        <input
                          type="text"
                          placeholder="Search QA-EXP-8849201..."
                          value={trackingSearch}
                          onChange={(e) => setTrackingSearch(e.target.value)}
                          className={styles.trackerSearchInput}
                        />
                        <button type="submit" className={styles.trackerSearchBtn}>
                          <Search size={15} />
                          <span>Track</span>
                        </button>
                      </form>
                    </div>

                    {selectedOrder ? (
                      <TrackingTimeline order={selectedOrder} />
                    ) : (
                      <div className={styles.activeShipmentBanner} style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <p>No active shipment selected. Search by your order reference (QA-XXXXXX) or tracking code above.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: MY ORDERS & INVOICES */}
                {customerTab === 'orders' && (
                  <div className={styles.tabContentCard}>
                    <h2 className={styles.cardHeading}>Order History & Invoices</h2>
                    <p className={styles.cardSub}>
                      All past orders placed with tracked delivery in Qatar.
                    </p>

                    <div className={styles.ordersList}>
                      {displayOrders.map((ord) => (
                        <div key={ord.id || ord.orderNumber} className={styles.orderListItem}>
                          <div className={styles.orderHeaderStrip}>
                            <div className={styles.orderNumberWrap}>
                              <strong>{ord.orderNumber}</strong>
                              <span className={styles.orderDate}>{ord.date}</span>
                            </div>
                            <span
                              className={`${styles.orderStatusBadge} ${
                                ord.status === 'Delivered'
                                  ? styles.delivered
                                  : styles.inTransit
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>

                          <div className={styles.orderItemsPreview}>
                            {ord.items.map((item: any, idx: number) => {
                              const imgUrl = item.image || item.product?.images?.[0] || '/placeholder.svg';
                              const itemTitle = item.title || item.product?.title || 'Qatar Tech Item';
                              const itemPrice = item.priceQAR || item.product?.priceQAR || 0;
                              return (
                                <div key={idx} className={styles.orderThumbWrap}>
                                  <img
                                    src={imgUrl}
                                    alt={itemTitle}
                                    className={styles.orderThumbImg}
                                    onError={(e) => {
                                      const target = e.currentTarget;
                                      if (!target.src.endsWith('/placeholder.svg')) {
                                        target.src = '/placeholder.svg';
                                      }
                                    }}
                                  />
                                  <div className={styles.orderItemInfo}>
                                    <span className={styles.orderItemTitle}>
                                      {itemTitle}
                                    </span>
                                    <span className={styles.orderItemQty}>
                                      Qty: {item.quantity} • QAR {itemPrice}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className={styles.orderFooterStrip}>
                            <div className={styles.orderTotalWrap}>
                              <span>Total: </span>
                              <strong className="price-qar">
                                QAR {ord.totalQAR.toLocaleString()}
                              </strong>
                            </div>

                            <div className={styles.orderActions}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrder(ord);
                                  setCustomerTab('tracking');
                                }}
                                className={styles.trackOrderAction}
                              >
                                <Plane size={14} />
                                <span>Track ({ord.trackingNumber})</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: SAVED QATAR ADDRESSES */}
                {customerTab === 'addresses' && (
                  <div className={styles.tabContentCard}>
                    <div className={styles.addressHeader}>
                      <div>
                        <h2 className={styles.cardHeading}>Saved Qatar Addresses</h2>
                        <p className={styles.cardSub}>
                          Qatar National Address standard (Zone, Street, Building) for rapid doorstep shipping.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddAddressOpen(true)}
                        className={styles.addNewAddrBtn}
                      >
                        <Plus size={15} />
                        <span>Add New Address</span>
                      </button>
                    </div>

                    <div className={styles.addressesGrid}>
                      {savedAddresses.map((addr, idx) => (
                        <div key={idx} className={styles.addressCard}>
                          <div className={styles.addressCardTop}>
                            <strong className={styles.addrRecipient}>
                              {addr.firstName && addr.lastName ? `${addr.firstName} ${addr.lastName}` : addr.fullName}
                            </strong>
                            {addr.isDefault && (
                              <span className={styles.defaultPill}>DEFAULT</span>
                            )}
                          </div>
                          <div className={styles.addrPhone}>
                            <Phone size={13} />
                            <span>{addr.phoneCountryCode ? `+${addr.phoneCountryCode} ${addr.phoneNumber}` : addr.phone}</span>
                          </div>
                          {addr.email && (
                            <div className={styles.addrPhone} style={{ marginTop: '2px', color: '#6b7280' }}>
                              <span style={{ fontSize: '12px' }}>✉ {addr.email}</span>
                            </div>
                          )}
                          <div className={styles.addrDetails}>
                            <p><strong>Street:</strong> {addr.streetAddress || addr.streetNumber}</p>
                            <p><strong>Apt / Building:</strong> {addr.apartmentSuite || addr.buildingNumber}</p>
                            <p><strong>Municipality:</strong> {addr.municipality}</p>
                            <p><strong>Zone:</strong> {addr.zoneNumber}</p>
                            <p><strong>Postal Code:</strong> {addr.postalCode || '00974'}</p>
                            <p><strong>Country:</strong> {addr.country || 'Qatar'}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Address Modal (AliExpress Format) */}
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
                                  <div className={styles.aliCountryInfo}>
                                    <CountryFlag code={dashboardCountryConfig.code} size={22} />
                                    <span className={styles.aliCountryCodeBadge}>{dashboardCountryConfig.code}</span>
                                    <span className={styles.aliCountryName}>{dashboardCountryConfig.name}</span>
                                  </div>
                                  <ChevronDown
                                    size={18}
                                    className={`${styles.dropdownChevron} ${dashboardCountryOpen ? styles.chevronOpen : ''}`}
                                  />
                                </div>

                                {dashboardCountryOpen && (
                                  <div className={styles.customDropdownMenu}>
                                    {SUPPORTED_COUNTRIES.map((c) => {
                                      const isSelected = dashboardCountryConfig.code === c.code;
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
                                {/* Row 1: First name & Last name */}
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

                                {/* Row 2: Email address & Mobile phone number */}
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
                                  <div className={styles.aliPhoneGroup}>
                                    <div className={styles.aliPhonePrefix}>{dashboardCountryConfig.phoneCode}</div>
                                    <input
                                      type="tel"
                                      required
                                      value={newAddress.phoneNumber}
                                      onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        setNewAddress({ ...newAddress, phoneNumber: val });
                                      }}
                                      placeholder="Mobile phone number"
                                      className={styles.aliPhoneInput}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* 3. Address */}
                            <div className={styles.aliSection}>
                              <label className={styles.aliSectionTitle}>Address</label>

                              {/* Row 1: Street address & Apt/Suite/Building */}
                              <div className={styles.aliAddressRow1}>
                                <input
                                  type="text"
                                  required
                                  value={newAddress.streetAddress}
                                  onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                                  placeholder="Street address, road or house number"
                                  className={styles.aliTextInput}
                                />
                                <input
                                  type="text"
                                  value={newAddress.apartmentSuite || ''}
                                  onChange={(e) => setNewAddress({ ...newAddress, apartmentSuite: e.target.value })}
                                  placeholder="Building, Apt, Suite, Unit (Optional)"
                                  className={styles.aliTextInput}
                                />
                              </div>

                              {/* Row 2: Municipality/Province, Zone/District, Postal code */}
                              <div className={styles.aliAddressRow2}>
                                {/* Custom Municipality Dropdown */}
                                <div
                                  ref={dashboardMunicipalityRef}
                                  className={`${styles.customSelectWrapper} ${dashboardMunicipalityOpen ? styles.wrapperOpen : ''}`}
                                >
                                  <div
                                    className={`${styles.customSelectTrigger} ${dashboardMunicipalityOpen ? styles.dropdownActiveTrigger : ''}`}
                                    onClick={() => {
                                      setDashboardMunicipalityOpen(!dashboardMunicipalityOpen);
                                      setDashboardCountryOpen(false);
                                      setDashboardZoneOpen(false);
                                    }}
                                  >
                                    <span className={newAddress.municipality ? styles.selectValueText : styles.selectPlaceholderText}>
                                      {newAddress.municipality ||
                                        (dashboardCountryConfig.code === 'QA'
                                          ? 'Select Municipality'
                                          : dashboardCountryConfig.code === 'SA'
                                            ? 'Select Province / City'
                                            : 'Select Emirate / City')}
                                    </span>
                                    <ChevronDown
                                      size={16}
                                      className={`${styles.dropdownChevron} ${dashboardMunicipalityOpen ? styles.chevronOpen : ''}`}
                                    />
                                  </div>

                                  {dashboardMunicipalityOpen && (
                                    <div className={styles.customDropdownMenu}>
                                      {dashboardCountryConfig.provinces.map((prov) => {
                                        const isSelected = newAddress.municipality === prov;
                                        return (
                                          <div
                                            key={prov}
                                            className={`${styles.customDropdownItem} ${isSelected ? styles.itemSelected : ''}`}
                                            onClick={() => {
                                              setNewAddress({ ...newAddress, municipality: prov, zoneNumber: '' });
                                              setDashboardMunicipalityOpen(false);
                                            }}
                                          >
                                            <span className={styles.itemTitle}>{prov}</span>
                                            {isSelected && <Check size={15} className={styles.itemCheckIcon} />}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                                {/* Custom Zone Dropdown */}
                                <div
                                  ref={dashboardZoneRef}
                                  className={`${styles.customSelectWrapper} ${dashboardZoneOpen ? styles.wrapperOpen : ''}`}
                                >
                                  <div
                                    className={`${styles.customSelectTrigger} ${dashboardZoneOpen ? styles.dropdownActiveTrigger : ''}`}
                                    onClick={() => {
                                      if (!newAddress.municipality) {
                                        showToast(
                                          'Select City First',
                                          'Please choose a municipality or city first to view its zones.',
                                          'info'
                                        );
                                        return;
                                      }
                                      setDashboardZoneOpen(!dashboardZoneOpen);
                                      setDashboardCountryOpen(false);
                                      setDashboardMunicipalityOpen(false);
                                    }}
                                  >
                                    <span className={newAddress.zoneNumber ? styles.selectValueText : styles.selectPlaceholderText}>
                                      {newAddress.zoneNumber ||
                                        (dashboardCountryConfig.code === 'QA'
                                          ? 'Select Zone'
                                          : dashboardCountryConfig.code === 'SA'
                                            ? 'Select District'
                                            : 'Select Area / Zone')}
                                    </span>
                                    <ChevronDown
                                      size={16}
                                      className={`${styles.dropdownChevron} ${dashboardZoneOpen ? styles.chevronOpen : ''}`}
                                    />
                                  </div>

                                  {dashboardZoneOpen && (
                                    <div className={styles.customDropdownMenu}>
                                      {(dashboardCountryConfig.zones[newAddress.municipality] || []).length > 0 ? (
                                        (dashboardCountryConfig.zones[newAddress.municipality] || []).map((z) => {
                                          const isSelected = newAddress.zoneNumber === z;
                                          return (
                                            <div
                                              key={z}
                                              className={`${styles.customDropdownItem} ${isSelected ? styles.itemSelected : ''}`}
                                              onClick={() => {
                                                setNewAddress({ ...newAddress, zoneNumber: z });
                                                setDashboardZoneOpen(false);
                                              }}
                                            >
                                              <span className={styles.itemTitle}>{z}</span>
                                              {isSelected && <Check size={15} className={styles.itemCheckIcon} />}
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div className={styles.noItemsMsg}>No zones available for this city</div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* ZIP / Postal code (Starts empty, placeholder shows clean text) */}
                                <input
                                  type="text"
                                  value={newAddress.postalCode || ''}
                                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                  placeholder="ZIP / Postal code"
                                  className={styles.aliTextInput}
                                />
                              </div>
                            </div>

                            {/* Checkbox: Set as default shipping address */}
                            <div className={styles.aliCheckboxRow}>
                              <label className={styles.aliCheckLabel}>
                                <input
                                  type="checkbox"
                                  checked={newAddress.isDefault}
                                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                  className={styles.aliHiddenCheck}
                                />
                                <span className={`${styles.aliCustomBox} ${newAddress.isDefault ? styles.checked : ''}`}>
                                  {newAddress.isDefault && <Check size={13} strokeWidth={3} color="#ffffff" />}
                                </span>
                                <span className={styles.aliCheckText}>Set as default shipping address</span>
                              </label>
                            </div>

                            {/* Button: Confirm */}
                            <div className={styles.aliBtnRow}>
                              <button type="submit" className={styles.aliConfirmBtn}>
                                Confirm
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: SAVED WISHLIST */}
                {customerTab === 'wishlist' && (
                  <div className={styles.tabContentCard}>
                    <div className={styles.wishlistHeader}>
                      <div>
                        <h2 className={styles.cardHeading}>Your Saved Wishlist</h2>
                        <p className={styles.cardSub}>
                          Items you saved for future Qatar air express shipments.
                        </p>
                      </div>
                      {wishlist.length > 0 && (
                        <span className={styles.wishlistCountBadge}>
                          {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
                        </span>
                      )}
                    </div>

                    {wishlist.length === 0 ? (
                      <div className={styles.emptyWishlistState}>
                        <div className={styles.emptyWishlistIconWrap}>
                          <Heart size={28} />
                        </div>
                        <h3>Your wishlist is empty</h3>
                        <p>
                          No items in your wishlist. Browse our Qatar express catalog and tap the heart icon to save products.
                        </p>
                        <Link href="/shop" className={styles.emptyWishlistBtn}>
                          Explore Catalog
                        </Link>
                      </div>
                    ) : (
                      <div className={styles.wishlistGrid}>
                        {wishlist.map((prod) => (
                          <div key={prod.id} className={styles.wishlistItemCard}>
                            <Link href={`/products/${prod.slug}`} className={styles.wishlistImgLink}>
                              <img
                                src={prod.images[0] || '/placeholder.svg'}
                                alt={prod.title}
                                className={styles.wishlistImg}
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (!target.src.endsWith('/placeholder.svg')) {
                                    target.src = '/placeholder.svg';
                                  }
                                }}
                              />
                            </Link>
                            <div className={styles.wishlistBody}>
                              <div className={styles.wishlistTitleRow}>
                                <Link
                                  href={`/products/${prod.slug}`}
                                  className={styles.wishlistTitle}
                                  title={prod.title}
                                >
                                  {prod.title}
                                </Link>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeFromWishlist(prod.id);
                                  }}
                                  className={styles.removeWishlistBtn}
                                  title="Remove from Wishlist"
                                  aria-label={`Remove ${prod.title} from wishlist`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <span className={styles.wishlistPrice}>
                                QAR {prod.priceQAR}
                              </span>
                              <div className={styles.wishlistBottomActions}>
                                <button
                                  type="button"
                                  onClick={() => addToCart(prod, 1)}
                                  className={styles.moveToCartBtn}
                                >
                                  Move to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: SUPPORT & CUSTOMER CARE */}
                {customerTab === 'support' && (
                  <div className={styles.tabContentCard}>
                    <h2 className={styles.cardHeading}>Qatar Customer Support & Care</h2>
                    <p className={styles.cardSub}>
                      Direct assistance in Doha and Lusail with our dedicated support concierge.
                    </p>

                    <div className={styles.supportChannelsGrid}>
                      <a href="tel:+97444928100" className={styles.channelCard}>
                        <Phone size={22} className={styles.channelIcon} />
                        <h4>Direct Doha Hotline</h4>
                        <p>+974 4492 8100</p>
                        <span>8:00 AM – 11:00 PM (GMT+3) • Tap to Call</span>
                      </a>

                      <a
                        href="https://wa.me/8801875707255?text=Hi%20Qatify%2C%20I%20need%20assistance%20with%20my%20order"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.channelCard}
                      >
                        <Headphones size={22} className={styles.channelIcon} />
                        <h4>WhatsApp Concierge</h4>
                        <p>01875707255</p>
                        <span>Instant order tracking updates • Tap to Chat</span>
                      </a>
                    </div>

                    <div className={styles.returnFormSection}>
                      <h3 className={styles.returnFormTitle}>Submit Order Assistance Request</h3>
                      <form onSubmit={handleReturnSubmit} className={styles.returnForm}>
                        <div className={styles.modalField}>
                          <label>Order Reference</label>
                          <input
                            type="text"
                            required
                            value={returnForm.orderNumber}
                            onChange={(e) =>
                              setReturnForm({ ...returnForm, orderNumber: e.target.value })
                            }
                          />
                        </div>
                        <div className={styles.modalField}>
                          <label>Reason for Claim</label>
                          <select
                            value={returnForm.reason}
                            onChange={(e) =>
                              setReturnForm({ ...returnForm, reason: e.target.value })
                            }
                          >
                            <option value="Damaged or defective item">Damaged or defective item</option>
                            <option value="Different item received">Different item received</option>
                            <option value="Missing parts/accessories">Missing parts/accessories</option>
                          </select>
                        </div>
                        <div className={styles.modalField}>
                          <label>Details & Comments</label>
                          <textarea
                            rows={3}
                            value={returnForm.comments}
                            onChange={(e) =>
                              setReturnForm({ ...returnForm, comments: e.target.value })
                            }
                            placeholder="Describe any issues observed..."
                          />
                        </div>
                        <button type="submit" className={styles.submitClaimBtn}>
                          Submit Support Request
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ===============================================================
                ADMIN VIEW (DROPSHIP STORE ADMIN & PIPELINE OVERVIEW)
                Only rendered if role is admin AND user is verified in Convex
            ================================================================ */}
            {role === 'admin' && isAdmin && (
              <div className={styles.adminWorkspace}>
                {/* 4 Analytics KPI Cards */}
                {(adminTab === 'all' || adminTab === 'analytics') && (
                  <div className={styles.adminKpiGrid}>
                    <div className={styles.adminKpiCard}>
                      <div className={styles.adminKpiTop}>
                        <span className={styles.adminKpiTitle}>30-Day Gross Revenue</span>
                        <DollarSign size={18} className={styles.greenIcon} />
                      </div>
                      <strong className={styles.adminKpiValue}>QAR {totalRevenue.toLocaleString()}</strong>
                      <span className={styles.adminGrowthPill}>Live Database Volume</span>
                    </div>

                    <div className={styles.adminKpiCard}>
                      <div className={styles.adminKpiTop}>
                        <span className={styles.adminKpiTitle}>Net Dropship Margin</span>
                        <TrendingUp size={18} className={styles.yellowIcon} />
                      </div>
                      <strong className={styles.adminKpiValue}>38.4% (Est. QAR {Math.round(totalRevenue * 0.384).toLocaleString()})</strong>
                      <span className={styles.adminKpiSub}>Direct Factory Costing</span>
                    </div>

                    <div className={styles.adminKpiCard}>
                      <div className={styles.adminKpiTop}>
                        <span className={styles.adminKpiTitle}>Daily Volume (Qatar)</span>
                        <Package size={18} className={styles.redIcon} />
                      </div>
                      <strong className={styles.adminKpiValue}>{displayOrders.length} Orders In System</strong>
                      <span className={styles.adminKpiSub}>Avg QAR 176.5 per basket</span>
                    </div>

                    <div className={styles.adminKpiCard}>
                      <div className={styles.adminKpiTop}>
                        <span className={styles.adminKpiTitle}>Avg Air Transit Time</span>
                        <Plane size={18} className={styles.blueIcon} />
                      </div>
                      <strong className={styles.adminKpiValue}>7.4 Days</strong>
                      <span className={styles.adminKpiSub}>Hamad Airport Hub (DOH)</span>
                    </div>
                  </div>
                )}

                {/* Fulfillment Pipeline Breakdown */}
                {(adminTab === 'all' || adminTab === 'pipeline') && (
                  <div className={styles.pipelineCard}>
                    <h3 className={styles.pipelineTitle}>Qatar Dropship Fulfillment Pipeline</h3>
                    <div className={styles.pipelineStagesRow}>
                      <div className={styles.pipelineStage}>
                        <div className={styles.pipelineCount}>{pendingDispatchCount}</div>
                        <div className={styles.pipelineStageName}>Pending Dispatch</div>
                        <span className={styles.pipelineStatusPill}>Supplier Pack</span>
                      </div>
                      <div className={styles.pipelineStage}>
                        <div className={styles.pipelineCount}>{inAirTransitCount}</div>
                        <div className={styles.pipelineStageName}>In Air Transit</div>
                        <span className={styles.pipelineStatusYellow}>Flight to DOH</span>
                      </div>
                      <div className={styles.pipelineStage}>
                        <div className={styles.pipelineCount}>{customsCount}</div>
                        <div className={styles.pipelineStageName}>Qatar Customs</div>
                        <span className={styles.pipelineStatusOrange}>Hamad Airport</span>
                      </div>
                      <div className={styles.pipelineStage}>
                        <div className={styles.pipelineCount}>{deliveredCount}</div>
                        <div className={styles.pipelineStageName}>Delivered</div>
                        <span className={styles.pipelineStatusGreen}>Doorstep Drops</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Store Orders Table */}
                {(adminTab === 'all' || adminTab === 'orders') && (
                  <div className={styles.adminTableCard}>
                    <div className={styles.adminTableHeadRow}>
                      <div>
                        <h3 className={styles.adminTableTitle}>Recent Cross-Border Orders (Qatar)</h3>
                        <span className={styles.mobileSwipeHint}>👉 Swipe table horizontally to inspect</span>
                      </div>
                      <span className={styles.liveOrdersPill}>Live Feed</span>
                    </div>

                    <div className={styles.tableResponsiveWrap}>
                      <table className={styles.adminOrdersTable}>
                        <thead>
                          <tr>
                            <th>Order Ref</th>
                            <th>Customer & Zone</th>
                            <th>Items</th>
                            <th>Total QAR</th>
                            <th>Carrier Tracking</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayOrders.map((ord: any) => {
                            const isLive = Boolean(ord._id);
                            const customerName = ord.address?.fullName || 'Qatar Customer';
                            const municipality = ord.address?.municipality || 'Qatar';
                            const itemsText = ord.items?.[0]?.title
                              ? ord.items[0].title.slice(0, 20) + '...'
                              : ord.items?.[0]?.product?.title?.slice(0, 20) + '...';

                            return (
                              <tr key={ord._id || ord.id || ord.orderNumber}>
                                <td><strong>{ord.orderNumber}</strong></td>
                                <td>{customerName} ({municipality})</td>
                                <td>{ord.items?.length || 1} items ({itemsText})</td>
                                <td className="price-qar">QAR {ord.totalQAR?.toLocaleString()}</td>
                                <td>
                                  <div><code>{ord.trackingNumber}</code></div>
                                  {isLive && (
                                    ord.aliexpressTrackingNumber ? (
                                      <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                        <span
                                          style={{
                                            fontSize: '11px',
                                            color: '#facc15',
                                            backgroundColor: '#1c1917',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            border: '1px solid #44403c',
                                            fontFamily: 'monospace',
                                          }}
                                          title={`Carrier: ${ord.aliexpressCarrier || 'cainiao'}`}
                                        >
                                          AliExpress: {ord.aliexpressTrackingNumber}
                                        </span>
                                        <button
                                          type="button"
                                          title="Sync Live AliExpress Status"
                                          onClick={async () => {
                                            try {
                                              await refreshTracking({ orderNumber: ord.orderNumber });
                                              showToast('Syncing AliExpress ✈️', `Live checkpoints fetching for ${ord.orderNumber}...`, 'info');
                                            } catch (err) {
                                              console.error(err);
                                              showToast('Sync Failed', 'Could not sync live checkpoints.', 'error');
                                            }
                                          }}
                                          style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#FF6D00',
                                            cursor: 'pointer',
                                            padding: '2px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <RotateCw size={12} />
                                        </button>
                                        <button
                                          type="button"
                                          title="Edit AliExpress Tracking Code"
                                          onClick={() => setLinkingOrder(ord)}
                                          style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#a1a1aa',
                                            cursor: 'pointer',
                                            padding: '2px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <Edit3 size={12} />
                                        </button>
                                      </div>
                                    ) : (
                                      <div style={{ marginTop: '4px' }}>
                                        <button
                                          type="button"
                                          onClick={() => setLinkingOrder(ord)}
                                          style={{
                                            background: 'rgba(255, 109, 0, 0.1)',
                                            color: '#FF6D00',
                                            border: '1px solid rgba(255, 109, 0, 0.3)',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                          }}
                                        >
                                          <Plane size={11} />
                                          <span>+ Link AliExpress</span>
                                        </button>
                                      </div>
                                    )
                                  )}
                                </td>
                                <td>
                                  <span className={
                                    ord.status === 'Delivered'
                                      ? styles.statusPillGreen
                                      : ord.status === 'Qatar Customs (DOH)'
                                      ? styles.statusPillYellow
                                      : styles.statusPillBlue
                                  }>
                                    {ord.status}
                                  </span>
                                </td>
                                <td>
                                  {isLive ? (
                                    <select
                                      value={ord.status}
                                      onChange={async (e) => {
                                        const newStatus = e.target.value as any;
                                        try {
                                          await updateStatus({
                                            adminKey: adminKey || undefined,
                                            orderId: ord._id,
                                            status: newStatus,
                                          });
                                          showToast('Status Updated! ✈️', `${ord.orderNumber} is now: ${newStatus}`, 'success');
                                        } catch (err) {
                                          console.error(err);
                                          showToast('Update Failed', 'Could not update status.', 'error');
                                        }
                                      }}
                                      className={styles.tableActionSelect}
                                    >
                                      <option value="Order Confirmed">Order Confirmed</option>
                                      <option value="Air Hub Transit">Air Hub Transit</option>
                                      <option value="Qatar Customs (DOH)">Customs (DOH)</option>
                                      <option value="Out for Delivery">Out for Delivery</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedOrder(ord);
                                        setRole('customer');
                                        setCustomerTab('tracking');
                                      }}
                                      className={styles.tableActionBtn}
                                    >
                                      Track
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Telegram Order Alerts Manager */}
                {(adminTab === 'all' || adminTab === 'telegram') && (
                  <TelegramAlertsManager />
                )}
              </div>
            )}
          </main>
        </div>

        {/* Convex Auth Sign-In & Sign-Up Modal */}
        <AuthModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onSuccess={() => setIsEmailModalOpen(false)}
        />

        {/* Dropshipping AliExpress Link & Sync Modal */}
        <AliExpressLinkModal
          isOpen={Boolean(linkingOrder)}
          onClose={() => setLinkingOrder(null)}
          order={linkingOrder}
          adminEmail={userEmail}
          adminKey={adminKey}
          onSuccess={() => {
            showToast('Tracking Linked! ✈️', 'AliExpress logistics synced into Qatify timeline', 'success');
          }}
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
                    backgroundColor: '#fff4ec',
                    color: '#FF6D00',
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
                Enter your <strong>Master Admin Secret Key</strong> to unlock dropship fulfillment, real-time analytics, and customer logistics management.
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
                      backgroundColor: '#FF6D00',
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
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '40px 0' }}>Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

