import { prisma } from "@/lib/db/database";
import { IVerificationToken } from "../core/entities/verificationToke";
import { IVerificationTokenRepository } from "../core/interfaces/verificationToken.repository.interface";

export class PrismaVerificationTokenRepository implements IVerificationTokenRepository {
  async create(data: IVerificationToken): Promise<IVerificationToken> {
    return await prisma.verificationToken.create({ data });
  }

  async getByEmail(email: string): Promise<IVerificationToken|null> {
    return await prisma.verificationToken.findFirst({ where: { email } });
  }

  async getByToken(token: string): Promise<IVerificationToken | null> {
    return await prisma.verificationToken.findFirst({ where: { token } });
  }

  async deleteById(id: string): Promise<IVerificationToken> {
    return await prisma.verificationToken.delete({ where: { id } });
  }
  async deleteByEmail(email: string): Promise<boolean> {
    const result = await prisma.verificationToken.deleteMany({ where: { email } });
    return result.count > 0;
  }


  async updateById(id: string, data: Partial<IVerificationToken>): Promise<IVerificationToken> {
    return await prisma.verificationToken.update({ where: { id }, data });
  }
}

export const prismaVerificationTokenInstance = new PrismaVerificationTokenRepository();