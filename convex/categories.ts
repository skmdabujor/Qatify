import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

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

// 3. Seed / Import categories into Convex database
export const seedCategories = mutation({
  args: {
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
    let inserted = 0;
    for (const item of args.items) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", item.slug))
        .first();

      if (!existing) {
        await ctx.db.insert("categories", item);
        inserted++;
      }
    }
    return { success: true, count: inserted };
  },
});

