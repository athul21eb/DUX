import { prisma } from "@/lib/db/database";
import { Otp } from "../core/entities/otp";
import { IOtpRepository } from "../core/interfaces/otp.repository.interface";
import { BaseRepository } from "./prisma.BaseRepository";

export class PrismaOtpRepositoryImpl extends BaseRepository<Otp> implements IOtpRepository {

   constructor() {
        super(prisma.oTP);  // Replace 'YourTimeSlotModel' with your actual time slot model
      }
  async createOtp(email: string, token: string): Promise<Otp | null> {
    try {
      const otp = await prisma.oTP.create({
        data: {
          email,
          token,
          expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
        },
      });
      return otp;
    } catch (error) {
      console.error("Error creating OTP:", error);
      return null;
    }
  }

  async getOtpByEmail(email: string): Promise<Otp | null> {
    try {
      const otp = await prisma.oTP.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" },
      });
      return otp;
    } catch (error) {
      console.error("Error fetching OTP by email:", error);
      return null;
    }
  }

  async getOtpByToken(token: string): Promise<Otp | null> {
    try {
      const otp = await prisma.oTP.findFirst({
        where: { token },
      });
      return otp;
    } catch (error) {
      console.error("Error fetching OTP by token:", error);
      return null;
    }
  }

  async deleteOtp(id: number): Promise<boolean> {
    try {
      await prisma.oTP.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error("Error deleting OTP:", error);
      return false;
    }
  }

  async deleteOtpByEmail(email: string): Promise<boolean> {
    try {
      await prisma.oTP.deleteMany({ where: { email } });
      return true;
    } catch (error) {
      console.error("Error deleting OTP by email:", error);
      return false;
    }
  }
}


export const prismaOtpInstance = new PrismaOtpRepositoryImpl();