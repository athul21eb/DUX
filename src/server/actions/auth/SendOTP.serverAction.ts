"use server";

import { ValidationError } from "@/server/core/errors/errors";
import { otpService } from "@/server/services/otp.service";
import { userService } from "@/server/services/user.service";
import { UserManagementResponseMessages } from "@/server/shared/constants/constant";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";
import { generateOtp } from "@/utils/token/otp";
import { ForgotPasswordSchema } from "@/utils/validator/authforms";

export const SendOTP_Server_Action = async (data: {
  email: string;
}): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {
    const validEmail = ForgotPasswordSchema.parse(data);
    if (!validEmail) {
      throw new ValidationError(
        UserManagementResponseMessages.ErrorInvalidInputtoSendOTP
      );
    }
    const { email } = validEmail;
    const existingEmail = await userService.getUserDetailsByEmail(email);
    if (!existingEmail) {
      throw new ValidationError(
        UserManagementResponseMessages.ErrorUserNotFound
      );
    }

    if (!existingEmail.emailVerified) {
      throw new ValidationError(
        UserManagementResponseMessages.ErrorEmailNotVerified
      );
    }

    await otpService.generateOtpAndSend(email);

    return SuccessResponse(
      UserManagementResponseMessages.SuccessOtpSent(email),
      null
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(
      error instanceof Error
        ? error.message
        : UserManagementResponseMessages.ErrorFaliedToSendOTP
    );
  }
};
