import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const name = params.name;
        return {
          email: params.email as string,
          ...(typeof name === "string" && name ? { name } : {}),
        };
      },
    }),
  ],
});
