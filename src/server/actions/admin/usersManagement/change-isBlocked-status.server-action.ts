"use server";

import { ValidationError } from "@/server/core/errors/errors";
import { userService } from "@/server/services/user.service";
import { UserManagementResponseMessages } from "@/server/shared/constants/constant";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";

export const Change_IsBlocked_Status_Server_Action = async (
  id: string,
  status: boolean
): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {


    if (!id || typeof status !== "boolean") {
      throw new ValidationError(UserManagementResponseMessages.ErrorInvalidInputToChangeIsBlockedStatus);
    }

    const changedStatus = await userService.changeIsBlockedStatus(id, status);

    return SuccessResponse(UserManagementResponseMessages.SuccessUserIsBlockedStatusChanged(status), null);
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(error instanceof Error ? error.message : UserManagementResponseMessages.ErrorFailedToChangeIsBlocked(status));
  }
};
