import { Otp } from "../entities/otp";

export interface IOtpRepository {
  createOtp(email: string, token: string): Promise<Otp | null>;
  getOtpByEmail(email: string): Promise<Otp | null>;
  getOtpByToken(token: string): Promise<Otp | null>;
  deleteOtp(id: number): Promise<boolean>;
  deleteOtpByEmail(email: string): Promise<boolean>;
}
