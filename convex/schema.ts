import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Product Catalog Table
  products: defineTable({
    productId: v.string(), // custom id like 'qat-001'
    slug: v.string(),
    title: v.string(),
    shortDescription: v.string(),
    fullDescription: v.string(),
    category: v.string(),
    categorySlug: v.string(),
    subcategory: v.string(),
    brand: v.string(),
    priceQAR: v.number(),
    originalPriceQAR: v.number(),
    discountPercent: v.number(),
    rating: v.number(),
    reviewCount: v.number(),
    soldCount: v.number(),
    stockPercent: v.number(),
    inStock: v.boolean(),
    isFlashDeal: v.boolean(),
    isTrending: v.boolean(),
    isBestSeller: v.boolean(),
    isUnder99: v.boolean(),
    isNewArrival: v.boolean(),
    badge: v.optional(v.string()),
    images: v.array(v.string()),
    tags: v.array(v.string()),
    variants: v.optional(
      v.object({
        colors: v.optional(
          v.array(
            v.object({
              name: v.string(),
              hex: v.string(),
              image: v.optional(v.string()),
            })
          )
        ),
        options: v.optional(
          v.array(
            v.object({
              name: v.string(),
              values: v.array(v.string()),
            })
          )
        ),
      })
    ),
    volumeDiscounts: v.optional(
      v.array(
        v.object({
          quantity: v.number(),
          pricePerUnitQAR: v.number(),
          savingsText: v.string(),
        })
      )
    ),
    specifications: v.record(v.string(), v.string()),
    packageContents: v.array(v.string()),
    dropshipInfo: v.object({
      dispatchHours: v.number(),
      shippingDaysMin: v.number(),
      shippingDaysMax: v.number(),
      freeShippingThresholdQAR: v.number(),
      shippingCostQAR: v.number(),
      airCarrier: v.string(),
      qualityInspected: v.boolean(),
      hubOrigin: v.string(),
    }),
    polarProductId: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_categorySlug", ["categorySlug"])
    .index("by_isFlashDeal", ["isFlashDeal"])
    .index("by_isTrending", ["isTrending"])
    .index("by_isBestSeller", ["isBestSeller"])
    .index("by_isUnder99", ["isUnder99"])
    .index("by_brand", ["brand"]),

  // 2. Categories Table
  categories: defineTable({
    categoryId: v.string(), // e.g. 'mobile-acc'
    name: v.string(),
    slug: v.string(),
    icon: v.string(),
    count: v.number(),
  }).index("by_slug", ["slug"]),

  // 3. Orders Table
  orders: defineTable({
    orderNumber: v.string(), // e.g. 'QA-89421'
    date: v.string(),
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
    subtotalQAR: v.number(),
    shippingQAR: v.number(),
    discountQAR: v.number(),
    totalQAR: v.number(),
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
    status: v.union(
      v.literal("Order Confirmed"),
      v.literal("Air Hub Transit"),
      v.literal("Qatar Customs (DOH)"),
      v.literal("Out for Delivery"),
      v.literal("Delivered"),
      v.literal("Cancelled")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    polarCheckoutId: v.optional(v.string()),
    polarOrderId: v.optional(v.string()),
    trackingNumber: v.string(),
    estimatedDeliveryWindow: v.string(),
    timeline: v.array(
      v.object({
        stage: v.string(),
        title: v.string(),
        description: v.string(),
        location: v.string(),
        date: v.string(),
        completed: v.boolean(),
        current: v.optional(v.boolean()),
      })
    ),
  })
    .index("by_orderNumber", ["orderNumber"])
    .index("by_trackingNumber", ["trackingNumber"])
    .index("by_polarCheckoutId", ["polarCheckoutId"])
    .index("by_status", ["status"]),
});

