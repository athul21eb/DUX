import {
  createUserDTO,
  getAllUsersDTO,
  loginUserDTO,
  updateUserDTO,
} from "../core/dtos/userDtos";
import { IUser } from "../core/entities/user";
import { ValidationError } from "../core/errors/errors";
import { IUserRepository } from "../core/interfaces/user.repository.interface";
import { IUserService } from "../core/interfaces/user.service.interface";

import { compare, hash } from "bcrypt-ts";
import { prismaRepoInstance } from "../repositories/prisma.user.repository";
import { signIn } from "@/lib/auth/auth";
import uploadFile from "@/utils/cloudinary/cloudinary";


export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  ////------------------------registerUser
  async registerUser(data: createUserDTO): Promise<IUser> {
    try {
      const userExists = await this.userRepository.getUserByEmail(data.email!);

      // console.log(userExists, "<====user \n");

      if (userExists) {
        if (userExists.googleId || !userExists.password) {
          throw new ValidationError(
            "Email is already registered via Google SignIn. Please try with another email."
          );
        }

        if (!userExists.emailVerified) {
          throw new ValidationError("Email is not verified yet. check the mailBox");
        }

        throw new ValidationError("Email is already taken. Please use another email.");
      }

      const hashedPassword = await hash(data.password, 10);
      if(!hashedPassword){
        throw new ValidationError("failed to register user due to password  hashing problem");

      }

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
        throw new ValidationError("email doesn't exist, invalid email");
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

  ////--------------change password -------------------

  async changePasswordOfUser(email: string, password: string): Promise<IUser> {
    try {
      const existingUser = await this.userRepository.getUserByEmail(email);

      if (!existingUser) {
        throw new ValidationError("Email not found");
      }

      if (!existingUser.password || existingUser.googleId) {
        throw new ValidationError(
          " Google via Signin Account can not use change password"
        );
      }
      const isPasswordMatch = await compare(password, existingUser.password);
      if (isPasswordMatch) {
        throw new ValidationError(
          "new password must be different from old password"
        );
      }
      const hashedPassword = await hash(password, 10);

      const updatedUser = await this.userRepository.updateUser(
        existingUser.id,
        {
          password: hashedPassword,
        }
      );

      if (!updatedUser) {
        throw new ValidationError("failed to change password");
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in user service changePasswordById func :", error);
      throw new Error("failed to do change password");
    }
  }

  //// --------------------update user profile Details

  async updateUserDetails(
    data: updateUserDTO,
    image: File | null
  ): Promise<IUser> {
    try {
      const { name, email, phone, gender, dob } = data;
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) {
        throw new ValidationError("user not found ");
      }

      let imageUrl = user.image;
      if (image) {
        try {
          imageUrl = await uploadFile(image);
        } catch (error) {
          console.error("failed to upload image", error);
          throw new ValidationError("failed to upload the image");
        }
      }
      const isDataUnchanged =
        user.name === name &&
        user.phone === phone &&
        user.gender === gender &&
        user.dob === dob &&
        user.image === imageUrl;

      if (isDataUnchanged) {
        return user;
      }

      const updatedUser = await this.userRepository.updateUser(user.id, {
        name,
        phone,
        gender,
        dob,
        image: imageUrl ?? undefined,
      });
      if (!updatedUser) {
        throw new ValidationError("failed to update the user ");
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in user service update user func :", error);
      throw new Error("failed to do update user");
    }
  }

  ////--------------getAllUsersWithPagination -------------------

  async getAllUsersWithPagination(
    skip: number,
    limit: number
  ): Promise<getAllUsersDTO> {
    try {
      const users = await this.userRepository.getAllUsers({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
      const totalCount = await this.userRepository.totalCount();

      const data = {
        users,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
      return data;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in skill service get user func :", error);
      throw new Error("failed to fetch  get users");
    }
  }

  ////--------------changeIsBlockedStatus -------------------

  async changeIsBlockedStatus(id: string, status: boolean): Promise<boolean> {
    try {
      if (!id || typeof status !== "boolean") {
        throw new ValidationError("invalid data to change isBlocked status");
      }

      const user = await this.userRepository.getUserById(id);
      if (!user) {
        throw new ValidationError("user does not exist");
      }

      const changedOrNot = await this.userRepository.changeBlockStatus(user.id, status);

      if (!changedOrNot) {
        throw new ValidationError(
          "failed to  change status of isBlocked of user"
        );
      }
      return changedOrNot;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in skill service get user func :", error);
      throw new Error("failed to fetch  get users");
    }
  }

   ////-------------------getUserDetailsByEmail

   async deleteUser(id:string): Promise<boolean> {
    try {
      const deleted = await this.userRepository.deleteUser(id)
      if (!deleted) {
        throw new ValidationError("fail to delete the user ");
      }
      return deleted;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in user  Service:", error);
      throw new Error("Failed to get details of user  ");
    }
  }
}

export const userService = new UserService(prismaRepoInstance);
