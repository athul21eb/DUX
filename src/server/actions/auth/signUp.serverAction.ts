"use server";

import { ValidationError } from "@/server/core/errors/errors";
import { userService } from "@/server/services/user.service";
import { verificationTokenService } from "@/server/services/verificationToken.service";
import { UserManagementResponseMessages } from "@/server/shared/constants/constant";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";
import {
  TSignUpFormInputType,
  SignUpFormSchema,
} from "@/utils/validator/authforms";

export const SignUp_ServerAction = async (
  formData: TSignUpFormInputType
): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {
    const validatedData = SignUpFormSchema.parse(formData);

    if (!validatedData) {
      throw new ValidationError(UserManagementResponseMessages.ErrorInvalidInputToSignUP);
    }
    const { email, name, password, confirmPassword } = validatedData;

    if (password !== confirmPassword) {
      throw new ValidationError(UserManagementResponseMessages.ErrorPasswordNotMatch);
    }
//// stored user data in database
    const createdUser = await userService.registerUser({
      email,
      name,
      password,
    });
    if (!createdUser) {
      throw new ValidationError(UserManagementResponseMessages.ErrorFaliedToSignUp);
    }
//// send email verification link
    const verification_token_Send_Or_Not =
      await verificationTokenService.createVerificationTokenAndSend(email);

    if (!verification_token_Send_Or_Not) {
      throw new ValidationError(UserManagementResponseMessages.ErrorFaliedToSendVerificationEmail);
    }


    return SuccessResponse(UserManagementResponseMessages.SuccessVerificationEmailSent(email), null);

  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }

    console.error("Error in SignUp_ServerAction:", error);

    return ErrorResponse(
      error instanceof Error
        ? error.message
        : UserManagementResponseMessages.ErrorFaliedToSignUp
    );
  }
};
