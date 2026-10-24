"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const createCheckoutSession = action({
  args: {
    orderId: v.id("orders"),
  },
  returns: v.object({
    checkoutId: v.string(),
    checkoutUrl: v.string(),
  }),
  handler: async (ctx, args): Promise<{ checkoutId: string; checkoutUrl: string }> => {
    // 1. Fetch order details from database
    const order: Doc<"orders"> | null = await ctx.runQuery(
      internal.orders.getOrderByIdInternal,
      { orderId: args.orderId }
    );

    if (!order) {
      throw new Error("Order not found");
    }

    const polarToken = process.env.POLAR_ACCESS_TOKEN;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const isSandbox = process.env.POLAR_ENVIRONMENT !== "production";

    if (!polarToken) {
      // In dev mode when POLAR_ACCESS_TOKEN is not yet configured, provide a simulated checkout URL
      console.warn("POLAR_ACCESS_TOKEN is not configured. Simulating checkout URL for development.");
      const simulatedCheckoutId = `sim_chk_${Date.now()}`;
      await ctx.runMutation(internal.orders.setPolarCheckoutId, {
        orderId: order._id,
        polarCheckoutId: simulatedCheckoutId,
      });

      return {
        checkoutId: simulatedCheckoutId,
        checkoutUrl: `${siteUrl}/checkout/success?orderNumber=${order.orderNumber}&simulated=true`,
      };
    }

    // 2. Call Polar 2026-10 API
    const polarApiUrl = isSandbox
      ? "https://sandbox-api.polar.sh/v1/checkouts"
      : "https://api.polar.sh/v1/checkouts";

    // 1 QAR = 100 minor units
    const amountInSubunits = Math.round(order.totalQAR * 100);
    const productId = process.env.POLAR_PRODUCT_ID || "7ecd47e9-9fca-4bdb-99d7-fb7dadd4f0af";

    const payload: Record<string, unknown> = {
      products: [productId],
      amount: amountInSubunits,
      currency: "qar",
      allow_discount_codes: true,
      require_billing_address: false,
      customer_name: order.address.fullName,
      success_url: `${siteUrl}/checkout/success?orderNumber=${order.orderNumber}&session_id={CHECKOUT_ID}`,
      cancel_url: `${siteUrl}/cart`,
      metadata: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        phone: order.address.phone,
        municipality: order.address.municipality,
        zoneNumber: order.address.zoneNumber,
      },
    };

    const response = await fetch(polarApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${polarToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Polar Checkout API error (${response.status}): ${errorText}`);
    }

    const checkoutData = await response.json();

    // 3. Link polarCheckoutId to order
    await ctx.runMutation(internal.orders.setPolarCheckoutId, {
      orderId: order._id,
      polarCheckoutId: checkoutData.id,
    });

    return {
      checkoutId: checkoutData.id,
      checkoutUrl: checkoutData.url,
    };
  },
});

