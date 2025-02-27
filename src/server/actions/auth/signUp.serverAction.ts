"use server";

import { ValidationError } from "@/server/core/errors/errors";
import { userService } from "@/server/services/user.service";
import { verificationTokenService } from "@/server/services/verificationToken.service";
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
      throw new ValidationError("Invalid input data");
    }
    const { email, name, password, confirmPassword } = validatedData;

    if (password !== confirmPassword) {
      throw new ValidationError("Passwords Do Not Match");
    }
//// stored user data in database
    const createdUser = await userService.registerUser({
      email,
      name,
      password,
    });
    if (!createdUser) {
      throw new ValidationError("Failed to Signup the User ");
    }
//// send email verification link
    const verification_token_Send_Or_Not =
      await verificationTokenService.createVerificationTokenAndSend(email);

    if (!verification_token_Send_Or_Not) {
      throw new ValidationError("Failed to Send verification Link");
    }


    return SuccessResponse("Email Verification was sent");

  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }

    console.error("Error in SignUp_ServerAction:", error);

    return ErrorResponse(
      error instanceof Error
        ? error.message
        : "An error occurred during sign-up"
    );
  }
};
