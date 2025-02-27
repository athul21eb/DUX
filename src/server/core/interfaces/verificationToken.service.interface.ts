import { IVerificationToken } from "../entities/verificationToke";

export interface IVerificationTokenService {
  createVerificationTokenAndSend(email:string): Promise<IVerificationToken>;
  getVerificationByEmail(email: string): Promise<IVerificationToken>;
  getVerificationByToken(token: string): Promise<IVerificationToken >;
  deleteVerificationById(id: string): Promise<IVerificationToken>;
  updateVerificationById(id: string, data: Partial<IVerificationToken>): Promise<IVerificationToken>;
}