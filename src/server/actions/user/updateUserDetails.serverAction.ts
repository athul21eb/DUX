"use server";


import { ValidationError } from "@/server/core/errors/errors";
import { userService } from "@/server/services/user.service";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";
import { UserFormValues, UserSchema } from "@/utils/validator/userformupdate";
import { revalidatePath } from "next/cache";

interface presenter {
  name: string;
  image?: string;
}
export const update_User_Details_Server_Action = async (
  formData: UserFormValues,
  selectedImage: File | null
): Promise<TSuccessResponse<presenter> | TErrorResponse> => {
  try {
    const validatedData = UserSchema.parse(formData);

    if (!validatedData) {
      throw new ValidationError("Invalid data to update user");
    }

    const updatedUser = await userService.updateUserDetails(
      validatedData,
      selectedImage
    );
    revalidatePath("/profile");
    const presenterData: presenter = {
      name: updatedUser.name || "",
      image: updatedUser.image || "",
    };
    return SuccessResponse("Profile updated successfully", presenterData);
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(error instanceof Error ? error.message : "failed to");
  }
};
