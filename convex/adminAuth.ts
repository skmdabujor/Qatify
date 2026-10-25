import { QueryCtx, MutationCtx } from "./_generated/server";

// =============================================================================
// Qatify — Authoritative Admin Access Verification Helper
// Validates caller identity against the Convex backend `admins` database table
// (Dynamic Email-based Access) or against server ADMIN_SECRET_KEY (CLI/Scripts).
// =============================================================================

export async function assertAdminAccess(
  ctx: { db: QueryCtx["db"] | MutationCtx["db"] },
  adminEmail?: string,
  adminKey?: string
): Promise<{ email: string; role: "owner" | "admin"; name?: string }> {
  // 1. Check if email is authorized in Convex `admins` table
  if (adminEmail && adminEmail.trim()) {
    const normalized = adminEmail.trim().toLowerCase();
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

  // 2. Fallback: Check if Admin Secret Key matches (for CLI scripts / seed data)
  const expected = process.env.ADMIN_SECRET_KEY;
  if (expected && adminKey && adminKey.trim() === expected.trim()) {
    return {
      email: "system@qatify.qa",
      role: "owner",
      name: "System Admin",
    };
  }

  throw new Error(
    "Unauthorized: Access denied. This action requires an email authorized in the Convex admins backend."
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
