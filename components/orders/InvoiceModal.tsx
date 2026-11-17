'use client';

// =============================================================================
// Qatify — Order Receipt & Tax Invoice Modal
// Dynamic, clean, printable receipt matching retail e-commerce standards
// =============================================================================

import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import styles from './InvoiceModal.module.scss';

export interface InvoiceModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ order, isOpen, onClose }: InvoiceModalProps) {
  if (!isOpen || !order) return null;

  const orderNumber = order.orderNumber || 'QA-896533';
  const orderDate = order.date || 'Nov 14, 2026';
  const trackingNumber = order.trackingNumber || 'QA-EXP-6190925';

  // Shipping Method
  const rawShippingMethod =
    typeof order.shippingMethod === 'object' && order.shippingMethod?.name
      ? order.shippingMethod.name
      : typeof order.shippingMethod === 'string'
      ? order.shippingMethod
      : order.carrier || 'Direct Air Express';
  // Clean method name (e.g. "Direct Air Express")
  const shippingMethod = rawShippingMethod.split('(')[0].trim() || 'Direct Air Express';

  // Billing & Shipping Info
  const address = order.address || {};
  const customerName =
    address.fullName ||
    `${address.firstName || ''} ${address.lastName || ''}`.trim() ||
    order.customerName ||
    'Qatar Guest';

  const shippingAddress =
    address.streetAddress && address.municipality
      ? `${address.buildingNumber ? `${address.buildingNumber}, ` : ''}${address.streetAddress}, ${address.zoneNumber ? `${address.zoneNumber}, ` : ''}${address.municipality}`
      : address.municipality || order.municipality || 'Doha, Qatar';

  const paymentStatus = (order.paymentStatus || 'paid').toLowerCase();
  const paymentStatusText =
    paymentStatus === 'paid'
      ? 'Paid'
      : paymentStatus === 'refunded'
      ? 'Refunded'
      : paymentStatus === 'failed'
      ? 'Failed'
      : 'Paid';

  // Itemized List
  const items = (order.items || []).map((it: any) => ({
    title: it.title || it.product?.title || 'Qatify Tech Item',
    quantity: Number(it.quantity || 1),
    priceQAR: Number(it.priceQAR || it.product?.priceQAR || 0),
    selectedColor: it.selectedColor,
    selectedOption: it.selectedOption,
    image: it.image || it.product?.images?.[0] || '/placeholder.svg',
  }));

  // Calculations
  const itemSubtotal = items.reduce(
    (acc: number, item: any) => acc + item.priceQAR * item.quantity,
    0
  );
  const grandTotal = Number(order.totalQAR || itemSubtotal);
  // Shipping fee: automatically calculated as Order Total - Item Subtotal (or fallback to shippingQAR)
  const calculatedShipping = grandTotal - itemSubtotal;
  const shippingFee = calculatedShipping > 0 ? calculatedShipping : (order.shippingQAR ?? 0);
  const discount = Number(order.discountQAR || 0);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.invoiceSheet} onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header Bar */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleGroup}>
            <span className={styles.headerBrandBadge}>Qatify</span>
            <h3 className={styles.modalTitle}>Order Receipt / Invoice</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.modalCloseBtn}
            aria-label="Close invoice"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Printable Invoice Content */}
        <div className={styles.invoiceScrollContent}>
          {/* Brand & Order Meta Header */}
          <div className={styles.storeBrandRow}>
            <div>
              <div className={styles.brandLogoWrap}>
                <span className={styles.brandLogoText}>
                  QATIFY<span className={styles.brandLogoDomain}>.QA</span>
                </span>
              </div>
              <div className={styles.brandSubtitle}>
                State of Qatar • Cross-Border Direct Air Express
              </div>
            </div>

            <div className={styles.invoiceMetaBlock}>
              <div className={styles.invoiceMetaLabel}>Order Reference</div>
              <div className={styles.invoiceMetaNum}>{orderNumber}</div>
              <div className={styles.invoiceMetaDate}>Order Date: {orderDate}</div>
              <div className={styles.paidStatusBadge}>
                <CheckCircle2 size={13} />
                <span>{paymentStatusText.toUpperCase()} ONLINE</span>
              </div>
            </div>
          </div>

          {/* Billing & Shipping Info Cards */}
          <div className={styles.infoGrid}>
            <div className={styles.infoCol}>
              <div className={styles.infoColTitle}>Customer &amp; Payment</div>
              <div className={styles.infoColBody}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Customer:</span>
                  <span className={styles.infoValueBold}>{customerName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Payment Status:</span>
                  <span className={styles.paymentPill}>{paymentStatusText}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Payment Method:</span>
                  <span className={styles.infoValue}>
                    {order.paymentMethod
                      ? order.paymentMethod.replace(/_/g, ' ').toUpperCase()
                      : 'Apple Pay / Debit Card'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.infoCol}>
              <div className={styles.infoColTitle}>Shipping &amp; Delivery</div>
              <div className={styles.infoColBody}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Shipping Address:</span>
                  <span className={styles.infoValueBold}>{shippingAddress}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Shipping Method:</span>
                  <span className={styles.infoValue}>{shippingMethod}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Tracking Number:</span>
                  <span className={styles.trackingMono}>{trackingNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th style={{ textAlign: 'center', width: '70px' }}>Qty</th>
                <th style={{ textAlign: 'right', width: '120px' }}>Unit Price</th>
                <th style={{ textAlign: 'right', width: '120px' }}>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, idx: number) => {
                const lineTotal = item.priceQAR * item.quantity;
                return (
                  <tr key={idx}>
                    <td>
                      <div className={styles.itemTitleCell}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className={styles.itemThumb}
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.endsWith('/placeholder.svg')) {
                              target.src = '/placeholder.svg';
                            }
                          }}
                        />
                        <div className={styles.itemText}>
                          <span className={styles.itemTitle}>{item.title}</span>
                          {(item.selectedColor || item.selectedOption) && (
                            <span className={styles.itemVariant}>
                              Variant: {item.selectedColor}
                              {item.selectedOption ? ` / ${item.selectedOption}` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', color: '#4b5563' }}>
                      QAR {item.priceQAR.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      QAR {lineTotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Price Breakdown */}
          <div className={styles.totalsSection}>
            <div className={styles.totalsTable}>
              <div className={styles.totalsRow}>
                <span>Item Subtotal:</span>
                <strong>QAR {itemSubtotal.toFixed(2)}</strong>
              </div>

              <div className={styles.totalsRow}>
                <span>Shipping Fee:</span>
                <span className={shippingFee === 0 ? styles.freeShipping : ''}>
                  {shippingFee === 0 ? 'FREE' : `QAR ${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {discount > 0 && (
                <div className={styles.totalsRow}>
                  <span>Discount:</span>
                  <span style={{ color: '#ef4444' }}>-QAR {discount.toFixed(2)}</span>
                </div>
              )}

              <div className={styles.totalsRowFinal}>
                <span>Grand Total:</span>
                <span className={styles.grandTotalHighlight}>
                  QAR {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Qatar Commercial & Customs Notice */}
          <div className={styles.invoiceFooterNote}>
            <div className={styles.noticeIconWrap}>
              <ShieldCheck size={16} />
            </div>
            <div>
              <strong>State of Qatar Customs Clearance &amp; Warranty:</strong>
              <div>
                All items shipped via Direct Air Express cleared under Hamad International Airport (DOH) manifest. 14-day return protection &amp; local Qatar support.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className={styles.modalFooterBar}>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeFooterBtn}
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className={styles.printBtn}
          >
            <Printer size={15} />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
