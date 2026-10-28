import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = ((params.email as string) || "").trim().toLowerCase();
        const user: { email: string; name?: string; phone?: string } = { email };
        const name = (params.name as string) || (params.fullName as string);
        if (name && typeof name === "string" && name.trim()) {
          user.name = name.trim();
        }
        const phone = params.phone as string;
        if (phone && typeof phone === "string" && phone.trim()) {
          user.phone = phone.trim();
        }
        return user;
      },
    }),
  ],
});
