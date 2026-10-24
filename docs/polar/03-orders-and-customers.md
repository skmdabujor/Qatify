# Polar Orders & Customers Management

> **Official Reference**: [Polar Orders API](https://polar.sh/docs/api-reference/2026-10/orders) & [Polar Customers API](https://polar.sh/docs/api-reference/2026-10/customers)

---

## 1. Orders API

An **Order** is generated in Polar as soon as a Checkout Session is successfully completed and paid by the customer.

### Key Order Properties

```typescript
interface PolarOrder {
  id: string;                    // UUID of the order in Polar
  created_at: string;            // ISO 8601 creation timestamp
  status: "paid" | "refunded";   // Payment status
  amount: number;                // Paid amount in minor currency units (e.g., 28900 for 289.00 QAR)
  currency: string;              // "qar", "usd", etc.
  checkout_id?: string;          // Originating checkout session ID
  customer_id: string;           // Associated Polar customer UUID
  customer: {
    id: string;
    email: string;
    name?: string;
  };
  product_id?: string;
  metadata: Record<string, any>; // Custom metadata passed during checkout
}
```

---

## 2. Querying Orders via SDK

### Fetch a Specific Order by ID

```typescript
import { createPolar } from "@polar-sh/sdk/2026-10";

const polar = createPolar({ accessToken: process.env.POLAR_ACCESS_TOKEN! });

export async function getOrderDetails(orderId: string) {
  const order = await polar.orders.get({ id: orderId });
  return order;
}
```

### Listing Recent Orders

```typescript
export async function listRecentOrders(limit: number = 20) {
  const response = await polar.orders.list({
    limit,
    sorting: ["-created_at"], // Most recent first
  });

  return response.result.items;
}
```

---

## 3. Customers API

Polar automatically registers customer profiles when a buyer enters their email address and name during checkout.

### Fetching Customer Information

```typescript
export async function getCustomer(customerId: string) {
  const customer = await polar.customers.get({ id: customerId });
  return customer;
}
```

---

## 4. Integration with Qatify Backend

In Qatify, when an order is paid via Polar:
1. The Polar `checkout_id` matches the `orders.polarCheckoutId` stored in Convex.
2. The Convex order record is patched with:
   - `paymentStatus: "paid"`
   - `polarOrderId: order.id`
   - `polarCustomerId: order.customer_id`
   - `status: "processing"`
3. The shipment tracking engine initializes the 6–10 day countdown for the customer.

