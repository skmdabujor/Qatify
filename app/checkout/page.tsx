'use client';

// =============================================================================
// Qatify — Authentic Made-in-China / Shopify Style In-Site Secure Checkout
// Single-Page Layout: Shipping Address Modal | In-App Card / Apple Pay / GPay | Order Protection
// =============================================================================

import React, { useState, Suspense, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  ShieldCheck,
  Plane,
  CreditCard,
  Lock,
  ChevronRight,
  ChevronDown,
  MapPin,
  Building,
  Phone,
  User,
  Mail,
  Sparkles,
  Check,
  X,
  Info,
  RotateCcw,
  Search,
  CheckCircle2,
  FileText,
  AlertCircle,
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
  GooglePayIcon,
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  MaestroIcon,
  JcbIcon,
  DiscoverIcon,
  QarCurrencyIcon,
} from '@/components/ui/PaymentIcons';
import { CountryFlag } from '@/components/ui/CountryFlags';
import { CheckoutSkeleton } from '@/components/ui/skeleton';
import styles from './page.module.scss';

// Feature Flag: Cash on Delivery status (Explicitly disabled as requested)
const IS_COD_ENABLED = false;

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBundleCheckout = searchParams.get('mode') === 'bundle';
  const isBuyNowCheckout = searchParams.get('mode') === 'buynow';

  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    appliedDiscountQAR,
    bundleCart,
    bundleSubtotal,
    bundleDiscountQAR,
    clearBundleCart,
    buyNowItem,
    clearBuyNow,
    savedAddresses,
    addAddress,
    createOrder,
    clearCart,
    showToast,
  } = useShop();

  const createConvexOrder = useMutation(api.orders.createOrder);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressMissingError, setAddressMissingError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const addressSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll while address modal is open
  useEffect(() => {
    if (isAddressModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAddressModalOpen]);

  // Active Shipping Address State
  const initialSavedAddress = savedAddresses?.[0] || null;
  const [address, setAddress] = useState<QatarAddress>(() => {
    if (initialSavedAddress) {
      return initialSavedAddress;
    }
    return {
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
    };
  });

  // Modal editing address draft
  const [draftAddress, setDraftAddress] = useState<QatarAddress>({
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

  const [saveAddressForFuture, setSaveAddressForFuture] = useState(true);

  // Check if a valid shipping address has been configured
  const hasValidAddress = Boolean(
    address.firstName?.trim() &&
    address.phoneNumber?.trim() &&
    address.streetAddress?.trim() &&
    address.municipality?.trim() &&
    address.postalCode?.trim()
  );

  // Current Country Config
  const currentCountryConfig =
    SUPPORTED_COUNTRIES.find((c) => c.name === draftAddress.country) ||
    SUPPORTED_COUNTRIES.find((c) => c.code === draftAddress.country) ||
    SUPPORTED_COUNTRIES[0];

  // Country, Municipality, Zone Dropdown states in Modal
  const [modalCountryOpen, setModalCountryOpen] = useState(false);
  const [modalMunicipalityOpen, setModalMunicipalityOpen] = useState(false);
  const [modalZoneOpen, setModalZoneOpen] = useState(false);

  const countryRef = useRef<HTMLDivElement>(null);
  const muniRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (countryRef.current && !countryRef.current.contains(target)) {
        setModalCountryOpen(false);
      }
      if (muniRef.current && !muniRef.current.contains(target)) {
        setModalMunicipalityOpen(false);
      }
      if (zoneRef.current && !zoneRef.current.contains(target)) {
        setModalZoneOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Shipping Method
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(
    SHIPPING_METHODS[0]
  );

  // Customer Order Note
  const [orderNote, setOrderNote] = useState('');

  // Payment Method Selection: 'credit_card' (Add a New Card) | 'apple_pay' | 'google_pay'
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'google_pay'>('credit_card');

  // Credit Card Form Data
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    billingSameAsShipping: true,
    saveCard: true,
  });

  // Restore saved card from localStorage on mount (so user doesn't have to fill it repeatedly)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('qatify_saved_payment_card');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setCardData((prev) => ({
            ...prev,
            cardNumber: parsed.cardNumber || '',
            cardName: parsed.cardName || '',
            expiry: parsed.expiry || '',
            cvv: parsed.cvv || '',
            billingSameAsShipping: parsed.billingSameAsShipping ?? true,
            saveCard: true,
          }));
        }
      }
    } catch (err) {
      console.error('Error loading saved card:', err);
    }
  }, []);

  // Helper to persist card data to localStorage
  const persistSavedCard = (data: {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
    billingSameAsShipping: boolean;
    saveCard: boolean;
  }) => {
    if (typeof window === 'undefined') return;
    try {
      if (data.saveCard) {
        localStorage.setItem(
          'qatify_saved_payment_card',
          JSON.stringify({
            cardNumber: data.cardNumber,
            cardName: data.cardName,
            expiry: data.expiry,
            cvv: data.cvv,
            billingSameAsShipping: data.billingSameAsShipping,
          })
        );
      } else {
        localStorage.removeItem('qatify_saved_payment_card');
      }
    } catch (err) {
      console.error('Error saving card:', err);
    }
  };

  // Terms and conditions acceptance
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Calculations based on checkout mode (Bundle vs Buy Now vs Regular Cart)
  const checkoutItems = isBundleCheckout
    ? bundleCart
    : isBuyNowCheckout
    ? (buyNowItem ? [buyNowItem] : [])
    : cart;

  const checkoutSubtotal = isBundleCheckout
    ? bundleSubtotal
    : isBuyNowCheckout
    ? (buyNowItem ? buyNowItem.product.priceQAR * buyNowItem.quantity : 0)
    : cartSubtotal;

  const isFreeShipping = checkoutSubtotal >= 150;
  const shippingCost = isFreeShipping ? 0 : (selectedShipping?.priceQAR ?? 20);
  const totalDiscount = isBundleCheckout
    ? (bundleDiscountQAR || 0)
    : (appliedDiscountQAR || 0);

  const grandTotal = Math.max(0, checkoutSubtotal + shippingCost - totalDiscount);

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    const updated = { ...cardData, cardNumber: formatted };
    setCardData(updated);
    if (updated.saveCard) persistSavedCard(updated);
  };

  // Cardholder Name Change
  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...cardData, cardName: e.target.value };
    setCardData(updated);
    if (updated.saveCard) persistSavedCard(updated);
  };

  // Format Expiry (MM / YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    const updated = { ...cardData, expiry: val };
    setCardData(updated);
    if (updated.saveCard) persistSavedCard(updated);
  };

  // CVV Change
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCvv = e.target.value.replace(/\D/g, '').slice(0, 4);
    const updated = { ...cardData, cvv: newCvv };
    setCardData(updated);
    if (updated.saveCard) persistSavedCard(updated);
  };

  // Toggle Save Card Checkbox
  const handleSaveCardToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const updated = { ...cardData, saveCard: isChecked };
    setCardData(updated);
    persistSavedCard(updated);
  };

  // Detect Card Brand from card number
  const detectCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    if (/^(6011|65|64[4-9])/.test(clean)) return 'discover';
    if (/^(352[89]|35[3-8][0-9])/.test(clean)) return 'jcb';
    return 'card';
  };

  // Open modal with current address or clear draft
  const openAddressModal = () => {
    if (hasValidAddress) {
      setDraftAddress({ ...address });
    } else {
      setDraftAddress({
        country: 'Qatar',
        firstName: '',
        lastName: '',
        email: address.email || '',
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
    }
    setIsAddressModalOpen(true);
  };

  // Save Modal Address
  const handleSaveDraftAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !draftAddress.firstName?.trim() ||
      !draftAddress.phoneNumber?.trim() ||
      !draftAddress.streetAddress?.trim() ||
      !draftAddress.municipality?.trim() ||
      !draftAddress.postalCode?.trim() ||
      !draftAddress.email?.trim()
    ) {
      showToast(
        'Required Fields Missing',
        'Please fill in all required fields (Name, Email, Address, City, Postal Code, and Phone).',
        'warning'
      );
      return;
    }

    const resolvedFullName = `${draftAddress.firstName.trim()} ${draftAddress.lastName?.trim() || ''}`.trim();
    const resolvedPhone = `+${(draftAddress.phoneCountryCode || currentCountryConfig.phoneCode).trim()} ${draftAddress.phoneNumber.trim()}`;

    const completeAddress: QatarAddress = {
      ...draftAddress,
      country: draftAddress.country || currentCountryConfig.name,
      fullName: resolvedFullName,
      phone: resolvedPhone,
      email: draftAddress.email.trim(),
      streetNumber: draftAddress.streetAddress,
      buildingNumber: draftAddress.apartmentSuite || '',
      postalCode: draftAddress.postalCode.trim(),
      isDefault: saveAddressForFuture,
    };

    if (saveAddressForFuture) {
      addAddress(completeAddress);
    }
    setAddress(completeAddress);
    setAddressMissingError(false);
    setIsAddressModalOpen(false);
    showToast('Shipping Address Saved', 'Delivery address confirmed for this order.', 'success');
  };

  // Handle Pay Now Action
  const handlePayNow = async () => {
    if (checkoutItems.length === 0) {
      showToast(
        'Cart is Empty',
        isBuyNowCheckout
          ? 'No product selected for instant checkout.'
          : isBundleCheckout
          ? 'Your bundle cart is empty. Please add items in Bundle Studio.'
          : 'Please add items before placing an order.',
        'warning'
      );
      router.push(isBundleCheckout ? '/bundle-builder' : '/shop');
      return;
    }

    // Ensure shipping address exists
    if (!hasValidAddress) {
      setAddressMissingError(true);
      showToast('Shipping Address Required', 'Please enter your delivery address to continue.', 'warning');
      addressSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      openAddressModal();
      return;
    }

    // Validate Card if Credit Card is selected
    if (paymentMethod === 'credit_card') {
      const cleanCard = cardData.cardNumber.replace(/\s+/g, '');
      if (cleanCard.length < 15) {
        showToast('Invalid Card Number', 'Please enter a valid 15 or 16-digit card number.', 'warning');
        return;
      }
      if (!cardData.cardName.trim()) {
        showToast('Cardholder Name Required', 'Please enter the given name on the card.', 'warning');
        return;
      }
      if (!cardData.expiry || !cardData.expiry.includes('/')) {
        showToast('Expiry Date Required', 'Please provide a valid expiration date (MM/YY).', 'warning');
        return;
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        showToast('Security Code Required', 'Please enter a valid CVV/CSC code (3 or 4 digits).', 'warning');
        return;
      }
    }

    if (!agreedToTerms) {
      showToast('Terms Acceptance Required', 'Please agree to the Terms and Conditions to proceed.', 'warning');
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

      const resolvedFullName =
        `${address.firstName || ''} ${address.lastName || ''}`.trim() || address.fullName || 'Valued Customer';
      const resolvedPhone =
        `+${(address.phoneCountryCode || currentCountryConfig.phoneCode).trim()} ${(address.phoneNumber || '').trim()}`.trim() ||
        address.phone ||
        '+974 44374646';

      // 1. Create order in Convex database with verified status
      const orderResult = await createConvexOrder({
        items: itemsPayload,
        couponCode: (!isBundleCheckout && appliedCoupon) ? appliedCoupon : undefined,
        customerNote: orderNote.trim() || undefined,
        address: {
          country: address.country || currentCountryConfig.name,
          firstName: address.firstName,
          lastName: address.lastName,
          phoneCountryCode: address.phoneCountryCode || currentCountryConfig.phoneCode,
          phoneNumber: address.phoneNumber,
          streetAddress: address.streetAddress,
          apartmentSuite: address.apartmentSuite,
          municipality: address.municipality || 'Doha',
          zoneNumber: address.zoneNumber || 'Zone 55',
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
        paymentMethod,
      });

      // 2. Also register in local ShopContext with matching Convex orderNumber
      createOrder({
        orderNumber: orderResult.orderNumber,
        trackingNumber: orderResult.trackingNumber,
        items: checkoutItems,
        subtotalQAR: checkoutSubtotal,
        shippingQAR: shippingCost,
        discountQAR: totalDiscount,
        totalQAR: grandTotal,
        address,
        shippingMethod: selectedShipping,
        paymentMethod,
        customerNote: orderNote.trim() || undefined,
        estimatedDeliveryWindow: '3–7 Business Days to Qatar',
      });

      if (typeof window !== 'undefined') {
        try {
          if (orderResult.orderNumber) {
            localStorage.setItem('qatify_last_order_number', orderResult.orderNumber);
          }
          if (address.email) {
            localStorage.setItem('qatify_customer_email', address.email.trim().toLowerCase());
          }
        } catch (e) {}
      }

      // 3. Clear shopping carts & persist saved card if selected
      if (paymentMethod === 'credit_card') {
        persistSavedCard(cardData);
      }

      if (isBundleCheckout) {
        clearBundleCart();
      } else if (isBuyNowCheckout) {
        clearBuyNow();
      } else {
        clearCart();
      }

      showToast('Payment Authorized', 'Your order was placed securely and confirmed!', 'success');

      // 4. Smooth In-Site redirect to success confirmation (No third-party redirection!)
      router.push(`/checkout/success?orderNumber=${orderResult.orderNumber}`);
    } catch (err) {
      console.error('Checkout error:', err);
      showToast('Payment Error', 'Could not process order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        {/* Top Header: Title + Secured Trading Badge */}
        <div className={styles.checkoutPageHeader}>
          <div className={styles.titleWithBadge}>
            <h1 className={styles.checkoutMainTitle}>Secure Checkout</h1>
            <span className={styles.securedTradingBadge} title="Protected by Secured Trading">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.stShieldIcon}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="stGradBadge" x1="12" y1="2" x2="12" y2="23" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#66bb6a" />
                    <stop offset="1" stopColor="#4cae4f" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2.2L9.6 3.9C7.8 4.4 5.8 4.6 4.3 4.3C3.7 4.2 3 4.6 3 5.3V11C3 16.4 6.9 20.7 11.7 22.3C11.9 22.4 12.1 22.4 12.3 22.3C17.1 20.7 21 16.4 21 11V5.3C21 4.6 20.3 4.2 19.7 4.3C18.2 4.6 16.2 4.4 14.4 3.9L12 2.2Z"
                  fill="url(#stGradBadge)"
                />
                <path
                  d="M14.6 8.7c-.6-.5-1.5-.8-2.5-.8-1.7 0-2.8.8-2.8 2.1 0 1.2.9 1.8 2.2 2.1l.8.2c1.2.3 1.6.7 1.6 1.3 0 .8-.8 1.4-1.9 1.4-1 0-2.1-.4-2.8-1.1l-.8 1.1c.9.9 2.2 1.4 3.6 1.4 2.2 0 3.6-1.1 3.6-2.8 0-1.4-.9-2.1-2.4-2.4l-.8-.2c-1.1-.2-1.5-.5-1.5-1.1 0-.7.7-1.2 1.7-1.2.8 0 1.6.3 2.2.7l.5-1.2z"
                  fill="#ffffff"
                />
              </svg>
              <span className={styles.stWordSecured}>Secured</span>
              <span className={styles.stWordTrading}>Trading</span>
            </span>
          </div>

          <div className={styles.headerTrustGuarantees}>
            <span className={styles.trustItem}>
              <ShieldCheck size={14} className={styles.trustIconGreen} />
              <span>256-Bit SSL Encryption</span>
            </span>
          </div>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className={styles.checkoutLayout}>
          {/* LEFT COLUMN: Main Form Modules */}
          <div className={styles.mainModulesColumn}>
            {/* ===============================================================
                SECTION 1: SHIPPING ADDRESS
            ================================================================ */}
            <section ref={addressSectionRef} className={styles.checkoutSection}>
              <div className={styles.sectionHeadingRow}>
                <div className={styles.sectionIconCircle}>
                  <MapPin size={17} />
                </div>
                <h2 className={styles.sectionHeadingText}>Shipping Address</h2>
              </div>

              <div className={styles.sectionBody}>
                {hasValidAddress ? (
                  <div className={styles.confirmedAddressCard}>
                    <div className={styles.addressCardTop}>
                      <div className={styles.recipientInfo}>
                        <CountryFlag code={address.country} size={18} />
                        <span className={styles.recipientName}>
                          {address.firstName} {address.lastName || ''}
                        </span>
                        <span className={styles.recipientPhone}>
                          +{address.phoneCountryCode || '974'} {address.phoneNumber}
                        </span>
                        {address.email && (
                          <span className={styles.recipientEmail}>
                            • {address.email}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={openAddressModal}
                        className={styles.editAddressButton}
                      >
                        Change Address
                      </button>
                    </div>

                    <div className={styles.addressCardDetails}>
                      <p className={styles.addressLinePrimary}>
                        {address.streetAddress}
                        {address.apartmentSuite ? `, ${address.apartmentSuite}` : ''}
                      </p>
                      <p className={styles.addressLineSecondary}>
                        {address.zoneNumber ? `${address.zoneNumber}, ` : ''}
                        {address.municipality}, {address.country}{' '}
                        {address.postalCode ? `• ${address.postalCode}` : ''}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyAddressContainer}>
                    <div className={styles.addAddressRow}>
                      <button
                        type="button"
                        onClick={openAddressModal}
                        className={styles.addNewAddressTriggerBtn}
                      >
                        + Add New Address
                      </button>
                      {addressMissingError && !hasValidAddress && (
                        <span className={styles.smallAddressNotice}>
                          <AlertCircle size={13} />
                          <span>Address required to proceed</span>
                        </span>
                      )}
                    </div>
                    <p className={styles.emptyAddressHint}>
                      Please add your shipping address so we can calculate exact delivery options.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ===============================================================
                SECTION 2: PAYMENT METHOD
            ================================================================ */}
            <section className={styles.checkoutSection}>
              <div className={styles.sectionHeadingRow}>
                <div className={styles.sectionIconCircle}>
                  <CreditCard size={17} />
                </div>
                <h2 className={styles.sectionHeadingText}>Payment Method</h2>
              </div>

              <div className={styles.paymentMethodsWrapper}>
                {/* CHOICE 1: Add a New Card (Visa / Mastercard / Amex / Maestro / JCB / Discover / Qatar) */}
                <div
                  className={`${styles.paymentOptionBox} ${
                    paymentMethod === 'credit_card' ? styles.optionSelected : ''
                  }`}
                  onClick={() => setPaymentMethod('credit_card')}
                >
                  <div className={styles.optionHeaderRow}>
                    <label className={styles.customRadioWrap}>
                      <input
                        type="radio"
                        name="checkoutPaymentMethod"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                        className={styles.hiddenRadio}
                      />
                      <span className={styles.radioDot} />
                    </label>

                    <div className={styles.optionHeaderLabelCol}>
                      <div className={styles.optionTitleRow}>
                        <CreditCard size={18} className={styles.cardHeaderIcon} />
                        <span className={styles.optionTitleText}>Add a New Card</span>
                      </div>
                    </div>

                    {/* Card Logos Row (Exact Match to Screenshot) */}
                    <div className={styles.cardLogosRow}>
                      <VisaIcon width={32} height={20} />
                      <MastercardIcon width={32} height={20} />
                      <MaestroIcon width={32} height={20} />
                      <JcbIcon width={32} height={20} />
                      <DiscoverIcon width={32} height={20} />
                      <AmexIcon width={32} height={20} />
                      <QarCurrencyIcon width={32} height={20} />
                    </div>
                  </div>

                  {/* Sub-form when Card is selected */}
                  {paymentMethod === 'credit_card' && (
                    <div
                      className={styles.expandedCardForm}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Card Number Input */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          Card number <span className={styles.requiredStar}>*</span>
                        </label>
                        <div className={styles.inputWithIconWrapper}>
                          <input
                            type="text"
                            value={cardData.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234  5678  9012  3456"
                            maxLength={19}
                            className={styles.styledInput}
                          />
                          <div className={styles.detectedCardBadge}>
                            {detectCardBrand(cardData.cardNumber) === 'visa' && (
                              <VisaIcon width={28} height={18} />
                            )}
                            {detectCardBrand(cardData.cardNumber) === 'mastercard' && (
                              <MastercardIcon width={28} height={18} />
                            )}
                            {detectCardBrand(cardData.cardNumber) === 'amex' && (
                              <AmexIcon width={28} height={18} />
                            )}
                            {detectCardBrand(cardData.cardNumber) === 'discover' && (
                              <DiscoverIcon width={28} height={18} />
                            )}
                            {detectCardBrand(cardData.cardNumber) === 'jcb' && (
                              <JcbIcon width={28} height={18} />
                            )}
                            {detectCardBrand(cardData.cardNumber) === 'card' && (
                              <CreditCard size={18} color="#94a3b8" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Cardholder Name */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          Given name(s) <span className={styles.requiredStar}>*</span>
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          value={cardData.cardName}
                          onChange={handleCardNameChange}
                          placeholder="Name as printed on card"
                          className={styles.styledInput}
                        />
                      </div>

                      {/* Expiry & CVV 2-column row */}
                      <div className={styles.twoColumnFields}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            <span>Expire in MM/YY</span>{' '}
                            <span className={styles.requiredStar}>*</span>
                            <span className={styles.infoTooltipIcon} title="Two digit month and two digit year">
                              <Info size={13} />
                            </span>
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            value={cardData.expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM / YY"
                            maxLength={5}
                            className={styles.styledInput}
                          />
                        </div>

                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            <span>Security code (CVV/CSC)</span>{' '}
                            <span className={styles.requiredStar}>*</span>
                            <span className={styles.infoTooltipIcon} title="3 digits on back of card or 4 digits on front of Amex">
                              <Info size={13} />
                            </span>
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            name="securityCodeCvv"
                            data-lpignore="true"
                            data-1p-ignore="true"
                            value={cardData.cvv}
                            onChange={handleCvvChange}
                            placeholder="CVV"
                            maxLength={4}
                            className={styles.styledInput}
                          />
                        </div>
                      </div>

                      {/* Billing Address Module Box */}
                      <div className={styles.billingAddressBox}>
                        <div className={styles.billingBoxHeader}>
                          <span className={styles.billingTitle}>Billing Address</span>
                        </div>
                        {hasValidAddress ? (
                          <div className={styles.billingToggleRow}>
                            <label className={styles.switchLabel}>
                              <input
                                type="checkbox"
                                checked={cardData.billingSameAsShipping}
                                onChange={(e) => {
                                  const updated = {
                                    ...cardData,
                                    billingSameAsShipping: e.target.checked,
                                  };
                                  setCardData(updated);
                                  if (updated.saveCard) persistSavedCard(updated);
                                }}
                                className={styles.hiddenSwitch}
                              />
                              <span className={styles.sliderSwitch} />
                              <span className={styles.switchText}>
                                Billing address the same as shipping address
                              </span>
                            </label>
                          </div>
                        ) : (
                          <p className={styles.billingAddressNotice}>
                            Your shipping address hasn't been added yet. Add it above and we'll use it as your billing address.
                          </p>
                        )}
                      </div>

                      {/* Checkbox: Save this card */}
                      <div className={styles.saveCardCheckboxRow}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={cardData.saveCard}
                            onChange={handleSaveCardToggle}
                            className={styles.nativeCheckbox}
                          />
                          <span className={styles.customBox}>
                            {cardData.saveCard && <Check size={12} strokeWidth={3} />}
                          </span>
                          <span className={styles.checkboxText}>
                            Save this card for faster checkout next time
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* CHOICE 2: Apple Pay */}
                <div
                  className={`${styles.paymentOptionBox} ${
                    paymentMethod === 'apple_pay' ? styles.optionSelected : ''
                  }`}
                  onClick={() => setPaymentMethod('apple_pay')}
                >
                  <div className={styles.optionHeaderRow}>
                    <label className={styles.customRadioWrap}>
                      <input
                        type="radio"
                        name="checkoutPaymentMethod"
                        checked={paymentMethod === 'apple_pay'}
                        onChange={() => setPaymentMethod('apple_pay')}
                        className={styles.hiddenRadio}
                      />
                      <span className={styles.radioDot} />
                    </label>

                    <div className={styles.optionHeaderLabelCol}>
                      <div className={styles.walletHeaderInline}>
                        <ApplePayIcon width={46} height={26} />
                        <span className={styles.walletLabelText}>Apple Pay</span>
                        <span className={styles.recommendedPill}>Recommended</span>
                      </div>
                      <p className={styles.walletSubText}>
                        Pay instantly with Touch ID or Face ID using your Apple device.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CHOICE 3: Google Pay */}
                <div
                  className={`${styles.paymentOptionBox} ${
                    paymentMethod === 'google_pay' ? styles.optionSelected : ''
                  }`}
                  onClick={() => setPaymentMethod('google_pay')}
                >
                  <div className={styles.optionHeaderRow}>
                    <label className={styles.customRadioWrap}>
                      <input
                        type="radio"
                        name="checkoutPaymentMethod"
                        checked={paymentMethod === 'google_pay'}
                        onChange={() => setPaymentMethod('google_pay')}
                        className={styles.hiddenRadio}
                      />
                      <span className={styles.radioDot} />
                    </label>

                    <div className={styles.optionHeaderLabelCol}>
                      <div className={styles.walletHeaderInline}>
                        <GooglePayIcon width={46} height={26} />
                        <span className={styles.walletLabelText}>Google Pay</span>
                      </div>
                      <p className={styles.walletSubText}>
                        Fast, secure checkout using cards stored in your Google Account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ===============================================================
                SECTION 3: ORDER ITEMS & NOTE
            ================================================================ */}
            <section className={styles.checkoutSection}>
              <div className={styles.itemsDeliveryCard}>
                {/* Items List */}
                <div className={styles.checkoutItemsList}>
                  {checkoutItems.map((item, idx) => (
                    <div key={idx} className={styles.checkoutItemRow}>
                      <div className={styles.itemThumbWrap}>
                        <Image
                          src={item.product.images[0] || '/placeholder.svg'}
                          alt={item.product.title}
                          width={60}
                          height={60}
                          className={styles.itemThumbImg}
                        />
                      </div>
                      <div className={styles.itemInfoCol}>
                        <span className={styles.itemTitle}>{item.product.title}</span>
                        {(item.selectedColor || item.selectedOption) && (
                          <span className={styles.itemVariant}>
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                            {item.selectedColor && item.selectedOption && ' • '}
                            {item.selectedOption && item.selectedOption}
                          </span>
                        )}
                        <span className={styles.itemQuantityBadge}>Qty: {item.quantity}</span>
                      </div>
                      <div className={styles.itemPriceCol}>
                        <strong className={styles.itemPriceQAR}>
                          QAR {(item.product.priceQAR * item.quantity).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Order Note Input */}
                <div className={styles.orderNoteContainer}>
                  <div className={styles.orderNoteHeader}>
                    <div className={styles.orderNoteTitleWrap}>
                      <FileText size={14} className={styles.orderNoteIcon} />
                      <label htmlFor="checkoutOrderNote" className={styles.orderNoteLabel}>
                        Order Note (Optional)
                      </label>
                    </div>
                    <span className={styles.orderNoteCharCount}>
                      {orderNote.length}/300
                    </span>
                  </div>
                  <textarea
                    id="checkoutOrderNote"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value.slice(0, 300))}
                    placeholder="Write a note for your order..."
                    className={styles.orderNoteTextarea}
                    rows={2}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary */}
          <aside className={styles.orderSummarySidebar}>
            <div className={styles.summaryStickyBox}>
              <div className={styles.summaryCard}>
                <h3 className={styles.summaryHeading}>
                  Order Summary ({checkoutItems.reduce((acc, i) => acc + i.quantity, 0)} items)
                </h3>

                {/* Products Thumbnails Row */}
                <div className={styles.summaryThumbsRow}>
                  {checkoutItems.slice(0, 4).map((item, i) => (
                    <div key={i} className={styles.summaryThumbWrap}>
                      <Image
                        src={item.product.images[0] || '/placeholder.svg'}
                        alt={item.product.title}
                        width={46}
                        height={46}
                        className={styles.summaryThumbImg}
                      />
                      <span className={styles.summaryThumbBadge}>{item.quantity}</span>
                    </div>
                  ))}
                  {checkoutItems.length > 4 && (
                    <div className={styles.moreThumbsBadge}>
                      +{checkoutItems.length - 4}
                    </div>
                  )}
                </div>

                {/* Breakdown Costs */}
                <div className={styles.breakdownList}>
                  <div className={styles.breakdownRow}>
                    <span className={styles.breakdownLabel}>Item subtotal</span>
                    <span className={styles.breakdownVal}>QAR {checkoutSubtotal.toFixed(2)}</span>
                  </div>

                  <div className={styles.breakdownRow}>
                    <span className={styles.breakdownLabel}>
                      Transaction fee <Info size={12} className={styles.feeInfo} />
                    </span>
                    <span className={styles.breakdownFeeWaived}>QAR 0.00</span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className={styles.breakdownRow}>
                      <span className={styles.breakdownDiscountLabel}>
                        Discount {appliedCoupon && `(${appliedCoupon})`}
                      </span>
                      <span className={styles.breakdownDiscountVal}>
                        -QAR {totalDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className={styles.breakdownRow}>
                    <span className={styles.breakdownLabel}>Air Freight Shipping</span>
                    {shippingCost === 0 ? (
                      <span className={styles.breakdownFree}>FREE</span>
                    ) : (
                      <span className={styles.breakdownVal}>QAR {shippingCost.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className={styles.divider} />

                {/* Total Payment Due */}
                <div className={styles.totalDueRow}>
                  <span className={styles.totalDueLabel}>Total payment due</span>
                  <strong className={styles.totalDueAmount}>
                    QAR {grandTotal.toFixed(2)}
                  </strong>
                </div>

                {/* Big Coral Pay Now Button */}
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isSubmitting}
                  className={styles.payNowButton}
                >
                  {isSubmitting ? (
                    <span className={styles.buttonSpinnerContent}>
                      <span className={styles.spinnerCircle} />
                      <span>Authorizing Payment...</span>
                    </span>
                  ) : (
                    <span>Pay Now</span>
                  )}
                </button>

                {/* Terms Acceptance Checkbox */}
                <div className={styles.termsRow}>
                  <label className={styles.termsLabel}>
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className={styles.nativeCheckbox}
                    />
                    <span className={styles.termsCustomBox}>
                      {agreedToTerms && <Check size={11} strokeWidth={3} />}
                    </span>
                    <span className={styles.termsText}>
                      By clicking the button, you agree to the{' '}
                      <Link href="/terms" className={styles.termsLink}>
                        Terms and Conditions
                      </Link>
                      ,{' '}
                      <Link href="/privacy" className={styles.termsLink}>
                        Privacy Policy
                      </Link>{' '}
                      and Return & Refund Rules.
                    </span>
                  </label>
                </div>

                {/* Made-in-China / Qatify Order Protection Card */}
                <div className={styles.orderProtectionBox}>
                  <h4 className={styles.protectionTitle}>Qatify.com Order Protection</h4>

                  <div className={styles.protectionItem}>
                    <div className={styles.protectionIconWrap}>
                      <ShieldCheck size={16} color="#18181b" />
                    </div>
                    <div>
                      <strong className={styles.protectionHeading}>Funds Security</strong>
                      <p className={styles.protectionText}>
                        Your payment is only released after you confirm satisfactory delivery in Qatar.
                      </p>
                    </div>
                  </div>

                  <div className={styles.protectionItem}>
                    <div className={styles.protectionIconWrap}>
                      <RotateCcw size={16} color="#18181b" />
                    </div>
                    <div>
                      <strong className={styles.protectionHeading}>Return & Refund Support</strong>
                      <p className={styles.protectionText}>
                        Request return or refund assistance within 14 days for eligible order issues.
                      </p>
                    </div>
                  </div>

                  <div className={styles.protectionItem}>
                    <div className={styles.protectionIconWrap}>
                      <Plane size={16} color="#18181b" />
                    </div>
                    <div>
                      <strong className={styles.protectionHeading}>Air Express Guarantee</strong>
                      <p className={styles.protectionText}>
                        Full doorstep courier handover with live Qatar Customs tracking.
                      </p>
                    </div>
                  </div>

                  <p className={styles.protectionFooterNotice}>
                    Only orders placed and paid through Qatify.com can enjoy protection by Secured Trading.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ===============================================================
          ADDRESS MODAL POPUP (Exact Match to Screenshot 2)
      ================================================================ */}
      {isAddressModalOpen && isMounted && createPortal(
        <div className={styles.modalBackdrop} onClick={() => setIsAddressModalOpen(false)}>
          <div
            className={styles.modalCardDialog}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New Address</h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className={styles.modalCloseBtn}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {/* Address Form (Clean Shopify Style) */}
            <form onSubmit={handleSaveDraftAddress} className={styles.modalAddressForm}>
              {/* Email (Shopify Style) */}
              <input
                type="email"
                required
                value={draftAddress.email || ''}
                onChange={(e) =>
                  setDraftAddress({ ...draftAddress, email: e.target.value })
                }
                placeholder="Email"
                className={styles.shopifyInput}
              />

              {/* Country Selector (Shopify Style) */}
              <div className={styles.shopifySelectWrap} ref={countryRef}>
                <div
                  className={styles.shopifyCountrySelect}
                  onClick={() => setModalCountryOpen(!modalCountryOpen)}
                >
                  <div className={styles.shopifyCountryInfo}>
                    <span className={styles.shopifyMiniLabel}>Country/Region</span>
                    <div className={styles.modalCountrySelected}>
                      <CountryFlag code={draftAddress.country} size={16} />
                      <span className={styles.countryNameText}>{draftAddress.country}</span>
                    </div>
                  </div>
                  <ChevronDown size={15} color="#6b7280" />
                </div>

                {modalCountryOpen && (
                  <div className={styles.modalDropdownMenu}>
                    {SUPPORTED_COUNTRIES.map((c) => (
                      <div
                        key={c.code}
                        onClick={() => {
                          setDraftAddress({
                            ...draftAddress,
                            country: c.name,
                            phoneCountryCode: c.phoneCode,
                          });
                          setModalCountryOpen(false);
                        }}
                        className={`${styles.modalDropdownItem} ${
                          draftAddress.country === c.name ? styles.dropdownSelected : ''
                        }`}
                      >
                        <CountryFlag code={c.code} size={18} />
                        <span>{c.name}</span>
                        <span className={styles.phoneCodeTag}>+{c.phoneCode}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* First Name & Last Name (2 Columns, Shopify Style) */}
              <div className={styles.twoColumnModalRow}>
                <input
                  type="text"
                  required
                  value={draftAddress.firstName}
                  onChange={(e) =>
                    setDraftAddress({
                      ...draftAddress,
                      firstName: e.target.value,
                      fullName: `${e.target.value} ${draftAddress.lastName || ''}`.trim(),
                    })
                  }
                  placeholder="First name"
                  className={styles.shopifyInput}
                />
                <input
                  type="text"
                  value={draftAddress.lastName}
                  onChange={(e) =>
                    setDraftAddress({
                      ...draftAddress,
                      lastName: e.target.value,
                      fullName: `${draftAddress.firstName || ''} ${e.target.value}`.trim(),
                    })
                  }
                  placeholder="Last name"
                  className={styles.shopifyInput}
                />
              </div>

              {/* Street Address (Shopify Style) */}
              <input
                type="text"
                required
                value={draftAddress.streetAddress}
                onChange={(e) =>
                  setDraftAddress({ ...draftAddress, streetAddress: e.target.value })
                }
                placeholder="Address"
                className={styles.shopifyInput}
              />

              {/* Apartment, Suite, etc. (optional) */}
              <input
                type="text"
                value={draftAddress.apartmentSuite}
                onChange={(e) =>
                  setDraftAddress({ ...draftAddress, apartmentSuite: e.target.value })
                }
                placeholder="Apartment, suite, etc. (optional)"
                className={styles.shopifyInput}
              />

              {/* City / Municipality, Zone, Postal Code (Shopify Style) */}
              <div className={styles.threeColumnModalRow}>
                {/* City / Municipality */}
                <div className={styles.shopifySelectWrap} ref={muniRef}>
                  <div
                    className={styles.shopifySelectTrigger}
                    onClick={() => setModalMunicipalityOpen(!modalMunicipalityOpen)}
                  >
                    <span className={draftAddress.municipality ? styles.selectVal : styles.selectPlaceholder}>
                      {draftAddress.municipality || 'City'}
                    </span>
                    <ChevronDown size={14} color="#6b7280" />
                  </div>
                  {modalMunicipalityOpen && (
                    <div className={styles.modalDropdownMenu}>
                      {QATAR_MUNICIPALITIES.map((m) => (
                        <div
                          key={m.code}
                          onClick={() => {
                            setDraftAddress({
                              ...draftAddress,
                              municipality: m.name.split(' (')[0],
                            });
                            setModalMunicipalityOpen(false);
                          }}
                          className={`${styles.modalDropdownItem} ${
                            draftAddress.municipality === m.name.split(' (')[0] ? styles.dropdownSelected : ''
                          }`}
                        >
                          <span>{m.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Zone Number */}
                <div className={styles.shopifySelectWrap} ref={zoneRef}>
                  <div
                    className={styles.shopifySelectTrigger}
                    onClick={() => setModalZoneOpen(!modalZoneOpen)}
                  >
                    <span className={draftAddress.zoneNumber ? styles.selectVal : styles.selectPlaceholder}>
                      {draftAddress.zoneNumber || 'Zone'}
                    </span>
                    <ChevronDown size={14} color="#6b7280" />
                  </div>
                  {modalZoneOpen && (
                    <div className={styles.modalDropdownMenuScrollable}>
                      {ALL_QATAR_ZONES.map((zone) => (
                        <div
                          key={zone}
                          onClick={() => {
                            setDraftAddress({
                              ...draftAddress,
                              zoneNumber: zone,
                            });
                            setModalZoneOpen(false);
                          }}
                          className={`${styles.modalDropdownItem} ${
                            draftAddress.zoneNumber === zone ? styles.dropdownSelected : ''
                          }`}
                        >
                          <strong>{zone}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Postal Code (Mandatory) */}
                <input
                  type="text"
                  required
                  value={draftAddress.postalCode}
                  onChange={(e) =>
                    setDraftAddress({ ...draftAddress, postalCode: e.target.value })
                  }
                  placeholder="Postal code"
                  className={styles.shopifyInput}
                />
              </div>

              {/* Phone Input (Shopify Style) */}
              <div className={styles.shopifyPhoneWrap}>
                <span className={styles.shopifyPhoneBadge}>
                  +{draftAddress.phoneCountryCode || '974'}
                </span>
                <input
                  type="tel"
                  required
                  value={draftAddress.phoneNumber}
                  onChange={(e) =>
                    setDraftAddress({
                      ...draftAddress,
                      phoneNumber: e.target.value.replace(/\D/g, ''),
                    })
                  }
                  placeholder="Phone"
                  className={styles.shopifyPhoneInput}
                />
              </div>

              {/* Set as default checkbox */}
              <div className={styles.modalDefaultCheckRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={saveAddressForFuture}
                    onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                    className={styles.nativeCheckbox}
                  />
                  <span className={styles.customBox}>
                    {saveAddressForFuture && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className={styles.checkboxText}>Set as default shipping address</span>
                </label>
              </div>

              {/* Modal Buttons: Cancel and Confirm */}
              <div className={styles.modalActionButtonsRow}>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className={styles.modalCancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalConfirmBtn}>
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}
