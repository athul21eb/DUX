"use server";

import { signIn } from "@/lib/auth/auth";
import { ValidationError } from "@/server/core/errors/errors";
import { userService } from "@/server/services/user.service";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";
import { LoginSchema, TLoginFormInputType } from "@/utils/validator/authforms";

export const Login_Server_Action = async (
  formData: TLoginFormInputType
): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {
    const validated_Data = LoginSchema.parse(formData);
    if (!validated_Data) throw new ValidationError("Invalid Input Data");

    await userService.loginUser(validated_Data);



    return SuccessResponse("User LoggedIn Successfully");

  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in login server action");
    return ErrorResponse(
      error instanceof Error ? error.message : "failed to login the user"
    );
  }
};
