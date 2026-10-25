import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// 1. Subscribe customer email to Qatar VIP Deal alerts (used by FirstTimeDiscountPopup & Footer)
export const subscribe = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      throw new Error("Please provide a valid email address");
    }

    const existing = await ctx.db
      .query("newsletter_subscribers")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      return {
        success: true,
        alreadySubscribed: true,
        couponCode: "WELCOME10",
        message: "You are already subscribed! Enjoy coupon WELCOME10 for 10% off.",
      };
    }

    await ctx.db.insert("newsletter_subscribers", {
      email: cleanEmail,
      source: args.source || "website",
      subscribedAt: new Date().toISOString(),
    });

    return {
      success: true,
      alreadySubscribed: false,
      couponCode: "WELCOME10",
      message: "Shukran! You are subscribed to Qatify VIP Deal alerts.",
    };
  },
});

// 2. Admin: List all newsletter subscribers (bounded)
export const listSubscribers = query({
  args: {
    adminKey: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Basic admin protection
    const expectedKey = process.env.ADMIN_SECRET_KEY;
    if (expectedKey && args.adminKey !== expectedKey) {
      throw new Error("Unauthorized access to subscriber list");
    }

    const takeCount = args.limit ?? 50;
    return await ctx.db
      .query("newsletter_subscribers")
      .order("desc")
      .take(takeCount);
  },
});

