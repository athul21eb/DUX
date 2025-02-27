import { generateOtp } from "@/utils/token/otp";
import { Otp } from "../core/entities/otp";
import { IOtpRepository } from "../core/interfaces/otp.repository.interface";
import { IOtpService } from "../core/interfaces/otp.service.interface";
import { prismaOtpInstance } from "../repositories/prisma.otp.repository";
import { ValidationError } from "../core/errors/errors";
import { sendForgotPasswordOtp } from "@/utils/mail/otpMail";

export class OtpServiceImpl implements IOtpService {
  private otpRepository: IOtpRepository;

  constructor(otpRepository: IOtpRepository) {
    this.otpRepository = otpRepository;
  }

  async generateOtpAndSend(email: string): Promise<Otp | null> {
    try {
      await this.otpRepository.deleteOtpByEmail(email);

      const otp = generateOtp();

      const created_otp = await this.otpRepository.createOtp(email, otp);

      if (!created_otp) {
        throw new ValidationError("failed to create an otp ");
      }

      await sendForgotPasswordOtp(email, created_otp.token);
      return created_otp;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in otpService:", error);
      throw new Error("Failed to send otp to  user");
    }
  }

  async validateOtp(email: string, token: string): Promise<boolean> {
    try {
      const existingOTP = await this.otpRepository.getOtpByEmail(email);

      if (!existingOTP) {
        throw new ValidationError("OTP not found");
      }

      if (existingOTP.token !== token) {
        throw new ValidationError("Invalid OTP");
      }
      if (new Date(existingOTP.expiresAt) < new Date()) {
        throw new ValidationError("OTP expired");
      }

      return this.otpRepository.deleteOtpByEmail(email);
      
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in otpService:", error);
      throw new Error("Failed to send otp to  user");
    }
  }

  async deleteOtp(id: number): Promise<boolean> {
    return this.otpRepository.deleteOtp(id);
  }

  async deleteOtpsByEmail(email: string): Promise<boolean> {
    return this.otpRepository.deleteOtpByEmail(email);
  }
}

export const otpService = new OtpServiceImpl(prismaOtpInstance);
