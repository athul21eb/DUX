import NextAuth from "next-auth";

import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../db/database";

import { userService } from "@/server/services/user.service";
import { googleAccountService } from "@/server/services/googleAccount.service";

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
          const existingUser = await userService.getUserDetailsByEmail(
            user.email ?? ""
          );

          if (existingUser) {

            if(!existingUser.emailVerified&&existingUser.role==="mentor"){
              return false
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

          console.log("new google user ")

        }
      }

      return true;
    },
    async jwt({ token }) {
      
      if (!token.email) return token;

      const existingUser = await userService.getUserDetailsByEmail(token.email);

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image as string;
      token.role = existingUser.role as string; // Ensure a default role is assigned
      token.googleId = existingUser.googleId;
      token.isBlocked = existingUser.isBlocked as boolean;

      return token;
    },

    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          googleId: token.googleId,
          image: token.image as string,
          role: token.role as string,
          isBlocked: token.isBlocked as boolean, // Ensure a default role
        },
      };
    },
  },

  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
});
