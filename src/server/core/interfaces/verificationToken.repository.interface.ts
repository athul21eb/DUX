import { IVerificationToken } from "../entities/verificationToke";

export interface IVerificationTokenRepository {
  create(data: Omit<IVerificationToken,'id'>): Promise<IVerificationToken>;
  getByEmail(email: string): Promise<IVerificationToken|null>;
  getByToken(token: string): Promise<IVerificationToken | null>;
  deleteById(id: string): Promise<IVerificationToken>;
  deleteByEmail(email:string):Promise<boolean>;
  updateById(id: string, data: Partial<IVerificationToken>): Promise<IVerificationToken>;
}