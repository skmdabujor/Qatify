import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { assertAdminAccess } from "./adminAuth";

// 1. Fetch all categories (bounded)
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const takeCount = args.limit ?? 50;
    return await ctx.db.query("categories").take(takeCount);
  },
});

// 2. Fetch single category by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// 3. Seed / Import categories into Convex database (Protected)
export const seedCategories = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    items: v.array(
      v.object({
        categoryId: v.string(),
        name: v.string(),
        slug: v.string(),
        icon: v.string(),
        count: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);

    let inserted = 0;
    // Clean up obsolete categories not present in items
    const existingCategories = await ctx.db.query("categories").collect();
    const incomingSlugs = new Set(args.items.map((i) => i.slug));
    for (const existingCat of existingCategories) {
      if (!incomingSlugs.has(existingCat.slug)) {
        await ctx.db.delete(existingCat._id);
      }
    }

    for (const item of args.items) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", item.slug))
        .first();

      if (!existing) {
        await ctx.db.insert("categories", item);
        inserted++;
      } else {
        await ctx.db.patch(existing._id, item);
        inserted++;
      }
    }
    return { success: true, count: inserted };
  },
});

// 4. One-time or Admin migration to replace TWS with Toys-Kids Learning
export const replaceTwsWithToysKids = mutation({
  args: {},
  handler: async (ctx) => {
    const twsCategory = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", "tws-audio"))
      .first();

    if (twsCategory) {
      await ctx.db.patch(twsCategory._id, {
        categoryId: "toys-kids-learning",
        name: "Toys-Kids Learning",
        slug: "toys-kids-learning",
        icon: "ToyBrick",
        count: 24,
      });
    } else {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", "toys-kids-learning"))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          icon: "ToyBrick",
        });
      } else {
        await ctx.db.insert("categories", {
          categoryId: "toys-kids-learning",
          name: "Toys-Kids Learning",
          slug: "toys-kids-learning",
          icon: "ToyBrick",
          count: 24,
        });
      }
    }

    return { success: true };
  },
});
