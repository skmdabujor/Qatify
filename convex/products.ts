import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { assertAdminAccess } from "./adminAuth";

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

// 7. Seed / Import mock products into Convex database (Protected)
export const seedProducts = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
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
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);
    let inserted = 0;
    for (const item of args.items) {
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", item.slug))
        .first();

      if (!existing) {
        await ctx.db.insert("products", item);
        inserted++;
      } else {
        await ctx.db.patch(existing._id, item);
        inserted++;
      }
    }
    return { success: true, count: inserted };
  },
});

// =============================================================================
// ADMIN OPERATIONS: Product Management & Convex Cloud File Storage
// =============================================================================

// 8. Generate upload URL for uploading product images to Convex Storage
export const generateUploadUrl = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);
    return await ctx.storage.generateUploadUrl();
  },
});

// 9. Resolve a storageId to a live image URL
export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// 10. Admin: Create a new product
export const createProduct = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    productId: v.optional(v.string()),
    title: v.string(),
    slug: v.optional(v.string()),
    shortDescription: v.string(),
    fullDescription: v.string(),
    category: v.string(),
    categorySlug: v.string(),
    subcategory: v.optional(v.string()),
    brand: v.string(),
    priceQAR: v.number(),
    originalPriceQAR: v.optional(v.number()),
    discountPercent: v.optional(v.number()),
    inStock: v.optional(v.boolean()),
    stockPercent: v.optional(v.number()),
    isFlashDeal: v.optional(v.boolean()),
    isTrending: v.optional(v.boolean()),
    isBestSeller: v.optional(v.boolean()),
    isUnder99: v.optional(v.boolean()),
    isNewArrival: v.optional(v.boolean()),
    badge: v.optional(v.string()),
    images: v.array(v.string()),
    tags: v.optional(v.array(v.string())),
    specifications: v.optional(v.record(v.string(), v.string())),
    packageContents: v.optional(v.array(v.string())),
    dropshipInfo: v.optional(
      v.object({
        dispatchHours: v.number(),
        shippingDaysMin: v.number(),
        shippingDaysMax: v.number(),
        freeShippingThresholdQAR: v.number(),
        shippingCostQAR: v.number(),
        airCarrier: v.string(),
        qualityInspected: v.boolean(),
        hubOrigin: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);
    const slug =
      args.slug ||
      args.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const productId = args.productId || `qat-${Date.now().toString().slice(-4)}${randomSuffix}`;

    const originalPrice = args.originalPriceQAR ?? Math.round(args.priceQAR * 1.3);
    const discount =
      args.discountPercent ??
      (originalPrice > args.priceQAR
        ? Math.round(((originalPrice - args.priceQAR) / originalPrice) * 100)
        : 0);

    const defaultDropship = {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 10,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 20,
      airCarrier: "Direct Express Air to Hamad Int’l (DOH)",
      qualityInspected: true,
      hubOrigin: "Global Tech Hub",
    };

    const newId = await ctx.db.insert("products", {
      productId,
      slug,
      title: args.title,
      shortDescription: args.shortDescription,
      fullDescription: args.fullDescription,
      category: args.category,
      categorySlug: args.categorySlug,
      subcategory: args.subcategory ?? args.category,
      brand: args.brand,
      priceQAR: args.priceQAR,
      originalPriceQAR: originalPrice,
      discountPercent: discount,
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0,
      stockPercent: args.stockPercent ?? 100,
      inStock: args.inStock ?? true,
      isFlashDeal: args.isFlashDeal ?? false,
      isTrending: args.isTrending ?? false,
      isBestSeller: args.isBestSeller ?? false,
      isUnder99: args.isUnder99 ?? args.priceQAR < 99,
      isNewArrival: args.isNewArrival ?? true,
      badge: args.badge,
      images: args.images.length > 0 ? args.images : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
      tags: args.tags ?? [args.category, args.brand],
      specifications: args.specifications ?? { Warranty: "1-Year Qatify Guarantee" },
      packageContents: args.packageContents ?? [args.title, "User Manual"],
      dropshipInfo: args.dropshipInfo ?? defaultDropship,
    });

    return { productId, slug, id: newId };
  },
});

// 11. Admin: Update existing product
export const updateProduct = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    id: v.id("products"),
    title: v.optional(v.string()),
    priceQAR: v.optional(v.number()),
    originalPriceQAR: v.optional(v.number()),
    discountPercent: v.optional(v.number()),
    shortDescription: v.optional(v.string()),
    fullDescription: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    stockPercent: v.optional(v.number()),
    badge: v.optional(v.string()),
    isFlashDeal: v.optional(v.boolean()),
    isTrending: v.optional(v.boolean()),
    isBestSeller: v.optional(v.boolean()),
    isUnder99: v.optional(v.boolean()),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);
    const { id, adminKey, adminEmail, ...patchFields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Product not found");

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(patchFields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    if (patchFields.priceQAR !== undefined && patchFields.isUnder99 === undefined) {
      updates.isUnder99 = patchFields.priceQAR < 99;
    }

    await ctx.db.patch(id, updates);
    return { success: true };
  },
});

// 12. Admin: Toggle product in-stock status
export const toggleStockStatus = mutation({
  args: {
    id: v.id("products"),
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");

    const newInStock = !product.inStock;
    const newStockPercent = newInStock ? (product.stockPercent > 0 ? product.stockPercent : 80) : 0;

    await ctx.db.patch(args.id, {
      inStock: newInStock,
      stockPercent: newStockPercent,
    });

    return { inStock: newInStock, stockPercent: newStockPercent };
  },
});

// 13. Admin: Delete product
export const deleteProduct = mutation({
  args: {
    id: v.id("products"),
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");

    await ctx.db.delete(args.id);
    return { success: true, deletedProductId: product.productId };
  },
});

// 14. Real-time fast full-text search across product catalog
export const searchProducts = query({
  args: {
    searchTerm: v.string(),
    categorySlug: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cleanSearch = args.searchTerm.trim();
    if (!cleanSearch) return [];

    const takeCount = args.limit ?? 10;

    return await ctx.db
      .query("products")
      .withSearchIndex("search_products", (q) => {
        let builder = q.search("title", cleanSearch);
        if (args.categorySlug) {
          builder = builder.eq("categorySlug", args.categorySlug);
        }
        return builder;
      })
      .take(takeCount);
  },
});

