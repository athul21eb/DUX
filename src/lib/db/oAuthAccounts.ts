import { Account, Prisma } from "@prisma/client";
import { prisma } from "./database";

export const GoogleOAuthAccountById = async (id: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId: id,
        provider: "google",
      },
    });

    return account;
  } catch (error) {
    console.log("Error in oAuthAccountByemail", error);
    return null;
  }
};


///create a new googleOauth account for first credential login users

export const createGoogleOAuthAccount = async (
  userId: string,
  accountData: Omit<Account, "userId" |"provider" | "createdAt" | "updatedAt" | "type">
): Promise<boolean> => {
  try {
    await prisma.account.create({
      data: {
        userId, // Connect to the existing user
        type: "oidc", // Set type explicitly
        provider: "google",
        providerAccountId: accountData.providerAccountId,
        access_token: accountData.access_token ?? null,
        refresh_token: accountData.refresh_token ?? null,
        expires_at: accountData.expires_at ?? null,
        token_type: accountData.token_type ?? null,
        scope: accountData.scope ?? null,
        id_token: accountData.id_token ?? null,
        session_state: accountData.session_state ?? null,
      },
    });

    return true;
  } catch (error) {
    console.error("Error in createGoogleOAuthAccount:", error);
    return false;
  }
};