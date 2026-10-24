# Convex Authentication & Security for Qatify

> **Official Reference**: [Convex Authentication](https://docs.convex.dev/auth) & [Convex Security](https://docs.convex.dev/database/security)

---

## 1. Authentication Strategy for E-Commerce Dropshipping

In an e-commerce platform like Qatify, checkout friction directly kills conversion rates. Therefore, our security and authentication strategy implements a **Hybrid Flow**:

1. **Guest Checkout (Default)**: Customers can place orders without signing up. Orders are identified by `orderNumber` + `customerEmail` + `customerPhone`.
2. **Authenticated Customers (Optional)**: Customers can sign in (via Clerk or NextAuth) to access `/dashboard` for saved addresses, wishlist persistence, and multi-order tracking.
3. **Admin Functions**: Order fulfillment, tracking updates, and product catalog management are protected via internal mutations or admin role verification.

---

## 2. Preventing Price & Order Tampering (Critical)

> [!CAUTION]
> **Never trust item prices or totals sent from the browser client.**  
> An attacker can modify JavaScript memory or network payloads to send `price: 1 QAR`.

In Convex, recalculate prices and totals strictly on the server:

```typescript
// Example: Safe Server-Side Price Verification in convex/orders.ts
export const createOrder = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
      })
    ),
    customerEmail: v.string(),
    customerPhone: v.string(),
    shippingAddress: v.any(),
  },
  handler: async (ctx, args) => {
    let subtotalQar = 0;
    const validatedItems = [];

    // Fetch verified prices directly from the Convex database
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product || !product.isActive) {
        throw new Error(`Product ${item.productId} is invalid or out of stock`);
      }

      subtotalQar += product.priceQar * item.quantity;
      validatedItems.push({
        productId: product._id,
        title: product.title,
        slug: product.slug,
        priceQar: product.priceQar, // Verified server-side price!
        quantity: item.quantity,
        image: product.images[0],
      });
    }

    // Server-enforced shipping policy: Free over 150 QAR, otherwise 20 QAR
    const shippingFeeQar = subtotalQar >= 150 ? 0 : 20;
    const totalQar = subtotalQar + shippingFeeQar;

    // Insert order with verified financial totals
    const orderId = await ctx.db.insert("orders", {
      orderNumber: `QA-${Math.floor(100000 + Math.random() * 900000)}`,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      shippingAddress: args.shippingAddress,
      items: validatedItems,
      subtotalQar,
      shippingFeeQar,
      discountQar: 0,
      totalQar,
      status: "pending_payment",
      paymentStatus: "pending",
      trackingCode: `QAT-AIR-${Date.now().toString().slice(-6)}`,
      estimatedDeliveryDateStart: new Date(Date.now() + 6 * 86400000).toISOString(),
      estimatedDeliveryDateEnd: new Date(Date.now() + 10 * 86400000).toISOString(),
    });

    return { orderId, totalQar };
  },
});
```

---

## 3. Protecting Internal Functions

Functions that mark payments as completed or modify logistics events are declared as `internalMutation` in Convex. 

- `mutation`: Publicly exposed to client browsers via `useMutation(api.orders.createOrder)`.
- `internalMutation`: **Inaccessible to client browsers**. Only callable by server-side actions, HTTP webhooks, or scheduled jobs:
  ```typescript
  import { internal } from "./_generated/api";
  
  // Safe: only runnable from convex/http.ts or actions
  await ctx.runMutation(internal.orders.markOrderAsPaid, { ... });
  ```

