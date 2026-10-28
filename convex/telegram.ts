import { v } from "convex/values";
import {
  query,
  mutation,
  action,
  internalQuery,
  internalAction,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

// =============================================================================
// Qatify — Telegram Order Notification System
// Sends real-time Telegram alerts to designated store owner/admin chat IDs
// via Telegram Bot API (https://api.telegram.org/bot<token>/sendMessage).
// =============================================================================

/**
 * Formats a clean, readable Telegram HTML alert message for a new order.
 */
export function formatOrderTelegramMessage(
  order: Doc<"orders">,
  siteUrl: string
): string {
  const itemsList = order.items
    .map(
      (it) =>
        `• <b>${it.title}</b> (x${it.quantity}) - QAR ${(it.priceQAR * it.quantity).toLocaleString()}`
    )
    .join("\n");

  const addressLine = `${order.address.municipality}, Zone ${order.address.zoneNumber}, St ${order.address.streetNumber}, Bldg ${order.address.buildingNumber}${
    order.address.unitNumber ? `, Unit ${order.address.unitNumber}` : ""
  }`;

  return [
    `🛍️ <b>[NEW ORDER RECEIVED - QATIFY]</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📦 <b>Order Number:</b> #${order.orderNumber}`,
    `📅 <b>Date:</b> ${order.date}`,
    `👤 <b>Customer:</b> ${order.address.fullName}`,
    `📞 <b>Customer Phone:</b> ${order.address.phone}`,
    `📍 <b>Delivery Address:</b> ${addressLine}`,
    `💰 <b>Total Amount:</b> <b>QAR ${order.totalQAR.toLocaleString()}</b>`,
    `💳 <b>Payment Method:</b> ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})`,
    `🚚 <b>Tracking Number:</b> <code>${order.trackingNumber}</code>`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `🛒 <b>Ordered Items (${order.items.length}):</b>`,
    itemsList,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `🔗 <a href="${siteUrl}/dashboard?order=${encodeURIComponent(
      order.orderNumber
    )}">View in Store Dashboard</a>`,
  ].join("\n");
}

// -----------------------------------------------------------------------------
// 1. Queries
// -----------------------------------------------------------------------------

/**
 * Public Query: List all registered Telegram notification recipients
 */
export const listRecipients = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("telegram_recipients").collect();
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
});

/**
 * Internal Query: Fetch all currently active Telegram recipients
 */
export const getActiveRecipientsInternal = internalQuery({
  args: {},
  handler: async (ctx): Promise<Doc<"telegram_recipients">[]> => {
    return await ctx.db
      .query("telegram_recipients")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();
  },
});

// -----------------------------------------------------------------------------
// 2. Mutations
// -----------------------------------------------------------------------------

/**
 * Mutation: Add a new Telegram notification recipient (chat ID)
 */
export const addRecipient = mutation({
  args: {
    chatId: v.string(),
    name: v.string(),
    botToken: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanChatId = args.chatId.trim();

    const existing = await ctx.db
      .query("telegram_recipients")
      .withIndex("by_chatId", (q) => q.eq("chatId", cleanChatId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name || existing.name,
        botToken: args.botToken !== undefined ? args.botToken.trim() : existing.botToken,
        isActive: args.isActive !== undefined ? args.isActive : true,
        notes: args.notes !== undefined ? args.notes : existing.notes,
      });
      return { recipientId: existing._id, action: "updated" };
    }

    const recipientId = await ctx.db.insert("telegram_recipients", {
      chatId: cleanChatId,
      name: args.name.trim(),
      botToken: args.botToken ? args.botToken.trim() : undefined,
      isActive: args.isActive !== undefined ? args.isActive : true,
      createdAt: new Date().toISOString(),
      notes: args.notes,
    });

    return { recipientId, action: "created" };
  },
});

/**
 * Mutation: Remove a Telegram recipient
 */
