import { v } from "convex/values";
import { action, query, internalAction } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

// Helper: Generate responsive branded HTML email template for Qatify
// Built according to Qatify's design system & typography ('Plus Jakarta Sans', 'Nunito Sans', 'JetBrains Mono')
export function generateOrderEmailHtml(order: Doc<"orders">, siteUrl: string): string {
  const trackingNumber = order.trackingNumber || order.orderNumber;
  const trackingUrl = `${siteUrl}/track/${encodeURIComponent(order.orderNumber)}`;
  const whatsappNumber =
    process.env.WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "8801304564836";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi Qatify, I have an inquiry regarding Order #${order.orderNumber}`
  )}`;

  const customerFirstName =
    order.address?.firstName?.trim() ||
    order.address?.fullName?.trim().split(" ")[0] ||
    "Mohammed";

  const customerFullName = order.address?.fullName || "Mohammed Al-Sayed";
  const customerPhone = order.address?.phone || "+974 55123456";

  const streetPart =
    order.address?.streetAddress ||
    order.address?.streetNumber ||
    "Al Sadd Street";
  const buildingPart =
    order.address?.apartmentSuite ||
    order.address?.buildingNumber ||
    "Building 45, Apartment 3B";
  const cityZonePart = `${order.address?.municipality || "Doha"}, ${
    order.address?.zoneNumber?.startsWith("Zone")
      ? order.address.zoneNumber
      : `Zone ${order.address?.zoneNumber || "24"}`
  }${order.address?.postalCode ? `, ${order.address.postalCode}` : ""}, ${order.address?.country || "Qatar"}`;

  const estimatedArrival =
    order.estimatedDeliveryWindow || "Nov 20 – Nov 24, 2026";

  const itemsHtml = order.items
    .map(
      (item) => `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="padding: 16px 0; border-bottom: 1px solid #F1F5F9;">
      <tbody><tr>
        <!-- 64x64 Product Thumbnail -->
        <td width="64" valign="top" style="padding-right: 14px;">
          <img src="${item.image || 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=200'}" alt="${item.title}" width="64" height="64" style="display: block; width: 64px; height: 64px; border-radius: 8px; border: 1px solid #E2E8F0; object-fit: cover; background-color: #F8FAFC;">
        </td>
        <!-- Product Title & Variant -->
        <td valign="top" style="padding-right: 14px;">
          <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #0F172A; line-height: 1.4; margin-bottom: 4px;">
            ${item.title}
          </div>
          ${
            item.selectedColor
              ? `<div style="font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; color: #64748B; margin-bottom: 3px;">
            Color: <span style="color: #334155; font-weight: 500;">${item.selectedColor}</span>
          </div>`
              : ""
          }
          ${
            item.selectedOption
              ? `<div style="font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; color: #64748B; margin-bottom: 3px;">
            Option: <span style="color: #334155; font-weight: 500;">${item.selectedOption}</span>
          </div>`
              : ""
          }
          <div style="font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; color: #64748B;">
            Qty: <strong style="color: #0F172A;">${item.quantity}</strong> × QAR ${item.priceQAR.toLocaleString()}
          </div>
        </td>
        <!-- Properly Separated Right-Aligned Price -->
        <td align="right" valign="top" style="white-space: nowrap;">
          <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; font-weight: 700; color: #0F172A;">
            QAR ${(item.priceQAR * item.quantity).toLocaleString()}
          </div>
        </td>
      </tr>
    </tbody></table>
    `
    )
    .join("");

  const isCOD = order.paymentMethod === "cash_on_delivery";
  const paymentMethodTitle = isCOD ? "Cash on Delivery" : "Polar Gateway";
  const paymentBadge = isCOD
    ? `<span style="display: inline-block; background-color: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">
        Pending (COD)
      </span>`
    : `<span style="display: inline-block; background-color: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">
        Paid ✓
      </span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for your order, ${customerFirstName}! (#${order.orderNumber})</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700;800&family=Nunito+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F9; font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F4F6F9; margin: 0; padding: 32px 12px;">
      <tbody><tr>
        <td align="center" valign="top">
          
          <!-- Main 600px Email Card -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);">
            
            <!-- Header: Clean Marketplace Brand Identity with Official Logo -->
            <tbody><tr>
              <td class="mobile-pad" style="padding: 22px 36px; background-color: #FFFFFF; border-bottom: 1px solid #F1F5F9; text-align: center;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
                  <tbody><tr>
                    <td align="center" valign="middle">
                      <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="https://www.shopqatify.com/brand/qatify-final-logo.png" alt="Shop Qatify" height="42" style="display: block; height: 42px; width: auto; max-width: 220px; border: 0; margin: 0 auto;" />
                      </a>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>

            <!-- Hero Confirmation Section -->
            <tr>
              <td class="mobile-pad" style="padding: 32px 36px 26px 36px; text-align: center;">
                <h1 style="margin: 0 0 8px 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 22px; font-weight: 700; color: #0F172A; line-height: 1.3; letter-spacing: -0.4px;">
                  Shukran, ${customerFirstName}!
                </h1>
                <p style="margin: 0 auto; max-width: 460px; font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #475569;">
                  Your order is confirmed &amp; secured. Items are being packed at our global air export hub for direct flight to Qatar.
                </p>
              </td>
            </tr>

            <!-- Air Express Tracking & Delivery Window Section -->
            <tr>
              <td class="mobile-pad" style="padding: 0 36px 28px 36px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;">
                  <tbody><tr>
                    <td style="padding: 20px 22px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="padding-bottom: 14px;">
                        <tbody><tr>
                          <td align="left" valign="middle" style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; font-weight: 600; color: #64748B;">
                            Tracking Number
                          </td>
                          <td align="right" valign="middle" style="font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 15px; font-weight: 700; color: #0F172A; letter-spacing: 0.4px;">
                            ${trackingNumber}
                          </td>
                        </tr>
                      </tbody></table>

                      <!-- Subtle Divider -->
                      <div style="border-top: 1px solid #E2E8F0; margin: 0 0 14px 0;"></div>

                      <!-- Estimated Arrival: Clean Two-Column Key-Value Row -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 18px;">
                        <tbody><tr>
                          <td align="left" valign="middle" style="font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; color: #64748B;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tbody><tr>
                                <td width="16" valign="middle" style="padding-right: 7px;">
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                  </svg>
                                </td>
                                <td valign="middle" style="font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; color: #64748B;">
                                  Estimated Doorstep Arrival:
                                </td>
                              </tr>
                            </tbody></table>
                          </td>
                          <td align="right" valign="middle" style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; font-weight: 700; color: #0F172A; white-space: nowrap;">
                            ${estimatedArrival}
                          </td>
                        </tr>
                      </tbody></table>

                      <!-- Sleek Deep Slate Marketplace CTA Button -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tbody><tr>
                          <td align="center" style="border-radius: 8px; background-color: #0F172A;">
                            <a href="${trackingUrl}" target="_blank" style="display: block; padding: 14px 20px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 8px; text-align: center; letter-spacing: 0.1px;" rel="noopener noreferrer">
                              Track Your Air Shipment Live →
                            </a>
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>

            <!-- Items in this Shipment Section -->
            <tr>
              <td class="mobile-pad" style="padding: 0 36px 24px 36px;">
                <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 12px; border-bottom: 1px solid #E2E8F0;">
                  Items in this shipment (${order.items.length})
                </div>

                ${itemsHtml}
              </td>
            </tr>

            <!-- Clean Light Slate Payment Summary Box -->
            <tr>
              <td class="mobile-pad" style="padding: 0 36px 24px 36px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;">
                  <tbody><tr>
                    <td style="padding: 18px 20px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tbody><tr>
                          <td style="padding: 3px 0; font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; color: #475569;">
                            Items Subtotal
                          </td>
                          <td align="right" style="padding: 3px 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; font-weight: 600; color: #0F172A;">
                            QAR ${order.subtotalQAR.toLocaleString()}
                          </td>
                        </tr>
                        ${
                          order.discountQAR && order.discountQAR > 0
                            ? `<tr>
                          <td style="padding: 3px 0; font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; color: #059669;">
                            Promo Discount ${order.couponCode ? `(${order.couponCode})` : ""}
                          </td>
                          <td align="right" style="padding: 3px 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; font-weight: 700; color: #059669;">
                            - QAR ${order.discountQAR.toLocaleString()}
                          </td>
                        </tr>`
                            : ""
                        }
                        <tr>
                          <td style="padding: 3px 0 12px 0; font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; color: #475569;">
                            Delivery in Qatar
                          </td>
                          <td align="right" style="padding: 3px 0 12px 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; font-weight: 600; color: #0F172A;">
                            ${order.shippingQAR === 0 ? '<span style="color: #059669; font-weight: 700;">FREE</span>' : `QAR ${order.shippingQAR.toLocaleString()}`}
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" style="border-top: 1px dashed #CBD5E1; padding-top: 12px;"></td>
                        </tr>
                        <tr>
                          <td valign="middle" style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; font-weight: 700; color: #0F172A;">
                            Total Amount
                          </td>
                          <td align="right" valign="middle" style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 18px; font-weight: 800; color: #0F172A;">
                            QAR ${order.totalQAR.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding-top: 10px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tbody><tr>
                                <td align="left" valign="middle" style="font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; color: #64748B;">
                                  Payment Method: <strong style="color: #334155;">${paymentMethodTitle}</strong>
                                </td>
                                <td align="right" valign="middle">
                                  ${paymentBadge}
                                </td>
                              </tr>
                            </tbody></table>
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>

            <!-- Delivery Destination Card -->
            <tr>
              <td class="mobile-pad" style="padding: 0 36px 32px 36px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px;">
                  <tbody><tr>
                    <td style="padding: 18px 20px;">
                      <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px;">
                        Delivery Destination (Qatar)
                      </div>
                      <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                        ${customerFullName} &nbsp;•&nbsp; <a href="tel:${customerPhone}" style="color: #2563EB; text-decoration: none; font-weight: 600;" target="_blank" rel="noopener noreferrer">${customerPhone}</a>
                      </div>
                      <div style="font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; color: #475569; line-height: 1.55;">
                        ${streetPart}, ${buildingPart}<br>
                        ${cityZonePart}
                      </div>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>

            <!-- Light, Fresh Marketplace Footer -->
            <tr>
              <td class="mobile-pad" style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 28px 36px; text-align: center;">
                <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #0F172A; margin-bottom: 14px;">
                  Need help with your order or delivery?
                </div>

                <!-- Crisp Emerald WhatsApp Support Button -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto 16px auto;">
                  <tbody><tr>
                    <td align="center" style="background-color: #10B981; border-radius: 8px;">
                      <a href="${whatsappUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 8px;" rel="noopener noreferrer">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px; margin-top: -2px;">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"></path>
                        </svg>
                        Chat on WhatsApp
                      </a>
                    </td>
                  </tr>
                </tbody></table>

                <!-- Direct Contact Links -->
                <div style="font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; color: #475569; margin-bottom: 14px;">
                  WhatsApp Support: <a href="https://wa.me/${whatsappNumber}" style="color: #0F172A; font-weight: 600; text-decoration: none;" target="_blank" rel="noopener noreferrer">+880 1304 564836</a>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  Email: <a href="mailto:support@shopqatify.com" style="color: #0F172A; font-weight: 600; text-decoration: none;" target="_blank" rel="noopener noreferrer">support@shopqatify.com</a>
                </div>

                <!-- Trust Badges -->
                <div style="font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 11px; font-weight: 500; color: #64748B; padding-top: 14px; border-top: 1px solid #E2E8F0; margin-bottom: 6px;">
                  100% Quality Inspected Before Flight Dispatch &nbsp;•&nbsp; 24/7 Dedicated Support
                </div>

                <!-- Copyright -->
                <div style="font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 11px; color: #94A3B8;">
                  © 2026 Qatify Technologies W.L.L. Doha, State of Qatar.
                </div>
              </td>
            </tr>

          </tbody></table>
          <!-- End Main 600px Email Card -->

        </td>
      </tr>
    </tbody></table>
</body>
</html>`;
}

// 1. Internal Action: Send Order Confirmation Email via Resend
export const sendOrderConfirmationEmail = internalAction({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (
    ctx,
    args
  ): Promise<
    | { success: true; simulated?: boolean; orderNumber?: string; recipient?: string; emailId?: string }
    | { success: false; reason?: string; error?: string }
  > => {
    // 1. Fetch order details from database
    const order: Doc<"orders"> | null = await ctx.runQuery(
      internal.orders.getOrderByIdInternal,
      { orderId: args.orderId }
    );

    if (!order) {
      console.warn(`Order not found for email dispatch: ${args.orderId}`);
      return { success: false, reason: "Order not found" };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const siteUrl =
      process.env.SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://shopqatify.com";
    const recipientEmail =
      order.customerEmail ||
      order.address.email ||
      "customer@example.com";

    const emailHtml = generateOrderEmailHtml(order, siteUrl);

    // If RESEND_API_KEY is not configured yet, simulate email sending
    if (!resendApiKey) {
      console.log(
        `[Email Service] RESEND_API_KEY not configured. Simulated Order Confirmation Email for order ${order.orderNumber} to ${recipientEmail} generated successfully.`
      );
      return {
        success: true,
        simulated: true,
        orderNumber: order.orderNumber,
        recipient: recipientEmail,
      };
    }

    const customerFirstName =
      order.address?.firstName?.trim() ||
      order.address?.fullName?.trim().split(" ")[0] ||
      "Mohammed";

    // Format requested by user: "Thanks for your order, Mohammed! (#QA-896533)"
    const emailSubject = `Thanks for your order, ${customerFirstName}! (#${order.orderNumber})`;

    // Call Resend REST API
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Qatify Qatar <orders@shopqatify.com>",
          to: [recipientEmail],
          subject: emailSubject,
          html: emailHtml,
          text: `Shukran! Your Qatify order ${order.orderNumber} is confirmed. Total: QAR ${order.totalQAR}. Track your shipment live at: ${siteUrl}/track/${order.orderNumber}`,
          reply_to: "support@shopqatify.com",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Resend API error (${response.status}): ${errorText}`);
        return { success: false, error: errorText };
      }

      const data = await response.json();
      console.log(`[Email Service] Live order confirmation email sent: ${data.id}`);
      return { success: true, emailId: data.id };
    } catch (err) {
      console.error("[Email Service] Failed to send email via Resend:", err);
      return { success: false, error: String(err) };
    }
  },
});

// 2. Public Query: Preview Order Confirmation Email HTML
export const previewOrderConfirmationHtml = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();

    if (!order) return null;

    const siteUrl = "https://shopqatify.com";
    return generateOrderEmailHtml(order, siteUrl);
  },
});

// 3. Public Action: Dispatch or Test Order Confirmation Email (via Resend)
export const resendOrderConfirmationEmailAction = action({
  args: {
    orderNumber: v.optional(v.string()),
    orderId: v.optional(v.id("orders")),
    recipientEmail: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    emailId?: string;
    orderNumber?: string;
    recipient?: string;
    simulated?: boolean;
    error?: string;
    message?: string;
  }> => {
    let order: Doc<"orders"> | null = null;

    if (args.orderId) {
      order = await ctx.runQuery(internal.orders.getOrderByIdInternal, {
        orderId: args.orderId,
      });
    } else if (args.orderNumber) {
      order = await ctx.runQuery(api.orders.getByOrderNumber, {
        orderNumber: args.orderNumber,
      });
    } else {
      const recentOrders = await ctx.runQuery(api.orders.listRecentOrders, {
        limit: 1,
      });
      if (recentOrders && recentOrders.length > 0) {
        order = recentOrders[0];
      }
    }

    if (!order) {
      return { success: false, error: "No order found to send confirmation email." };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const siteUrl =
      process.env.SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://shopqatify.com";
    const recipientEmail =
      args.recipientEmail?.trim().toLowerCase() ||
      order.customerEmail ||
      order.address.email ||
      "sheakmohammadabujor@gmail.com";

    const emailHtml = generateOrderEmailHtml(order, siteUrl);

    if (!resendApiKey) {
      return {
        success: true,
        simulated: true,
        orderNumber: order.orderNumber,
        recipient: recipientEmail,
        message: `Simulated order confirmation email for #${order.orderNumber} to ${recipientEmail}`,
      };
    }

    const customerFirstName =
      order.address?.firstName?.trim() ||
      order.address?.fullName?.trim().split(" ")[0] ||
      "Mohammed";

    // Format requested by user: "Thanks for your order, Mohammed! (#QA-896533)"
    const emailSubject = `Thanks for your order, ${customerFirstName}! (#${order.orderNumber})`;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Qatify Qatar <orders@shopqatify.com>",
          to: [recipientEmail],
          subject: emailSubject,
          html: emailHtml,
          text: `Shukran! Your Qatify order ${order.orderNumber} is confirmed. Total: QAR ${order.totalQAR}. Track your shipment live at: ${siteUrl}/track/${order.orderNumber}`,
          reply_to: "support@shopqatify.com",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: errorText, orderNumber: order.orderNumber, recipient: recipientEmail };
      }

      const data = await response.json();
      return {
        success: true,
        emailId: data.id,
        orderNumber: order.orderNumber,
        recipient: recipientEmail,
        message: `Order confirmation email sent for #${order.orderNumber} to ${recipientEmail} (ID: ${data.id})`,
      };
    } catch (err) {
      return { success: false, error: String(err), orderNumber: order.orderNumber, recipient: recipientEmail };
    }
  },
});
