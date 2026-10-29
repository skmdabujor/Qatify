// =============================================================================
// Qatify — Dedicated Bundle Products Backend (`convex/bundleProducts.ts`)
// Exclusive Table: `bundleProducts`
// Rules:
// - Standard clean pricing (priceQAR) with NO individual discounts or strikethrough.
// - Discounts unlock strictly via Tiered Bundle rules (5+ items = 5%, 10+ = 10%, etc.).
// - Independent management & dedicated add / edit / delete mutations.
// =============================================================================

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { assertAdminAccess } from "./adminAuth";

// 1. Fetch Bundle Products (Bounded query)
export const list = query({
  args: {
    categorySlug: v.optional(v.string()),
    brand: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const takeCount = args.limit ?? 100;

    if (args.categorySlug && args.categorySlug !== "all") {
      const items = await ctx.db
        .query("bundleProducts")
        .withIndex("by_categorySlug", (q) => q.eq("categorySlug", args.categorySlug!))
        .take(takeCount);

      if (args.brand) {
        return items.filter((item) => item.brand === args.brand);
      }
      return items;
    }

    if (args.brand) {
      return await ctx.db
        .query("bundleProducts")
        .withIndex("by_brand", (q) => q.eq("brand", args.brand!))
        .take(takeCount);
    }

    return await ctx.db.query("bundleProducts").take(takeCount);
  },
});

// 2. Fetch single Bundle Product by Slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bundleProducts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// 3. Fetch single Bundle Product by Product ID
export const getByProductId = query({
  args: { productId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bundleProducts")
      .withIndex("by_productId", (q) => q.eq("productId", args.productId))
      .first();
  },
});

// 4. Admin: Add a dedicated Bundle Product
export const addBundleProduct = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    productId: v.optional(v.string()),
    title: v.string(),
    slug: v.optional(v.string()),
    shortDescription: v.string(),
    category: v.string(),
    categorySlug: v.string(),
    subcategory: v.optional(v.string()),
    brand: v.string(),
    priceQAR: v.number(), // Standard price without individual discount
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    inStock: v.optional(v.boolean()),
    images: v.array(v.string()),
    specifications: v.optional(v.record(v.string(), v.string())),
    packageContents: v.optional(v.array(v.string())),
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
    const productId =
      args.productId || `bnd-${Date.now().toString().slice(-4)}${randomSuffix}`;

    // Verify slug uniqueness
    const existing = await ctx.db
      .query("bundleProducts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (existing) {
      throw new Error(`Bundle product with slug '${slug}' already exists`);
    }

    const newId = await ctx.db.insert("bundleProducts", {
      productId,
      slug,
      title: args.title,
      shortDescription: args.shortDescription,
      category: args.category,
      categorySlug: args.categorySlug,
      subcategory: args.subcategory,
      brand: args.brand,
      priceQAR: Math.max(0, args.priceQAR),
      rating: args.rating ?? 4.9,
      reviewCount: args.reviewCount ?? 45,
      inStock: args.inStock ?? true,
      images: args.images.length > 0 ? args.images : ["/placeholder.svg"],
      specifications: args.specifications ?? {},
      packageContents: args.packageContents ?? [],
      isActive: true,
    });

    return { success: true, id: newId, productId, slug };
  },
});

// 5. Admin: Update a dedicated Bundle Product
export const updateBundleProduct = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    id: v.id("bundleProducts"),
    title: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    category: v.optional(v.string()),
    categorySlug: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    brand: v.optional(v.string()),
    priceQAR: v.optional(v.number()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    inStock: v.optional(v.boolean()),
    images: v.optional(v.array(v.string())),
    specifications: v.optional(v.record(v.string(), v.string())),
    packageContents: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);

    const { id, adminEmail, adminKey, ...fields } = args;
    await ctx.db.patch(id, fields);

    return { success: true };
  },
});

// 6. Admin: Delete a dedicated Bundle Product
export const deleteBundleProduct = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    id: v.id("bundleProducts"),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// 7. Seed / Sync initial high-quality 180+ QAR items into the `bundleProducts` table
export const seedBundleProducts = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    items: v.optional(
      v.array(
        v.object({
          productId: v.string(),
          slug: v.string(),
          title: v.string(),
          shortDescription: v.string(),
          category: v.string(),
          categorySlug: v.string(),
          subcategory: v.optional(v.string()),
          brand: v.string(),
          priceQAR: v.number(),
          rating: v.number(),
          reviewCount: v.number(),
          inStock: v.boolean(),
          images: v.array(v.string()),
          specifications: v.record(v.string(), v.string()),
          packageContents: v.optional(v.array(v.string())),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);

    const itemsToSeed = args.items ?? [];
    let count = 0;

    for (const item of itemsToSeed) {
      const existing = await ctx.db
        .query("bundleProducts")
        .withIndex("by_slug", (q) => q.eq("slug", item.slug))
        .first();

      if (!existing) {
        await ctx.db.insert("bundleProducts", {
          ...item,
          isActive: true,
        });
        count++;
      } else {
        await ctx.db.patch(existing._id, {
          ...item,
          isActive: true,
        });
        count++;
      }
    }

    return { success: true, seededCount: count };
  },
});

