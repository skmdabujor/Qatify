import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// =============================================================================
// Qatify — Dynamic Admin Access Management (Convex)
// Allows adding, removing, and verifying admin emails in real time.
// =============================================================================

/**
 * 1. Query: Check whether a given email has Admin privileges.
 */
export const checkIsAdmin = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const normalized = args.email.trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) {
      return { isAdmin: false, role: null, name: null };
    }

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    if (!admin) {
      return { isAdmin: false, role: null, name: null };
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
 * 2. Query: List all active admins.
 */
export const listAdmins = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const takeCount = args.limit ?? 50;
    return await ctx.db.query("admins").order("desc").take(takeCount);
  },
});

/**
 * 3. Query: Get the count of registered admins.
 * Useful to check if the store has any initial admin configured.
 */
export const getAdminCount = query({
  args: {},
  handler: async (ctx) => {
    const admins = await ctx.db.query("admins").take(5);
    return admins.length;
  },
});

/**
 * 4. Mutation: Add a new admin email.
 */
export const addAdmin = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal("owner"), v.literal("admin"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
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
 * 5. Mutation: Remove an admin by ID.
 */
export const removeAdmin = mutation({
  args: { id: v.id("admins") },
  handler: async (ctx, args) => {
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
 * 6. Mutation: Remove an admin by email.
 */
export const removeAdminByEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
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
 * 7. Mutation: Seed initial admin (Bootstrap).
 * If the database currently has 0 admins, this allows the store owner to claim initial access.
 */
export const bootstrapInitialAdmin = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingAdmins = await ctx.db.query("admins").take(1);
    if (existingAdmins.length > 0) {
      throw new Error("Initial admin setup is disabled because admins already exist.");
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

