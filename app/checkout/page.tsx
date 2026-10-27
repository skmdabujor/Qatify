'use client';

// =============================================================================
// Qatify — Multi-Step Checkout Page (`/checkout`)
// Step 1: Qatar National Address | Step 2: Air Shipping | Step 3: Payment
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ArrowRight,
  MapPin,
  Building,
  Phone,
  User,
  Mail,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { QATAR_MUNICIPALITIES, SHIPPING_METHODS } from '@/data/products';
import { QatarAddress, ShippingMethod, Order } from '@/types/product';
import {
  ApplePayIcon,
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  CashOnDeliveryIcon,
} from '@/components/ui/PaymentIcons';
import styles from './page.module.scss';

// Feature Flag: Cash on Delivery status (Set to true to re-enable COD on checkout)
const IS_COD_ENABLED = false;

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    appliedDiscountQAR,
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

  // Steps state: 1 = Address, 2 = Shipping, 3 = Payment
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Address State (Qatar National Address format)
  const defaultAddr = savedAddresses[0] || {
    fullName: 'Tariq Al-Mansoor',
    email: 'customer@qatify.qa',
    phone: '+974 5512 8894',
    municipality: 'Lusail City (مدينة لوسيل)',
    zoneNumber: 'Zone 69',
    streetNumber: 'Street 312',
    buildingNumber: 'Building 18',
    unitNumber: 'Apt 402',
    landmark: 'Fox Hills North, Near Crescent Park',
  };

  const [address, setAddress] = useState<QatarAddress>({
    fullName: defaultAddr.fullName,
    email: defaultAddr.email || '',
    phone: defaultAddr.phone,
    municipality: defaultAddr.municipality,
    zoneNumber: defaultAddr.zoneNumber,
    streetNumber: defaultAddr.streetNumber,
    buildingNumber: defaultAddr.buildingNumber,
    unitNumber: defaultAddr.unitNumber || '',
    landmark: defaultAddr.landmark || '',
  });

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

  // Calculations
  const shippingCost =
    selectedShipping.id === 'standard-air' && isFreeShipping
      ? 0
      : selectedShipping.priceQAR;
  const grandTotal = Math.max(0, cartSubtotal + shippingCost - (appliedDiscountQAR || 0));

  // Handle address submit -> move to step 2
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.zoneNumber || !address.streetNumber || !address.buildingNumber) {
      showToast('Incomplete Address', 'Please fill in all Qatar National Address fields.', 'warning');
      return;
    }
    if (saveAddressForFuture) {
      addAddress(address);
    }
    setCurrentStep(2);
  };

  // Handle shipping submit -> move to step 3
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  // Handle final order placement
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showToast('Cart is Empty', 'Please add items before placing an order.', 'warning');
      router.push('/shop');
      return;
    }

    try {
      setIsSubmitting(true);

      const itemsPayload = cart.map((item) => ({
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
      const orderResult = await createConvexOrder({
        items: itemsPayload,
        couponCode: appliedCoupon || undefined,
        address: {
          fullName: address.fullName,
          phone: address.phone,
          email: address.email || undefined,
          municipality: address.municipality,
          zoneNumber: address.zoneNumber,
          streetNumber: address.streetNumber,
          buildingNumber: address.buildingNumber,
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
        items: cart,
        subtotalQAR: cartSubtotal,
        shippingQAR: shippingCost,
        discountQAR: appliedDiscountQAR || 0,
        totalQAR: grandTotal,
        address,
        shippingMethod: selectedShipping,
        paymentMethod,
        estimatedDeliveryWindow: '6–10 Business Days to Qatar',
      });

      // 3. Clear cart
      clearCart();

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
                  {confirmedOrder.address.municipality}, {confirmedOrder.address.zoneNumber}, {confirmedOrder.address.buildingNumber}
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
          <Link href="/cart" className={styles.crumbLink}>Cart</Link>
          <ChevronRight size={13} className={styles.crumbChevron} />
          <span className={styles.currentCrumb}>Qatar Express Checkout</span>
        </nav>

        {/* 3-Step Visual Progress Bar */}
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

          <button
            type="button"
            onClick={() => currentStep > 2 && setCurrentStep(2)}
            className={`${styles.stepIndicator} ${currentStep >= 2 ? styles.active : ''}`}
          >
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepLabelCol}>
              <span className={styles.stepTitle}>Air Freight</span>
              <span className={styles.stepDesc}>6–10 Days Tracked</span>
            </div>
          </button>

          <div className={`${styles.stepConnector} ${currentStep >= 3 ? styles.active : ''}`} />

          <div className={`${styles.stepIndicator} ${currentStep === 3 ? styles.active : ''}`}>
            <div className={styles.stepNum}>3</div>
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
                STEP 1: QATAR NATIONAL ADDRESS FORM
            ================================================================ */}
            {currentStep === 1 && (
              <form onSubmit={handleAddressSubmit} className={styles.stepFormCard}>
                <div className={styles.formCardHeader}>
                  <MapPin size={20} className={styles.headerIconRed} />
                  <div>
                    <h2 className={styles.formCardTitle}>1. Qatar Delivery Address</h2>
                    <p className={styles.formCardSub}>
                      Follows standard Qatar National Address format for accurate doorstep delivery.
                    </p>
                  </div>
                </div>

                {/* Quick saved addresses selection pills */}
                {savedAddresses.length > 0 && (
                  <div className={styles.savedAddressesBar}>
                    <span className={styles.savedBarLabel}>Quick Select:</span>
                    {savedAddresses.map((addr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAddress(addr)}
                        className={styles.savedAddrPill}
                      >
                        {addr.municipality.split(' ')[0]} - {addr.zoneNumber}
                      </button>
                    ))}
                  </div>
                )}

                <div className={styles.formGrid}>
                  {/* Full Name */}
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      Full Name <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWithIcon}>
                      <User size={15} className={styles.fieldIcon} />
                      <input
                        type="text"
                        required
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        placeholder="e.g. Tariq Al-Mansoor"
                        className={styles.textInput}
                      />
                    </div>
                  </div>

                  {/* Phone with +974 prefix */}
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      Qatar Mobile Number <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWithIcon}>
                      <Phone size={15} className={styles.fieldIcon} />
                      <input
                        type="tel"
                        required
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        placeholder="+974 5512 8894"
                        className={styles.textInput}
                      />
                    </div>
                  </div>

                  {/* Customer Email Address for Order Confirmation */}
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      Email Address (for Air Tracking & Receipt) <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWithIcon}>
                      <Mail size={15} className={styles.fieldIcon} />
                      <input
                        type="email"
                        required
                        value={address.email || ''}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                        placeholder="e.g. tariq@example.com"
                        className={styles.textInput}
                      />
                    </div>
                  </div>

                  {/* Municipality Selection */}
                  <div className={styles.formGroupFull}>
                    <label className={styles.fieldLabel}>
                      Municipality (البلدية) <span className={styles.req}>*</span>
                    </label>
                    <select
                      value={address.municipality}
                      onChange={(e) => setAddress({ ...address, municipality: e.target.value })}
                      className={styles.selectInput}
                    >
                      {QATAR_MUNICIPALITIES.map((mun) => (
                        <option key={mun.code} value={mun.name}>
                          {mun.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Qatar National Address: Zone, Street, Building */}
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      Zone Number (رقم المنطقة) <span className={styles.req}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address.zoneNumber}
                      onChange={(e) => setAddress({ ...address, zoneNumber: e.target.value })}
                      placeholder="e.g. Zone 69 or Zone 24"
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      Street Number (رقم الشارع) <span className={styles.req}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address.streetNumber}
                      onChange={(e) => setAddress({ ...address, streetNumber: e.target.value })}
                      placeholder="e.g. Street 312"
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      Building Number (رقم المبنى) <span className={styles.req}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address.buildingNumber}
                      onChange={(e) => setAddress({ ...address, buildingNumber: e.target.value })}
                      placeholder="e.g. Building 18"
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Unit / Apartment No.</label>
                    <input
                      type="text"
                      value={address.unitNumber}
                      onChange={(e) => setAddress({ ...address, unitNumber: e.target.value })}
                      placeholder="e.g. Apt 402"
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.fieldLabel}>Nearby Landmark / Area Details</label>
                    <input
                      type="text"
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      placeholder="e.g. Fox Hills North, Near Crescent Park / Al Meera"
                      className={styles.textInput}
                    />
                  </div>
                </div>

                <div className={styles.checkboxRow}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      checked={saveAddressForFuture}
                      onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                      className={styles.customCheck}
                    />
                    <span>Save this address for future 1-click orders in Qatar</span>
                  </label>
                </div>

                <button type="submit" className={styles.continueStepBtn}>
                  <span>Continue to Air Shipping Options</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* ===============================================================
                STEP 2: AIR SHIPPING OPTIONS
            ================================================================ */}
            {currentStep === 2 && (
              <form onSubmit={handleShippingSubmit} className={styles.stepFormCard}>
                <div className={styles.formCardHeader}>
                  <Plane size={20} className={styles.headerIconRed} />
                  <div>
                    <h2 className={styles.formCardTitle}>2. Choose Qatar Delivery Method</h2>
                    <p className={styles.formCardSub}>
                      Fast express courier delivery across Doha, Lusail, Al Rayyan, and all Qatar municipalities.
                    </p>
                  </div>
                </div>

                <div className={styles.shippingOptionsList}>
                  {SHIPPING_METHODS.map((method) => {
                    const isSelected = selectedShipping.id === method.id;
                    const priceDisplay =
                      method.id === 'standard-air' && isFreeShipping
                        ? 'FREE (Over QAR 150)'
                        : `QAR ${method.priceQAR}`;

                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedShipping(method)}
                        className={`${styles.shippingMethodCard} ${
                          isSelected ? styles.selectedMethod : ''
                        }`}
                      >
                        <div className={styles.methodRadioCol}>
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={isSelected}
                            onChange={() => setSelectedShipping(method)}
                          />
                        </div>

                        <div className={styles.methodInfoCol}>
                          <div className={styles.methodTop}>
                            <strong className={styles.methodName}>{method.name}</strong>
                            <span className={styles.methodBadge}>{method.badge}</span>
                          </div>
                          <p className={styles.methodDesc}>{method.description}</p>
                          <span className={styles.methodDuration}>
                            ⏱️ Estimated Delivery: <strong>{method.duration}</strong>
                          </span>
                        </div>

                        <div className={styles.methodPriceCol}>
                          <span className={styles.methodPriceText}>{priceDisplay}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.stepButtonRow}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className={styles.backStepBtn}
                  >
                    ← Edit Address
                  </button>
                  <button type="submit" className={styles.continueStepBtn}>
                    <span>Proceed to Payment</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* ===============================================================
                STEP 3: PAYMENT METHOD SELECTOR UI
            ================================================================ */}
            {currentStep === 3 && (
              <div className={styles.stepFormCard}>
                <div className={styles.formCardHeader}>
                  <Lock size={20} className={styles.headerIconRed} />
                  <div>
                    <h2 className={styles.formCardTitle}>3. Select Secure Payment Method</h2>
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
                    onClick={() => setCurrentStep(2)}
                    className={styles.backStepBtn}
                  >
                    ← Edit Shipping
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
              </div>
            )}
          </div>

          {/* Right Column: Order Review Summary */}
          <div className={styles.summaryColumn}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Review</h3>

              {/* Items List */}
              <div className={styles.summaryItemsList}>
                {cart.map((item) => (
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
                  <span className="price-qar">QAR {cartSubtotal.toLocaleString()}</span>
                </div>

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

