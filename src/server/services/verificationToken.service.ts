import { IVerificationToken } from "../core/entities/verificationToke";
import { ValidationError } from "../core/errors/errors";
import { IVerificationTokenService } from "../core/interfaces/verificationToken.service.interface";
import { IVerificationTokenRepository } from "../core/interfaces/verificationToken.repository.interface";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/utils/mail/verificationMail";
import { prismaVerificationTokenInstance } from "../repositories/prisma.verificationToken.repository";

export class VerificationTokenService implements IVerificationTokenService {
  constructor(private repository: IVerificationTokenRepository) {}
  ////---------------generateVerificationToken

  async createVerificationTokenAndSend(
    email: string
  ): Promise<IVerificationToken> {
    try {
      const token = uuidv4();
      let expiredInSecondsEpoch = new Date().getTime() + 1000 * 60 * 60 * 1; // 1 hours
      await this.repository.deleteByEmail(email);

      const Database_stored_verification_token = await this.repository.create({
        email,
        token,
        expires: new Date(expiredInSecondsEpoch),
      });

      await sendVerificationEmail(email, Database_stored_verification_token.token);

      return Database_stored_verification_token;
    } catch (error) {
       console.error("Error in VerificationTokenService:", error);
      throw new Error("Failed to generate Verification Token");
    }
  }

  async getVerificationByEmail(
    email: string
  ): Promise<IVerificationToken | null> {
    return await this.repository.getByEmail(email);
  }

  async getVerificationByToken(
    token: string
  ): Promise<IVerificationToken | null> {
    return await this.repository.getByToken(token);
  }

  async deleteVerificationById(id: string): Promise<IVerificationToken> {
    return await this.repository.deleteById(id);
  }

  async updateVerificationById(
    id: string,
    data: Partial<IVerificationToken>
  ): Promise<IVerificationToken> {
    return await this.repository.updateById(id, data);
  }
}


export const verificationTokenService = new VerificationTokenService(prismaVerificationTokenInstance);