import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { assertAdminAccess } from "./adminAuth";

// =============================================================================
// Qatify — Dynamic Admin Access Management (Convex)
// Manages store owner & admin access dynamically in the Convex backend database.
// No secret keys required on the frontend — access is determined by whether the
// email is registered and granted access in the `admins` table.
// =============================================================================

/**
 * 1. Query: Check whether a given email has Admin privileges.
 * Reactive and real-time. Frontend uses this to conditionally render Store Admin.
 */
export const checkIsAdmin = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const normalized = args.email.trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) {
      return { isAdmin: false, role: null, name: null, email: null };
    }

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    if (!admin) {
      return { isAdmin: false, role: null, name: null, email: null };
    }

    return {
      isAdmin: true,
      role: admin.role,
      name: admin.name || null,
      email: admin.email,
    };
  },
});

/**
 * 2. Query: Verify whether an Admin Secret Key is valid (Legacy / CLI helper).
 */
export const verifyAdminKey = query({
  args: { adminKey: v.string() },
  handler: async (ctx, args) => {
    const expected = process.env.ADMIN_SECRET_KEY;
    if (!expected || !args.adminKey) {
      return { valid: false };
    }
    return { valid: args.adminKey.trim() === expected.trim() };
  },
});

/**
 * 3. Query: List all active admins.
 * Protected: requires either an authorized adminEmail or valid adminKey.
 */
export const listAdmins = query({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);
    const takeCount = args.limit ?? 50;
    return await ctx.db.query("admins").order("desc").take(takeCount);
  },
});

/**
 * 4. Query: Get the count of registered admins.
 */
export const getAdminCount = query({
  args: {},
  handler: async (ctx) => {
    const admins = await ctx.db.query("admins").take(5);
    return admins.length;
  },
});

/**
 * 5. Mutation: Add a new admin email.
 * Protected: requires an authorized admin/owner email or valid adminKey.
 */
export const addAdmin = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal("owner"), v.literal("admin"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);

    const normalized = args.email.trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) {
      throw new Error("Invalid email address format.");
    }

    // Check if email already exists
    const existing = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    if (existing) {
      throw new Error(`Email "${normalized}" is already registered as an admin.`);
    }

    const id = await ctx.db.insert("admins", {
      email: normalized,
      name: args.name?.trim() || undefined,
      role: args.role ?? "admin",
      addedAt: new Date().toISOString(),
      notes: args.notes?.trim() || undefined,
    });

    console.log(`[Admin] Added new admin: ${normalized} (Role: ${args.role ?? "admin"})`);
    return { success: true, id, email: normalized };
  },
});

/**
 * 6. Mutation: Remove an admin by ID.
 * Protected: requires an authorized admin/owner email or valid adminKey.
 */
export const removeAdmin = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    id: v.id("admins"),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);

    const admin = await ctx.db.get(args.id);
    if (!admin) {
      throw new Error("Admin record not found.");
    }

    await ctx.db.delete(args.id);
    console.log(`[Admin] Removed admin: ${admin.email}`);
    return { success: true, removedEmail: admin.email };
  },
});

/**
 * 7. Mutation: Remove an admin by email.
 * Protected: requires an authorized admin/owner email or valid adminKey.
 */
export const removeAdminByEmail = mutation({
  args: {
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);

    const normalized = args.email.trim().toLowerCase();
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    if (!admin) {
      throw new Error(`Admin with email "${normalized}" not found.`);
    }

    await ctx.db.delete(admin._id);
    console.log(`[Admin] Removed admin by email: ${normalized}`);
    return { success: true, removedEmail: normalized };
  },
});

/**
 * 8. Mutation: Seed initial admin (Bootstrap).
 * Allows bootstrap only if 0 admins exist or valid adminKey provided.
 */
export const bootstrapInitialAdmin = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    adminKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingAdmins = await ctx.db.query("admins").take(1);
    if (existingAdmins.length > 0) {
      // If admins already exist, must have valid adminKey
      const expected = process.env.ADMIN_SECRET_KEY;
      if (!expected || args.adminKey !== expected) {
        throw new Error("Initial admin setup is disabled because admins already exist.");
      }
    }

    const normalized = args.email.trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) {
      throw new Error("Invalid email address.");
    }

    const id = await ctx.db.insert("admins", {
      email: normalized,
      name: args.name?.trim() || "Store Owner",
      role: "owner",
      addedAt: new Date().toISOString(),
      notes: "Bootstrap initial owner account",
    });

    console.log(`[Admin] Initial store owner bootstrap completed: ${normalized}`);
    return { success: true, id, email: normalized };
  },
});
