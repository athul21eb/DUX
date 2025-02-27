import { AccountEntity } from "../entities/googleAccount";

export interface IAccountRepository {
  findGoogleOAuthAccountByUserId(userId: string): Promise<AccountEntity | null>;
  createGoogleOAuthAccount(userId: string, accountData: Omit<AccountEntity, "userId" | "provider">): Promise<boolean>;
}
