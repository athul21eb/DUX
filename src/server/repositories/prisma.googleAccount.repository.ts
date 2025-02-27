import { prisma } from "@/lib/db/database";
import { IAccountRepository } from "../core/interfaces/googleAccount.repository.interface";
import { AccountEntity } from "../core/entities/googleAccount";


export class AccountRepository implements IAccountRepository {
  async findGoogleOAuthAccountByUserId(userId: string): Promise<AccountEntity | null> {
    try {
      return await prisma.account.findFirst({
        where: {
          userId,
          provider: "google",
        },
      });
    } catch (error) {
      console.error("Error in findGoogleOAuthAccountByUserId:", error);
      return null;
    }
  }

  async createGoogleOAuthAccount(
    userId: string,
    accountData: Omit<AccountEntity, "userId" | "provider">
  ): Promise<boolean> {
    try {
      await prisma.account.create({
        data: {
          userId,
          provider: "google",
          type: "oidc",
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
  }
}


export const  prismaGoogleAccountRepoInstance = new AccountRepository();