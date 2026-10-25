import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// 1. Submit a customer support or product inquiry
export const submitInquiry = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanName = args.name.trim();
    const cleanEmail = args.email.trim().toLowerCase();
    const cleanMsg = args.message.trim();

    if (!cleanName) throw new Error("Name is required");
    if (!cleanEmail || !cleanEmail.includes("@")) throw new Error("Valid email is required");
    if (!cleanMsg) throw new Error("Message cannot be empty");

    const inquiryId = await ctx.db.insert("inquiries", {
      name: cleanName,
      email: cleanEmail,
      phone: args.phone?.trim(),
      subject: args.subject?.trim() || "Customer Inquiry",
      message: cleanMsg,
      status: "new",
      createdAt: new Date().toISOString(),
    });

    return { success: true, inquiryId };
  },
});

// 2. Admin: List customer inquiries (bounded)
export const listInquiries = query({
  args: {
    status: v.optional(
      v.union(v.literal("new"), v.literal("in_progress"), v.literal("resolved"))
    ),
    limit: v.optional(v.number()),
    adminKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const expectedKey = process.env.ADMIN_SECRET_KEY;
    if (expectedKey && args.adminKey !== expectedKey) {
      throw new Error("Unauthorized access");
    }

    const takeCount = args.limit ?? 50;

    if (args.status) {
      return await ctx.db
        .query("inquiries")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(takeCount);
    }

    return await ctx.db.query("inquiries").order("desc").take(takeCount);
  },
});

// 3. Admin: Update inquiry status
export const updateInquiryStatus = mutation({
  args: {
    inquiryId: v.id("inquiries"),
    status: v.union(v.literal("new"), v.literal("in_progress"), v.literal("resolved")),
    adminKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const expectedKey = process.env.ADMIN_SECRET_KEY;
    if (expectedKey && args.adminKey !== expectedKey) {
      throw new Error("Unauthorized");
    }

    const item = await ctx.db.get(args.inquiryId);
    if (!item) throw new Error("Inquiry not found");

    await ctx.db.patch(args.inquiryId, { status: args.status });
    return { success: true };
  },
});

