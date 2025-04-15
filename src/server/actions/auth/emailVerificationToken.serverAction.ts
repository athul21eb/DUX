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

export const Email_Verification_Server_Action = async (
  token: string
): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {
    const existingToken = await verificationTokenService.getVerificationByToken(
      token
    );

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      //// resend email verification link

      const verification_token_Send_Or_Not =
        await verificationTokenService.createVerificationTokenAndSend(
          existingToken.email
        );

      if (!verification_token_Send_Or_Not) {
        throw new ValidationError(UserManagementResponseMessages.ErrorFaliedToSendVerificationEmail);
      }

      throw new ValidationError(
        UserManagementResponseMessages.ErrorVerificationTokenExpiredAndResend
      );
    }

    const changed_Email_Verification_User =
      await userService.changeEmailVerification(existingToken.email);

    await verificationTokenService.deleteVerificationById(existingToken.id);

    return SuccessResponse(UserManagementResponseMessages.SuccessEmailVerified);
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(error instanceof Error ? error.message : UserManagementResponseMessages.ErrorFaliledToVerifyEmail);
  }
};
