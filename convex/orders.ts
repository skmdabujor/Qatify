import { v } from "convex/values";
import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// 1. Customer places an order (or initiates checkout)
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
  },
  handler: async (ctx, args) => {
    // Calculate subtotal from items
    const subtotalQAR = args.items.reduce(
      (sum, item) => sum + item.priceQAR * item.quantity,
      0
    );

    // Free delivery in Qatar if subtotal >= 150 QAR, otherwise shippingMethod price
    const shippingQAR = subtotalQAR >= 150 ? 0 : args.shippingMethod.priceQAR;
    const discountQAR = 0;
    const totalQAR = subtotalQAR + shippingQAR - discountQAR;

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
      items: args.items,
      subtotalQAR,
      shippingQAR,
      discountQAR,
      totalQAR,
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
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_polarCheckoutId", (q) =>
        q.eq("polarCheckoutId", args.polarCheckoutId)
      )
      .first();

    if (!order) {
      console.warn(`Order not found for polarCheckoutId: ${args.polarCheckoutId}`);
      return null;
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
      polarOrderId: args.polarOrderId,
      timeline: updatedTimeline,
    });

    return order._id;
  },
});

// 6. Public Mutation: Confirm simulated payment (for dev testing)
export const confirmSimulatedPayment = mutation({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();

    if (!order) return null;

    if (order.paymentStatus !== "paid") {
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

// 7. Public Query: List recent orders (for dashboard and admin preview)
export const listRecentOrders = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
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
  },
  handler: async (ctx, args) => {
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



