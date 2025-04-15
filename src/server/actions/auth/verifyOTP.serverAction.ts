"use server";

import { ValidationError } from "@/server/core/errors/errors";
import { otpService } from "@/server/services/otp.service";
import { UserManagementResponseMessages } from "@/server/shared/constants/constant";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";
import {
  ForgotPasswordSchema,
  TForgotPasswordFormType,
} from "@/utils/validator/authforms";

export const verify_OTP_Server_Action = async (
  data: TForgotPasswordFormType
): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {
    const validOtpData = ForgotPasswordSchema.parse(data);
    const { email, otp } = validOtpData;
    if (!email || !otp) {
      throw new ValidationError(UserManagementResponseMessages.ErrorInvalidInputToVerifyOTP);
    }

    await otpService.validateOtp(email, otp);

    return SuccessResponse(UserManagementResponseMessages.SuccessOtpVerified, null);
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action verify_OTP_Server_Action");
    return ErrorResponse(
      error instanceof Error ? error.message : UserManagementResponseMessages.ErrorFaliedToVerifyOTP,
    );
  }
};
