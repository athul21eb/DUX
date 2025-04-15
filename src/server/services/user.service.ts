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
import {  UserManagementResponseMessages } from "../shared/constants/constant";


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
            UserManagementResponseMessages.ErrorEmailRegisteredwithGoogle
          );
        }

        if (!userExists.emailVerified) {
          throw new ValidationError(UserManagementResponseMessages.ErrorEmailNotVerified);
        }

        throw new ValidationError(UserManagementResponseMessages.ErrorEmailAlreadyExists);
      }

      const hashedPassword = await hash(data.password, 10);
      if(!hashedPassword){
        throw new ValidationError(UserManagementResponseMessages.ErrorFaliedToSignUp);

      }

      return await this.userRepository.createUser({
        ...data,
        password: hashedPassword,
      });

    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in UserService:", error);
      throw new Error(UserManagementResponseMessages.ErrorFaliedToSignUp);
    }
  }

  ////------------------login User
  async loginUser(data: loginUserDTO): Promise<IUser> {
    try {
      const { email, password } = data;

      const userExists = await this.userRepository.getUserByEmail(email);

      if (!userExists) {
        throw new ValidationError(UserManagementResponseMessages.ErrorUserNotFound);
      }

      if (userExists.email && (userExists.googleId || !userExists.password)) {
        throw new ValidationError(
          UserManagementResponseMessages.ErrorEmailRegisteredwithGoogle
        );
      }

      if (
        userExists.email &&
        userExists.password &&
        !userExists.emailVerified
      ) {
        throw new ValidationError(
          UserManagementResponseMessages.ErrorEmailNotVerified
        );
      }

      if (userExists.isBlocked) {
        throw new ValidationError(UserManagementResponseMessages.ErrorUserisBlocked);
      }

      const isPasswordMatch = await compare(
        password,
        userExists.password as string
      );

      if (!isPasswordMatch) {
        throw new ValidationError(UserManagementResponseMessages.ErrorInvalidCreadentials);
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
      throw new Error(UserManagementResponseMessages.ErrorFailedToLogin);
    }
  }

  ////-------------------getUserDetailsByEmail

  async getUserDetailsByEmail(email: string): Promise<IUser> {
    try {
      const existingUser = await this.userRepository.getUserByEmail(email);
      if (!existingUser) {
        throw new ValidationError(UserManagementResponseMessages.ErrorUserNotFound);
      }
      return existingUser;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in user  Service:", error);
      throw new Error(UserManagementResponseMessages.ErrorFailedToFetchUserDetails);
    }
  }
  ////change email verified to true by id

  async changeEmailVerification(email: string): Promise<IUser> {
    try {
      const existingUser = await this.userRepository.getUserByEmail(email);
      if (!existingUser) {
        throw new ValidationError(UserManagementResponseMessages.ErrorUserNotFound);
      }
      const updatedUser = await this.userRepository.updateUser(
        existingUser.id,
        { emailVerified: new Date() }
      );
      if (!updatedUser) {
        throw new ValidationError(UserManagementResponseMessages.ErrorFaliledToVerifyEmail);
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error(
        "Error in user service changeEmailVerificationById func :",
        error
      );
      throw new Error(UserManagementResponseMessages.ErrorFaliledToVerifyEmail);
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
        throw new ValidationError(UserManagementResponseMessages.ErrorFaliledToVerifyEmail);
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error(
        "Error in user service changeEmailVerificationById func :",
        error
      );
      throw new Error(UserManagementResponseMessages.ErrorFaliledToVerifyEmail);
    }
  }

  ////--------------change password -------------------

  async changePasswordOfUser(email: string, password: string): Promise<IUser> {
    try {
      const existingUser = await this.userRepository.getUserByEmail(email);

      if (!existingUser) {
        throw new ValidationError(UserManagementResponseMessages.ErrorUserNotFound);
      }

      if (!existingUser.password || existingUser.googleId) {
        throw new ValidationError(UserManagementResponseMessages.ErrorGoogleAccountCannotChangePassword);
      }
      const isPasswordMatch = await compare(password, existingUser.password);
      if (isPasswordMatch) {
        throw new ValidationError(
          UserManagementResponseMessages.ErrorNewPasswordAndOldPasswordSame
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
        throw new ValidationError(UserManagementResponseMessages.ErrorFaliedToChangePassword);
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in user service changePasswordById func :", error);
      throw new Error(UserManagementResponseMessages.ErrorFaliedToChangePassword);
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
        throw new ValidationError(UserManagementResponseMessages.ErrorUserNotFound);
      }

      let imageUrl = user.image;
      if (image) {
        try {
          imageUrl = await uploadFile(image);
        } catch (error) {
          console.error("failed to upload image", error);
          throw new ValidationError(UserManagementResponseMessages.ErrorFaliedToUploadProfilePicture);
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
        throw new ValidationError(UserManagementResponseMessages.ErrorFailedToUpdateUserDetails);
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in user service update user func :", error);
      throw new Error(UserManagementResponseMessages.ErrorFailedToUpdateUserDetails);
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
      throw new Error(UserManagementResponseMessages.ErrorFailedToFetchUsers);
    }
  }

  ////--------------changeIsBlockedStatus -------------------

  async changeIsBlockedStatus(id: string, status: boolean): Promise<boolean> {
    try {
      if (!id || typeof status !== "boolean") {
        throw new ValidationError(UserManagementResponseMessages.ErrorInvalidInputToChangeIsBlockedStatus);
      }

      const user = await this.userRepository.getUserById(id);
      if (!user) {
        throw new ValidationError(UserManagementResponseMessages.ErrorUserNotFound);
      }

      const changedOrNot = await this.userRepository.changeBlockStatus(user.id, status);

      if (!changedOrNot) {
        throw new ValidationError(
          UserManagementResponseMessages.ErrorFailedToChangeIsBlocked(
            status
          )
        );
      }
      return changedOrNot;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in skill service get user func :", error);
      throw new Error(UserManagementResponseMessages.ErrorFailedToChangeIsBlocked(status));
    }
  }

   ////-------------------getUserDetailsByEmail

   async deleteUser(id:string): Promise<boolean> {
    try {
      const deleted = await this.userRepository.deleteUser(id)
      if (!deleted) {
        throw new ValidationError(UserManagementResponseMessages.ErrorFailedToDeleteUser);
      }
      return deleted;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in user  Service:", error);
      throw new Error(UserManagementResponseMessages.ErrorFailedToDeleteUser);
    }
  }
}

export const userService = new UserService(prismaRepoInstance);
