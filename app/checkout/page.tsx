'use client';

// =============================================================================
// Qatify — Multi-Step Checkout Page (`/checkout`)
// Step 1: Qatar National Address | Step 2: Air Shipping | Step 3: Payment
// =============================================================================

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  ShieldCheck,
  Plane,
  CreditCard,
  Banknote,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  MapPin,
  Building,
  Phone,
  User,
  Mail,
  Sparkles,
  MessageCircle,
  Check,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import {
  QATAR_MUNICIPALITIES,
  SHIPPING_METHODS,
  SUPPORTED_COUNTRIES,
  ALIEXPRESS_QATAR_MUNICIPALITIES,
  ALIEXPRESS_MUNICIPALITY_ZONES,
  ALL_QATAR_ZONES,
} from '@/data/products';
import { QatarAddress, ShippingMethod, Order } from '@/types/product';
import {
  ApplePayIcon,
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  CashOnDeliveryIcon,
} from '@/components/ui/PaymentIcons';
import { CountryFlag } from '@/components/ui/CountryFlags';
import styles from './page.module.scss';

// Feature Flag: Cash on Delivery status (Set to true to re-enable COD on checkout)
const IS_COD_ENABLED = false;

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBundleCheckout = searchParams.get('mode') === 'bundle';

  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    appliedDiscountQAR,
    bundleCart,
    bundleSubtotal,
    bundleTierPercent,
    bundleDiscountQAR,
    clearBundleCart,
    isFreeShipping,
    savedAddresses,
    addAddress,
    createOrder,
    clearCart,
    showToast,
    openChat,
  } = useShop();

  const createConvexOrder = useMutation(api.orders.createOrder);
  const createPolarCheckout = useAction(api.polar.createCheckoutSession);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Steps state: 1 = Address, 2 = Payment
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Address State: Empty by default so all inputs show clean placeholder text
  const [address, setAddress] = useState<QatarAddress>({
    country: 'Qatar',
    firstName: '',
    lastName: '',
    email: '',
    phoneCountryCode: '974',
    phoneNumber: '',
    streetAddress: '',
    apartmentSuite: '',
    municipality: '',
    zoneNumber: '',
    postalCode: '',
    isDefault: true,
    fullName: '',
    phone: '',
  });

  const currentCountryConfig =
    SUPPORTED_COUNTRIES.find((c) => c.name === address.country) ||
    SUPPORTED_COUNTRIES.find((c) => c.code === address.country) ||
    SUPPORTED_COUNTRIES[0];

  // Custom Dropdown Open States & Refs for Outside Click
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [municipalityDropdownOpen, setMunicipalityDropdownOpen] = useState(false);
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);

  const countrySelectRef = React.useRef<HTMLDivElement>(null);
  const municipalitySelectRef = React.useRef<HTMLDivElement>(null);
  const zoneSelectRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (countrySelectRef.current && !countrySelectRef.current.contains(target)) {
        setCountryDropdownOpen(false);
      }
      if (municipalitySelectRef.current && !municipalitySelectRef.current.contains(target)) {
        setMunicipalityDropdownOpen(false);
      }
      if (zoneSelectRef.current && !zoneSelectRef.current.contains(target)) {
        setZoneDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountryChange = (countryName: string) => {
    const found = SUPPORTED_COUNTRIES.find((c) => c.name === countryName) || SUPPORTED_COUNTRIES[0];

    setAddress((prev) => ({
      ...prev,
      country: found.name,
      phoneCountryCode: found.phoneCode,
      postalCode: '', // Postal code stays empty so user types their own!
      municipality: '',
      zoneNumber: '',
    }));
  };

  const [saveAddressForFuture, setSaveAddressForFuture] = useState(true);

  // Shipping Method
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(
    SHIPPING_METHODS[0]
  );

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'credit_card' | 'cash_on_delivery'>('apple_pay');

  // Credit card mock inputs
  const [cardData, setCardData] = useState({
    cardNumber: '4111 2222 3333 4444',
    cardName: 'TARIQ AL MANSOOR',
    expiry: '09/28',
    cvv: '884',
  });

  // Success state / placed order
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Calculations based on checkout mode (Bundle vs Regular)
  const checkoutItems = isBundleCheckout ? bundleCart : cart;
  const checkoutSubtotal = isBundleCheckout ? bundleSubtotal : cartSubtotal;
  const shippingCost = selectedShipping.priceQAR;
  const totalDiscount = isBundleCheckout
    ? (bundleDiscountQAR || 0)
    : (appliedDiscountQAR || 0);
  const grandTotal = Math.max(0, checkoutSubtotal + shippingCost - totalDiscount);

  // Handle address submit -> move to step 2
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !address.firstName?.trim() ||
      !address.lastName?.trim() ||
      !address.phoneNumber?.trim() ||
      !address.streetAddress?.trim() ||
      !address.municipality?.trim() ||
      !address.zoneNumber?.trim()
    ) {
      showToast('Incomplete Address', 'Please fill in Name, Phone, Street, City & Zone.', 'warning');
      return;
    }
    if (!address.email?.trim() || !address.email.includes('@') || !address.email.includes('.')) {
      showToast('Valid Email Required', 'Please enter a valid email address for order notifications.', 'warning');
      return;
    }
    const resolvedFullName = `${address.firstName.trim()} ${address.lastName.trim()}`;
    const resolvedPhone = `+${(address.phoneCountryCode || currentCountryConfig.phoneCode).trim()} ${address.phoneNumber.trim()}`;
    const updatedAddress: QatarAddress = {
      ...address,
      country: address.country || currentCountryConfig.name,
      fullName: resolvedFullName,
      phone: resolvedPhone,
      streetNumber: address.streetAddress,
      buildingNumber: address.apartmentSuite || '',
      postalCode: address.postalCode?.trim() || currentCountryConfig.defaultPostalCode,
      isDefault: saveAddressForFuture,
    };
    if (saveAddressForFuture) {
      addAddress(updatedAddress);
    }
    setAddress(updatedAddress);
    setCurrentStep(2);
  };

  // Handle final order placement
  const handlePlaceOrder = async () => {
    if (checkoutItems.length === 0) {
      showToast(
        'Cart is Empty',
        isBundleCheckout
          ? 'Your bundle cart is empty. Please add items in Bundle Studio.'
          : 'Please add items before placing an order.',
        'warning'
      );
      router.push(isBundleCheckout ? '/bundle-builder' : '/shop');
      return;
    }

    try {
      setIsSubmitting(true);

      const itemsPayload = checkoutItems.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        slug: item.product.slug,
        priceQAR: item.product.priceQAR,
        quantity: item.quantity,
        image: item.product.images[0] || '/placeholder.svg',
        selectedColor: item.selectedColor,
        selectedOption: item.selectedOption,
      }));

      // 1. Create persistent order in Convex database
      const resolvedFullName = `${address.firstName || ''} ${address.lastName || ''}`.trim() || address.fullName || 'Customer';
      const resolvedPhone = `+${(address.phoneCountryCode || currentCountryConfig.phoneCode).trim()} ${(address.phoneNumber || '').trim()}`.trim() || address.phone || '+974 44374646';

      const orderResult = await createConvexOrder({
        items: itemsPayload,
        couponCode: (!isBundleCheckout && appliedCoupon) ? appliedCoupon : undefined,
        address: {
          country: address.country || currentCountryConfig.name,
          firstName: address.firstName,
          lastName: address.lastName,
          phoneCountryCode: address.phoneCountryCode || currentCountryConfig.phoneCode,
          phoneNumber: address.phoneNumber,
          streetAddress: address.streetAddress,
          apartmentSuite: address.apartmentSuite,
          municipality: address.municipality,
          zoneNumber: address.zoneNumber,
          postalCode: address.postalCode || currentCountryConfig.defaultPostalCode,
          isDefault: saveAddressForFuture,
          fullName: resolvedFullName,
          phone: resolvedPhone,
          email: address.email?.trim() || undefined,
          streetNumber: address.streetAddress || address.streetNumber,
          buildingNumber: address.apartmentSuite || address.buildingNumber,
          unitNumber: address.unitNumber || undefined,
          landmark: address.landmark || undefined,
        },
        shippingMethod: {
          id: selectedShipping.id,
          name: selectedShipping.name,
          badge: selectedShipping.badge,
          duration: selectedShipping.duration,
          priceQAR: selectedShipping.priceQAR,
          description: selectedShipping.description,
        },
        paymentMethod: paymentMethod === 'cash_on_delivery' ? 'cash_on_delivery' : 'polar',
      });

      // 2. Also save into local ShopContext
      createOrder({
        items: checkoutItems,
        subtotalQAR: checkoutSubtotal,
        shippingQAR: shippingCost,
        discountQAR: totalDiscount,
        totalQAR: grandTotal,
        address,
        shippingMethod: selectedShipping,
        paymentMethod,
        estimatedDeliveryWindow: '6–10 Business Days to Qatar',
      });

      // 3. Clear the appropriate cart
      if (isBundleCheckout) {
        clearBundleCart();
      } else {
        clearCart();
      }

      // 4. If Cash on Delivery, route to confirmation
      if (paymentMethod === 'cash_on_delivery') {
        router.push(`/checkout/success?orderNumber=${orderResult.orderNumber}&method=cod`);
        return;
      }

      // 5. Digital checkout: Create Polar checkout session
      const session = await createPolarCheckout({
        orderId: orderResult.orderId,
      });

      if (session?.checkoutUrl) {
        window.location.href = session.checkoutUrl;
      } else {
        router.push(`/checkout/success?orderNumber=${orderResult.orderNumber}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      showToast('Checkout Failed', 'Could not process order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was successfully created, render celebration state
  if (confirmedOrder) {
    return (
      <div className={styles.orderSuccessPage}>
        <div className="container">
          <div className={styles.successCard}>
            <div className={styles.successIconCircle}>
              <CheckCircle2 size={54} />
            </div>

            <span className={styles.successPill}>ORDER CONFIRMED & VERIFIED</span>
            <h1 className={styles.successHeading}>Shukran! Your Order is Placed</h1>
            <p className={styles.successSub}>
              We are routing your items to our international air logistics hub. You will receive step-by-step SMS updates with live Qatar customs tracking.
            </p>

            <div className={styles.orderMetadataBox}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Order Number</span>
                <strong className={styles.metaValueMono}>{confirmedOrder.orderNumber}</strong>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Air Express Tracking</span>
                <strong className={styles.trackingNumberHighlight}>
                  {confirmedOrder.trackingNumber}
                </strong>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Delivery Destination</span>
                <span className={styles.metaValue}>
                  {confirmedOrder.address.streetAddress || confirmedOrder.address.streetNumber}, {confirmedOrder.address.apartmentSuite || confirmedOrder.address.buildingNumber}, {confirmedOrder.address.municipality}, {confirmedOrder.address.zoneNumber}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Estimated Arrival</span>
                <strong className={styles.metaValue}>
                  6–10 Business Days via Hamad Int’l Airport (DOH)
                </strong>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Total Paid</span>
                <strong className={styles.metaValuePrice}>
                  QAR {confirmedOrder.totalQAR.toLocaleString()}
                </strong>
              </div>
            </div>

            <div className={styles.successCtaRow}>
              <Link href="/dashboard" className={styles.trackShipmentBtn}>
                <Plane size={16} />
                <span>Track International Shipment</span>
              </Link>
              <Link href="/shop" className={styles.backHomeBtn}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        {/* Header Breadcrumb */}
        <nav className={styles.breadcrumbNav}>
          <Link href={isBundleCheckout ? '/bundle-cart' : '/cart'} className={styles.crumbLink}>
            {isBundleCheckout ? 'Bundle Cart' : 'Cart'}
          </Link>
          <ChevronRight size={13} className={styles.crumbChevron} />
          <span className={styles.currentCrumb}>
            {isBundleCheckout ? 'Wholesale Bundle Checkout' : 'Qatar Express Checkout'}
          </span>
        </nav>

        {/* 2-Step Visual Progress Bar */}
        <div className={styles.stepsProgressBar}>
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`${styles.stepIndicator} ${currentStep >= 1 ? styles.active : ''}`}
          >
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepLabelCol}>
              <span className={styles.stepTitle}>Qatar Address</span>
              <span className={styles.stepDesc}>Zone, Street & Building</span>
            </div>
          </button>

          <div className={`${styles.stepConnector} ${currentStep >= 2 ? styles.active : ''}`} />

          <div className={`${styles.stepIndicator} ${currentStep === 2 ? styles.active : ''}`}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepLabelCol}>
              <span className={styles.stepTitle}>Payment</span>
              <span className={styles.stepDesc}>
                {IS_COD_ENABLED ? 'Apple Pay / Card / COD' : 'Apple Pay / Card'}
              </span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout: Form (Left) & Order Summary (Right) */}
        <div className={styles.checkoutLayout}>
          {/* Form Column */}
          <div className={styles.formColumn}>
            {/* ===============================================================
                STEP 1: ALIEXPRESS QATAR DROPSHIP SHIPPING DETAILS
            ================================================================ */}
            {currentStep === 1 && (
              <div className={styles.aliCardWrapper}>
                {/* Quick saved addresses selection pills */}
                {savedAddresses.length > 0 && (
                  <div className={styles.savedAddressesBar}>
                    <span className={styles.savedBarLabel}>Quick Select:</span>
                    {savedAddresses.map((addr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAddress({
                            country: addr.country || 'Qatar',
                            firstName: addr.firstName || '',
                            lastName: addr.lastName || '',
                            email: addr.email || '',
                            phoneCountryCode: addr.phoneCountryCode || '974',
                            phoneNumber: addr.phoneNumber || '',
                            streetAddress: addr.streetAddress || addr.streetNumber || '',
                            apartmentSuite: addr.apartmentSuite || addr.buildingNumber || '',
                            municipality: addr.municipality || '',
                            zoneNumber: addr.zoneNumber || '',
                            postalCode: addr.postalCode || '',
                            isDefault: addr.isDefault ?? true,
                            fullName: addr.fullName || '',
                            phone: addr.phone || '',
                          });
                        }}
                        className={styles.savedAddrPill}
                      >
                        {addr.firstName || addr.fullName?.split(' ')[0] || 'Address'} • {addr.municipality} ({addr.zoneNumber})
                      </button>
                    ))}
                  </div>
                )}

                <div className={styles.aliModalCard}>
                  <div className={styles.aliModalHeader}>
                    <h2 className={styles.aliModalTitle}>Add new address</h2>
                  </div>

                  <form onSubmit={handleAddressSubmit} className={styles.aliAddressForm}>
                    {/* 1. Country/region */}
                    <div className={styles.aliSection}>
                      <label className={styles.aliSectionTitle}>Country/region</label>
                      <div
                        ref={countrySelectRef}
                        className={`${styles.customSelectWrapper} ${countryDropdownOpen ? styles.wrapperOpen : ''}`}
                        style={{ maxWidth: '320px' }}
                      >
                        <div
                          className={`${styles.aliCountrySelector} ${countryDropdownOpen ? styles.dropdownActiveTrigger : ''}`}
                          onClick={() => {
                            setCountryDropdownOpen(!countryDropdownOpen);
                            setMunicipalityDropdownOpen(false);
                            setZoneDropdownOpen(false);
                          }}
                        >
                          <div className={styles.aliCountryInfo}>
                            <CountryFlag code={currentCountryConfig.code} size={22} />
                            <span className={styles.aliCountryCodeBadge}>{currentCountryConfig.code}</span>
                            <span className={styles.aliCountryName}>{currentCountryConfig.name}</span>
                          </div>
                          <ChevronDown
                            size={18}
                            className={`${styles.dropdownChevron} ${countryDropdownOpen ? styles.chevronOpen : ''}`}
                          />
                        </div>

                        {countryDropdownOpen && (
                          <div className={styles.customDropdownMenu}>
                            {SUPPORTED_COUNTRIES.map((c) => {
                              const isSelected = currentCountryConfig.code === c.code;
                              return (
                                <div
                                  key={c.code}
                                  className={`${styles.customDropdownItem} ${isSelected ? styles.itemSelected : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCountryChange(c.name);
                                    setCountryDropdownOpen(false);
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
                              value={address.firstName}
                              onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                              placeholder="First name"
                              className={styles.aliTextInput}
                            />
                          </div>
                          <div className={styles.aliInputCol}>
                            <input
                              type="text"
                              required
                              value={address.lastName}
                              onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
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
                              value={address.email || ''}
                              onChange={(e) => setAddress({ ...address, email: e.target.value })}
                              placeholder="Email address"
                              className={styles.aliTextInput}
                            />
                          </div>
                          <div className={styles.aliPhoneGroup}>
                            <div className={styles.aliPhonePrefix}>{currentCountryConfig.phoneCode}</div>
                            <input
                              type="tel"
                              required
                              value={address.phoneNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setAddress({ ...address, phoneNumber: val });
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
                          value={address.streetAddress}
                          onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                          placeholder="Street address, road or house number"
                          className={styles.aliTextInput}
                        />
                        <input
                          type="text"
                          value={address.apartmentSuite || ''}
                          onChange={(e) => setAddress({ ...address, apartmentSuite: e.target.value })}
                          placeholder="Building, Apt, Suite, Unit (Optional)"
                          className={styles.aliTextInput}
                        />
                      </div>

                      {/* Row 2: Municipality/Province, Zone/District, Postal code */}
                      <div className={styles.aliAddressRow2}>
                        {/* Custom Municipality Dropdown */}
                        <div
                          ref={municipalitySelectRef}
                          className={`${styles.customSelectWrapper} ${municipalityDropdownOpen ? styles.wrapperOpen : ''}`}
                        >
                          <div
                            className={`${styles.customSelectTrigger} ${municipalityDropdownOpen ? styles.dropdownActiveTrigger : ''}`}
                            onClick={() => {
                              setMunicipalityDropdownOpen(!municipalityDropdownOpen);
                              setCountryDropdownOpen(false);
                              setZoneDropdownOpen(false);
                            }}
                          >
                            <span className={address.municipality ? styles.selectValueText : styles.selectPlaceholderText}>
                              {address.municipality ||
                                (currentCountryConfig.code === 'QA'
                                  ? 'Select Municipality'
                                  : currentCountryConfig.code === 'SA'
                                    ? 'Select Province / City'
                                    : 'Select Emirate / City')}
                            </span>
                            <ChevronDown
                              size={16}
                              className={`${styles.dropdownChevron} ${municipalityDropdownOpen ? styles.chevronOpen : ''}`}
                            />
                          </div>

                          {municipalityDropdownOpen && (
                            <div className={styles.customDropdownMenu}>
                              {currentCountryConfig.provinces.map((prov) => {
                                const isSelected = address.municipality === prov;
                                return (
                                  <div
                                    key={prov}
                                    className={`${styles.customDropdownItem} ${isSelected ? styles.itemSelected : ''}`}
                                    onClick={() => {
                                      setAddress({ ...address, municipality: prov, zoneNumber: '' });
                                      setMunicipalityDropdownOpen(false);
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
                          ref={zoneSelectRef}
                          className={`${styles.customSelectWrapper} ${zoneDropdownOpen ? styles.wrapperOpen : ''}`}
                        >
                          <div
                            className={`${styles.customSelectTrigger} ${zoneDropdownOpen ? styles.dropdownActiveTrigger : ''}`}
                            onClick={() => {
                              if (!address.municipality) {
                                showToast(
                                  'Select City First',
                                  'Please choose a municipality or city first to view its zones.',
                                  'info'
                                );
                                return;
                              }
                              setZoneDropdownOpen(!zoneDropdownOpen);
                              setCountryDropdownOpen(false);
                              setMunicipalityDropdownOpen(false);
                            }}
                          >
                            <span className={address.zoneNumber ? styles.selectValueText : styles.selectPlaceholderText}>
                              {address.zoneNumber ||
                                (currentCountryConfig.code === 'QA'
                                  ? 'Select Zone'
                                  : currentCountryConfig.code === 'SA'
                                    ? 'Select District'
                                    : 'Select Area / Zone')}
                            </span>
                            <ChevronDown
                              size={16}
                              className={`${styles.dropdownChevron} ${zoneDropdownOpen ? styles.chevronOpen : ''}`}
                            />
                          </div>

                          {zoneDropdownOpen && (
                            <div className={styles.customDropdownMenu}>
                              {(currentCountryConfig.zones[address.municipality] || []).length > 0 ? (
                                (currentCountryConfig.zones[address.municipality] || []).map((z) => {
                                  const isSelected = address.zoneNumber === z;
                                  return (
                                    <div
                                      key={z}
                                      className={`${styles.customDropdownItem} ${isSelected ? styles.itemSelected : ''}`}
                                      onClick={() => {
                                        setAddress({ ...address, zoneNumber: z });
                                        setZoneDropdownOpen(false);
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
                          value={address.postalCode || ''}
                          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
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
                          checked={saveAddressForFuture}
                          onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                          className={styles.aliHiddenCheck}
                        />
                        <span className={`${styles.aliCustomBox} ${saveAddressForFuture ? styles.checked : ''}`}>
                          {saveAddressForFuture && <Check size={13} strokeWidth={3} color="#ffffff" />}
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

            {/* ===============================================================
                STEP 2: PAYMENT METHOD SELECTOR UI
            ================================================================ */}
            {currentStep === 2 && (
              <div className={styles.stepFormCard}>
                <div className={styles.formCardHeader}>
                  <Lock size={20} className={styles.headerIconRed} />
                  <div>
                    <h2 className={styles.formCardTitle}>2. Select Secure Payment Method</h2>
                    <p className={styles.formCardSub}>
                      All transactions are 256-bit encrypted and processed in Qatari Riyal (QAR).
                    </p>
                  </div>
                </div>

                {/* Payment Option Tabs */}
                <div className={styles.paymentMethodTabs}>
                  {/* Apple Pay */}
                  <div
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`${styles.payOptionCard} ${
                      paymentMethod === 'apple_pay' ? styles.activePay : ''
                    }`}
                  >
                    <div className={styles.payOptionHeader}>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'apple_pay'}
                        onChange={() => setPaymentMethod('apple_pay')}
                      />
                      <span className={styles.payOptionName}>Apple Pay</span>
                      <ApplePayIcon width={40} height={25} />
                      <span className={styles.recommendedPill}>RECOMMENDED IN QATAR</span>
                    </div>
                    <p className={styles.payOptionSub}>
                      Pay instantly with Touch ID or Face ID using your Apple devices.
                    </p>
                  </div>

                  {/* Credit / Debit Card */}
                  <div
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`${styles.payOptionCard} ${
                      paymentMethod === 'credit_card' ? styles.activePay : ''
                    }`}
                  >
                    <div className={styles.payOptionHeader}>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                      />
                      <span className={styles.payOptionName}>Credit / Debit Card</span>
                      <div className={styles.cardLogosRow}>
                        <VisaIcon width={34} height={21} />
                        <MastercardIcon width={34} height={21} />
                        <AmexIcon width={34} height={21} />
                      </div>
                    </div>
                    <p className={styles.payOptionSub}>
                      Secure payment with local Qatari banks or international credit cards.
                    </p>

                    {paymentMethod === 'credit_card' && (
                      <div className={styles.mockCardForm} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.formGroupFull}>
                          <label className={styles.fieldLabel}>Cardholder Name</label>
                          <input
                            type="text"
                            value={cardData.cardName}
                            onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                            className={styles.textInput}
                          />
                        </div>

                        <div className={styles.formGroupFull}>
                          <label className={styles.fieldLabel}>Card Number</label>
                          <input
                            type="text"
                            value={cardData.cardNumber}
                            onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                            className={styles.textInput}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.fieldLabel}>Expiry Date</label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            className={styles.textInput}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.fieldLabel}>CVV / CVC</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            className={styles.textInput}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery (COD) - Conditionally rendered when enabled */}
                  {IS_COD_ENABLED && (
                    <div
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`${styles.payOptionCard} ${
                        paymentMethod === 'cash_on_delivery' ? styles.activePay : ''
                      }`}
                    >
                      <div className={styles.payOptionHeader}>
                        <input
                          type="radio"
                          name="payMethod"
                          checked={paymentMethod === 'cash_on_delivery'}
                          onChange={() => setPaymentMethod('cash_on_delivery')}
                        />
                        <span className={styles.payOptionName}>Cash on Delivery (COD)</span>
                        <CashOnDeliveryIcon width={40} height={25} />
                        <span className={styles.codPill}>ALL QATAR ZONES</span>
                      </div>
                      <p className={styles.payOptionSub}>
                        Pay in cash (QAR) directly to the delivery courier upon doorstep package handover.
                      </p>
                    </div>
                  )}
                </div>

                <div className={styles.stepButtonRow}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className={styles.backStepBtn}
                  >
                    ← Edit Address
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className={styles.confirmOrderBtn}
                    style={{
                      opacity: isSubmitting ? 0.75 : 1,
                      cursor: isSubmitting ? 'wait' : 'pointer',
                    }}
                  >
                    <Lock size={16} />
                    <span>
                      {isSubmitting
                        ? 'Connecting to Polar Gateway...'
                        : `Confirm & Place Qatar Order (QAR ${grandTotal.toLocaleString()})`}
                    </span>
                  </button>
                </div>

                <p
                  style={{
                    fontSize: '11.5px',
                    color: '#71717a',
                    textAlign: 'center',
                    marginTop: '12px',
                    lineHeight: '1.45',
                  }}
                >
                  By placing your order, you agree to Qatify&apos;s{' '}
                  <Link href="/terms" style={{ color: '#FF6D00', textDecoration: 'underline' }}>
                    Terms &amp; Conditions
                  </Link>
                  ,{' '}
                  <Link href="/privacy" style={{ color: '#FF6D00', textDecoration: 'underline' }}>
                    Privacy Policy
                  </Link>
                  , and{' '}
                  <Link href="/refund-policy" style={{ color: '#FF6D00', textDecoration: 'underline' }}>
                    Refund &amp; Return Policy
                  </Link>
                  . Covered by our 100% Lost Parcel Money-Back Guarantee (Insha&apos;Allah).
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Order Review Summary */}
          <div className={styles.summaryColumn}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Review</h3>

              {/* Items List */}
              <div className={styles.summaryItemsList}>
                {checkoutItems.map((item) => (
                  <div key={item.id} className={styles.summaryItem}>
                    <img
                      src={item.product.images[0] || '/placeholder.svg'}
                      alt={item.product.title}
                      className={styles.summaryItemImg}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith('/placeholder.svg')) {
                          target.src = '/placeholder.svg';
                        }
                      }}
                    />
                    <div className={styles.summaryItemInfo}>
                      <h4 className={styles.summaryItemTitle}>{item.product.title}</h4>
                      <div className={styles.summaryItemMeta}>
                        <span>Qty: {item.quantity}</span>
                        {item.selectedColor && <span> • {item.selectedColor}</span>}
                      </div>
                    </div>
                    <div className={styles.summaryItemPrice}>
                      QAR {item.product.priceQAR * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className={styles.summaryCalculations}>
                <div className={styles.calcRow}>
                  <span>Subtotal</span>
                  <span className="price-qar">QAR {checkoutSubtotal.toLocaleString()}</span>
                </div>

                {isBundleCheckout && bundleDiscountQAR > 0 && (
                  <div className={styles.calcRow} style={{ color: '#16a34a' }}>
                    <span>Tiered Bundle ({bundleTierPercent}% OFF)</span>
                    <span className="price-qar">- QAR {bundleDiscountQAR.toLocaleString()}</span>
                  </div>
                )}

                {!isBundleCheckout && appliedDiscountQAR > 0 && (
                  <div className={styles.calcRow} style={{ color: '#16a34a' }}>
                    <span>Promo Coupon</span>
                    <span className="price-qar">- QAR {appliedDiscountQAR.toLocaleString()}</span>
                  </div>
                )}

                <div className={styles.calcRow}>
                  <div className={styles.calcLabelCol}>
                    <span>{selectedShipping.name}</span>
                    <span className={styles.calcSub}>{selectedShipping.duration}</span>
                  </div>
                  <span className="price-qar">
                    {shippingCost === 0 ? (
                      <strong className={styles.freeGreen}>FREE</strong>
                    ) : (
                      `QAR ${shippingCost}`
                    )}
                  </span>
                </div>

                <div className={`${styles.calcRow} ${styles.grandTotal}`}>
                  <span>Total Amount</span>
                  <span className={styles.grandPrice}>
                    QAR {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery Guarantee Pill */}
              <div className={styles.checkoutGuarantees}>
                <div className={styles.guaranteeItem}>
                  <ShieldCheck size={16} />
                  <span>100% Pre-Dispatch Quality Check</span>
                </div>
                <div className={styles.guaranteeItem}>
                  <Plane size={16} />
                  <span>Fast Doorstep Delivery in Qatar</span>
                </div>
              </div>

              {/* Checkout Live Support Card */}
              <div className={styles.checkoutHelpCard}>
                <div className={styles.checkoutHelpText}>
                  <span>Need assistance with your order?</span>
                  <strong>Chat live with our Doha checkout team</strong>
                </div>
                <button
                  type="button"
                  onClick={() => openChat('I need assistance with checkout and payment in Qatar.')}
                  className={styles.checkoutChatBtn}
                >
                  <MessageCircle size={14} />
                  <span>Chat With Us</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px 20px', textAlign: 'center' }}>Loading Qatar Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

