'use client';

// =============================================================================
// Qatify — Customer & Operations Dashboard (`/dashboard`)
// Role Switcher: Customer View (5-Stage Air Shipment Tracker) vs Admin View (Analytics)
// =============================================================================

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { QATAR_MUNICIPALITIES } from '@/data/products';
import { QatarAddress, Order } from '@/types/product';
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

  // Tracking search input
  const [trackingSearch, setTrackingSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order>(
    activeOrder || orders[0]
  );

  // Address Modal State
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<QatarAddress>({
    fullName: '',
    phone: '+974 ',
    municipality: QATAR_MUNICIPALITIES[0].name,
    zoneNumber: '',
    streetNumber: '',
    buildingNumber: '',
    unitNumber: '',
    landmark: '',
  });

  // Support / Return Claim Form State
  const [returnForm, setReturnForm] = useState({
    orderNumber: orders[0]?.orderNumber || '',
    reason: 'Damaged or defective item',
    comments: '',
  });

  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingSearch.trim()) return;

    const found = orders.find(
      (o) =>
        o.trackingNumber.toLowerCase() === trackingSearch.trim().toLowerCase() ||
        o.orderNumber.toLowerCase() === trackingSearch.trim().toLowerCase()
    );

    if (found) {
      setSelectedOrder(found);
      showToast('Shipment Located! 📦', `Tracking ref: ${found.trackingNumber}`);
    } else {
      showToast('Shipment Not Found', 'Check tracking code or try QA-EXP-8849201', 'warning');
    }
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.zoneNumber || !newAddress.streetNumber || !newAddress.buildingNumber) {
      showToast('Incomplete Fields', 'Please complete the Qatar National Address form.', 'warning');
      return;
    }
    addAddress(newAddress);
    setIsAddAddressOpen(false);
    setNewAddress({
      fullName: '',
      phone: '+974 ',
      municipality: QATAR_MUNICIPALITIES[0].name,
      zoneNumber: '',
      streetNumber: '',
      buildingNumber: '',
      unitNumber: '',
      landmark: '',
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

          {/* Role Switcher Pill (Customer vs Admin) */}
          <div className={styles.roleSwitcherWrap}>
            <span className={styles.switcherLabel}>View Mode:</span>
            <div className={styles.rolePillsGroup}>
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`${styles.rolePill} ${role === 'customer' ? styles.active : ''}`}
              >
                Customer Account
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`${styles.rolePill} ${role === 'admin' ? styles.active : ''}`}
              >
                Dropship Store Admin
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
              <div className={styles.sidebarNav}>
                <div className={styles.userProfileMini}>
                  <div className={styles.avatarCircle}>TA</div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>Tariq Al-Mansoor</span>
                    <span className={styles.userLocation}>Lusail, Qatar</span>
                  </div>
                </div>

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
                  <span>Support & 14-Day Returns</span>
                </button>
              </div>
            ) : (
              <div className={styles.sidebarNav}>
                <div className={styles.adminBadgeBlock}>
                  <span className={styles.adminPill}>DROPSHIP ADMIN</span>
                  <span className={styles.adminStoreName}>Qatify Qatar Hub</span>
                </div>

                <div className={styles.navGroupTitle}>Operations</div>
                <div className={`${styles.navItem} ${styles.active}`}>
                  <BarChart3 size={16} />
                  <span>Store Analytics & KPI</span>
                </div>
                <div className={styles.navItem}>
                  <Truck size={16} />
                  <span>Fulfillment Pipeline</span>
                </div>
                <div className={styles.navItem}>
                  <Users size={16} />
                  <span>Qatar Customer Database</span>
                </div>
              </div>
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
                  <div className={styles.kpiCard}>
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

                    {/* Active Shipment Card */}
                    <div className={styles.activeShipmentBanner}>
                      <div className={styles.shipmentMetaBlock}>
                        <span className={styles.shipmentTag}>LIVE AIR EXPRESS</span>
                        <h3 className={styles.shipmentTrackingCode}>
                          {selectedOrder.trackingNumber}
                        </h3>
                        <span className={styles.shipmentRef}>
                          Order Ref: {selectedOrder.orderNumber} • Placed on {selectedOrder.date}
                        </span>
                      </div>

                      <div className={styles.shipmentEtaBlock}>
                        <span className={styles.etaLabel}>Target Qatar Arrival:</span>
                        <strong className={styles.etaDates}>
                          {selectedOrder.estimatedDeliveryWindow}
                        </strong>
                        <span className={styles.etaLocation}>
                          Destination: {selectedOrder.address.municipality}
                        </span>
                      </div>
                    </div>

                    {/* 5-STAGE PROGRESS TIMELINE */}
                    <div className={styles.fiveStageTimeline}>
                      {selectedOrder.timeline.map((step, idx) => {
                        const isDone = step.completed;
                        const isCurrent = step.current;

                        return (
                          <div
                            key={step.stage}
                            className={`${styles.timelineNodeRow} ${
                              isDone ? styles.done : isCurrent ? styles.current : ''
                            }`}
                          >
                            <div className={styles.nodeColumn}>
                              <div className={styles.nodeCircle}>
                                {isDone ? (
                                  <CheckCircle2 size={16} />
                                ) : isCurrent ? (
                                  <Plane size={15} className={styles.pulsePlane} />
                                ) : (
                                  <span className={styles.stageIndex}>{idx + 1}</span>
                                )}
                              </div>
                              {idx < selectedOrder.timeline.length - 1 && (
                                <div className={styles.nodeLine} />
                              )}
                            </div>

                            <div className={styles.nodeDetails}>
                              <div className={styles.nodeTopLine}>
                                <h4 className={styles.nodeTitle}>{step.title}</h4>
                                <span className={styles.nodeDate}>{step.date}</span>
                              </div>
                              <p className={styles.nodeDesc}>{step.description}</p>
                              <div className={styles.nodeLocation}>
                                <MapPin size={12} />
                                <span>{step.location}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                      {orders.map((ord) => (
                        <div key={ord.id} className={styles.orderListItem}>
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
                            {ord.items.map((item, idx) => (
                              <div key={idx} className={styles.orderThumbWrap}>
                                <img
                                  src={item.product.images[0] || '/placeholder.svg'}
                                  alt={item.product.title}
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
                                    {item.product.title}
                                  </span>
                                  <span className={styles.orderItemQty}>
                                    Qty: {item.quantity} • QAR {item.product.priceQAR}
                                  </span>
                                </div>
                              </div>
                            ))}
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
                            <strong className={styles.addrRecipient}>{addr.fullName}</strong>
                            {addr.isDefault && (
                              <span className={styles.defaultPill}>DEFAULT</span>
                            )}
                          </div>
                          <div className={styles.addrPhone}>
                            <Phone size={13} />
                            <span>{addr.phone}</span>
                          </div>
                          <div className={styles.addrDetails}>
                            <p><strong>Municipality:</strong> {addr.municipality}</p>
                            <p><strong>Zone:</strong> {addr.zoneNumber}</p>
                            <p><strong>Street:</strong> {addr.streetNumber}</p>
                            <p><strong>Building:</strong> {addr.buildingNumber}</p>
                            {addr.unitNumber && <p><strong>Unit:</strong> {addr.unitNumber}</p>}
                            {addr.landmark && <p><strong>Landmark:</strong> {addr.landmark}</p>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Address Modal */}
                    {isAddAddressOpen && (
                      <div
                        className={styles.modalOverlay}
                        onClick={() => setIsAddAddressOpen(false)}
                      >
                        <div
                          className={styles.modalCard}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h3 className={styles.modalTitle}>Add New Qatar Address</h3>
                          <form onSubmit={handleSaveNewAddress} className={styles.modalForm}>
                            <div className={styles.modalField}>
                              <label>Full Name</label>
                              <input
                                type="text"
                                required
                                value={newAddress.fullName}
                                onChange={(e) =>
                                  setNewAddress({ ...newAddress, fullName: e.target.value })
                                }
                                placeholder="Recipient Name"
                              />
                            </div>
                            <div className={styles.modalField}>
                              <label>Phone (+974)</label>
                              <input
                                type="tel"
                                required
                                value={newAddress.phone}
                                onChange={(e) =>
                                  setNewAddress({ ...newAddress, phone: e.target.value })
                                }
                                placeholder="+974 5512 8894"
                              />
                            </div>
                            <div className={styles.modalField}>
                              <label>Municipality</label>
                              <select
                                value={newAddress.municipality}
                                onChange={(e) =>
                                  setNewAddress({ ...newAddress, municipality: e.target.value })
                                }
                              >
                                {QATAR_MUNICIPALITIES.map((mun) => (
                                  <option key={mun.code} value={mun.name}>
                                    {mun.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className={styles.modalField}>
                              <label>Zone Number</label>
                              <input
                                type="text"
                                required
                                value={newAddress.zoneNumber}
                                onChange={(e) =>
                                  setNewAddress({ ...newAddress, zoneNumber: e.target.value })
                                }
                                placeholder="e.g. Zone 69"
                              />
                            </div>
                            <div className={styles.modalField}>
                              <label>Street Number</label>
                              <input
                                type="text"
                                required
                                value={newAddress.streetNumber}
                                onChange={(e) =>
                                  setNewAddress({ ...newAddress, streetNumber: e.target.value })
                                }
                                placeholder="e.g. Street 312"
                              />
                            </div>
                            <div className={styles.modalField}>
                              <label>Building Number</label>
                              <input
                                type="text"
                                required
                                value={newAddress.buildingNumber}
                                onChange={(e) =>
                                  setNewAddress({ ...newAddress, buildingNumber: e.target.value })
                                }
                                placeholder="e.g. Building 18"
                              />
                            </div>

                            <div className={styles.modalActions}>
                              <button
                                type="button"
                                onClick={() => setIsAddAddressOpen(false)}
                                className={styles.cancelModalBtn}
                              >
                                Cancel
                              </button>
                              <button type="submit" className={styles.saveModalBtn}>
                                Save Address
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

                {/* TAB 5: SUPPORT & 14-DAY RETURNS */}
                {customerTab === 'support' && (
                  <div className={styles.tabContentCard}>
                    <h2 className={styles.cardHeading}>Qatar Customer Support & Returns</h2>
                    <p className={styles.cardSub}>
                      Direct assistance in Doha and Lusail with our 14-day defect replacement policy.
                    </p>

                    <div className={styles.supportChannelsGrid}>
                      <div className={styles.channelCard}>
                        <Phone size={22} className={styles.channelIcon} />
                        <h4>Direct Doha Hotline</h4>
                        <p>+974 4492 8100</p>
                        <span>8:00 AM – 11:00 PM (GMT+3)</span>
                      </div>

                      <div className={styles.channelCard}>
                        <Headphones size={22} className={styles.channelIcon} />
                        <h4>WhatsApp Concierge</h4>
                        <p>+974 5512 8894</p>
                        <span>Instant order tracking updates</span>
                      </div>
                    </div>

                    <div className={styles.returnFormSection}>
                      <h3 className={styles.returnFormTitle}>Submit 14-Day Return / Replacement Claim</h3>
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
                          Submit Replacement Claim
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ===============================================================
                ADMIN VIEW (DROPSHIP STORE ADMIN & PIPELINE OVERVIEW)
            ================================================================ */}
            {role === 'admin' && (
              <div className={styles.adminWorkspace}>
                {/* 4 Analytics KPI Cards */}
                <div className={styles.adminKpiGrid}>
                  <div className={styles.adminKpiCard}>
                    <div className={styles.adminKpiTop}>
                      <span className={styles.adminKpiTitle}>30-Day Gross Revenue</span>
                      <DollarSign size={18} className={styles.greenIcon} />
                    </div>
                    <strong className={styles.adminKpiValue}>QAR 148,290</strong>
                    <span className={styles.adminGrowthPill}>+18.4% vs last month</span>
                  </div>

                  <div className={styles.adminKpiCard}>
                    <div className={styles.adminKpiTop}>
                      <span className={styles.adminKpiTitle}>Net Dropship Margin</span>
                      <TrendingUp size={18} className={styles.yellowIcon} />
                    </div>
                    <strong className={styles.adminKpiValue}>38.4% (QAR 56,943)</strong>
                    <span className={styles.adminKpiSub}>Direct Factory Costing</span>
                  </div>

                  <div className={styles.adminKpiCard}>
                    <div className={styles.adminKpiTop}>
                      <span className={styles.adminKpiTitle}>Daily Volume (Qatar)</span>
                      <Package size={18} className={styles.redIcon} />
                    </div>
                    <strong className={styles.adminKpiValue}>84 Orders Today</strong>
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

                {/* Fulfillment Pipeline Breakdown */}
                <div className={styles.pipelineCard}>
                  <h3 className={styles.pipelineTitle}>Qatar Dropship Fulfillment Pipeline</h3>
                  <div className={styles.pipelineStagesRow}>
                    <div className={styles.pipelineStage}>
                      <div className={styles.pipelineCount}>14</div>
                      <div className={styles.pipelineStageName}>Pending Dispatch</div>
                      <span className={styles.pipelineStatusPill}>Supplier Pack</span>
                    </div>
                    <div className={styles.pipelineStage}>
                      <div className={styles.pipelineCount}>48</div>
                      <div className={styles.pipelineStageName}>In Air Transit</div>
                      <span className={styles.pipelineStatusYellow}>Flight to DOH</span>
                    </div>
                    <div className={styles.pipelineStage}>
                      <div className={styles.pipelineCount}>19</div>
                      <div className={styles.pipelineStageName}>Qatar Customs</div>
                      <span className={styles.pipelineStatusOrange}>Hamad Airport</span>
                    </div>
                    <div className={styles.pipelineStage}>
                      <div className={styles.pipelineCount}>215</div>
                      <div className={styles.pipelineStageName}>Delivered</div>
                      <span className={styles.pipelineStatusGreen}>Doorstep Drops</span>
                    </div>
                  </div>
                </div>

                {/* Recent Store Orders Table */}
                <div className={styles.adminTableCard}>
                  <div className={styles.adminTableHeadRow}>
                    <h3 className={styles.adminTableTitle}>Recent Cross-Border Orders (Qatar)</h3>
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
                        <tr>
                          <td><strong>QTF-78291-QA</strong></td>
                          <td>Tariq Al-Mansoor (Lusail Zone 69)</td>
                          <td>PulsePro ANC + Cable</td>
                          <td className="price-qar">QAR 237</td>
                          <td><code>QA-EXP-8849201</code></td>
                          <td>
                            <span className={styles.statusPillYellow}>Hamad Customs</span>
                          </td>
                          <td>
                            <button className={styles.tableActionBtn}>Inspect</button>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>QTF-77402-QA</strong></td>
                          <td>Jassim Al-Kuwari (Doha Zone 22)</td>
                          <td>HyperCharge 100W GaN</td>
                          <td className="price-qar">QAR 129</td>
                          <td><code>QA-EXP-8740291</code></td>
                          <td>
                            <span className={styles.statusPillBlue}>In Air Transit</span>
                          </td>
                          <td>
                            <button className={styles.tableActionBtn}>Inspect</button>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>QTF-76194-QA</strong></td>
                          <td>Mohammed Al-Thani (Al Rayyan)</td>
                          <td>Titan Ultra Smartwatch</td>
                          <td className="price-qar">QAR 189</td>
                          <td><code>QA-EXP-8629104</code></td>
                          <td>
                            <span className={styles.statusPillGreen}>Delivered</span>
                          </td>
                          <td>
                            <button className={styles.tableActionBtn}>Inspect</button>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>QTF-75482-QA</strong></td>
                          <td>Sara Al-Marri (Al Wakrah)</td>
                          <td>PureGlow Flask + Stand</td>
                          <td className="price-qar">QAR 148</td>
                          <td><code>QA-EXP-8519402</code></td>
                          <td>
                            <span className={styles.statusPillRed}>Pack Inspection</span>
                          </td>
                          <td>
                            <button className={styles.tableActionBtn}>Inspect</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
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

