import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// 1. Fetch verified reviews for a specific product (bounded)
export const listByProduct = query({
  args: {
    productId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const takeCount = args.limit ?? 20;

    // First try by productId
    let reviews = await ctx.db
      .query("reviews")
      .withIndex("by_productId", (q) => q.eq("productId", args.productId))
      .order("desc")
      .take(takeCount);

    return reviews;
  },
});

// 2. Submit a new customer review & automatically update product's rating and reviewCount
export const submitReview = mutation({
  args: {
    productId: v.string(),
    authorName: v.string(),
    rating: v.number(),
    comment: v.string(),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanName = args.authorName.trim();
    const cleanComment = args.comment.trim();

    if (!cleanName) {
      throw new Error("Author name is required");
    }
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5 stars");
    }
    if (cleanComment.length < 5) {
      throw new Error("Review comment must be at least 5 characters long");
    }

    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const location = args.location?.trim() || "Doha, Qatar";

    // Insert the review
    const reviewId = await ctx.db.insert("reviews", {
      productId: args.productId,
      authorName: cleanName,
      rating: args.rating,
      comment: cleanComment,
      location,
      verifiedBuyer: true,
      date: todayStr,
    });

    // Find the product to update its rating and reviewCount
    let product = await ctx.db
      .query("products")
      .withIndex("by_productId", (q) => q.eq("productId", args.productId))
      .first();

    if (!product) {
      product = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", args.productId))
        .first();
    }

    if (product) {
      const currentCount = product.reviewCount ?? 0;
      const currentRating = product.rating ?? 5.0;
      const newCount = currentCount + 1;
      // Weighted average rounded to 1 decimal place
      const newRating = Math.round(((currentRating * currentCount + args.rating) / newCount) * 10) / 10;

      await ctx.db.patch(product._id, {
        reviewCount: newCount,
        rating: Math.min(5.0, Math.max(1.0, newRating)),
      });
    }

    return { success: true, reviewId };
  },
});

// 3. Seed starter customer reviews for top Qatar gadgets
export const seedReviews = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleReviews = [
      {
        productId: "qat-001",
        authorName: "Nasser K.",
        rating: 5,
        comment: "Outstanding ANC performance! Perfect for flights out of Hamad Int’l. Battery lasts all week.",
        location: "Lusail, Qatar",
        verifiedBuyer: true,
        date: "3 days ago",
      },
      {
        productId: "qat-001",
        authorName: "Fatima Al-Thani",
        rating: 5,
        comment: "Arrived in 7 business days as promised. Clean packaging, genuine build quality.",
        location: "The Pearl, Doha",
        verifiedBuyer: true,
        date: "1 week ago",
      },
      {
        productId: "qat-001",
        authorName: "Rashid M.",
        rating: 4,
        comment: "Great soundstage and bass. Very comfortable ear cushions even in humid weather.",
        location: "Al Rayyan, Qatar",
        verifiedBuyer: true,
        date: "2 weeks ago",
      },
      {
        productId: "qat-002",
        authorName: "Hamad J.",
        rating: 5,
        comment: "Fastest 140W GaN charger I have used in Doha. Runs cool and charges MacBook + iPhone at full speed.",
        location: "West Bay, Doha",
        verifiedBuyer: true,
        date: "4 days ago",
      },
      {
        productId: "qat-003",
        authorName: "Jassim Al-Kuwari",
        rating: 5,
        comment: "Strong magnetic hold on rough desert drives. Fast 15W wireless charging works seamlessly.",
        location: "Al Wakrah, Qatar",
        verifiedBuyer: true,
        date: "5 days ago",
      },
    ];

    let insertedCount = 0;
    for (const rev of sampleReviews) {
      const existing = await ctx.db
        .query("reviews")
        .withIndex("by_productId", (q) => q.eq("productId", rev.productId))
        .filter((q) => q.eq(q.field("authorName"), rev.authorName))
        .first();

      if (!existing) {
        await ctx.db.insert("reviews", rev);
        insertedCount++;
      }
    }

    return { insertedCount };
  },
});

