import { v } from "convex/values";
import { query, mutation, internalMutation, internalQuery, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { assertAdminAccess } from "./adminAuth";

// Helper: Deduct stock percentage and increment sold count for purchased items
async function deductStockForItems(
  ctx: MutationCtx,
  items: Array<{ productId: string; quantity: number }>
) {
  for (const item of items) {
    let product = await ctx.db
      .query("products")
      .withIndex("by_productId", (q) => q.eq("productId", item.productId))
      .first();

    if (!product) {
      product = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", item.productId))
        .first();
    }

    if (product) {
      const newSoldCount = (product.soldCount ?? 0) + item.quantity;
      const currentStockPercent = product.stockPercent ?? 100;
      // Deduct stock percent (approx 2% per unit, minimum 0%)
      const newStockPercent = Math.max(0, currentStockPercent - item.quantity * 2);
      const inStock = newStockPercent > 0;

      await ctx.db.patch(product._id, {
        soldCount: newSoldCount,
        stockPercent: newStockPercent,
        inStock,
      });

      console.log(
        `[Inventory] Deducted stock for ${product.productId}: soldCount=${newSoldCount}, stockPercent=${newStockPercent}%, inStock=${inStock}`
      );
    }
  }
}

// 1. Customer places an order (with server-side price validation & stock checks)
export const createOrder = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.string(),
        title: v.string(),
        slug: v.string(),
        priceQAR: v.number(),
        quantity: v.number(),
        image: v.string(),
        selectedColor: v.optional(v.string()),
        selectedOption: v.optional(v.string()),
      })
    ),
    address: v.object({
      fullName: v.string(),
      phone: v.string(),
      email: v.optional(v.string()),
      municipality: v.string(),
      zoneNumber: v.string(),
      streetNumber: v.string(),
      buildingNumber: v.string(),
      unitNumber: v.optional(v.string()),
      landmark: v.optional(v.string()),
    }),
    shippingMethod: v.object({
      id: v.string(),
      name: v.string(),
      badge: v.string(),
      duration: v.string(),
      priceQAR: v.number(),
      description: v.string(),
    }),
    paymentMethod: v.union(
      v.literal("credit_card"),
      v.literal("apple_pay"),
      v.literal("cash_on_delivery"),
      v.literal("polar")
    ),
    couponCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Server-side Price Validation & Stock Availability Check
    const verifiedItems: Array<{
      productId: string;
      title: string;
      slug: string;
      priceQAR: number;
      quantity: number;
      image: string;
      selectedColor?: string;
      selectedOption?: string;
    }> = [];

    let calculatedSubtotal = 0;

    for (const item of args.items) {
      if (item.quantity <= 0) {
        throw new Error("Item quantity must be at least 1");
      }

      // Look up authoritative product from database
      let product = await ctx.db
        .query("products")
        .withIndex("by_productId", (q) => q.eq("productId", item.productId))
        .first();

      if (!product) {
        product = await ctx.db
          .query("products")
          .withIndex("by_slug", (q) => q.eq("slug", item.slug || item.productId))
          .first();
      }

      if (!product) {
        throw new Error(`Product not found: ${item.title || item.productId}`);
      }

      if (!product.inStock) {
        throw new Error(`Product "${product.title}" is currently out of stock`);
      }

      // 1. Authoritative base unit price directly from database
      let verifiedUnitPrice = product.priceQAR;

      // 2. Volume discount verification from database
      if (product.volumeDiscounts && product.volumeDiscounts.length > 0) {
        const sortedTiers = [...product.volumeDiscounts].sort(
          (a, b) => b.quantity - a.quantity
        );
        const matchedTier = sortedTiers.find((tier) => item.quantity >= tier.quantity);
        if (matchedTier) {
          verifiedUnitPrice = matchedTier.pricePerUnitQAR;
        }
      }

      // 3. Option pricing addon if applicable (e.g. "(+QAR 25)")
      if (item.selectedOption) {
        const match = item.selectedOption.match(/\(\+QAR\s*(\d+)\)/i);
        if (match) {
          verifiedUnitPrice += parseInt(match[1], 10);
        }
      }

      calculatedSubtotal += verifiedUnitPrice * item.quantity;

      verifiedItems.push({
        productId: product.productId,
        title: product.title,
        slug: product.slug,
        priceQAR: verifiedUnitPrice,
        quantity: item.quantity,
        image: product.images[0] || item.image || "",
        selectedColor: item.selectedColor,
        selectedOption: item.selectedOption,
      });
    }

    // Validate and apply coupon discount if provided
    let discountQAR = 0;
    let appliedCouponCode: string | undefined = undefined;

    if (args.couponCode) {
      const cleanCode = args.couponCode.trim().toUpperCase();
      const coupon = await ctx.db
        .query("coupons")
        .withIndex("by_code", (q) => q.eq("code", cleanCode))
        .first();

      if (coupon && coupon.isActive) {
        const today = new Date().toISOString().slice(0, 10);
        const notExpired = !coupon.expiryDate || today <= coupon.expiryDate;
        const withinUses = !coupon.maxUses || coupon.usedCount < coupon.maxUses;
        const meetsMinSpend = calculatedSubtotal >= coupon.minOrderQAR;

        if (notExpired && withinUses && meetsMinSpend) {
          if (coupon.discountType === "percentage") {
            discountQAR = Math.round((calculatedSubtotal * coupon.discountValue) / 100);
            if (coupon.maxDiscountQAR) {
              discountQAR = Math.min(discountQAR, coupon.maxDiscountQAR);
            }
          } else {
            discountQAR = Math.min(coupon.discountValue, calculatedSubtotal);
          }
          appliedCouponCode = coupon.code;

          // Increment coupon used count
          await ctx.db.patch(coupon._id, {
            usedCount: coupon.usedCount + 1,
          });
        }
      }
    }

    // Free delivery in Qatar if subtotal >= 150 QAR, otherwise shippingMethod price
    const subtotalQAR = calculatedSubtotal;
    const shippingQAR = subtotalQAR >= 150 ? 0 : args.shippingMethod.priceQAR;
    const totalQAR = Math.max(0, subtotalQAR + shippingQAR - discountQAR);

    // Generate unique order number (QA-XXXXXX)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `QA-${randomSuffix}`;
    const trackingNumber = `QAT-AIR-${randomSuffix}`;

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const estStart = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
    const estEnd = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const estWindow = `${estStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${estEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      date: dateStr,
      items: verifiedItems,
      subtotalQAR,
      shippingQAR,
      discountQAR,
      totalQAR,
      couponCode: appliedCouponCode,
      customerEmail: args.address.email?.toLowerCase(),
      customerPhone: args.address.phone,
      address: args.address,
      shippingMethod: args.shippingMethod,
      paymentMethod: args.paymentMethod,
      status: "Order Confirmed",
      paymentStatus: args.paymentMethod === "cash_on_delivery" ? "pending" : "pending",
      trackingNumber,
      estimatedDeliveryWindow: estWindow,
      timeline: [
        {
          stage: "Order Confirmed",
          title: "Order Placed & Payment Pending",
          description: "Order received in Qatify system. Awaiting payment authorization.",
          location: "Qatify Cloud Center",
          date: dateStr,
          completed: true,
          current: true,
        },
        {
          stage: "Air Hub Transit",
          title: "Direct Global Air Express Dispatch",
          description: "Package packed, quality-inspected, and boarded for direct flight to Qatar.",
          location: "Global Logistics Hub",
          date: "Pending dispatch",
          completed: false,
        },
        {
          stage: "Qatar Customs (DOH)",
          title: "Customs Clearance & Inspection",
          description: "Flight arrived at Hamad International Airport (DOH) for express customs clearance.",
          location: "Hamad Int’l Airport (DOH)",
          date: "Estimated Day 5–7",
          completed: false,
        },
        {
          stage: "Out for Delivery",
          title: "Dispatched with Local Courier",
          description: `Handed over to local courier for doorstep delivery in ${args.address.municipality}.`,
          location: `${args.address.municipality}, Qatar`,
          date: "Estimated Day 7–9",
          completed: false,
        },
        {
          stage: "Delivered",
          title: "Delivered to Customer Doorstep",
          description: `Successfully delivered to Building ${args.address.buildingNumber}, Street ${args.address.streetNumber}, ${args.address.zoneNumber}.`,
          location: `${args.address.municipality}, Qatar`,
          date: estWindow,
          completed: false,
        },
      ],
    });

    // For Cash on Delivery, deduct stock and schedule email immediately upon placement
    if (args.paymentMethod === "cash_on_delivery") {
      await deductStockForItems(ctx, verifiedItems);
      await ctx.scheduler.runAfter(0, internal.emails.sendOrderConfirmationEmail, {
        orderId,
      });
    }

    // Schedule instant Telegram alert to store owners / admins
    await ctx.scheduler.runAfter(0, internal.telegram.sendOrderNotificationTelegram, {
      orderId,
    });

    return { orderId, orderNumber, trackingNumber, totalQAR };
  },
});

// 2. Fetch order by orderNumber (public query for Tracking & Confirmation pages)
export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
  },
});

// 3. Internal Query: Get order by ID
export const getOrderByIdInternal = internalQuery({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

// 4. Internal Mutation: Set Polar Checkout ID
export const setPolarCheckoutId = internalMutation({
  args: {
    orderId: v.id("orders"),
    polarCheckoutId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      polarCheckoutId: args.polarCheckoutId,
    });
  },
});

// 5. Internal Mutation: Mark Order as Paid (invoked by Polar Webhook)
export const markOrderAsPaid = internalMutation({
  args: {
    polarCheckoutId: v.string(),
    polarOrderId: v.string(),
    orderNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let order = null;

    if (args.polarCheckoutId) {
      order = await ctx.db
        .query("orders")
        .withIndex("by_polarCheckoutId", (q) =>
          q.eq("polarCheckoutId", args.polarCheckoutId)
        )
        .first();
    }

    if (!order && args.orderNumber) {
      order = await ctx.db
        .query("orders")
        .withIndex("by_orderNumber", (q) =>
          q.eq("orderNumber", args.orderNumber!)
        )
        .first();
    }

    if (!order) {
      console.warn(
        `Order not found for polarCheckoutId: ${args.polarCheckoutId}, orderNumber: ${args.orderNumber}`
      );
      return null;
    }

    // Deduct inventory stock if not already deducted
    if (order.paymentStatus !== "paid") {
      await deductStockForItems(ctx, order.items);
    }

    const updatedTimeline = order.timeline.map((step) => {
      if (step.stage === "Order Confirmed") {
        return {
          ...step,
          title: "Order Confirmed & Paid",
          description: "Payment confirmed via Polar. Order approved for Air Express shipping.",
          completed: true,
          current: false,
        };
      }
      if (step.stage === "Air Hub Transit") {
        return {
          ...step,
          current: true,
        };
      }
      return step;
    });

    await ctx.db.patch(order._id, {
      paymentStatus: "paid",
      status: "Air Hub Transit",
      polarOrderId: args.polarOrderId || order.polarOrderId,
      timeline: updatedTimeline,
    });

    // Schedule order confirmation email
    await ctx.scheduler.runAfter(0, internal.emails.sendOrderConfirmationEmail, {
      orderId: order._id,
    });

    return order._id;
  },
});

// 6. Mutation: Confirm simulated payment (strictly for non-production development testing)
export const confirmSimulatedPayment = mutation({
  args: {
    orderNumber: v.string(),
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Strictly prevent simulated payment exploit in live production
    if (process.env.POLAR_ENVIRONMENT === "production") {
      throw new Error(
        "Simulated payments are strictly disabled in production mode. Orders must be paid via Polar Gateway."
      );
    }

    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);

    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();

    if (!order) return null;

    if (order.paymentStatus !== "paid") {
      // Deduct inventory stock for simulated payment
      await deductStockForItems(ctx, order.items);

      const updatedTimeline = order.timeline.map((step) => {
        if (step.stage === "Order Confirmed") {
          return {
            ...step,
            title: "Order Confirmed & Payment Verified",
            description: "Authorized with Polar Secure Gateway. Dispatched to international air export hub.",
            completed: true,
            current: false,
          };
        }
        if (step.stage === "Air Hub Transit") {
          return {
            ...step,
            current: true,
          };
        }
        return step;
      });

      await ctx.db.patch(order._id, {
        paymentStatus: "paid",
        status: "Air Hub Transit",
        timeline: updatedTimeline,
      });
    }

    return order._id;
  },
});

// 7. Protected Query: List recent orders (Admin only)
export const listRecentOrders = query({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);
    const takeCount = args.limit ?? 50;
    return await ctx.db.query("orders").order("desc").take(takeCount);
  },
});

// 8. Public Query: Track order by orderNumber or trackingNumber
export const trackOrder = query({
  args: { search: v.string() },
  handler: async (ctx, args) => {
    const cleanSearch = args.search.trim().toUpperCase();
    if (!cleanSearch) return null;

    const byOrder = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", cleanSearch))
      .first();
    if (byOrder) return byOrder;

    const byTracking = await ctx.db
      .query("orders")
      .withIndex("by_trackingNumber", (q) => q.eq("trackingNumber", cleanSearch))
      .first();
    return byTracking;
  },
});

// 9. Admin Mutation: Update order status & advance 5-stage shipment timeline
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("Order Confirmed"),
      v.literal("Air Hub Transit"),
      v.literal("Qatar Customs (DOH)"),
      v.literal("Out for Delivery"),
      v.literal("Delivered"),
      v.literal("Cancelled")
    ),
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const stageOrder = [
      "Order Confirmed",
      "Air Hub Transit",
      "Qatar Customs (DOH)",
      "Out for Delivery",
      "Delivered",
    ];

    const targetIndex = stageOrder.indexOf(args.status);

    const updatedTimeline = order.timeline.map((step) => {
      const stepIndex = stageOrder.indexOf(step.stage);
      if (targetIndex === -1) {
        return step;
      }
      if (stepIndex < targetIndex) {
        return { ...step, completed: true, current: false };
      } else if (stepIndex === targetIndex) {
        return { ...step, completed: true, current: true };
      } else {
        return { ...step, completed: false, current: false };
      }
    });

    await ctx.db.patch(args.orderId, {
      status: args.status,
      timeline: updatedTimeline,
    });

    return { success: true };
  },
});

// 10. Privacy-Scoped Customer Query: Get orders by customer email or phone
export const getOrdersByCustomer = query({
  args: {
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const takeCount = args.limit ?? 20;

    if (args.email) {
      const cleanEmail = args.email.trim().toLowerCase();
      return await ctx.db
        .query("orders")
        .withIndex("by_customerEmail", (q) => q.eq("customerEmail", cleanEmail))
        .order("desc")
        .take(takeCount);
    }

    if (args.phone) {
      const cleanPhone = args.phone.trim();
      return await ctx.db
        .query("orders")
        .withIndex("by_customerPhone", (q) => q.eq("customerPhone", cleanPhone))
        .order("desc")
        .take(takeCount);
    }

    return [];
  },
});



