# Convex Queries & Mutations for Qatify

> **Official Reference**: [Convex Queries](https://docs.convex.dev/functions/query-functions) & [Convex Mutations](https://docs.convex.dev/functions/mutation-functions)  
> **Target Files**: `convex/products.ts`, `convex/orders.ts`

---

## 1. Core Principles

- **Queries (`query`)**: Read-only functions. Completely deterministic, cached, and automatically reactive. When data changes in the Convex database, connected clients re-render automatically.
- **Mutations (`mutation`)**: Write operations. Execute inside an ACID transaction. If an error is thrown, the entire operation rolls back automatically.
- **Internal Functions (`internalQuery`, `internalMutation`)**: Private backend functions that cannot be invoked directly from the frontend browser. Only callable by actions (`ctx.runMutation`) or HTTP actions (e.g., from webhook handlers).

---

## 2. Product Catalog (`convex/products.ts`)

```typescript
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// 1. Fetch all active products or filter by category
export const list = query({
  args: {
    categorySlug: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("products").filter((q) => q.eq(q.field("isActive"), true));

    if (args.categorySlug) {
      return await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categorySlug", args.categorySlug!))
        .filter((q) => q.eq(q.field("isActive"), true))
        .take(args.limit ?? 50);
    }

    return await q.take(args.limit ?? 50);
  },
});

// 2. Fetch single product by its URL slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!product || !product.isActive) {
      return null;
    }

    return product;
  },
});

// 3. Fetch Flash Deals for Homepage countdown shelf
export const getFlashDeals = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_flash_deal", (q) => q.eq("isFlashDeal", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(args.limit ?? 8);
  },
});

// 4. Seed initial products from mock data
export const seedProducts = mutation({
  args: {
    items: v.array(
      v.object({
        title: v.string(),
        slug: v.string(),
        brand: v.string(),
        priceQar: v.number(),
        compareAtPriceQar: v.optional(v.number()),
        discountPercent: v.optional(v.number()),
        description: v.string(),
        category: v.string(),
        categorySlug: v.string(),
        images: v.array(v.string()),
        stock: v.number(),
        rating: v.number(),
        reviewsCount: v.number(),
        isFlashDeal: v.boolean(),
        badge: v.optional(v.string()),
        tags: v.array(v.string()),
        deliveryDaysMin: v.number(),
        deliveryDaysMax: v.number(),
        specs: v.array(v.object({ key: v.string(), value: v.string() })),
        isActive: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", item.slug))
        .first();

      if (!existing) {
        await ctx.db.insert("products", item);
      }
    }
    return { success: true, count: args.items.length };
  },
});
```

---

## 3. Order Management (`convex/orders.ts`)

```typescript
import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

// 1. Create a draft order when customer initiates checkout
export const createOrder = mutation({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    shippingAddress: v.object({
      zone: v.string(),
      street: v.string(),
      building: v.string(),
      unit: v.optional(v.string()),
      city: v.string(),
      country: v.literal("Qatar"),
      deliveryNotes: v.optional(v.string()),
    }),
    items: v.array(
      v.object({
        productId: v.id("products"),
        title: v.string(),
        slug: v.string(),
        priceQar: v.number(),
        quantity: v.number(),
        image: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Calculate subtotal
    const subtotalQar = args.items.reduce(
      (sum, item) => sum + item.priceQar * item.quantity,
      0
    );

    // Free delivery in Qatar if order >= 150 QAR, otherwise 20 QAR flat rate
    const shippingFeeQar = subtotalQar >= 150 ? 0 : 20;
    const discountQar = 0;
    const totalQar = subtotalQar + shippingFeeQar - discountQar;

    // Generate unique order number (e.g. QA-783921)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `QA-${randomSuffix}`;

    // Calculate estimated 6-10 business days delivery window
    const now = new Date();
    const estStart = new Date(now.setDate(now.getDate() + 6)).toISOString();
    const estEnd = new Date(now.setDate(now.getDate() + 4)).toISOString(); // 6+4 = 10 days

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      shippingAddress: args.shippingAddress,
      items: args.items,
      subtotalQar,
      shippingFeeQar,
      discountQar,
      totalQar,
      status: "pending_payment",
      paymentStatus: "pending",
      trackingCode: `QAT-AIR-${randomSuffix}`,
      estimatedDeliveryDateStart: estStart,
      estimatedDeliveryDateEnd: estEnd,
    });

    return { orderId, orderNumber, totalQar };
  },
});

// 2. Fetch order by orderNumber for tracking & confirmation
export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
  },
});

// 3. Internal mutation: Link Polar Checkout ID
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

// 4. Internal mutation: Mark order as Paid upon Webhook receipt
export const markOrderAsPaid = internalMutation({
  args: {
    polarCheckoutId: v.string(),
    polarOrderId: v.string(),
    polarCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_polar_checkout_id", (q) =>
        q.eq("polarCheckoutId", args.polarCheckoutId)
      )
      .first();

    if (!order) {
      throw new Error(`Order with polarCheckoutId ${args.polarCheckoutId} not found`);
    }

    await ctx.db.patch(order._id, {
      paymentStatus: "paid",
      status: "processing",
      polarOrderId: args.polarOrderId,
      polarCustomerId: args.polarCustomerId,
    });

    // Create initial tracking step (Air Express Dispatch)
    await ctx.db.insert("shipment_events", {
      orderId: order._id,
      orderNumber: order.orderNumber,
      step: 1,
      title: "Order Confirmed & Preparing for Dispatch",
      description: "Payment verified. Packed and inspected for Direct Global Air Express.",
      location: "Global Logistics Hub",
      timestamp: new Date().toISOString(),
      isCompleted: true,
    });

    return order._id;
  },
});
```

---

## 4. Using Queries and Mutations in React (Next.js)

```tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function FlashDealsSection() {
  const flashDeals = useQuery(api.products.getFlashDeals, { limit: 8 });

  if (flashDeals === undefined) {
    return <div>Loading Flash Deals...</div>;
  }

  return (
    <div className="deals-grid">
      {flashDeals.map((product) => (
        <div key={product._id} className="deal-card">
          <h4>{product.title}</h4>
          <p className="price">QAR {product.priceQar}</p>
        </div>
      ))}
    </div>
  );
}
```

