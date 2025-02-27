import { createUserDTO, loginUserDTO } from "../core/dtos/userDtos";
import { IUser } from "../core/entities/user";
import { ValidationError } from "../core/errors/errors";
import { IUserRepository } from "../core/interfaces/user.repository.interface";
import { IUserService } from "../core/interfaces/user.service.interface";

import { compare, hash } from "bcrypt-ts";
import { prismaRepoInstance } from "../repositories/prisma.user.repository";
import { signIn } from "@/lib/auth/auth";
import { AuthError } from "next-auth";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  ////------------------------registerUser
  async registerUser(data: createUserDTO): Promise<IUser> {
    try {
      const userExists = await this.userRepository.getUserByEmail(data.email!);

      // console.log(userExists, "<====user \n");

      if (
        userExists &&
        userExists.email &&
        (userExists.googleId || !userExists.password)
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

      const hashedPassword = await hash(data.password, 10);

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

  ////------------------login User
  async loginUser(data: loginUserDTO): Promise<IUser> {
    try {
      const { email, password } = data;

      const userExists = await this.userRepository.getUserByEmail(email);

      if (!userExists) {
        throw new ValidationError("User Does Not Exist");
      }

      if (userExists.email && (userExists.googleId || !userExists.password)) {
        throw new ValidationError(
          "Email already registered via Google. Please Login Using Google SignIn"
        );
      }

      if (
        userExists.email &&
        userExists.password &&
        !userExists.emailVerified
      ) {
        throw new ValidationError(
          "Email verification is not  done yet. Please confirm your email address"
        );
      }

      if (userExists.isBlocked) {
        throw new ValidationError("User Account is Blocked !");
      }

      const isPasswordMatch = await compare(
        password,
        userExists.password as string
      );

      if (!isPasswordMatch) {
        throw new ValidationError("Invalid Credentials");
      }
      const signInResponse = await signIn("credentials", {
        email: userExists.email,
        password: password,
        redirect: false,
      });

      if (signInResponse?.error)
        throw new ValidationError(signInResponse.error);

      return userExists;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in UserService:", error);
      throw new Error("Failed to login user ");
    }
  }

  ////-------------------getUserDetailsByEmail

  async getUserDetailsByEmail(email: string): Promise<IUser> {
    try {
      const existingUser = await this.userRepository.getUserByEmail(email);
      if (!existingUser) {
        throw new ValidationError("user doesn't exist, invalid email");
      }
      return existingUser;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in user  Service:", error);
      throw new Error("Failed to get details of user  ");
    }
  }
  ////change email verified to true by id

  async changeEmailVerification(email: string): Promise<IUser> {
    try {
      const existingUser = await this.userRepository.getUserByEmail(email);
      if (!existingUser) {
        throw new ValidationError("user doesn't exist, invalid email");
      }
      const updatedUser = await this.userRepository.updateUser(
        existingUser.id,
        { emailVerified: new Date() }
      );
      if (!updatedUser) {
        throw new ValidationError("failed to do email verification");
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error(
        "Error in user service changeEmailVerificationById func :",
        error
      );
      throw new Error("failed to do email verification");
    }
  }

  //// ------------update googleId to user data

  async updateGoogleIdOfUser(id: string, googleId: string): Promise<IUser> {
    try {
      const updatedUser = await this.userRepository.updateUser(id, {
        emailVerified: new Date(),
        googleId,
      });
      if (!updatedUser) {
        throw new ValidationError("failed to do email verification");
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error(
        "Error in user service changeEmailVerificationById func :",
        error
      );
      throw new Error("failed to do email verification");
    }
  }
}

export const userService = new UserService(prismaRepoInstance);