export const removeRecipient = mutation({
  args: {
    id: v.id("telegram_recipients"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

/**
 * Mutation: Toggle recipient active state
 */
export const toggleRecipient = mutation({
  args: {
    id: v.id("telegram_recipients"),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Recipient not found");
    }
    const newStatus = args.isActive !== undefined ? args.isActive : !item.isActive;
    await ctx.db.patch(args.id, { isActive: newStatus });
    return { success: true, isActive: newStatus };
  },
});

/**
 * Mutation: Seed default Telegram recipient
 */
export const seedDefaultRecipient = mutation({
  args: {},
  handler: async (ctx) => {
    const defaultChatId = "7303881875";
    const existing = await ctx.db
      .query("telegram_recipients")
      .withIndex("by_chatId", (q) => q.eq("chatId", defaultChatId))
      .first();

    if (!existing) {
      return await ctx.db.insert("telegram_recipients", {
        chatId: defaultChatId,
        name: "Tafsir Ahmed (Store Owner)",
        botToken: "8976140185:AAEDkbk5QhC9ARaolnSbUR0TC6CWanF2Mfg",
        isActive: true,
        createdAt: new Date().toISOString(),
        notes: "Primary Telegram alert receiver",
      });
    }
    return existing._id;
  },
});

// -----------------------------------------------------------------------------
// 3. Actions
// -----------------------------------------------------------------------------

/**
 * Internal Action: Send real-time Telegram notification for an order
 */
export const sendOrderNotificationTelegram = internalAction({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    sentCount: number;
    skippedCount: number;
    results: Array<{ chatId: string; status: string; error?: string }>;
  }> => {
    // 1. Fetch order details
    const order: Doc<"orders"> | null = await ctx.runQuery(
      internal.orders.getOrderByIdInternal,
      { orderId: args.orderId }
    );

    if (!order) {
      console.warn(`[Telegram Alert] Order not found for ID: ${args.orderId}`);
      return { success: false, sentCount: 0, skippedCount: 0, results: [] };
    }

    // 2. Fetch active Telegram recipients from database
    const dbRecipients: Doc<"telegram_recipients">[] = await ctx.runQuery(
      internal.telegram.getActiveRecipientsInternal,
      {}
    );

    // List of targets: chat ID and specific token
    const targets: Array<{ chatId: string; botToken: string; name: string }> = [];

    const defaultBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const defaultChatId = process.env.TELEGRAM_CHAT_ID;

    // Collect targets from database
    for (const r of dbRecipients) {
      const token = r.botToken || defaultBotToken;
      if (token && r.chatId) {
        targets.push({ chatId: r.chatId, botToken: token, name: r.name });
      }
    }

    // If no targets in DB, fallback to default env vars
    if (targets.length === 0 && defaultBotToken && defaultChatId) {
      targets.push({
        chatId: defaultChatId,
        botToken: defaultBotToken,
        name: "Store Owner (Env)",
      });
    }

    if (targets.length === 0) {
      console.log(
        "[Telegram Alert] No active Telegram bot token or chat ID configured."
      );
      return { success: true, sentCount: 0, skippedCount: 0, results: [] };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qatify.qa";
    const message = formatOrderTelegramMessage(order, siteUrl);

    let sentCount = 0;
    let skippedCount = 0;
    const results: Array<{ chatId: string; status: string; error?: string }> = [];

    // 3. Dispatch Telegram message to each target
    for (const target of targets) {
      try {
        const url = `https://api.telegram.org/bot${target.botToken}/sendMessage`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: target.chatId,
            text: message,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
        });

        const resData = await res.json();

        if (res.ok && resData.ok) {
          console.log(
            `[Telegram Alert] Successfully sent alert to ${target.name} (${target.chatId}) for Order #${order.orderNumber}`
          );
          sentCount++;
          results.push({ chatId: target.chatId, status: "sent" });
        } else {
          console.error(
            `[Telegram Alert] API error for ${target.name} (${target.chatId}):`,
            resData
          );
          results.push({
            chatId: target.chatId,
            status: "api_error",
            error: resData.description || JSON.stringify(resData),
          });
        }
      } catch (err) {
        console.error(
          `[Telegram Alert] Network error sending to ${target.name} (${target.chatId}):`,
          err
        );
        results.push({
          chatId: target.chatId,
          status: "network_error",
          error: String(err),
        });
      }
    }

    return {
      success: true,
      sentCount,
      skippedCount,
      results,
    };
  },
});

/**
 * Public Action: Send a test Telegram message to verify bot connection
 */
export const testSendTelegram = action({
  args: {
    chatId: v.optional(v.string()),
    botToken: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ success: boolean; message: string; response?: unknown }> => {
    const token = args.botToken?.trim() || process.env.TELEGRAM_BOT_TOKEN;
    const chat = args.chatId?.trim() || process.env.TELEGRAM_CHAT_ID;

    if (!token) {
      return {
        success: false,
        message:
          "Telegram Bot Token is missing. Please provide botToken or set TELEGRAM_BOT_TOKEN in .env.local",
      };
    }

    if (!chat) {
      return {
        success: false,
        message:
          "Telegram Chat ID is missing. Please provide chatId or set TELEGRAM_CHAT_ID in .env.local",
      };
    }

    const testMessage = [
      `🔔 <b>[QATIFY - TELEGRAM ALERT TEST]</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `✅ <b>Connection Status:</b> Successfully Connected!`,
      `🕒 <b>Timestamp:</b> ${new Date().toLocaleString()}`,
      `📦 Your Qatify store is now ready to receive real-time order alerts here.`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
    ].join("\n");

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat,
          text: testMessage,
          parse_mode: "HTML",
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        return {
          success: true,
          message: `Test message sent successfully to Chat ID: ${chat}!`,
          response: data,
        };
      } else {
        return {
          success: false,
          message: `Telegram API error: ${data.description || "Failed to send"}`,
          response: data,
        };
      }
    } catch (err) {
      return {
        success: false,
        message: `Network failure connecting to Telegram: ${String(err)}`,
      };
    }
  },
});

/**
 * 4. Internal Action: Send Telegram alert when an order's shipment milestone updates
 */
export const sendShipmentStatusTelegram = internalAction({
  args: {
    orderId: v.id("orders"),
    stage: v.string(),
    checkpointDesc: v.string(),
    checkpointLocation: v.string(),
  },
  handler: async (ctx, args) => {
    const order: Doc<"orders"> | null = await ctx.runQuery(
      internal.orders.getOrderByIdInternal,
      { orderId: args.orderId }
    );
    if (!order) return { success: false };

    const dbRecipients: Doc<"telegram_recipients">[] = await ctx.runQuery(
      internal.telegram.getActiveRecipientsInternal,
      {}
    );

    const defaultBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const defaultChatId = process.env.TELEGRAM_CHAT_ID;

    const targets: Array<{ chatId: string; botToken: string; name: string }> = [];
    for (const r of dbRecipients) {
      const token = r.botToken || defaultBotToken;
      if (token && r.chatId) targets.push({ chatId: r.chatId, botToken: token, name: r.name });
    }
    if (targets.length === 0 && defaultBotToken && defaultChatId) {
      targets.push({ chatId: defaultChatId, botToken: defaultBotToken, name: "Store Owner" });
    }
    if (targets.length === 0) return { success: true };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qatify.qa";
    const text = [
      `✈️ <b>[SHIPMENT MILESTONE UPDATE - QATIFY]</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `📦 <b>Order Ref:</b> #${order.orderNumber}`,
      `🏷️ <b>New Status:</b> <b>${args.stage}</b>`,
      `📍 <b>Location:</b> ${args.checkpointLocation}`,
      `📝 <b>Event:</b> ${args.checkpointDesc}`,
      `👤 <b>Customer:</b> ${order.address.fullName} (${order.address.municipality})`,
      `🚚 <b>Air Tracking:</b> <code>${order.trackingNumber}</code>`,
      order.aliexpressTrackingNumber ? `🌐 <b>AliExpress Code:</b> <code>${order.aliexpressTrackingNumber}</code>` : "",
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🔗 <a href="${siteUrl}/track-order?code=${encodeURIComponent(order.orderNumber)}">View Customer Tracking Page</a>`,
    ].filter(Boolean).join("\n");

    for (const target of targets) {
      try {
        await fetch(`https://api.telegram.org/bot${target.botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: target.chatId,
            text,
            parse_mode: "HTML",
          }),
        });
      } catch (err) {
        console.error(`[Telegram Alert] Failed to send update to ${target.chatId}:`, err);
      }
    }
    return { success: true };
  },
});


