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

// 1b. Fetch main categories enriched with live representative product data.
// When fewer than `limit` main categories exist (e.g. 10 vs 16-slot homepage grid),
// remaining slots are filled with top distinct product subcategories from those main categories.
export const listWithProducts = query({
  args: {
    limit: v.optional(v.number()),
    productsPerCategory: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const targetCount = args.limit ?? 16;
    const productsLimit = args.productsPerCategory ?? 25;

    const categories = await ctx.db.query("categories").take(targetCount);

    const categoryResults = await Promise.all(
      categories.map(async (cat) => {
        const categoryProducts = await ctx.db
          .query("products")
          .withIndex("by_categorySlug", (q) => q.eq("categorySlug", cat.slug))
          .take(productsLimit);

        const inStockProducts = categoryProducts.filter((p) => p.inStock !== false);
        const pool = inStockProducts.length > 0 ? inStockProducts : categoryProducts;

        const sortedPool = [...pool].sort((a, b) => {
          const scoreA = (a.isBestSeller ? 2 : 0) + (a.isTrending ? 1 : 0);
          const scoreB = (b.isBestSeller ? 2 : 0) + (b.isTrending ? 1 : 0);
          if (scoreB !== scoreA) return scoreB - scoreA;
          return (b.soldCount ?? 0) - (a.soldCount ?? 0);
        });

        const featuredProduct = sortedPool[0] ?? null;
        const thumbnailImage = cat.image || featuredProduct?.images?.[0] || null;

        return {
          cat,
          sortedPool,
          item: {
            _id: String(cat._id),
            categoryId: cat.categoryId,
            name: cat.name,
            slug: cat.slug,
            subcategory: null as string | null,
            href: `/shop?cat=${cat.slug}`,
            icon: cat.icon,
            count: cat.count,
            liveProductCount: categoryProducts.length,
            image: thumbnailImage,
            featuredProductTitle: featuredProduct?.title ?? null,
            featuredProductSlug: featuredProduct?.slug ?? null,
            minPriceQAR:
              pool.length > 0
                ? Math.min(...pool.map((p) => p.priceQAR))
                : null,
          },
        };
      })
    );

    const items = categoryResults.map((r) => r.item);

    if (items.length < targetCount) {
      const usedImages = new Set(
        items.map((i) => i.image).filter((img): img is string => Boolean(img))
      );
      const usedNames = new Set(items.map((i) => i.name.toLowerCase()));

      // Build round-robin subcategory candidates from each main category's products
      const perCatQueues = categoryResults.map(({ cat, sortedPool }) => {
        const subMap = new Map<string, typeof sortedPool>();
        for (const prod of sortedPool) {
          const sub = (prod.subcategory || "").trim();
          if (!sub) continue;
          const lowerSub = sub.toLowerCase();
          if (usedNames.has(lowerSub) || cat.name.toLowerCase().includes(lowerSub)) {
            continue;
          }
          const existing = subMap.get(sub) ?? [];
          existing.push(prod);
          subMap.set(sub, existing);
        }
        return { cat, entries: Array.from(subMap.entries()) };
      });

      let round = 0;
      let progressed = true;
      while (items.length < targetCount && progressed) {
        progressed = false;
        for (const queue of perCatQueues) {
          if (items.length >= targetCount) break;
          if (round >= queue.entries.length) continue;
          progressed = true;

          const [subName, subProducts] = queue.entries[round];
          if (usedNames.has(subName.toLowerCase())) continue;

          const preferredProd =
            subProducts.find((p) => p.images?.[0] && !usedImages.has(p.images[0])) ??
            subProducts[0];

          const img = preferredProd?.images?.[0] ?? null;
          if (img) usedImages.add(img);
          usedNames.add(subName.toLowerCase());

          items.push({
            _id: `${String(queue.cat._id)}-sub-${subName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            categoryId: `${queue.cat.categoryId}-${round}`,
            name: subName,
            slug: queue.cat.slug,
            subcategory: subName,
            href: `/shop?cat=${queue.cat.slug}&sub=${encodeURIComponent(subName)}`,
            icon: queue.cat.icon,
            count: subProducts.length,
            liveProductCount: subProducts.length,
            image: img,
            featuredProductTitle: preferredProd?.title ?? null,
            featuredProductSlug: preferredProd?.slug ?? null,
            minPriceQAR:
              subProducts.length > 0
                ? Math.min(...subProducts.map((p) => p.priceQAR))
                : null,
          });
        }
        round++;
      }
    }

    return items.slice(0, targetCount);
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
        image: v.optional(v.string()),
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
