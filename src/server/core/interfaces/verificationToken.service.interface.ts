import { IVerificationToken } from "../entities/verificationToke";

export interface IVerificationTokenService {
  createVerificationTokenAndSend(email:string): Promise<IVerificationToken>;
  getVerificationByEmail(email: string): Promise<IVerificationToken|null>;
  getVerificationByToken(token: string): Promise<IVerificationToken | null>;
  deleteVerificationById(id: string): Promise<IVerificationToken>;
  updateVerificationById(id: string, data: Partial<IVerificationToken>): Promise<IVerificationToken>;
}