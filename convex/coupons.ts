import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Helper: Validate admin secret if set in environment
function assertAdmin(adminKey?: string) {
  const expected = process.env.ADMIN_SECRET_KEY;
  if (expected && adminKey !== expected) {
    throw new Error("Unauthorized: Invalid Admin Secret Key");
  }
}

// 1. Validate a coupon code against current subtotal
export const validateCoupon = query({
  args: {
    code: v.string(),
    subtotalQAR: v.number(),
    currentDate: v.optional(v.string()), // YYYY-MM-DD passed from client to avoid non-deterministic query wall-clock reads
  },
  handler: async (ctx, args) => {
    const cleanCode = args.code.trim().toUpperCase();
    if (!cleanCode) {
      return { isValid: false, discountQAR: 0, message: "Coupon code is empty" };
    }

    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", cleanCode))
      .first();

    if (!coupon) {
      return { isValid: false, discountQAR: 0, message: "Invalid coupon code" };
    }

    if (!coupon.isActive) {
      return { isValid: false, discountQAR: 0, message: "This coupon is no longer active" };
    }

    // Check expiration using passed currentDate (or safe fallback)
    if (coupon.expiryDate && args.currentDate) {
      if (args.currentDate > coupon.expiryDate) {
        return { isValid: false, discountQAR: 0, message: "This coupon has expired" };
      }
    }

    // Check usage limits
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { isValid: false, discountQAR: 0, message: "This coupon has reached its maximum usage limit" };
    }

    // Check minimum spend
    if (args.subtotalQAR < coupon.minOrderQAR) {
      return {
        isValid: false,
        discountQAR: 0,
        message: `Minimum order subtotal of QAR ${coupon.minOrderQAR} required for this coupon`,
      };
    }

    // Calculate discount amount
    let discountQAR = 0;
    if (coupon.discountType === "percentage") {
      discountQAR = Math.round((args.subtotalQAR * coupon.discountValue) / 100);
      if (coupon.maxDiscountQAR) {
        discountQAR = Math.min(discountQAR, coupon.maxDiscountQAR);
      }
    } else {
      discountQAR = Math.min(coupon.discountValue, args.subtotalQAR);
    }

    return {
      isValid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountQAR,
      message: `Coupon applied: ${coupon.description || coupon.code}`,
    };
  },
});

// 2. Admin: List all coupons
export const listCoupons = query({
  args: {
    limit: v.optional(v.number()),
    adminKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    assertAdmin(args.adminKey);
    const takeCount = args.limit ?? 50;
    return await ctx.db.query("coupons").take(takeCount);
  },
});

// 3. Admin: Create a new coupon
export const createCoupon = mutation({
  args: {
    adminKey: v.optional(v.string()),
    code: v.string(),
    discountType: v.union(v.literal("percentage"), v.literal("fixed")),
    discountValue: v.number(),
    minOrderQAR: v.number(),
    maxDiscountQAR: v.optional(v.number()),
    maxUses: v.optional(v.number()),
    expiryDate: v.optional(v.string()),
    isActive: v.boolean(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    assertAdmin(args.adminKey);
    const cleanCode = args.code.trim().toUpperCase();

    // Ensure unique code
    const existing = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", cleanCode))
      .first();

    if (existing) {
      throw new Error(`Coupon with code "${cleanCode}" already exists`);
    }

    const couponId = await ctx.db.insert("coupons", {
      code: cleanCode,
      discountType: args.discountType,
      discountValue: args.discountValue,
      minOrderQAR: args.minOrderQAR,
      maxDiscountQAR: args.maxDiscountQAR,
      maxUses: args.maxUses,
      usedCount: 0,
      expiryDate: args.expiryDate,
      isActive: args.isActive,
      description: args.description,
    });

    return { couponId, code: cleanCode };
  },
});

// 4. Admin: Toggle coupon active status
export const toggleCouponStatus = mutation({
  args: {
    couponId: v.id("coupons"),
    adminKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    assertAdmin(args.adminKey);
    const coupon = await ctx.db.get(args.couponId);
    if (!coupon) throw new Error("Coupon not found");

    const newStatus = !coupon.isActive;
    await ctx.db.patch(args.couponId, { isActive: newStatus });
    return { success: true, isActive: newStatus };
  },
});

// 5. Admin: Delete coupon
export const deleteCoupon = mutation({
  args: {
    couponId: v.id("coupons"),
    adminKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    assertAdmin(args.adminKey);
    const coupon = await ctx.db.get(args.couponId);
    if (!coupon) throw new Error("Coupon not found");

    await ctx.db.delete(args.couponId);
    return { success: true };
  },
});

// 6. Seed starter coupons for instant testing
export const seedCoupons = mutation({
  args: {},
  handler: async (ctx) => {
    const defaultCoupons = [
      {
        code: "WELCOME10",
        discountType: "percentage" as const,
        discountValue: 10,
        minOrderQAR: 100,
        maxDiscountQAR: 50,
        maxUses: 500,
        usedCount: 0,
        expiryDate: "2027-12-31",
        isActive: true,
        description: "10% Off for New Qatify Customers",
      },
      {
        code: "QATAR25",
        discountType: "fixed" as const,
        discountValue: 25,
        minOrderQAR: 150,
        maxUses: 200,
        usedCount: 0,
        expiryDate: "2027-12-31",
        isActive: true,
        description: "Save QAR 25 on Orders over QAR 150",
      },
      {
        code: "EID50",
        discountType: "fixed" as const,
        discountValue: 50,
        minOrderQAR: 300,
        maxUses: 100,
        usedCount: 0,
        expiryDate: "2027-12-31",
        isActive: true,
        description: "Festival Special: QAR 50 Off on QAR 300+ orders",
      },
    ];

    let insertedCount = 0;
    for (const item of defaultCoupons) {
      const existing = await ctx.db
        .query("coupons")
        .withIndex("by_code", (q) => q.eq("code", item.code))
        .first();

      if (!existing) {
        await ctx.db.insert("coupons", item);
        insertedCount++;
      }
    }

    return { insertedCount };
  },
});

