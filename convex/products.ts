import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// 1. Fetch products (bounded collection)
export const list = query({
  args: {
    categorySlug: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const takeCount = args.limit ?? 50;

    if (args.categorySlug) {
      return await ctx.db
        .query("products")
        .withIndex("by_categorySlug", (q) => q.eq("categorySlug", args.categorySlug!))
        .take(takeCount);
    }

    return await ctx.db.query("products").take(takeCount);
  },
});

// 2. Fetch single product by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// 3. Fetch Flash Deals for countdown shelf
export const getFlashDeals = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const takeCount = args.limit ?? 8;
    return await ctx.db
      .query("products")
      .withIndex("by_isFlashDeal", (q) => q.eq("isFlashDeal", true))
      .take(takeCount);
  },
});

// 4. Fetch Trending products
export const getTrending = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const takeCount = args.limit ?? 10;
    return await ctx.db
      .query("products")
      .withIndex("by_isTrending", (q) => q.eq("isTrending", true))
      .take(takeCount);
  },
});

// 5. Fetch Best Sellers
export const getBestSellers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const takeCount = args.limit ?? 10;
    return await ctx.db
      .query("products")
      .withIndex("by_isBestSeller", (q) => q.eq("isBestSeller", true))
      .take(takeCount);
  },
});

// 6. Fetch Under 99 QAR products
export const getUnder99 = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const takeCount = args.limit ?? 10;
    return await ctx.db
      .query("products")
      .withIndex("by_isUnder99", (q) => q.eq("isUnder99", true))
      .take(takeCount);
  },
});

// 7. Seed / Import mock products into Convex database
export const seedProducts = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.string(),
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
      })
    ),
  },
  handler: async (ctx, args) => {
    let inserted = 0;
    for (const item of args.items) {
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", item.slug))
        .first();

      if (!existing) {
        await ctx.db.insert("products", item);
        inserted++;
      }
    }
    return { success: true, count: inserted };
  },
});

