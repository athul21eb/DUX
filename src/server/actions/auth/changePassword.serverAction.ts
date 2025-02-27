


'use server'

import { ValidationError } from "@/server/core/errors/errors";
import { userService } from "@/server/services/user.service";
import { ErrorResponse, SuccessResponse, TErrorResponse, TSuccessResponse } from "@/utils/serverActionResponses/serverActionResponses"
import { changePasswordSchema, TChangePasswordType } from "@/utils/validator/authforms";



export const change_Password_Server_Action = async(email:string,data:TChangePasswordType):Promise<TSuccessResponse<null>|TErrorResponse>=>{


  try {


    const validatedData = changePasswordSchema.parse(data);

    if(!validatedData){
      throw new ValidationError("Invalid Data");

    }
const {newPassword} = validatedData;
    await userService.changePasswordOfUser(email,newPassword);


    return SuccessResponse('Password changed successfully');
  } catch (error) {
  if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(
      error instanceof Error ? error.message : "failed to change Password"
    );
  }


}