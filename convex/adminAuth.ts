import { QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// =============================================================================
// Qatify — Authoritative Admin Access Verification Helper
// Validates caller identity against the Convex backend `admins` database table
// (Authenticated Session via Convex Auth) or against server ADMIN_SECRET_KEY.
// =============================================================================

export async function assertAdminAccess(
  ctx: QueryCtx | MutationCtx,
  adminEmail?: string,
  adminKey?: string
): Promise<{ email: string; role: "owner" | "admin"; name?: string }> {
  // 1. Check if caller has an authenticated session with Convex Auth
  try {
    const userId = await getAuthUserId(ctx);
    if (userId) {
      const user = await ctx.db.get(userId);
      if (user?.email) {
        const normalized = user.email.trim().toLowerCase();
        const admin = await ctx.db
          .query("admins")
          .withIndex("by_email", (q) => q.eq("email", normalized))
          .first();

        if (admin) {
          return {
            email: admin.email,
            role: admin.role,
            name: admin.name,
          };
        }
      }
    }
  } catch (err) {
    // getAuthUserId may fail in environments without auth headers; proceed to key check
  }

  // 2. Secret Key check (for CLI scripts / seed data / emergency master access)
  const expected = process.env.ADMIN_SECRET_KEY;
  if (expected && adminKey && adminKey.trim() === expected.trim()) {
    return {
      email: adminEmail?.trim().toLowerCase() || "system@shopqatify.com",
      role: "owner",
      name: "Store Owner",
    };
  }

  throw new Error(
    "Unauthorized: Access denied. Please sign in with an authorized admin account or provide a valid Admin Key."
  );
}

export function assertAdminKey(adminKey?: string): void {
  const expected = process.env.ADMIN_SECRET_KEY;
  if (!expected || !expected.trim()) {
    throw new Error(
      "Server configuration error: ADMIN_SECRET_KEY is not configured in Convex deployment environment."
    );
  }

  if (!adminKey || adminKey.trim() !== expected.trim()) {
    throw new Error("Unauthorized: Invalid Admin Secret Key.");
  }
}

