# Convex Schema & Data Modeling for Qatify

> **Official Reference**: [Convex Schemas & Types](https://docs.convex.dev/database/schemas)  
> **Target File**: `convex/schema.ts`

---

## 1. Schema System Overview

Convex schemas define the structure of your database tables, the validation rules for each column/field, and the indexes used for fast lookups.

- Schemas are defined in `convex/schema.ts` using `defineSchema` and `defineTable`.
- Validation is performed using the `v` validator object.
- Convex validates all writes at runtime. If a mutation attempts to insert an object missing required fields or having invalid data types, the mutation fails with a clear validation error.
- Tables automatically receive a system `_id` field (typed as `Id<"tableName">`) and a `_creationTime` field (numeric unix timestamp in milliseconds).

### Supported `v` Validators

| Validator | TypeScript Type | Description |
| :--- | :--- | :--- |
| `v.string()` | `string` | Text string |
| `v.number()` | `number` | Floating point or integer numbers |
| `v.boolean()` | `boolean` | `true` or `false` |
| `v.id("tableName")` | `Id<"tableName">` | Foreign key referencing another table's `_id` |
| `v.array(v.type)` | `Array<type>` | Ordered list of typed elements |
| `v.object({...})` | `Record<string, any>` | Nested object structure |
| `v.optional(v.type)` | `type \| undefined` | Field may be undefined or omitted |
| `v.union(v1, v2)` | `v1 \| v2` | Union of multiple types |
| `v.literal(val)` | `"val"` | Strict literal value |
| `v.null()` | `null` | Null value |
| `v.any()` | `any` | Any JSON-serializable value |

---

## 2. Complete Qatify Schema (`convex/schema.ts`)

Here is the complete, production-ready schema for Qatify:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Product Catalog
  products: defineTable({
    title: v.string(),
    slug: v.string(),
    brand: v.string(),
    priceQar: v.number(),
    compareAtPriceQar: v.optional(v.number()),
    discountPercent: v.optional(v.number()),
    description: v.string(),
    shortDescription: v.optional(v.string()),
    category: v.string(),
    categorySlug: v.string(),
    images: v.array(v.string()),
    stock: v.number(),
    rating: v.number(),
    reviewsCount: v.number(),
    isFlashDeal: v.boolean(),
    badge: v.optional(v.string()), // e.g. "HOT DEAL", "-35% OFF", "TOP PICK"
    tags: v.array(v.string()),
    deliveryDaysMin: v.number(), // default 6 for Qatar dropshipping
    deliveryDaysMax: v.number(), // default 10 for Qatar dropshipping
    specs: v.array(
      v.object({
        key: v.string(),
        value: v.string(),
      })
    ),
    // Polar integration link
    polarProductId: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["categorySlug"])
    .index("by_flash_deal", ["isFlashDeal"])
    .index("by_brand", ["brand"]),

  // 2. Categories
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    icon: v.string(),
    description: v.optional(v.string()),
    featured: v.boolean(),
    displayOrder: v.number(),
  }).index("by_slug", ["slug"]),

  // 3. Orders & Polar Payments
  orders: defineTable({
    orderNumber: v.string(), // e.g., "QA-89421"
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(), // Qatar +974 format
    shippingAddress: v.object({
      zone: v.string(),
      street: v.string(),
      building: v.string(),
      unit: v.optional(v.string()),
      city: v.string(), // "Doha", "Lusail", "Al Rayyan", etc.
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
    subtotalQar: v.number(),
    shippingFeeQar: v.number(), // 0 if subtotal >= 150 QAR, otherwise 20 QAR
    discountQar: v.number(),
    totalQar: v.number(),
    
    // Status tracking
    status: v.union(
      v.literal("pending_payment"),
      v.literal("processing"),
      v.literal("air_express_transit"),
      v.literal("customs_cleared_doha"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("refunded")
    ),

    // Polar Payment identifiers
    polarCheckoutId: v.optional(v.string()),
    polarOrderId: v.optional(v.string()),
    polarCustomerId: v.optional(v.string()),

    // Tracking
    trackingCode: v.string(), // e.g., "QAT-AIR-2026-90412"
    estimatedDeliveryDateStart: v.string(), // ISO date
    estimatedDeliveryDateEnd: v.string(),   // ISO date
  })
    .index("by_order_number", ["orderNumber"])
    .index("by_customer_email", ["customerEmail"])
    .index("by_polar_checkout_id", ["polarCheckoutId"])
    .index("by_status", ["status"]),

  // 4. Shipment Tracking Timeline Events
  shipment_events: defineTable({
    orderId: v.id("orders"),
    orderNumber: v.string(),
    step: v.number(), // 1 to 5
    title: v.string(),
    description: v.string(),
    location: v.string(),
    timestamp: v.string(),
    isCompleted: v.boolean(),
  }).index("by_order_id", ["orderId"]),

  // 5. Customer Reviews
  reviews: defineTable({
    productId: v.id("products"),
    customerName: v.string(),
    rating: v.number(), // 1 to 5
    comment: v.string(),
    verifiedBuyer: v.boolean(),
    date: v.string(),
  }).index("by_product_id", ["productId"]),
});
```

---

## 3. Defining Indexes & Best Practices

1. **Always index lookup fields**: Fields used inside `.filter()` or `.withIndex()` must be defined with `.index("index_name", ["field1", "field2"])`.
2. **Deterministic Sort**: Indexes automatically sort by indexed keys. For example, `.index("by_category", ["categorySlug"])` will allow fast queries matching category slug.
3. **Foreign Keys**: Always type relation IDs using `v.id("targetTableName")` rather than raw `v.string()`. This guarantees referential type checking across your backend.

