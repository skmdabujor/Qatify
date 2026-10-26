import { v } from "convex/values";
import { action, query, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

// Helper: Generate responsive branded HTML email template for Qatify
export function generateOrderEmailHtml(order: Doc<"orders">, siteUrl: string): string {
  const trackingUrl = `${siteUrl}/dashboard?order=${encodeURIComponent(order.orderNumber)}`;
  const whatsappNumber = process.env.WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801875707255";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi Qatify, I have an inquiry regarding Order #${order.orderNumber}`)}`;

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f1f3f5;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="64" valign="top">
                <img src="${item.image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200'}" alt="${item.title}" width="60" height="60" style="border-radius: 8px; object-fit: cover; border: 1px solid #e4e4e7; display: block;" />
              </td>
              <td style="padding-left: 12px;" valign="top">
                <div style="font-size: 14px; font-weight: 700; color: #0a0a0c; line-height: 1.3;">${item.title}</div>
                ${item.selectedColor ? `<div style="font-size: 12px; color: #71717a; margin-top: 3px;">Color: ${item.selectedColor}</div>` : ''}
                ${item.selectedOption ? `<div style="font-size: 12px; color: #71717a;">Option: ${item.selectedOption}</div>` : ''}
                <div style="font-size: 12px; color: #52525b; margin-top: 4px;">Qty: <strong>${item.quantity}</strong> × QAR ${item.priceQAR.toLocaleString()}</div>
              </td>
              <td align="right" valign="top" style="font-size: 14px; font-weight: 700; color: #0a0a0c;">
                QAR ${(item.priceQAR * item.quantity).toLocaleString()}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${order.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f5; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e4e4e7;">
          
          <!-- 1. Header with Dark Obsidian Brand Canvas & Authentic Logo -->
          <tr>
            <td style="background-color: #0a0a0c; padding: 18px 24px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right: 12px;">
                    <img src="https://mellow-puma-618.eu-west-1.convex.cloud/api/storage/abf7ad3e-2e8a-4cad-81fa-e45e052d50b9" width="38" height="38" alt="Qatify" style="display: block; border-radius: 10px;" />
                  </td>
                  <td valign="middle">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle">
                          <span style="font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; text-transform: uppercase;">
                            QATIFY
                          </span>
                        </td>
                        <td valign="middle" style="padding-left: 8px;">
                          <span style="background-color: #facc15; color: #0a0a0c; font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 4px; font-family: monospace; display: inline-block;">
                            .QA
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. Hero Celebration & Confirmation -->
          <tr>
            <td style="padding: 28px 24px 20px 24px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #f1f3f5;">
              <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background-color: #ecfdf5; color: #059669; font-size: 24px; margin-bottom: 12px;">
                ✓
              </div>
              <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #0a0a0c;">
                Shukran, ${order.address.fullName.split(' ')[0]}!
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #52525b; line-height: 1.5;">
                Your order is confirmed & secured. Items are being packed at our global air export hub for direct flight to Qatar.
              </p>

              <!-- Order Badge Pill -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 18px; margin: 0 auto;">
                <tr>
                  <td style="font-size: 13px; color: #64748b; padding-right: 12px;">Order Number:</td>
                  <td style="font-size: 14px; font-weight: 800; color: #0a0a0c; font-family: monospace;">${order.orderNumber}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 3. Air Express 5-Stage Tracking Card -->
          <tr>
            <td style="padding: 20px 24px; background-color: #fcfcfd; border-bottom: 1px solid #f1f3f5;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 10px; padding: 18px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Air Express Tracking Number</div>
                    <div style="font-size: 16px; font-weight: 800; color: #e11d48; font-family: monospace; margin: 4px 0 12px 0;">${order.trackingNumber}</div>
                    
                    <div style="font-size: 13px; color: #0a0a0c; margin-bottom: 14px; line-height: 1.4;">
                      ⏱️ <strong>Estimated Doorstep Arrival:</strong> ${order.estimatedDeliveryWindow} (via Hamad Int’l Airport DOH)
                    </div>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="${trackingUrl}" target="_blank" style="display: block; background-color: #e11d48; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; text-align: center; padding: 12px 20px; border-radius: 8px;">
                            Track Your Air Shipment Live →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 4. Purchased Items List -->
          <tr>
            <td style="padding: 24px;">
              <div style="font-size: 15px; font-weight: 800; color: #0a0a0c; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                Items in this Shipment (${order.items.length})
              </div>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- 5. Payment & Invoice Breakdown -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px;">
                <tr>
                  <td style="font-size: 13px; color: #52525b; padding-bottom: 8px;">Items Subtotal</td>
                  <td align="right" style="font-size: 13px; font-weight: 600; color: #0a0a0c; padding-bottom: 8px;">QAR ${order.subtotalQAR.toLocaleString()}</td>
                </tr>
                ${
                  order.discountQAR > 0
                    ? `
                <tr>
                  <td style="font-size: 13px; color: #059669; padding-bottom: 8px;">Promo Discount ${order.couponCode ? `(${order.couponCode})` : ''}</td>
                  <td align="right" style="font-size: 13px; font-weight: 700; color: #059669; padding-bottom: 8px;">- QAR ${order.discountQAR.toLocaleString()}</td>
                </tr>
                `
                    : ''
                }
                <tr>
                  <td style="font-size: 13px; color: #52525b; padding-bottom: 10px;">Delivery in Qatar</td>
                  <td align="right" style="font-size: 13px; font-weight: 600; color: #0a0a0c; padding-bottom: 10px;">
                    ${order.shippingQAR === 0 ? '<span style="color: #059669; font-weight: 700;">FREE</span>' : `QAR ${order.shippingQAR.toLocaleString()}`}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top: 1px dashed #cbd5e1; padding-top: 10px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="font-size: 16px; font-weight: 800; color: #0a0a0c;">Total Amount</td>
                        <td align="right" style="font-size: 18px; font-weight: 800; color: #e11d48;">QAR ${order.totalQAR.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="font-size: 12px; color: #64748b; padding-top: 4px;">
                          Payment Method: <strong>${order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery (Pending)' : 'Polar Gateway (Paid ✓)'}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 6. Qatar National Address Delivery Box -->
          <tr>
            <td style="padding: 0 24px 28px 24px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 10px; padding: 16px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; color: #71717a; text-transform: uppercase; margin-bottom: 6px;">📍 Delivery Destination (Qatar National Address)</div>
                    <div style="font-size: 14px; font-weight: 700; color: #0a0a0c;">${order.address.fullName} • <span style="font-family: monospace; font-weight: 600;">${order.address.phone}</span></div>
                    <div style="font-size: 13px; color: #3f3f46; margin-top: 4px; line-height: 1.4;">
                      ${order.address.municipality}<br>
                      ${order.address.zoneNumber}, ${order.address.streetNumber}, ${order.address.buildingNumber}
                      ${order.address.unitNumber ? `, Apt/Unit ${order.address.unitNumber}` : ''}
                      ${order.address.landmark ? `<br><span style="color: #71717a; font-size: 12px;">Landmark: ${order.address.landmark}</span>` : ''}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 7. Support & Footer -->
          <tr>
            <td style="background-color: #0a0a0c; padding: 24px; text-align: center; color: #a1a1aa;">
              <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
                Need help with your order or delivery?
              </div>
              <div style="margin-bottom: 16px;">
                <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #25d366; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 8px 16px; border-radius: 20px;">
                  💬 Chat on WhatsApp (01875707255)
                </a>
              </div>
              <div style="font-size: 12px; color: #71717a; line-height: 1.5;">
                Hotline: +974 4492 8100 &nbsp;|&nbsp; Email: support@qatify.qa<br>
                100% Quality Inspected Before Flight Dispatch &nbsp;•&nbsp; 14-Day Return Protection<br>
                <span style="font-size: 11px; color: #52525b; margin-top: 8px; display: block;">© 2026 Qatify Technologies W.L.L. Doha, State of Qatar.</span>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// 1. Internal Action: Send Order Confirmation Email via Resend (or simulate in dev)
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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qatify.qa";
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

    // Call Resend REST API
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Qatify Qatar <onboarding@resend.dev>",
          to: [recipientEmail],
          subject: `Order Confirmed: ${order.orderNumber} | Qatify Qatar`,
          html: emailHtml,
          text: `Shukran! Your Qatify order ${order.orderNumber} is confirmed. Total: QAR ${order.totalQAR}. Track your shipment live at: ${siteUrl}/dashboard?order=${order.orderNumber}`,
          reply_to: "support@qatify.qa",
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

    const siteUrl = "http://localhost:3000";
    return generateOrderEmailHtml(order, siteUrl);
  },
});
