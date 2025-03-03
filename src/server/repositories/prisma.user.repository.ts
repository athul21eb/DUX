import { prisma } from "@/lib/db/database";
import { IUserRepository } from "../core/interfaces/user.repository.interface";
import { IUser } from "../core/entities/user";
import { createUserDTO } from "../core/dtos/userDtos";
import { Role } from "@prisma/client";

export class PrismaUserRepository implements IUserRepository {
  async createUser(user: createUserDTO): Promise<IUser> {


    return await prisma.user.create({
      data: {
        ...user,
        role: user.role as Role, 
      },
    });
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserByGoogleId(googleId: string): Promise<IUser | null> {
    return await prisma.user.findFirst({
      where: { googleId },
    });
  }

  async updateUser(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    return await prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    return await prisma.user.findMany({where:{
      role:"user"
    }});
  }

  async changeBlockStatus(id: string,status:boolean): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id },
        data: { isBlocked: status },
      });
      return true;
    } catch (error) {
      console.error("Error blocking user:", error);
      return false;
    }
  }
  async isEmailTaken(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });
    return !!user;
  }
  async totalCount(): Promise<number> {
    return await prisma.user.count();
  }
}

export const prismaRepoInstance = new PrismaUserRepository();