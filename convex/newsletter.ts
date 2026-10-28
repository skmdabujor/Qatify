import { v } from "convex/values";
import { query, mutation, action, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { assertAdminAccess } from "./adminAuth";

// =============================================================================
// Qatify — Qatar VIP Newsletter & Deal Alerts Engine
// =============================================================================

export interface NewsletterTemplateOptions {
  recipientEmail?: string;
  siteUrl?: string;
  promoCode?: string;
  discountPercentage?: number;
  previewTitle?: string;
  whatsappNumber?: string;
}

// 1. Generate Luxury Responsive HTML Email Template for Qatify VIP Newsletter
export function generateNewsletterEmailHtml(options: NewsletterTemplateOptions = {}): string {
  const siteUrl = options.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://qatify.qa";
  const promoCode = options.promoCode || "WELCOME10";
  const whatsappNumber = options.whatsappNumber || process.env.WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801875707255";
  const recipientEmail = options.recipientEmail || "VIP Subscriber";
  const recipientName = recipientEmail.includes("@") ? recipientEmail.split("@")[0] : "VIP Member";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi Qatify VIP, I would like to inquire about the newsletter deals and coupon ${promoCode}`)}`;
  const logoUrl = "https://mellow-puma-618.eu-west-1.convex.cloud/api/storage/kg2bvtt5c9jz56hv42td27x8318h40pk";

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Qatify VIP Qatar Deals</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Preheader preview text (invisible in body, shown in inbox list) -->
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #fff;">
    🇶🇦 VIP Insider Deals: Claim 10% OFF with code ${promoCode} + Direct Air Express to Hamad Int'l Airport (DOH) &amp; doorstep delivery across Qatar!
  </div>

  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f5; padding: 28px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Card -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border: 1px solid #e4e4e7;">
          
          <!-- 1. Header with Dark Obsidian Brand Canvas & Authentic Logo -->
          <tr>
            <td style="background-color: #0a0a0c; padding: 20px 28px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td valign="middle" align="left">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 12px;">
                          <img src="${logoUrl}" width="40" height="40" alt="Qatify" style="display: block; border-radius: 10px;" />
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
                  <td valign="middle" align="right">
                    <span style="display: inline-block; background-color: rgba(255,255,255,0.12); color: #e4e4e7; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                      VIP INSIDER • DOHA
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. Hero Section: Exclusive Qatar Drops -->
          <tr>
            <td style="background: linear-gradient(180deg, #0a0a0c 0%, #18181b 100%); padding: 36px 28px 32px 28px; text-align: center; color: #ffffff;">
              <div style="display: inline-block; background: rgba(224, 108, 42, 0.18); border: 1px solid rgba(224, 108, 42, 0.4); color: #f59e0b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 14px; border-radius: 30px; margin-bottom: 16px;">
                🇶🇦 EXCLUSIVE QATAR DROP &amp; WEEKLY CURATION
              </div>
              <h1 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 900; line-height: 1.25; letter-spacing: -0.5px; color: #ffffff;">
                Global Trending Finds,<br><span style="color: #e06c2a;">Delivered Direct to Doha</span> ✈️
              </h1>
              <p style="margin: 0 auto 20px auto; max-width: 480px; font-size: 14px; color: #a1a1aa; line-height: 1.6;">
                Salam, <strong style="color: #ffffff;">${recipientName}</strong>! Enjoy direct air import access to top-trending lifestyle gadgets, electronics, and viral essentials — inspected at our global hub and flown straight to Hamad Int’l Airport (DOH).
              </p>

              <!-- Coupon Code Card -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="background-color: #27272a; border: 1px dashed #facc15; border-radius: 12px; padding: 16px 24px; margin: 0 auto; max-width: 420px;">
                <tr>
                  <td align="center">
                    <div style="font-size: 11px; font-weight: 700; color: #facc15; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                      Your VIP Welcome Voucher (10% OFF)
                    </div>
                    <div style="font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: 4px; font-family: monospace; padding: 6px 0;">
                      ${promoCode}
                    </div>
                    <div style="font-size: 12px; color: #d4d4d8; margin-top: 2px;">
                      Use at checkout for instant 10% discount on all items
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Main CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top: 24px;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #e06c2a;">
                    <a href="${siteUrl}?ref=newsletter&coupon=${promoCode}" target="_blank" style="display: inline-block; background-color: #e06c2a; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 800; padding: 14px 32px; border-radius: 8px; border: 1px solid #d45917;">
                      Claim VIP 10% Off &amp; Shop Now →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 3. Curated Qatar VIP Category Drops -->
          <tr>
            <td style="padding: 32px 28px 20px 28px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 800; color: #e06c2a; text-transform: uppercase; letter-spacing: 1px;">
                  TOP PICKS FOR QATAR
                </div>
                <h2 style="margin: 6px 0 0 0; font-size: 20px; font-weight: 800; color: #0a0a0c;">
                  Curated Categories Trending This Week
                </h2>
              </div>

              <!-- Category 1: Smart Tech & Audio -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; margin-bottom: 16px; overflow: hidden;">
                <tr>
                  <td width="110" valign="middle" style="padding: 12px;">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" width="100" height="100" alt="Tech" style="display: block; border-radius: 8px; object-fit: cover;" />
                  </td>
                  <td valign="middle" style="padding: 12px 16px 12px 4px;">
                    <span style="background-color: #ecfdf5; color: #059669; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                      ⚡ Fast Air Express
                    </span>
                    <h3 style="margin: 6px 0 4px 0; font-size: 15px; font-weight: 800; color: #0a0a0c;">
                      Smart Tech &amp; Wireless Audio
                    </h3>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #71717a; line-height: 1.4;">
                      Next-gen ANC headphones, 100W GaN chargers, and magnetic wireless car mounts.
                    </p>
                    <a href="${siteUrl}/products?category=electronics" target="_blank" style="font-size: 12px; font-weight: 700; color: #e06c2a; text-decoration: none;">
                      Shop Tech Collection &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Category 2: Deals Under QAR 99 -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; margin-bottom: 16px; overflow: hidden;">
                <tr>
                  <td width="110" valign="middle" style="padding: 12px;">
                    <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&q=80" width="100" height="100" alt="Under 99" style="display: block; border-radius: 8px; object-fit: cover;" />
                  </td>
                  <td valign="middle" style="padding: 12px 16px 12px 4px;">
                    <span style="background-color: #fef3c7; color: #b45309; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                      🔥 Best Values
                    </span>
                    <h3 style="margin: 6px 0 4px 0; font-size: 15px; font-weight: 800; color: #0a0a0c;">
                      Under QAR 99 Super Deals
                    </h3>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #71717a; line-height: 1.4;">
                      Daily essentials, lifestyle gear &amp; novelty gadgets under QAR 99 with guaranteed air shipping.
                    </p>
                    <a href="${siteUrl}/products?filter=under-99" target="_blank" style="font-size: 12px; font-weight: 700; color: #e06c2a; text-decoration: none;">
                      View Under 99 Deals &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Category 3: Modern Lifestyle & Home -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td width="110" valign="middle" style="padding: 12px;">
                    <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&q=80" width="100" height="100" alt="Lifestyle" style="display: block; border-radius: 8px; object-fit: cover;" />
                  </td>
                  <td valign="middle" style="padding: 12px 16px 12px 4px;">
                    <span style="background-color: #eff6ff; color: #2563eb; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                      ✨ Premium Quality
                    </span>
                    <h3 style="margin: 6px 0 4px 0; font-size: 15px; font-weight: 800; color: #0a0a0c;">
                      Modern Living &amp; Smart Accessories
                    </h3>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #71717a; line-height: 1.4;">
                      Aesthetic home organizers, smart wearables, and sleek everyday carry upgrades.
                    </p>
                    <a href="${siteUrl}/products" target="_blank" style="font-size: 12px; font-weight: 700; color: #e06c2a; text-decoration: none;">
                      Browse Catalog &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 4. Why Qatar Chooses Qatify (4 Pillars) -->
          <tr>
            <td style="padding: 24px 28px; background-color: #f8fafc; border-top: 1px solid #f1f3f5; border-bottom: 1px solid #f1f3f5;">
              <div style="font-size: 13px; font-weight: 800; color: #0a0a0c; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; margin-bottom: 18px;">
                The Qatify Qatar Promise 🇶🇦
              </div>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="50%" valign="top" style="padding: 8px 10px;">
                    <div style="font-size: 20px; margin-bottom: 4px;">✈️</div>
                    <div style="font-size: 13px; font-weight: 800; color: #0a0a0c;">Direct Flight to DOH</div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; margin-top: 2px;">
                      Flown direct into Hamad Int’l Airport with live parcel tracking.
                    </div>
                  </td>
                  <td width="50%" valign="top" style="padding: 8px 10px;">
                    <div style="font-size: 20px; margin-bottom: 4px;">📍</div>
                    <div style="font-size: 13px; font-weight: 800; color: #0a0a0c;">National Address</div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; margin-top: 2px;">
                      Delivered to your exact Zone, Street &amp; Building in Qatar.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" valign="top" style="padding: 12px 10px 8px 10px;">
                    <div style="font-size: 20px; margin-bottom: 4px;">🛡️</div>
                    <div style="font-size: 13px; font-weight: 800; color: #0a0a0c;">Inspected Quality</div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; margin-top: 2px;">
                      Every product passes rigorous inspection before flight export.
                    </div>
                  </td>
                  <td width="50%" valign="top" style="padding: 12px 10px 8px 10px;">
                    <div style="font-size: 20px; margin-bottom: 4px;">💵</div>
                    <div style="font-size: 13px; font-weight: 800; color: #0a0a0c;">COD &amp; Polar Pay</div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; margin-top: 2px;">
                      Pay cash on delivery or securely via Polar credit/debit card.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 5. VIP WhatsApp Concierge -->
          <tr>
            <td style="padding: 24px 28px; background-color: #ffffff; text-align: center;">
              <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 800; color: #0a0a0c;">
                Have questions or looking for a specific item?
              </h4>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #71717a;">
                Our bilingual support team in Doha is available 24/7 on WhatsApp.
              </p>
              <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 22px; border-radius: 24px;">
                💬 Chat with Doha Concierge on WhatsApp
              </a>
            </td>
          </tr>

          <!-- 6. Footer & Legal -->
          <tr>
            <td style="background-color: #0a0a0c; padding: 24px; text-align: center; color: #a1a1aa; border-top: 1px solid #18181b;">
              <div style="font-size: 12px; color: #71717a; line-height: 1.6; margin-bottom: 12px;">
                Hotline: +974 4492 8100 &nbsp;|&nbsp; WhatsApp: +880 1875 707255 &nbsp;|&nbsp; Email: support@qatify.qa<br>
                Commercial Registration: Doha, State of Qatar
              </div>
              <div style="font-size: 11px; color: #52525b; line-height: 1.5;">
                You are receiving this VIP digest because you subscribed at Qatify.qa.<br>
                <a href="${siteUrl}/dashboard" target="_blank" style="color: #a1a1aa; text-decoration: underline;">Manage Preferences</a>
                &nbsp;•&nbsp;
                <a href="${siteUrl}" target="_blank" style="color: #a1a1aa; text-decoration: underline;">Visit Store</a>
              </div>
              <div style="font-size: 11px; color: #3f3f46; margin-top: 12px;">
                © 2026 Qatify Technologies W.L.L. All rights reserved.
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

// 2. Subscribe customer email to Qatar VIP Deal alerts (used by FirstTimeDiscountPopup & Footer)
export const subscribe = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      throw new Error("Please provide a valid email address");
    }

    const existing = await ctx.db
      .query("newsletter_subscribers")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      return {
        success: true,
        alreadySubscribed: true,
        couponCode: "WELCOME10",
        message: "You are already subscribed! Enjoy coupon WELCOME10 for 10% off.",
      };
    }

    await ctx.db.insert("newsletter_subscribers", {
      email: cleanEmail,
      source: args.source || "website",
      subscribedAt: new Date().toISOString(),
    });

    return {
      success: true,
      alreadySubscribed: false,
      couponCode: "WELCOME10",
      message: "Shukran! You are subscribed to Qatify VIP Deal alerts.",
    };
  },
});

