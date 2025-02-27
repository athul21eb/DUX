import { AccountEntity } from "../entities/googleAccount";

export interface IAccountService {
  getGoogleOAuthAccount(userId: string): Promise<AccountEntity | null>;
  registerGoogleOAuthAccount(userId: string, accountData: Omit<AccountEntity, "userId" | "provider">): Promise<boolean>;
}
