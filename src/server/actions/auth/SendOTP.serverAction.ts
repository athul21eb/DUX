"use server";

import { ValidationError } from "@/server/core/errors/errors";
import { otpService } from "@/server/services/otp.service";
import { userService } from "@/server/services/user.service";
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
      throw new ValidationError("invalid email");
    }
const {email} = validEmail
    const existingEmail = await userService.getUserDetailsByEmail(
      email
    );
    if (!existingEmail) {
      throw new ValidationError("Email is not found");
    }

    if (!existingEmail.emailVerified) {
      throw new ValidationError("Email is not verified yet");
    }



     await otpService.generateOtpAndSend(email)

    return SuccessResponse("OTP sent successfully.");
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(error instanceof Error ? error.message : "failed to");
  }
};
