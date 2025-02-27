import { Otp } from "../entities/otp";

export interface IOtpService {
  generateOtpAndSend(email: string): Promise<Otp | null>;
  validateOtp(email: string, token: string): Promise<boolean>;
  deleteOtp(id: number): Promise<boolean>;
  deleteOtpsByEmail(email: string): Promise<boolean>;
}
