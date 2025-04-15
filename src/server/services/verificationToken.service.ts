import { IVerificationToken } from "../core/entities/verificationToke";
import { ValidationError } from "../core/errors/errors";
import { IVerificationTokenService } from "../core/interfaces/verificationToken.service.interface";
import { IVerificationTokenRepository } from "../core/interfaces/verificationToken.repository.interface";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/utils/mail/verificationMail";
import { prismaVerificationTokenInstance } from "../repositories/prisma.verificationToken.repository";
import { UserManagementResponseMessages } from "../shared/constants/constant";

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

      await sendVerificationEmail(
        email,
        Database_stored_verification_token.token
      );

      return Database_stored_verification_token;
    } catch (error) {
      console.error("Error in VerificationTokenService:", error);
      throw new Error(UserManagementResponseMessages.ErrorFaliedToSendVerificationEmail);
    }
  }

  async getVerificationByEmail(
    email: string
  ): Promise<IVerificationToken > {
    try {
      const existingToken = await this.repository.getByEmail(email);
      if (!existingToken) {
        throw new ValidationError(UserManagementResponseMessages.ErrorVerificationTokenNotFound);
      }

      return existingToken;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in token service:", error);
      throw new Error(UserManagementResponseMessages.ErrorFaliledToVerifyEmail);
    }
  }

  async getVerificationByToken(
    token: string
  ): Promise<IVerificationToken > {
  try {
    const existingToken = await this.repository.getByToken(token);
    if (!existingToken) {
      throw new ValidationError(UserManagementResponseMessages.ErrorVerificationTokenNotFound);
    }

    return existingToken;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    console.error("Error in token service:", error);
    throw new Error(UserManagementResponseMessages.ErrorVerificationTokenNotFound);
  }
  }

  async deleteVerificationById(id: string): Promise<IVerificationToken> {
   try{

  const token =    await this.repository.deleteById(id);
  if(!token){
    throw new ValidationError(UserManagementResponseMessages.ErrorVerificationTokenNotFound);
  }
     return token
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    console.error("Error in token service delete method:", error);
    throw new Error(UserManagementResponseMessages.ErrorVerificationTokenNotFound);
  }
  }

  async updateVerificationById(
    id: string,
    data: Partial<IVerificationToken>
  ): Promise<IVerificationToken> {
    return await this.repository.updateById(id, data);
  }
}

export const verificationTokenService = new VerificationTokenService(
  prismaVerificationTokenInstance
);