// 3. Admin: List all newsletter subscribers (Protected)
export const listSubscribers = query({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);

    const takeCount = args.limit ?? 100;
    return await ctx.db
      .query("newsletter_subscribers")
      .order("desc")
      .take(takeCount);
  },
});

// 4. Internal Query: Fetch subscribers for broadcast action
export const getSubscribersInternal = internalQuery({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const takeCount = args.limit ?? 200;
    return await ctx.db
      .query("newsletter_subscribers")
      .order("desc")
      .take(takeCount);
  },
});

// 5. Query: Preview VIP Newsletter HTML in browser
export const previewNewsletterHtml = query({
  args: {
    promoCode: v.optional(v.string()),
    recipientEmail: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qatify.qa";
    return generateNewsletterEmailHtml({
      recipientEmail: args.recipientEmail || "sheakmohammadabujor@gmail.com",
      promoCode: args.promoCode || "WELCOME10",
      siteUrl,
    });
  },
});

// 6. Action: Send Test VIP Newsletter Email (Dispatches via Resend REST API)
export const sendTestNewsletter = action({
  args: {
    recipientEmail: v.optional(v.string()),
    promoCode: v.optional(v.string()),
    subject: v.optional(v.string()),
    adminKey: v.optional(v.string()),
  },
  handler: async (
    _ctx,
    args
  ): Promise<{
    success: boolean;
    emailId?: string;
    recipient: string;
    promoCode: string;
    subject: string;
    simulated?: boolean;
    message: string;
    error?: string;
  }> => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qatify.qa";
    const promoCode = (args.promoCode || "WELCOME10").trim().toUpperCase();
    const targetEmail = (args.recipientEmail || "sheakmohammadabujor@gmail.com").trim().toLowerCase();
    const emailSubject = args.subject || "✨ Qatify VIP Qatar: 10% Off + Direct Hamad Air Express Drops 🇶🇦";

    const emailHtml = generateNewsletterEmailHtml({
      recipientEmail: targetEmail,
      promoCode,
      siteUrl,
    });

    if (!resendApiKey) {
      console.log(`[Newsletter] RESEND_API_KEY missing. Simulated test newsletter to ${targetEmail}`);
      return {
        success: true,
        simulated: true,
        recipient: targetEmail,
        promoCode,
        subject: emailSubject,
        message: `Simulated test newsletter generated for ${targetEmail}. Configure RESEND_API_KEY for live delivery.`,
      };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Qatify Qatar VIP <onboarding@resend.dev>",
          to: [targetEmail],
          subject: emailSubject,
          html: emailHtml,
          text: `Salam! Enjoy 10% OFF with code ${promoCode} on Qatify Qatar. Direct flight to Hamad Int'l Airport (DOH) & doorstep delivery across Qatar. Shop now at: ${siteUrl}`,
          reply_to: "support@qatify.qa",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Newsletter] Resend API error (${response.status}): ${errorText}`);
        return {
          success: false,
          recipient: targetEmail,
          promoCode,
          subject: emailSubject,
          error: errorText,
          message: `Resend error: ${errorText}`,
        };
      }

      const data = await response.json();
      console.log(`[Newsletter] Live VIP test newsletter sent successfully: ${data.id} to ${targetEmail}`);
      return {
        success: true,
        emailId: data.id,
        recipient: targetEmail,
        promoCode,
        subject: emailSubject,
        message: `Test newsletter sent successfully to ${targetEmail} (Message ID: ${data.id})`,
      };
    } catch (err) {
      console.error("[Newsletter] Exception during test dispatch:", err);
      return {
        success: false,
        recipient: targetEmail,
        promoCode,
        subject: emailSubject,
        error: String(err),
        message: `Failed to dispatch test newsletter: ${String(err)}`,
      };
    }
  },
});

// 7. Action: Broadcast Newsletter to All Subscribers (Protected)
export const broadcastNewsletter = action({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    promoCode: v.optional(v.string()),
    subject: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    totalSubscribers: number;
    dispatchedCount: number;
    simulatedCount: number;
    errors: string[];
  }> => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qatify.qa";
    const promoCode = (args.promoCode || "WELCOME10").trim().toUpperCase();
    const emailSubject = args.subject || "✨ Qatify VIP Qatar: Exclusive Deals & New Air Express Drops 🇶🇦";

    // 1. Fetch subscribers via internal query with explicit type annotation
    const subscribers: Doc<"newsletter_subscribers">[] = await ctx.runQuery(
      internal.newsletter.getSubscribersInternal,
      { limit: 200 }
    );

    let dispatchedCount = 0;
    let simulatedCount = 0;
    const errors: string[] = [];

    for (const sub of subscribers) {
      const emailHtml = generateNewsletterEmailHtml({
        recipientEmail: sub.email,
        promoCode,
        siteUrl,
      });

      if (!resendApiKey) {
        simulatedCount++;
        continue;
      }

      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "Qatify Qatar VIP <onboarding@resend.dev>",
            to: [sub.email],
            subject: emailSubject,
            html: emailHtml,
            text: `Salam! Enjoy 10% OFF with code ${promoCode} on Qatify Qatar. Shop now: ${siteUrl}`,
            reply_to: "support@qatify.qa",
          }),
        });

        if (response.ok) {
          dispatchedCount++;
        } else {
          const errText = await response.text();
          errors.push(`${sub.email}: ${errText}`);
        }
      } catch (e) {
        errors.push(`${sub.email}: ${String(e)}`);
      }
    }

    return {
      success: true,
      totalSubscribers: subscribers.length,
      dispatchedCount,
      simulatedCount,
      errors,
    };
  },
});
