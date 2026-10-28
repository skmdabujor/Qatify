import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// =============================================================================
// Qatify — Authenticated User Profile Queries & Mutations
// =============================================================================

/**
 * Returns current authenticated customer profile or null if visitor is guest.
 */
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return {
      _id: user._id,
      _creationTime: user._creationTime,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      image: user.image,
    };
  },
});

/**
 * Update authenticated user's profile details (Name, Phone number).
 */
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Please sign in to update profile.");
    }

    const patch: { name?: string; phone?: string } = {};
    if (args.name !== undefined) {
      patch.name = args.name.trim();
    }
    if (args.phone !== undefined) {
      patch.phone = args.phone.trim();
    }

    await ctx.db.patch(userId, patch);
    return { success: true };
  },
});
