

'use server'

import { ValidationError } from "@/server/core/errors/errors";
import { otpService } from "@/server/services/otp.service";
import { ErrorResponse, SuccessResponse, TErrorResponse, TSuccessResponse } from "@/utils/serverActionResponses/serverActionResponses"
import { ForgotPasswordSchema, TForgotPasswordFormType } from "@/utils/validator/authforms";



export const verify_OTP_Server_Action = async(data:TForgotPasswordFormType):Promise<TSuccessResponse<null>|TErrorResponse>=>{


  try {

    const validOtpData = ForgotPasswordSchema.parse(data);
    const {email,otp} = validOtpData;
if(!email||!otp){
  throw new ValidationError("invalid otp and email");
}

await otpService.validateOtp(email,otp)

    return SuccessResponse('OTP verified successfully.');
    
  } catch (error) {
  if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(
      error instanceof Error ? error.message : "failed to verify otp "
    );
  }


}