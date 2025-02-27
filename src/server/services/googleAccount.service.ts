import { AccountEntity } from "../core/entities/googleAccount";
import { IAccountRepository } from "../core/interfaces/googleAccount.repository.interface";
import { IAccountService } from "../core/interfaces/googleAccount.service.interface";
import { prismaGoogleAccountRepoInstance } from "../repositories/prisma.googleAccount.repository";

export class GoogleAccountService implements IAccountService {
  private accountRepository: IAccountRepository;

  constructor(accountRepository: IAccountRepository) {
    this.accountRepository = accountRepository;
  }

  async getGoogleOAuthAccount(userId: string): Promise<AccountEntity | null> {
    return this.accountRepository.findGoogleOAuthAccountByUserId(userId);
  }

  async registerGoogleOAuthAccount(userId: string, accountData: Omit<AccountEntity, "userId" | "provider">): Promise<boolean> {
    return this.accountRepository.createGoogleOAuthAccount(userId, accountData);
  }
}


export const googleAccountService = new GoogleAccountService(prismaGoogleAccountRepoInstance)