import NextAuth from "next-auth";

import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../db/database";

import { userService } from "@/server/services/user.service";
import { googleAccountService } from "@/server/services/googleAccount.service";
import { issueTokens } from "@/server/actions/auth/issue-tokens.server-action";
import { refreshAccessToken } from "@/server/actions/auth/refreshingToken.server-action";
import { logout } from "@/server/actions/auth/logOuthelper.server-action";
import { cookies } from "next/headers";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          let existingUser;


          try {
            existingUser = await userService.getUserDetailsByEmail(
              user.email ?? ""
            );
          } catch (error) {
            return true;
          }


          if (existingUser) {
            if (!existingUser.emailVerified && existingUser.role === "mentor") {
              return false;
            }
            const existingGoogleAccount =
              await googleAccountService.getGoogleOAuthAccount(
                existingUser.id ?? ""
              );

            if (!existingGoogleAccount) {
              await googleAccountService.registerGoogleOAuthAccount(
                existingUser.id,
                {
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token ?? null,
                  refresh_token: account.refresh_token ?? null,
                  expires_at: account.expires_at ?? null,
                  token_type: account.token_type ?? null,
                  scope: account.scope ?? null,
                  id_token: account.id_token ?? null,
                  session_state: String(account.session_state) ?? null,
                }
              );
            }

            if (!existingUser.emailVerified || !existingUser.googleId) {
              await userService.updateGoogleIdOfUser(
                existingUser.id,
                account.providerAccountId
              );
            }
          }
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false; // Prevent sign-in if an error occurs
        }
      }

      return true;
    },

    async jwt({ token }) {
      // if (process.env.NODE_ENV === "development") {
      //   console.log(
      //     "token info:",
      //     {
      //       accessToken: token.accessToken,
      //       expires_at: token.expires_at,
      //       error: token.error
      //     }
      //   );
      // }

      if (!token.email) return token;

      const existingUser = await userService.getUserDetailsByEmail(token.email);

      if (!existingUser) {
        token.error = "RefreshAccessTokenError";
        return token;
      }

      if (!token.accessToken || !token.expires_at) {
        try {
          const { accessToken, expires_at } = await issueTokens({
            id: token.sub!,
          });

          token.accessToken = accessToken;
          token.expires_at = expires_at; // Make sure to set this
        } catch (error) {
          console.error("Initial token issuance failed:", error);
          token.error = "RefreshAccessTokenError";
          return token;
        }
      }

      // Token refresh when expired
      if (token.expires_at && Date.now() > token.expires_at) {
        try {
          const refreshedTokens = await refreshAccessToken();

          if (!refreshedTokens) {
            throw new Error("Failed to refresh token");
          }

          token.accessToken = refreshedTokens.access_token;
          token.expires_at = refreshedTokens.expires_at;
          token.error = undefined;
        } catch (error) {
          console.error("Token refresh failed:", error);
          token.error = "RefreshAccessTokenError";
          return token;
        }
      }

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image as string;
      token.role = existingUser.role as string; // Ensure a default role is assigned
      token.googleId = existingUser.googleId ? existingUser.googleId : null;
      token.isBlocked = existingUser.isBlocked;

      return token;
    },

    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          googleId: token.googleId,
          image: token.image,
          role: token.role,
          isBlocked: token.isBlocked,
        },
      };
    },
  },
  events: {
    async signOut() {
      await logout();
    },
  },
 

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 15 * 60, // 15 minutes
  },
  adapter: PrismaAdapter(prisma),
});
