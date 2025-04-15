"use server";

import { ValidationError } from "@/server/core/errors/errors";
import { mentorService } from "@/server/services/mentor.service";
import { userService } from "@/server/services/user.service";
import { MentorMangementResponseMessages } from "@/server/shared/constants/constant";
import uploadFile from "@/utils/cloudinary/cloudinary";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";
import {
  RegisterMentorFormSchema,
  RegisterMentorFormType,
} from "@/utils/validator/registerMentor";
import { randomUUID } from "crypto";

export const Register_Mentor_Server_Action = async (
  formData: RegisterMentorFormType,
  selectedImage: File,
  selectedDocuments: File[]
): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {
    const validatedData = RegisterMentorFormSchema.parse(formData);

    console.log('\n',validatedData,selectedImage,selectedDocuments,'[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ \n')

    // throw new ValidationError(
    //   MentorMangementResponseMessages.ErrorInvalidInputToRegisterMentor
    // );

    if (!validatedData) {
      throw new ValidationError(
        MentorMangementResponseMessages.ErrorInvalidInputToRegisterMentor
      );
    }

    if (!selectedImage) {
      throw new ValidationError(
        MentorMangementResponseMessages.ErrorInvalidInputToRegisterMentorByProfilePicisRequired
      );
    }
    if (selectedDocuments.length < 3) {
      throw new ValidationError(
        MentorMangementResponseMessages.ErrorInvalidInputToRegisterMentorByDocumentsisRequired
      );
    }

    const tempPassword = randomUUID();

    // Upload profile image if provided
    let profileImageUrl;
    if (selectedImage) {
      try {
        const uploadResult = await uploadFile(selectedImage);
        if (uploadResult) {
          profileImageUrl = uploadResult;
        }
      } catch (error) {
        console.error("Error uploading profile image:", error);
        throw new ValidationError(
          MentorMangementResponseMessages.ErrorFaliedToUploadProfilePicture
        );
      }
    }

    // Upload documents if provided and filter out null values
    const documentUrls: string[] = [];
    for (const document of selectedDocuments) {
      try {
        const url = await uploadFile(document);
        if (url) {
          documentUrls.push(url);
        }
      } catch (error) {
        console.error("Error uploading document:", error);
        throw new ValidationError(
          MentorMangementResponseMessages.ErrorFailedToUploadDocuments
        );
      }
    }

    const createdUser = await userService.registerUser({
      email: validatedData.email,
      name: validatedData.name,
      password: tempPassword,
      dob: validatedData.dob.toISOString(),
      gender: validatedData.gender,
      image: profileImageUrl,
      phone: validatedData.phone,
      role: "mentor",
    });

    try {
      await mentorService.createMentor({
        userId: createdUser.id,
        documents: documentUrls,
        educations: validatedData.educations,
        experiences: validatedData.experiences,
        expertise: validatedData.expertise,
        skills: validatedData.skills,
        languages: validatedData.languages,
        hourlyRate: Number(validatedData.hourlyRate),
        aboutMe: validatedData.aboutMe,
        timeSlots:validatedData.timeSlots
      });
    } catch (e) {
      await userService.deleteUser(createdUser.id);

      throw e;
    }

    return SuccessResponse(
      MentorMangementResponseMessages.SuccessMentorApplicationApplied
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(
      error instanceof Error
        ? error.message
        : MentorMangementResponseMessages.ErrorFailedToRegisterMentor
    );
  }
};
