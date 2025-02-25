import { createUserDTO } from "../core/dtos/userDtos";
import { IUser } from "../core/entities/user";
import { ValidationError } from "../core/errors/errors";
import { IUserRepository } from "../core/interfaces/user.repository.interface";
import { IUserService } from "../core/interfaces/user.service.interface";

import bcrypt from "bcrypt";
import { prismaRepoInstance } from "../repositories/prisma.user.repository";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  ////registerUser
  async registerUser(data: createUserDTO): Promise<IUser | string> {
    try {
      const userExists = await this.userRepository.getUserByEmail(data.email!);

      if (!userExists) {
        throw new Error("Email already in use");
      }

      console.log(userExists, "<====user \n");

      if (
        userExists &&
        userExists.email &&
        userExists.googleId &&
        !userExists.password
      ) {
        throw new ValidationError(
          "Email already register via  Google . please try with another email"
        );
      }

      if (
        userExists &&
        userExists.email &&
        userExists.password &&
        !userExists.emailVerified
      ) {
        throw new ValidationError(
          "Email already verification sended . Please confirm your email address"
        );
      }

      if (userExists && userExists.email && userExists.password) {
        throw new ValidationError(
          "Email already verification sended . Please confirm your email address"
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      return await this.userRepository.createUser({
        ...data,
        password: hashedPassword,
      });

    } catch (error) {

      if (error instanceof ValidationError) throw error;
      console.error("Error in UserService:", error);
      throw new Error("Failed to register user");
    }
  }
}


export const  userService = new UserService(prismaRepoInstance);